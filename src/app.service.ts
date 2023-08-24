import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to my inaugural project, which has been deployed on a server.';
  }
}
