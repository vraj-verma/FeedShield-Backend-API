import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type FeedsDocument = Feeds_ & Document;

@Schema({
     timestamps: {
          createdAt: 'created_at',
          updatedAt: 'updated_at',
     }
})
export class Feeds_ {

     _id?: Types.ObjectId;

     @Prop()
     user_id: number;

     @Prop()
     topic: string;

     @Prop()
     description: string;

     @Prop()
     url: string;

     @Prop()
     published: boolean;
}

export const FeedsSchema = SchemaFactory.createForClass(Feeds_);

