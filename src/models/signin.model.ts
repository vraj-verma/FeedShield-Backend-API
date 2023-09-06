import { ApiProperty } from "@nestjs/swagger";

export class Signin {

     @ApiProperty({ required: true })
     email: string;

     @ApiProperty({ required: true })
     password: string;
}