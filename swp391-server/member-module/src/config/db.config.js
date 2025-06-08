const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({

  host: "localhost",
  user: "root",
  password: "root",
  database: "swp391_drug",
  port: 3306,

});

module.exports = pool;
