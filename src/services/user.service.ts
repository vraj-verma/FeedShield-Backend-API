import { Inject, Injectable } from "@nestjs/common";
import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { Signup } from "../models/signup.model";
import { JoinUser } from "src/models/join-user.model";

@Injectable()
export class UserService {

     constructor(
          @Inject('MYSQL_CONNECTION') private db: mysql.Connection
     ) { }

     async createUser(user: Signup) {
          const sqlQuery = `INSERT INTO Users set ?`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery, [user]);
          return response.insertId;
     }

     async getUserByEmail(email: string): Promise<any> {
          const sqlQuery = `SELECT * FROM Users WHERE email = ?`;
          const [response] = await this.db.query<RowDataPacket[]>(sqlQuery, [email]);
          return response ? response[0] : null;
     }


     async joinUser(joinUser: JoinUser) {
          const sqlQuery = `UPDATE Users SET password = ?, joined = ? WHERE user_id = ?`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery,
               [
                    joinUser.password,
                    joinUser.joined,
                    joinUser.user_id
               ]
          );

          return response ? response.affectedRows > 0 : null
     }
}