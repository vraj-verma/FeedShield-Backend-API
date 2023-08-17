import { Controller, Get, Post, Body, Req, Res, UseGuards, HttpException, HttpStatus, Query, Put, Param } from "@nestjs/common";
import { AccountService } from "../services/account.service";
import { Request, Response } from "express";
import { JwtAuthGuard } from "../services/auth/jwt-auth.guard";
import { JwtService } from "@nestjs/jwt";
import { AuthUser } from "../models/authuser.model";
import { Role, Signup } from "../models/signup.model";
import { UserService } from "../services/user.service";
import { CreateUser, UpdateUser } from "../models/create-user.model";
import { ValidationPipe } from "../pipes/joiValidation.pipe";
import { JoiValidationSchema } from "../validation/schema.validation";
import { RolesGuard } from "../services/auth/roles.guard";
import { Roles } from "../services/auth/roles.decorator";
const bcrypt = require('bcrypt')


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class AccountController {
     constructor(
          private jwtService: JwtService,
          private userService: UserService,
     ) { }

     @Roles(Role.Super_Admin, Role.Admin)
     @Post()
     async createUser(
          @Req() req,
          @Res() res: Response,
          @Body(new ValidationPipe(JoiValidationSchema.createUserSchema)) user: CreateUser,
     ) {
          const authUser = <AuthUser>req.user;

          const isAlreadyExist = await this.userService.getUserByEmail(user.email);

          if (isAlreadyExist) {
               throw new HttpException(
                    `User already exist, login pleasse`,
                    HttpStatus.BAD_REQUEST
               );
          }

          if (Role.Admin === user.role && !authUser.access) {
               throw new HttpException(
                    `Admin can't create user with Admin role, Role 'Basic' user can be created by Admin`,
                    HttpStatus.BAD_REQUEST
               );
          }

          if (user.role === Role.Super_Admin) {
               throw new HttpException(
                    `Only one Super Admin can exist, try to give other role`,
                    HttpStatus.BAD_REQUEST
               );
          };

          user.account_id = authUser.account_id;
          user.access = true;

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
               message: `User created, please join with the token`,
               token
          })
     }

     @Roles(Role.Super_Admin, Role.Admin)
     @Put(':id')
     async updateUser(
          @Req() req: Request,
          @Res() res: Response,
          @Param('id') id: string,
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
}