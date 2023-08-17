import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { Inject, Injectable } from "@nestjs/common";
import { Feeds } from '../models/feeds.model';

@Injectable()
export class FeedService {
     constructor(
          @Inject('MYSQL_CONNECTION') private db: mysql.Connection,
     ) { }

     async createFeed(feed: Feeds): Promise<number> {
          const sqlQuery = `INSERT INTO Feeds SET ?`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery, [feed]);
          return response.insertId;
     }

     async getFeeds(): Promise<Feeds> {
          const sqlQuery = `SELECT * FROM Feeds`;
          const [response] = await this.db.query<RowDataPacket[]>(sqlQuery);
          return response ? response as unknown as Feeds : null;
     }

     async getFeedById(id: string): Promise<any> {
          const sqlQuery = `SELECT * FROM Feeds WHERE feed_id = ?`;
          const [response] = await this.db.query<RowDataPacket[]>(sqlQuery, [id]);
          return response ? response[0] : null;
     }

     async getFeedsByUserId(id: string): Promise<any> {
          const sqlQuery = `SELECT * FROM Feeds WHERE user_id = ?`;
          const [response] = await this.db.query<RowDataPacket[]>(sqlQuery, [id]);
          return response ? response : null;
     }

     async updateFeed(id: string, feed: Feeds): Promise<boolean> {
          const sqlQuery = `UPDATE Feeds SET ? WHERE feed_id = ?`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery, [feed, id]);
          return response ? response.affectedRows > 0 : null
     }

     async deleteFeed(id: any): Promise<boolean> {
          const sqlQuery = `DELETE FROM Feeds WHERE feed_id IN (?)`;
          const [response] = await this.db.query<ResultSetHeader>(sqlQuery, [id]);
          return response ? response.affectedRows > 0 : null
     }




}