import { Inject, Injectable } from "@nestjs/common";
import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { Signup } from "../models/signup.model";
import { JoinUser } from "../models/join-user.model";
import { UpdateUser } from "../models/create-user.model";
import { AuthUser } from "src/models/authuser.model";

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
          const sqlQuery = `SELECT * FROM Users 
               INNER JOIN Accounts ON Users.account_id = Accounts.account_id 
               WHERE email = ?`;
          const [response] = await this.db.query<RowDataPacket[]>(sqlQuery, email);
          return response ? response[0] : null;
     }

     async getUserById(user_id: number) {
          const sqlQuery = `SELECT * FROM Users WHERE user_id = ?`;
          const [response] = await this.db.query<RowDataPacket[]>(sqlQuery, [user_id]);
          return response ? response[0] : null;
     }

     async updateUser(user_id: number, updateUser: UpdateUser) {
          const sqlQuery = `UPDATE Users SET ? WHERE user_id = ?`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery, [updateUser, user_id]);
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

     async deleteUsers(account_id: number): Promise<boolean> {
          const sqlQuery = `DELETE FROM Users WHERE account_id = ?`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery, [account_id]);
          return response ? response.affectedRows > 0 : false;
     }

     async deleteUserByUserId(user_id: number): Promise<boolean> {
          const sqlQuery = `DELETE FROM Users WHERE user_id = ?`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery, user_id);
          return response ? response.affectedRows > 0 : false;
     }

     async getUsers(): Promise<AuthUser[]> {
          const sqlQuery = `SELECT * FROM Users WHERE role <> 'Super Admin'`;
          const [response] = await this.db.query<RowDataPacket[]>(sqlQuery);
          return response ? response as [AuthUser] : [];
     }
}