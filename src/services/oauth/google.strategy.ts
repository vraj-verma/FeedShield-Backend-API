import { Strategy, VerifyCallBack } from 'passport-google-oauth20';
import { PassportStrategy } from "@nestjs/passport";

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
     constructor() {
          super(
               {
                    clientID: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    callbackURL: process.env.GOOGLE_CALLBACK_URL,
                    scope: ['email', 'profile'],
               }
          );
     }

     async validate(accessToken: string, refreshToken: string, profile: any, next: VerifyCallBack): Promise<any> {
          const { name, emails, photos } = profile;
          const user = {
               email: emails[0].value,
               name: `${name.givenName} ${name.familyName}`,
               picture: photos[0].value,
               accessToken
          }
          next(null, user);
     }
}
