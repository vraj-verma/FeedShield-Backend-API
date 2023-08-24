import { Controller, Get, HttpException, HttpStatus, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from 'express';
import { SuperAdminService } from "./superAdmin.service";
import { JwtAuthGuard } from "../services/auth/jwt-auth.guard";
import { RolesGuard } from "../services/auth/roles.guard";
import { Roles } from "../services/auth/roles.decorator";
import { Role } from "../models/signup.model";
import { UserService } from "../services/user.service";


@Controller('admin')
export class SuperAdminController {
     constructor(
          private superAdminService: SuperAdminService,
          private userService: UserService,
     ) { }


     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(Role.Super_Admin)
     @Get('logs')
     async getLogs(
          @Req() req: Request,
          @Res() res: Response,
     ) {
          const response = await this.superAdminService.getLogs();
          if (!response && response.length === 0) {
               throw new HttpException(
                    'No logs found',
                    HttpStatus.NOT_FOUND
               );
          }

          const str = String(response);
          const objResponse = str.match(/\{[^}]+\}/g);

          const objToJsson = objResponse.map(objectString => JSON.parse(objectString));

          res.status(200).json(objToJsson);
     }

     // @Roles(Role.Super_Admin)
     @Get('users')
     async getUsers(
          @Req() req: Request,
          @Res() res: Response,
     ) {
          const response = await this.userService.getUsers();
          if (!response) {
               throw new HttpException(
                    'No users found',
                    HttpStatus.NOT_FOUND
               );
          }
          res.status(200).json(response);
     }

}
