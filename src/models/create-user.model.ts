import { ApiProperty } from "@nestjs/swagger";
import { Status } from "./account.model";
import { Role } from "./signup.model";

export class CreateUser {

     @ApiProperty({ required: false })
     account_id?: number;

     @ApiProperty({ required: false })
     name?: string;

     @ApiProperty({ required: true })
     email: string;

     @ApiProperty({ required: true, enum: Role })
     role: Role;

     @ApiProperty({ required: false })
     access?: boolean;

     @ApiProperty({ required: false })
     created_at?: Date | string;
}

export class UpdateUser {
     account_id?: number;
     name?: string;
     role?: Role;
     status?: Status;
     access?: boolean;
     updated_at?: Date | string;
}