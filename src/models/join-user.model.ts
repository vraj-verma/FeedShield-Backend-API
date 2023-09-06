import { ApiProperty } from "@nestjs/swagger";
import { Status } from "./account.model";

export class JoinUser {

     @ApiProperty({ required: false })
     user_id?: number;

     @ApiProperty({ required: false })
     joined?: boolean;

     @ApiProperty({ required: true })
     password: string;

     @ApiProperty({ required: true })
     confirm_password?: string;

     @ApiProperty({ required: true, enum: Status })
     status: Status;

     @ApiProperty({ required: false })
     created_at?: Date | string;
}