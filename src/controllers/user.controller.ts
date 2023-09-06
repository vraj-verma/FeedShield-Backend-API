const bcrypt = require('bcrypt')
import {
     Controller,
     Post,
     Body,
     Req,
     Res,
     UseGuards,
     HttpException,
     HttpStatus,
     Put,
     Param,
     Delete,
     Query,
} from "@nestjs/common";
import { AccountService } from "../services/account.service";
import { Request, Response } from "express";
import { JwtAuthGuard } from "../services/auth/jwt-auth.guard";
import { JwtService } from "@nestjs/jwt";
import { AuthUser } from "../models/authuser.model";
import { Role } from "../models/signup.model";
import { UserService } from "../services/user.service";
import { CreateUser, UpdateUser } from "../models/create-user.model";
import { ValidationPipe } from "../pipes/joiValidation.pipe";
import { JoiValidationSchema } from "../validation/schema.validation";
import { RolesGuard } from "../services/auth/roles.guard";
import { Roles } from "../services/auth/roles.decorator";
import { BlacklistService } from "src/services/blacklist.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";


@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
     constructor(
          private jwtService: JwtService,
          private userService: UserService,
          private accountService: AccountService,
          private blacklistService: BlacklistService,
     ) { }

     @ApiOperation({ summary: 'Block user' })
     @ApiResponse({ type: 'string' })
     @Roles(Role.Super_Admin)
     @Post('block')
     async blockUser(
          @Req() req: Request | any,
          @Res() res: Response,
          @Query('email') email: string,
     ) {
          const isBlocked = await this.blacklistService.getBlockedUser(email);
          if (!isBlocked) {
               const blocked = await this.blacklistService.blockUser(email);

               if (!blocked) {
                    throw new HttpException(
                         `Unable to block user at this moment`,
                         HttpStatus.NOT_IMPLEMENTED
                    );
               }

               return res.status(201).json(
                    {
                         message: `You blocked the user with email: ${email}`
                    }
               )
          }
          const unBlocked = await this.blacklistService.unBlockUser(email);
          if (!unBlocked) {
               throw new HttpException(
                    `Unable to unblock user at this moment`,
                    HttpStatus.NOT_MODIFIED
               );
          }

          return res.status(200).json(
               {
                    message: `You unblocked the user with email: ${email}`
               }
          );
     }

     @ApiOperation({ summary: 'Create an user' })
     @ApiResponse({ type: Object })
     @Roles(Role.Super_Admin, Role.Admin)
     @Post()
     async createUser(
          @Req() req: any,
          @Res() res: Response,
          @Body(new ValidationPipe(JoiValidationSchema.createUserSchema)) user: CreateUser,
     ) {
          const authUser: AuthUser = req.user;

          if (authUser.user_used >= authUser.user_limit) {
               throw new HttpException(
                    `User limit exceeded, please upgrade your plan or delete some users`,
                    HttpStatus.BAD_REQUEST
               );
          }

          const isAlreadyExist = await this.userService.getUserByEmail(user.email);

          if (isAlreadyExist) {
               throw new HttpException(
                    `User already exist, login pleasse`,
                    HttpStatus.BAD_REQUEST
               );
          }

          if (Role.Admin === user.role && !authUser.access) {
               throw new HttpException(
                    `Admin can't create user with role 'Admin', 'Basic' user can be created by Admin`,
                    HttpStatus.BAD_REQUEST
               );
          }

          if (!authUser.access) {
               user.access = false;
          }

          if (user.role === Role.Super_Admin) {
               throw new HttpException(
                    `Only one Super Admin can exist, try to give other role`,
                    HttpStatus.BAD_REQUEST
               );
          };

          user.account_id = authUser.account_id;
          authUser.user_used = authUser.user_used + 1;
          await this.accountService.updateAccount(authUser.user_id, { user_used: authUser.user_used });

          const user_id = await this.userService.createUser(user);
          if (!user_id) {
               throw new HttpException(
                    `User not created, try again`,
                    HttpStatus.NOT_IMPLEMENTED
               );
          }

          const payload = {
               email: user.email,
               account_id: authUser.account_id,
               user_id: user_id
          };

          const token = this.jwtService.sign(payload);

          res.status(201).json({
               message: `User created with id: ${user_id}, please join with the token`,
               token
          })
     }

     @ApiOperation({ summary: 'Update user by id' })
     @ApiResponse({ type: 'string' })
     @Roles(Role.Super_Admin)
     @Put(':id')
     async updateUser(
          @Req() req: Request,
          @Res() res: Response,
          @Param('id') id: number,
          @Body(new ValidationPipe(JoiValidationSchema.updateUserSchema)) updateUser: UpdateUser
     ) {

          const isExist = await this.userService.getUserById(id);
          if (!isExist) {
               throw new HttpException(
                    `User not found`,
                    HttpStatus.NOT_FOUND
               );
          }

          const response = await this.userService.updateUser(id, updateUser);
          if (!response) {
               throw new HttpException(
                    `User not updated`,
                    HttpStatus.NOT_IMPLEMENTED
               );
          }
          res.status(200).json({ message: `User with id: ${id} updated` })
     }

     @ApiOperation({ summary: 'Delete an user' })
     @ApiResponse({ type: 'string' })
     @Roles(Role.Super_Admin, Role.Admin)
     @Delete(':user_id')
     async deleteUser(
          @Req() req: any,
          @Res() res: Response,
          @Param('user_id') user_id: number,
     ) {

          const authUser: AuthUser = req.user;

          const isExist = await this.userService.getUserById(user_id);
          if (!isExist) {
               throw new HttpException(
                    `User not found`,
                    HttpStatus.NOT_FOUND
               );
          }

          if (authUser.role === Role.Admin && !authUser.access && isExist.role !== Role.Basic) {
               throw new HttpException(
                    `You don't have access to delete, please contact to Super Admin`,
                    HttpStatus.BAD_REQUEST
               );
          }

          const response = await this.userService.deleteUserByUserId(user_id);
          if (!response) {
               throw new HttpException(
                    `User not deleted`,
                    HttpStatus.NOT_IMPLEMENTED
               );
          }

          if (authUser.role === Role.Super_Admin) {
               await this.accountService.updateAccount(authUser.user_id, { user_used: authUser.user_used - 1 });
          }

          res.status(200).json({ message: `User with id: ${user_id} deleted` })
     }

}