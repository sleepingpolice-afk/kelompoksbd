const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
    connectionString : process.env.CONNECTIONSTRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect().then(() => {
  console.log(`Connected to database!`);
});

module.exports = pool;