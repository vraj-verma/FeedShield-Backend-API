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

@Module({
  imports: [
    MysqlModule,
    JwtModule.register({
      secret: 'secretOrKey',
      signOptions: { expiresIn: '1h' },
    }),
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
