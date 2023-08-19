import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SuperAdminService {
     constructor() { }

     folderPath = path.join('src/files');

     async getLogs() {
          try {
               const allFiles = await fs.promises.readdir(this.folderPath);

               const datas = await Promise.all(
                    allFiles.map(async (file) => {
                         try {
                              return await fs.promises.readFile(path.join(this.folderPath, file), 'utf8');
                         } catch (err) {
                              console.log(`Error reading file: ${file}`, err);
                              return null;
                         }
                    })
               );

               const filteredDatas = datas.filter(d => d !== null);

               return filteredDatas;

          } catch (error) {
               console.log('Error reading folder:', error);
               return [];
          }
     }


}
