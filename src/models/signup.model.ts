import { ApiProperty } from "@nestjs/swagger";
import { Status } from "./account.model";

export class Signup {

     @ApiProperty({ required: false })
     user_id?: number;

     @ApiProperty({ required: false })
     account_id?: number;

     @ApiProperty({ required: false })
     name?: string;

     @ApiProperty({ required: true, enum: (Role: Role) => Role })
     role: Role;

     @ApiProperty({ required: true })
     email: string;

     @ApiProperty({ required: false })
     password?: string;

     @ApiProperty({ required: false, enum: Status })
     status?: Status;

     @ApiProperty({ required: false })
     access?: boolean;

     @ApiProperty({ required: false })
     created_at?: Date | string;

     @ApiProperty({ required: false })
     joined?: boolean;
}

export enum Role {
     Admin = "Admin",
     Super_Admin = "Super Admin",
     Basic = "Basic"
}