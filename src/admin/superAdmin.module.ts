import { Module } from "@nestjs/common";
import { SuperAdminService } from "./superAdmin.service";
import { SuperAdminController } from "./superAdmin.controller";

@Module({
     providers: [
          SuperAdminService,
     ],
     controllers: [
          SuperAdminController,
     ],
     exports: [
          SuperAdminModule
     ]
})

export class SuperAdminModule { }