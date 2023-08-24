import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
     constructor(
          private readonly userService: UserService,
     ) {
          super({ 
               jwtFromRequest: ExtractJwt.fromExtractors([
                    ExtractJwt.fromAuthHeaderAsBearerToken(),
                    ExtractJwt.fromUrlQueryParameter('token'),
               ]),
               ignoreExpiration: false,
               secretOrKey: process.env.APP_SECRET_KEY,
               passReqToCallback: true,
          });
     }

     async validate(req: Request, payload: any) {
          const email = payload.email;
          const user = await this.userService.getUserByEmail(email);

          if (!user) {
               throw new HttpException(`Unauthorized`, HttpStatus.UNAUTHORIZED);
          }
          return { ...user };
     }
}
