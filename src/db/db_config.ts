import * as mysql from 'mysql2/promise';

export const mysqlConfig = [
     {
          provide: 'MYSQL_CONNECTION',
          useFactory: (): mysql.Pool => {
               try {
                    const pool = mysql.createPool({
                         // host: process.env.MYSQL_HOST,
                         // port: +(process.env.MYSQL_PORT),  
                         // user: process.env.MYSQL_USER,
                         // password: process.env.MYSQL_PASSWORD,
                         // database: process.env.MYSQL_DB,
                         // multipleStatements: true,     
                         // waitForConnections: true,
                         // connectionLimit: 10, 
                         host: "aws-india-instance.clqbiaktudx8.ap-south-1.rds.amazonaws.com",
                         port : 3306, 
                         user: "admin",
                         password: "qwerty123",
                         database: "Node" 
                            
                    }); 
                    console.log('DB Connected')
                    return pool;
               } catch (error) {
                    console.error(error);
                    process.exit(0);
               }
          },
     },
];