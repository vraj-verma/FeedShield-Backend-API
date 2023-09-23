import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type OTPDocument = OTP & Document;

@Schema()
export class OTP {

     otp_id: Types.ObjectId;

     @Prop()
     otp: number;

     @Prop()
     feed_id: string;

     @Prop()
     deleted_by: string;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);