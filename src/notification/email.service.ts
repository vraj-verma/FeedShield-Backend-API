import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { Role } from "../models/signup.model";
import { join } from "path";
import { readFileSync } from "fs";
const templatePath = join('src/templates/feed.html')
const emailTemplate = readFileSync(templatePath, 'utf-8');

// user template
const userTemplatePath = join('src/templates/user.html')
const userEmailTemplate = readFileSync(userTemplatePath, 'utf-8');

// otp template
const otpTemplatePath = join('src/templates/otp.html')
const otpEmailTemplate = readFileSync(otpTemplatePath, 'utf-8');

@Injectable()
export class EmailService {
     constructor(
          private mailerService: MailerService
     ) { }

     async sendMail(feed_id: string, name: string, role: Role) {
          const htmlTemplate = emailTemplate.replace('{name}', name).replace('{role}', role).replace('{feed_id}', feed_id).replace('{{feed_id}}', feed_id);

          await this.mailerService.sendMail({
               from: `Sumit Verma ${process.env.MAIL_USER}`,
               to: process.env.FEED_TEMP_EMAIL_TO,
               cc: process.env.FEED_TEMP_EMAIL_CC,
               // bcc: '',
               subject: 'New Feed added 📒',
               html: htmlTemplate
          });
     }

     async userCreatedMail(createdBy: string, userName: string, role: Role) {
          const htmlTemplate = userEmailTemplate.replace('{createdBy}', createdBy).replace('{user}', userName).replace('{role}', role);

          await this.mailerService.sendMail({
               from: `Sumit Verma ${process.env.MAIL_USER}`,
               to: process.env.FEED_TEMP_EMAIL_TO,
               cc: process.env.FEED_TEMP_EMAIL_CC,
               // bcc: '',
               subject: 'New User added 👤',
               html: htmlTemplate
          });
     }

     async otpMail(otp: any, feed_id: string) {
          const htmlTemplate = otpEmailTemplate.replace('{feed_id}', feed_id).replace('{otp}', otp);

          await this.mailerService.sendMail({
               from: `Sumit Verma ${process.env.MAIL_USER}`,
               to: process.env.FEED_TEMP_EMAIL_TO,
               cc: process.env.FEED_TEMP_EMAIL_CC,
               // bcc: '',
               subject: 'Request to delete feed 📝',
               // text: `Your OTP to delete this feed with id: ${feed_id} is: ${otp}`
               html: htmlTemplate
          });
     }

}