import { Inject, Injectable } from "@nestjs/common";
import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { Account } from "../models/account.model";

@Injectable()
export class AccountService {

     constructor(
          @Inject('MYSQL_CONNECTION') private db: mysql.Connection
     ) { }

     async createAccount(signup: Account): Promise<number> {
          const sqlQuery = `INSERT INTO Accounts set ?`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery, signup);
          return response.insertId;
     }

     async getAccountByEmail(email: string): Promise<any> {
          const sqlQuery = `SELECT * FROM Accounts WHERE email = ?`;
          const [response] = await this.db.query<RowDataPacket[]>(sqlQuery, [email]);
          return response ? response[0] : null;
     }

     async deleteAccount(account_id: number): Promise<boolean> {
          const sqlQuery = `DELETE FROM Accounts WHERE account_id = ?`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery, account_id);
          return response ? response.affectedRows > 0 : false;
     }

     async updateAccount(account_id: number, data: any): Promise<boolean> {
          const sqlQuery = `UPDATE Accounts SET user_used = ? WHERE account_id = ?`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery, [data.user_used, account_id]);
          return response ? response.affectedRows > 0 : false;
     }
}