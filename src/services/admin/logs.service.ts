import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Logs, LogsDocument } from '../../schema/logs.schema'
import { Model } from 'mongoose'

@Injectable()
export class LogsService {
     constructor(
          @InjectModel(Logs.name) private logsModel: Model<LogsDocument>
     ) { }

     createLogs(log: any) {
          const response = new this.logsModel(log).save();
          if (!response) {
               console.log('log not added in mongoDB');
          }
     }
}