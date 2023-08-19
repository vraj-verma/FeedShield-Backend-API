import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { AuthUser } from '../models/authuser.model';


@Injectable()
export class Logger implements NestMiddleware {
     private logFolder = path.join('src/logss');
     private logFile: string;
     private jwtService: JwtService;

     constructor(jwtService: JwtService) {
          this.jwtService = jwtService;
          this.createLogFile();
          setInterval(() => {
               this.createLogFile();
          }, 5 * 60 * 1000);
          setInterval(() => {
               this.deleteOldLogs();
          }, 2 * 60 * 1000);
     }

     private createLogFile() {
          const timestamp = new Date().toISOString().replace(/[:-]/g, '');
          this.logFile = path.join(this.logFolder, `log_${timestamp}.log`);
          fs.writeFileSync(this.logFile, '');
     }

     private deleteOldLogs() {
          const files = fs.readdirSync(this.logFolder);
          const currentTime = Date.now();
          files.forEach(file => {
               const filePath = path.join(this.logFolder, file);
               const fileStats = fs.statSync(filePath);
               const fileAge = currentTime - fileStats.mtime.getTime();
               if (fileAge > 30 * 60 * 1000) {
                    fs.unlinkSync(filePath);
               }
          });
     }

     use(req: Request, res: Response, next: NextFunction) {

          // decode user by token
          const token = req.headers?.authorization?.split(' ')[1];
          let authUser: AuthUser;

          try {
               authUser = this.jwtService.verify(token);
          } catch (error) {
               console.error('Sometthing went wrong', error.message);
          }

          const logMessage = {
               Time: `[${new Date().toISOString()}]`,
               User: `${authUser ? authUser.email : req.body.email}`,
               Method: `${req.method} ${req.url}`,
               Operation: `${req.originalUrl}`,
               User_Agent: `${req.headers['user-agent']}`,
          };

          const jsonFile = JSON.stringify(logMessage).trim();
          fs.appendFileSync(this.logFile, jsonFile);
          next();
     }
}
