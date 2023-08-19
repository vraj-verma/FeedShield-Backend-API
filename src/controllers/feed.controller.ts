import {
     Controller,
     Post,
     Req,
     Res,
     Body,
     Param,
     Query,
     UseGuards,
     HttpException,
     HttpStatus,
     Put,
     Delete,
     Get,
     Logger,
} from "@nestjs/common";
import { Request, Response } from 'express'
import { FeedService } from "../services/feed.service";
import { Feeds } from "../models/feeds.model";
import { ValidationPipe } from "../pipes/joiValidation.pipe";
import { JoiValidationSchema } from "../validation/schema.validation";
import { JwtAuthGuard } from "../services/auth/jwt-auth.guard";
import { RolesGuard } from "../services/auth/roles.guard";
import { Roles } from "../services/auth/roles.decorator";
import { Role } from "../models/signup.model";
import { AuthUser } from "../models/authuser.model";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('feed')
export class FeedController {

     constructor(
          private feedService: FeedService,
     ) { }

     @Roles(Role.Super_Admin)
     @Post()
     async createFeed(
          @Req() req: any,
          @Res() res: Response,
          @Body(new ValidationPipe(JoiValidationSchema.createFeedSchema)) feed: Feeds
     ) {
          const authUser = <AuthUser>req.user;
          feed.user_id = authUser.user_id;
          feed.created_at = new Date().toLocaleString();

          const response = await this.feedService.createFeed(feed);
          if (!response) {
               throw new HttpException(
                    'Feed not created',
                    HttpStatus.NOT_IMPLEMENTED
               );
          }
          res.status(201).json(
               {
                    ...feed,
                    feed_id: response,
               }
          )
     }

     @Roles(Role.Super_Admin)
     @Get()
     async getFeeds(
          @Req() req: Request,
          @Res() res: Response,
     ) {
          const response = await this.feedService.getFeeds();
          if (!response) {
               throw new HttpException(
                    `NO feeds found`,
                    HttpStatus.NOT_FOUND
               );
          }

          res.status(200).json(response);
     }

     @Roles(Role.Super_Admin)
     @Put(':id')
     async updateFeedById(
          @Req() req: any,
          @Res() res: Response,
          @Param('id') feed_id: string,
          @Body(new ValidationPipe(JoiValidationSchema.updateFeedSchema)) feed: Feeds
     ) {
          const authUser = <AuthUser>req.user;
          feed.user_id = authUser.user_id;
          feed.updated_at = new Date().toLocaleString();

          const response = await this.feedService.updateFeed(feed_id, feed);
          if (!response) {
               throw new HttpException(
                    'Feed not updated',
                    HttpStatus.NOT_IMPLEMENTED
               );
          }
          res.status(200).json(
               {
                    ...feed,
                    message: `Feed with id: ${feed_id} updated successfully`,
               }
          );
     }

     @Roles(Role.Super_Admin, Role.Admin)
     @Delete()
     async deleteFeedById(
          @Req() req: any,
          @Res() res: Response,
          @Query('id') feed_id: any,
     ) {

          const authUser: AuthUser = req.user;
          if (authUser.role === Role.Admin && !authUser.access) {
               throw new HttpException(
                    `You do not have access to delete the feeds. Please contact your account administrator.`,
                    HttpStatus.FORBIDDEN
               );
          }

          if (typeof feed_id == 'string') {
               feed_id = feed_id.split(',');
          }

          const response = await this.feedService.deleteFeed(feed_id);
          if (!response) {
               throw new HttpException(
                    'Feed not found',
                    HttpStatus.NOT_FOUND
               );
          }
          res.status(200).json(
               {
                    message: `Feed with id: ${feed_id} deleted successfully`,
               }
          );
     }

     @Roles(Role.Super_Admin, Role.Admin, Role.Basic)
     @Get(':id')
     async getFeedById(
          @Req() req: any,
          @Res() res: Response,
          @Param('id') feed_id: string,
     ) {
          const authUser: AuthUser = req.user;
          if (authUser.role === Role.Admin || authUser.role === Role.Basic && !authUser.access) {
               throw new HttpException(
                    `You do not have access to get the feeds. Please contact your account administrator.`,
                    HttpStatus.FORBIDDEN
               );
          }
          const response = await this.feedService.getFeedById(feed_id);
          if (!response) {
               throw new HttpException(
                    'Feed not found',
                    HttpStatus.NOT_FOUND
               );
          }
          res.status(HttpStatus.OK).json(response);
     }

}