import pg from "pg";
import fs from "fs";
const { Pool } = pg;

const config = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database:  process.env.PGDATABASE,
  user: process.env.PGUSER,
  password:  process.env.PGPASSWORD,
  ssl: false,
  max: 10,
  idleTimeoutMillis: 10_000
};

export const pool = new Pool(config);

export async function initDb() {
  const sql = fs.readFileSync(new URL("./sql/init.sql", import.meta.url));
  await pool.query(sql.toString());
}
