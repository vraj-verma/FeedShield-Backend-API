require('dotenv').config();
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { AccountService } from './services/account.service';
import { MysqlModule } from './db/mysql.module';
import { UserService } from './services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './controllers/user.controller';
import { JwtStrategy } from './services/auth/jwt.strategy';
import { FeedService } from './services/feed.service';
import { FeedController } from './controllers/feed.controller';
import { Logger } from './logger/logger.service';
import { SuperAdminModule } from './admin/superAdmin.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './services/oauth/google.strategy';
import { GoogleGuard } from './services/oauth/google.guard';
import { BlacklistService } from './services/blacklist.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedsSchema, Feeds_ } from './schema/feeds.schema';
import { FeedsService } from './services/feeds.service';
import { Logs, LogsSchema, } from './schema/logs.schema';
import { LogsService } from './services/admin/logs.service';
import { DropBoxGuard } from './services/oauth/dropbox.guard';
import { DropboxStrategy } from './services/oauth/dropbox.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './mail/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    MysqlModule,
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME }),
    MongooseModule.forFeature(
      [
        {
          name: Feeds_.name, schema: FeedsSchema
        },
        {
          name: Logs.name, schema: LogsSchema
        }
      ]
    ),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: +(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      }
    }),
    JwtModule.register({
      secret: process.env.APP_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    SuperAdminModule,
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    FeedController,
  ],
  providers: [
    UserService,
    AccountService,
    BlacklistService,
    JwtStrategy,
    AppService,
    FeedsService,
    FeedService,
    LogsService,
    GoogleStrategy,
    GoogleGuard,
    DropboxStrategy,
    DropBoxGuard,
    EmailService,
  ],
  exports: [
    UserService,
  ]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Logger)
      // .exclude({ path: 'admin/logs', method: RequestMethod.GET })
      .forRoutes('*');
  }
}

// for development
// export class AppModule {}
