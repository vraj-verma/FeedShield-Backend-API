import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export type LogsDocument = Logs & Document;

@Schema()
export class Logs {

     log_id: Types.ObjectId;

     @ApiProperty({ required: true })
     @Prop()
     Time: string;

     @ApiProperty({ required: true })
     @Prop()
     User: string;

     @ApiProperty({ required: true })
     @Prop()
     Method: string;

     @ApiProperty({ required: true })
     @Prop()
     Operation: string;

     @ApiProperty({ required: true })
     @Prop()
     User_Agent: string;
}

export const LogsSchema = SchemaFactory.createForClass(Logs);
