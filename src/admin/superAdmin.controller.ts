import { Controller, Get, HttpException, HttpStatus, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from 'express';
import { SuperAdminService } from "./superAdmin.service";
import { JwtAuthGuard } from "../services/auth/jwt-auth.guard";
import { RolesGuard } from "../services/auth/roles.guard";
import { Roles } from "../services/auth/roles.decorator";
import { Role } from "../models/signup.model";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('logs')
export class SuperAdminController {
     constructor(
          private readonly superAdminService: SuperAdminService,
     ) { }

     @Roles(Role.Super_Admin)
     @Get()
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

}
