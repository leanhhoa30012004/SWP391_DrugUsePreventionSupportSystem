const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({

  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "swp-db",
  port: process.env.DB_PORT || 3307,
  timezone: process.DB_TIMEZONE || "+07:00"
});
pool.on('connection', (conn) => {
  conn.query("SET time_zone = '+07:00'");
});

module.exports = pool;
