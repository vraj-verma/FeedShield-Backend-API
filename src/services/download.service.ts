import { Injectable } from "@nestjs/common";
const { transforms: { flatten }, } = require('json2csv');
import { Parser } from 'json2csv';
import { Response } from "express";


@Injectable()
export class DownloadService {

     coverter = new Parser(
          {
               transforms: [
                    flatten(
                         {
                              objects: true,
                              arrays: true,
                              separator: '-',
                         }
                    ),
               ],
               formatters:{

               }
          }
     );

     async downloadData(res: Response, data: any) {
          const csv = this.coverter.parse(data);
          res.set('Content-Type', 'text/csv');
          res.end(csv);
     }
}


