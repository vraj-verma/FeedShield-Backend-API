import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

const logsFolderPath = path.join('src/logs');

const logFileName = `file-${new Date().getUTCMilliseconds()}.log`;
const logFilePath = path.join(logsFolderPath, logFileName);

@Module({
     imports: [
          WinstonModule.forRoot({
               level: 'info',
               transports: [
                    new winston.transports.File({ filename: `${logFilePath}` }),
                    new winston.transports.Console
               ],
          }),
     ],
     exports: [WinstonModule],
})
export class LoggerModule { }
