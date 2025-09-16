import express from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { pool } from "../db.js";
import { signJwt } from "../auth/jwt.js";
import { sanitizeString } from "../utils/sanitize.js";

const router = express.Router();

const credsSchema = z.object({
  username: z.string(),
  password: z.string()
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = credsSchema.parse(req.body);

    const { rows } = await pool.query(
      "SELECT id, username, password_hash FROM users WHERE username = $1",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signJwt({ sub: user.id, username: user.username });
    res.json({
      token,
      user: { id: user.id, username: sanitizeString(user.username) }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
