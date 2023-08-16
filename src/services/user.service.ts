import { Inject, Injectable } from "@nestjs/common";
import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { Signup } from "../models/signup.model";
import { JoinUser } from "../models/join-user.model";
import { UpdateUser } from "../models/create-user.model";

@Injectable()
export class UserService {

     constructor(
          @Inject('MYSQL_CONNECTION') private db: mysql.Connection
     ) { }

     async createUser(user: Signup) {
          const sqlQuery = `INSERT INTO Users SET ?`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery, [user]);
          return response.insertId;
     }

     async getUserByEmail(email: string): Promise<any> {
          const sqlQuery = `SELECT * FROM Users WHERE email = ?`;
          const [response] = await this.db.query<RowDataPacket[]>(sqlQuery, [email]);
          return response ? response[0] : null;
     }

     async getUserById(id: string) {
          const sqlQuery = `SELECT * FROM Users WHERE user_id = ?`;
          const [response] = await this.db.query<RowDataPacket[]>(sqlQuery, [id]);
          return response ? response[0] : null;
     }

     async updateUser(id: string, updateUser: UpdateUser) {
          const sqlQuery = `UPDATE Users SET ? WHERE user_id = ?`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery, [updateUser, id]);
          return response ? response.affectedRows > 0 : null
     }


     async joinUser(joinUser: JoinUser) {
          const sqlQuery = `UPDATE Users SET password = ?, joined = ?, status = ?, created_at = ? WHERE user_id = ?`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery,
               [
                    joinUser.password,
                    joinUser.joined,
                    joinUser.status,
                    joinUser.created_at,
                    joinUser.user_id,
               ]
          );

          return response ? response.affectedRows > 0 : null
     }
}