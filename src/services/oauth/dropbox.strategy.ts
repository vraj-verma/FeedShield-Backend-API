import { Strategy, VerifyCallBack } from 'passport-google-oauth20';
import { PassportStrategy } from "@nestjs/passport";

export class DropboxStrategy extends PassportStrategy(Strategy, 'dropbox') {
     constructor() {
          super( 
               {
                    clientID: process.env.DROPBOX_APP_KEY,
                    clientSecret: process.env.DROPBOX_APP_SECRET,
                    callbackURL: process.env.DROPBOX_CALLBACK_URL,
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
