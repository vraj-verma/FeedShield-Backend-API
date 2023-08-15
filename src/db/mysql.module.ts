import { Module } from "@nestjs/common";
import { mysqlConfig } from "./db_config";

@Module({
     providers: [...mysqlConfig],
     exports: [...mysqlConfig],

})

export class MysqlModule { }