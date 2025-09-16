import "dotenv/config";
import { createApp } from "./app.js";
import { initDb, pool } from "./db.js";
import bcrypt from "bcrypt";

const PORT = Number(process.env.PORT || 8080);


async function seedAdminIfEmpty() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS c FROM users");
  if (rows[0].c === 0) {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    const hash = await bcrypt.hash(password, 12);
    await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, hash]
    );
    console.log(`Seeded default user: ${username}`);
  }
}

const app = createApp();

initDb()
  .then(seedAdminIfEmpty)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((e) => {
    console.error("Failed to init DB:", e);
    process.exit(1);
  });
