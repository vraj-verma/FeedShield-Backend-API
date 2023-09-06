import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type LogsDocument = Logs & Document;

@Schema()
export class Logs {

     log_id: Types.ObjectId;

     @Prop()
     Time: string;

     @Prop()
     User: string;

     @Prop()
     Method: string;

     @Prop()
     Operation: string;

     @Prop()
     User_Agent: string;
}

export const LogsSchema = SchemaFactory.createForClass(Logs);
