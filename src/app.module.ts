import { WinstonModule } from 'nest-winston';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { AccountService } from './services/account.service';
import { MysqlModule } from './db/mysql.module';
import { UserService } from './services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { AccountController } from './controllers/account.controller';
import { JwtStrategy } from './services/auth/jwt.strategy';
import winston from 'winston';
import { LoggerModule } from './logger/logger.module';



@Module({
  imports: [
    MysqlModule,
    JwtModule.register({
      secret: 'secretOrKey',
      signOptions: { expiresIn: '1h' },
    }),
    LoggerModule,
  ],
  controllers: [
    AppController,
    AuthController,
    AccountController,
  ],
  providers: [
    UserService,
    AccountService,
    JwtStrategy,
    AppService,
  ],
})
export class AppModule { }
