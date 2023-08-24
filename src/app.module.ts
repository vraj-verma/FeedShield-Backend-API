import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { ScheduleModule } from '@nestjs/schedule';
import { Logger } from './logger/logger.service';
import { SuperAdminModule } from './admin/superAdmin.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    MysqlModule,
    JwtModule.register({
      secret: process.env.APP_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    ScheduleModule.forRoot(),
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
    JwtStrategy,
    AppService,
    FeedService,
  ],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Logger).forRoutes('*');
  }
}

// for development
// export class AppModule {}
