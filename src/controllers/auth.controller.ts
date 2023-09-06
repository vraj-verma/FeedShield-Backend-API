import {
     Controller,
     Get,
     Post,
     Body,
     Req,
     Res,
     HttpException,
     HttpStatus,
     Query,
     Delete,
     UseGuards,
} from "@nestjs/common";
const bcrypt = require('bcrypt');
import { Request, Response } from "express";
import { Role, Signup } from "../models/signup.model";
import { AccountService } from "../services/account.service";
import { UserService } from "../services/user.service";
import { Status } from "../models/account.model";
import { AuthUser } from "../models/authuser.model";
import { Signin } from "../models/signin.model";
import { ValidationPipe } from "../pipes/joiValidation.pipe";
import { JoiValidationSchema } from "../validation/schema.validation";
import { JwtService } from "@nestjs/jwt";
import { JoinUser } from "../models/join-user.model";
import { JwtAuthGuard } from "../services/auth/jwt-auth.guard";
import { RolesGuard } from "../services/auth/roles.guard";
import { Roles } from "../services/auth/roles.decorator";
import { GoogleGuard } from "../services/oauth/google.guard";
import { BlacklistService } from "../services/blacklist.service";
import { DropBoxGuard } from "src/services/oauth/dropbox.guard";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
     constructor(
          private accountService: AccountService,
          private userService: UserService,
          private blacklistService: BlacklistService,
          private jwtService: JwtService,
     ) { }

     @ApiOperation({ summary: 'Create an account' })
     @ApiResponse({ type: AuthUser })
     @Post('signup')
     async signup(
          @Req() req: Request,
          @Res() res: Response,
          @Body(new ValidationPipe(JoiValidationSchema.signupSchema)) signup: Signup
     ) {
          const isAccountExist = await this.userService.getUserByEmail(signup.email);

          if (isAccountExist) {
               throw new HttpException(
                    `Account with email: ${signup.email} already exist, please login`,
                    HttpStatus.BAD_REQUEST
               );
          }

          const salt = await bcrypt.genSalt(6);
          const hash = await bcrypt.hash(signup.password, salt);
          signup.password = hash;
          signup.role = Role.Super_Admin;
          signup.status = Status.Active;
          signup.joined = true;
          signup.access = true;

          const account_id = await this.accountService.createAccount({
               user_limit: 5,
               user_used: 1,
               created_at: new Date().toLocaleString()

          });

          const user_id = await this.userService.createUser({
               ...signup, account_id
          });

          // const authUser: AuthUser = {
          //      user_id,
          //      account_id,
          //      name: signup.name,
          //      email: signup.email,
          //      role: Role.Super_Admin,
          //      // user_limit: 5,
          // }

          const authUser: AuthUser = await this.userService.getUserByEmail(signup.email);

          res.status(201).json(authUser);
     }

     @ApiOperation({ summary: 'Sign in to get JWT token' })
     @ApiResponse({ type: AuthUser })
     @Post('signin')
     async signin(
          @Req() req: Request,
          @Res() res: Response,
          @Body(new ValidationPipe(JoiValidationSchema.signinSchema)) signin: Signin
     ) {

          // check if user is blocked
          const isBlocked = await this.blacklistService.getBlockedUser(signin.email);
          if (isBlocked) {
               throw new HttpException(
                    `User with email: ${signin.email} is blocked, Please contact your Super Admin.`,
                    HttpStatus.NOT_FOUND
               );
          }

          const response: AuthUser = await this.userService.getUserByEmail(signin.email);

          if (!response) {
               throw new HttpException(
                    `Account with email: ${signin.email} does not exist, please signup`,
                    HttpStatus.NOT_FOUND
               );
          }
          if (response.status === Status.Inactive) {
               throw new HttpException(
                    `Account is not active, please contact to admin`,
                    HttpStatus.NOT_FOUND
               );
          }

          if (!response.joined) {
               throw new HttpException(
                    `Account is not joined, please join`,
                    HttpStatus.UNAUTHORIZED
               );
          }

          // decrypt password
          const passwordMatch = await bcrypt.compare(signin.password, response.password);
          if (!passwordMatch) {
               throw new HttpException(
                    `Password is not correct, try again`,
                    HttpStatus.BAD_REQUEST
               );
          }

          const payload = {
               email: signin.email,
               account_id: response.account_id,
               user_id: response.user_id
          };

          const token = this.jwtService.sign(payload);
          response.token = token;

          delete response.password;
          res.status(200).json(response);
     }

     @ApiOperation({ summary: 'Join user with JWT token' })
     @ApiResponse({ type: 'string' })
     @Post('join-user')
     async joinUser(
          @Req() req: Request,
          @Res() res: Response,
          @Body(new ValidationPipe(JoiValidationSchema.joinUserSchema)) join_user: JoinUser,
          @Query('token') token: string,
     ) {
          const token_decoded = await this.jwtService.verify(token);

          const isAlreadyJoined = await this.userService.getUserByEmail(token_decoded.email);

          if (isAlreadyJoined.joined) {
               throw new HttpException(
                    `User already joined, please login`,
                    HttpStatus.BAD_REQUEST
               );
          }

          if (join_user.password !== join_user.confirm_password) {
               throw new HttpException(
                    `Password & Confirm password does not match, please trya gain`,
                    HttpStatus.BAD_REQUEST
               );
          }

          const salt = await bcrypt.genSalt(6);
          const hash = await bcrypt.hash(join_user.password, salt);

          const response = await this.userService.joinUser(
               {
                    password: hash,
                    joined: true,
                    user_id: token_decoded.user_id,
                    status: Status.Active,
               }
          );

          if (!response) {
               throw new HttpException(
                    `Somwthing went wrong or token expired, try again`,
                    HttpStatus.NOT_MODIFIED
               );
          }

          res.status(200).json({ message: `Sucessfully Joined` })
     }

     @ApiOperation({ summary: 'Delete an account' })
     @ApiResponse({ type: 'string' })
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(Role.Super_Admin)
     @Delete('delete-account')
     async deleteAccount(
          @Req() req: Request,
          @Res() res: Response,
     ) {
          const token_decoded = await this.jwtService.verify(req.headers.authorization.split(' ')[1]);

          // get account_id from token
          const authUser: AuthUser = await this.userService.getUserByEmail(token_decoded.email);

          const response = await this.accountService.deleteAccount(authUser.account_id);
          const deleteUsers = await this.userService.deleteUsers(authUser.account_id);
          if (!response && !deleteUsers) {
               throw new HttpException(
                    `Something went wrong, try again`,
                    HttpStatus.NOT_MODIFIED
               );
          }

          res.status(200).json({ message: `Account deleted successfully` });

     }

     @ApiOperation({ summary: 'OAuth with Google' })
     @UseGuards(GoogleGuard)
     @Get('google')
     async googleAuth(
          @Req() req: Request | any,
          @Res() res: Response
     ) { }

     @ApiOperation({ summary: 'OAuth with Google' })
     @ApiResponse({ type: AuthUser })
     @UseGuards(GoogleGuard)
     @Get('google/redirect')
     async googleAuthRedirect(
          @Req() req: Request | any,
          @Res() res: Response,
     ) {
          const response: AuthUser = await this.userService.getUserByEmail(req.user.email);

          // if account does not exits
          if (!response) {
               const account_id = await this.accountService.createAccount({
                    user_limit: 5,
                    user_used: 1,
               });

               // saving custom password as '123456' only in case of google auth
               const salt = await bcrypt.genSalt(6);
               const hash = await bcrypt.hash('123456', salt);

               const user_id = await this.userService.createUser({
                    name: req.user.name,
                    email: req.user.email,
                    password: hash,
                    role: Role.Super_Admin,
                    status: Status.Active,
                    joined: true,
                    access: true,
                    account_id
               });

               // const authUser: AuthUser = {
               //      user_id,
               //      account_id,
               //      name: req.user.name,
               //      email: req.user.email,
               //      role: Role.Super_Admin,
               //      created_at: new Date().toLocaleString(),
               //      message: `Since you are using google auth, your password is '123456'.Please change it after login`
               // }

               const authUser: AuthUser = await this.userService.getUserByEmail(req.user.email);

               return res.status(201).json(authUser);
          }

          // if account exits
          const payload = {
               email: req.user.email,
               account_id: response.account_id,
               user_id: response.user_id
          }

          const token = this.jwtService.sign(payload);
          response.token = token;

          const { password, ...data } = response;

          res.status(200).json(data);

     }

     @ApiOperation({ summary: 'OAuth with Dropbox' })
     @UseGuards(DropBoxGuard)
     @Get('dropbox')
     async dropboxAuth() { }

     @ApiOperation({ summary: 'OAuth with Dropbox' })
     @ApiResponse({ type: AuthUser })
     @UseGuards(DropBoxGuard)
     @Get('dropbox/redirect')
     async dropboxAuthRedirect(
          @Req() req: Request | any,
          @Res() res: Response,
     ) {
          return res.status(200).json(req.user);
     }
}