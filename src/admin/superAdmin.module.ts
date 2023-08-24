import { Module, forwardRef } from "@nestjs/common";
import { SuperAdminService } from "./superAdmin.service";
import { SuperAdminController } from "./superAdmin.controller";
import { AppModule } from "src/app.module";

@Module({
     imports: [forwardRef(() => AppModule)],
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