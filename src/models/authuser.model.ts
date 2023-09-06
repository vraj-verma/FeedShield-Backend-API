import { ApiProperty } from "@nestjs/swagger";
import { Status } from "./account.model";
import { Role } from "./signup.model";

export class AuthUser {

     @ApiProperty({ required: false })
     user_id?: number;

     @ApiProperty({ required: false })
     account_id?: number;

     @ApiProperty({ required: false })
     name?: string;

     @ApiProperty({ required: false })
     user_limit?: number = 5;

     @ApiProperty({ required: false })
     user_used?: number;

     @ApiProperty({ required: false })
     email?: string;

     @ApiProperty({ required: false })
     status?: Status;

     @ApiProperty({ required: false })
     role?: Role;

     @ApiProperty({ required: false })
     joined?: boolean;

     @ApiProperty({ required: false })
     created_at?: Date | string;

     @ApiProperty({ required: false })
     password?: string;

     @ApiProperty({ required: false })
     token?: string;

     @ApiProperty({ required: false })
     access?: boolean;

     @ApiProperty({ required: false })
     message?: string;
}