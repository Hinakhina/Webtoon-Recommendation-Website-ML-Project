import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',           // or your MySQL password if changed
  database: 'webtoon_db',
  port: 3306              // default XAMPP MySQL port
});
