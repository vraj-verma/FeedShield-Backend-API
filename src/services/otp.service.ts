import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { OTP, OTPDocument } from "src/schema/otp.schema";

@Injectable()
export class OTPService {
     constructor(
          @InjectModel(OTP.name) private otpModel: Model<OTPDocument>
     ) { }

     async createOTP(otp: number, feed_id: any, deleted_by: string) {
          const data = { otp, feed_id, deleted_by };
          return await new this.otpModel(data).save();
     }
}