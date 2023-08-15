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
import { JoinUser } from "src/models/join-user.model";

@Controller('auth')
export class AuthController {
     constructor(
          private accountService: AccountService,
          private userService: UserService,
          private jwtService: JwtService,
     ) { }


     @Post('signup')
     async signup(
          @Req() req: Request,
          @Res() res: Response,
          @Body(new ValidationPipe(JoiValidationSchema.signupSchema)) signup: Signup
     ) {
          const isAccountExist = await this.userService.getUserByEmail(signup.email);
          console.log(isAccountExist)
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
          signup.created_at = new Date();
          signup.joined = true;

          const account_id = await this.accountService.createAccount({
               user_limit: 5,
               created_at: new Date()
          });

          const user_id = await this.userService.createUser({
               ...signup, account_id
          });

          const authUser: AuthUser = {
               user_id,
               account_id,
               name: signup.name,
               email: signup.email,
               role: Role.Super_Admin,
               user_limit: 5,
               created_at: new Date(),
          }

          res.status(201).json(authUser);
     }

     @Post('signin')
     async signin(
          @Req() req: Request,
          @Res() res: Response,
          @Body(new ValidationPipe(JoiValidationSchema.signinSchema)) signin: Signin
     ) {
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

     @Post('join-user')
     async joinUser(
          @Req() req: Request,
          @Res() res: Response,
          @Body(new ValidationPipe(JoiValidationSchema.joinUserSchema)) join_user: JoinUser,
          @Query('token') token: string,
     ) {
          const token_decoded = await this.jwtService.verify(token);

          const isAlreadyJoined = await this.userService.getUserByEmail(token_decoded.email);

          if (isAlreadyJoined) {
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
                    created_at: new Date()
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

}