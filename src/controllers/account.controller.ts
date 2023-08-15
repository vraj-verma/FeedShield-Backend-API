import { Controller, Get, Post, Body, Req, Res, UseGuards, HttpException, HttpStatus, Query } from "@nestjs/common";
import { AccountService } from "../services/account.service";
import { Request, Response } from "express";
import { JwtAuthGuard } from "../services/auth/jwt-auth.guard";
import { JwtService } from "@nestjs/jwt";
import { AuthUser } from "../models/authuser.model";
import { Role, Signup } from "../models/signup.model";
import { UserService } from "../services/user.service";
import { JoinUser } from "../models/join-user.model";
import { CreateUser } from "../models/create-user.model";
import { ValidationPipe } from "src/pipes/joiValidation.pipe";
import { JoiValidationSchema } from "src/validation/schema.validation";
const bcrypt = require('bcrypt')

@UseGuards(JwtAuthGuard)
@Controller('user')
export class AccountController {
     constructor(
          private jwtService: JwtService,
          private userService: UserService,
     ) { }


     @Post('create')
     async createUser(
          @Req() req,
          @Res() res: Response,
          @Body(new ValidationPipe(JoiValidationSchema.createUserSchema)) user: CreateUser,
     ) {
          const authUser = <AuthUser>req.user;

          if (authUser.role !== Role.Super_Admin) {
               throw new HttpException(
                    `Role with Super Admin can create users only, please check your role`,
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

          if (user.role === Role.Super_Admin) {
               throw new HttpException(
                    `Only one Super Admin can exist, try to give other role`,
                    HttpStatus.BAD_REQUEST
               );
          };

          user.account_id = authUser.account_id;

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

}