import express from "express";
import { z } from "zod";
import { pool } from "../db.js";
import { sanitizeString } from "../utils/sanitize.js";
import createError from "http-errors";

const router = express.Router();

const itemSchema = z.object({
  data: z.string().min(1).max(10_000)
});


router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, data, created_at, updated_at FROM items ORDER BY id DESC"
    );
    const safe = rows.map(r => ({
      id: r.id,
      data: sanitizeString(r.data),
      created_at: r.created_at,
      updated_at: r.updated_at
    }));
    res.json(safe);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { data } = itemSchema.parse(req.body);
    const clean = sanitizeString(data);
    const { rows } = await pool.query(
      "INSERT INTO items (data) VALUES ($1) RETURNING id, data, created_at, updated_at",
      [clean]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
});


router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw createError(400, "Invalid id");
    }
    const result = await pool.query("DELETE FROM items WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;
