import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { Feeds_, FeedsDocument } from "../schema/feeds.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class FeedsService {
     constructor(
          @InjectModel(Feeds_.name) private feedsModel: Model<FeedsDocument>,
     ) { }

     async createFeed(feed: any): Promise<any> {
          const response = await new this.feedsModel(feed).save();
          return response ? response._id : null;
     }

     async updateFeedById(feed_id: string, feed: Feeds_) {
          const response = await this.feedsModel.findByIdAndUpdate(feed_id, feed, { new: true }).exec();
          return response;
     }

     async getFeeds(): Promise<Feeds_[]> {
          const response = await this.feedsModel.find({}, { __v: 0 });
          return response ? response as Feeds_[] : []
     }

     async getFeedById(feed_id: string): Promise<Feeds_> {
          const filter = { _id: feed_id }
          const response = await this.feedsModel.findById(filter, { __v: 0 });
          return response ? response as Feeds_ : null;
     }

     async deleteFeedById(feed_id: string): Promise<boolean> {
          const filter = { _id: feed_id };
          const response = await this.feedsModel.deleteOne(filter);
          return response ? response.deletedCount > 0 : false;
     }
}