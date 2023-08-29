import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Inject, Injectable } from "@nestjs/common";


@Injectable()
export class BlacklistService {
     constructor(
          @Inject('MYSQL_CONNECTION') private db: mysql.Connection
     ) { }


     async blockUser(email: string): Promise<boolean> {
          const sqlQuery = `INSERT INTO Blacklist (email) VALUES (?)`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery, [email]);
          return response ? response.affectedRows > 0 : false;
     }

     async unBlockUser(email: string): Promise<boolean> {
          const sqlQuery = `DELETE FROM Blacklist WHERE email = ?`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery, email);
          return response ? response.affectedRows > 0 : false;
     }

     async getBlockedUser(email: string): Promise<any> {
          const sqlQuery = `SELECT * FROM Blacklist WHERE email = ?`;
          const [response] = await this.db.query<RowDataPacket[]>(sqlQuery, email);
          return response ? response[0] : null;
     }

}