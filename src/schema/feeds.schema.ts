import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
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

     @ApiProperty({ required: true })
     @Prop()
     user_id: number;

     @ApiProperty({ required: true })
     @Prop()
     topic: string;

     @ApiProperty({ required: true })
     @Prop()
     description: string;

     @ApiProperty({ required: true })
     @Prop()
     url: string;

     @ApiProperty({ required: true })
     @Prop()
     published: boolean;
}

export const FeedsSchema = SchemaFactory.createForClass(Feeds_);

