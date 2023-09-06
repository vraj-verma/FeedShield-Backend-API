import { ApiProperty } from "@nestjs/swagger";

export class Account {
     @ApiProperty({ required: false })
     account_id?: number;

     @ApiProperty({ required: false })
     user_limit?: number;

     @ApiProperty({ required: false })
     user_used?: number;
     
     @ApiProperty({ required: false })
     created_at?: Date | string;
}

export enum Status {
     Active = 'Active',
     Inactive = 'Inactive'
}