//wkwkwk ty technoskill 1.0

const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
    connectionString : process.env.PG_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect().then(() => {
  console.log(`Connected to database!`);
});

module.exports = pool;