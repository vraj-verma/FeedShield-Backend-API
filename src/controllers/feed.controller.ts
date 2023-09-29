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
} from "@nestjs/common";
import { Request, Response } from 'express'
import { ValidationPipe } from "../pipes/joiValidation.pipe";
import { JoiValidationSchema } from "../validation/schema.validation";
import { JwtAuthGuard } from "../services/auth/jwt-auth.guard";
import { RolesGuard } from "../services/auth/roles.guard";
import { Roles } from "../services/auth/roles.decorator";
import { Role } from "../models/signup.model";
import { AuthUser } from "../models/authuser.model";
import { FeedsService } from "../services/feeds.service";
import { Feeds_ } from "../schema/feeds.schema";
import { EmailService } from "../notification/email.service";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FeedService } from "../services/feed.service";
import { Feeds } from "../models/feeds.model";

@ApiTags('Feeds')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('feed')
export class FeedController {

     constructor(
          private feedsService: FeedsService,
          private feedService: FeedService,
          private emailService: EmailService,
          // private otpService: OTPService
     ) { }

     @ApiOperation({ summary: 'Create Feed' })
     @ApiResponse({ type: Feeds_ })
     @Roles(Role.Super_Admin)
     @Post()
     async createFeed(
          @Req() req: any,
          @Res() res: Response,
          @Body(new ValidationPipe(JoiValidationSchema.createFeedSchema)) feed: Feeds
          // @Body() feed: Feeds
     ) {
          const authUser = <AuthUser>req.user;
          feed.user_id = authUser.user_id;

          // const response = await this.feedsService.createFeed(feed);
          const response: any = await this.feedService.createFeed(feed);
          if (!response) {
               throw new HttpException(
                    'Feed not created',
                    HttpStatus.NOT_IMPLEMENTED
               );
          }
          this.emailService.sendMail(response, authUser.name, authUser.role);
          res.status(201).json(
               {
                    ...feed,
                    feed_id: response,
               }
          )
     }

     @ApiOperation({ summary: 'Get Feeds' })
     @ApiResponse({ type: Feeds_ })
     @Roles(Role.Super_Admin, Role.Admin, Role.Basic)
     @Get()
     async getFeeds(
          @Req() req: Request | any,
          @Res() res: Response,
     ) {
          const authUser: AuthUser = req.user;
          if (authUser.role === Role.Basic && !authUser.access) {
               throw new HttpException(
                    `You don't have permission to access this API. Please contact to your Super Admin.`,
                    HttpStatus.FORBIDDEN
               );
          }
          // const response = await this.feedsService.getFeeds();
          const response = await this.feedService.getFeeds();
          if (!response) {
               throw new HttpException(
                    `No feeds found`,
                    HttpStatus.NOT_FOUND
               );
          }
          const total = response.length;
          res.status(200).json(
               {
                    total,
                    response
               }
          );
     }

     @ApiOperation({ summary: 'Delete feed by id' })
     @ApiQuery({ type: "string", name: "feed_id" })
     @ApiResponse({ type: 'string' })
     @Roles(Role.Super_Admin, Role.Admin)
     @Delete('delete')
     async deleteFeedById(
          @Req() req: any,
          @Res() res: Response,
          @Query('feed_id') feed_id: any,
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
          
          // const response = await this.feedsService.deleteFeedById(feed_id);
          const response = await this.feedService.deleteFeedById(feed_id);
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

     @ApiOperation({ summary: 'Update feed by id' })
     @ApiResponse({ type: 'string' })
     @Roles(Role.Super_Admin)
     @Put(':id')
     async updateFeedById(
          @Req() req: any,
          @Res() res: Response,
          @Param('id') feed_id: string,
          // @Body(new ValidationPipe(JoiValidationSchema.updateFeedSchema)) feed: Feeds_
          @Body(new ValidationPipe(JoiValidationSchema.updateFeedSchema)) feed: Feeds
     ) {
          const authUser: AuthUser = req.user;
          feed.user_id = authUser.user_id;

          const response = await this.feedService.updateFeed(feed_id, feed); // this was sql service
          // const response = await this.feedsService.updateFeedById(feed_id, feed); // changed to mongo service
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

     @ApiOperation({ summary: 'Get feed by id' })
     @ApiResponse({ type: Feeds_ })
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
                    `You do not have access to get the feeds. Please contact your Super Admin.`,
                    HttpStatus.FORBIDDEN
               );
          }
          // const response = await this.feedsService.getFeedById(feed_id);
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