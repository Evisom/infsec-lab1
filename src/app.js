import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import createError from "http-errors";
import authRoutes from "./routes/auth.js";
import dataRoutes from "./routes/data.js";
import { requireAuth } from "./middleware/auth.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet({
    contentSecurityPolicy: false
  }));
  app.use(cors({ origin: true, credentials: false }));
  app.use(express.json({ limit: "10kb", strict: true }));
  app.use(morgan("combined"));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/auth", authRoutes);
  app.use("/api/data", requireAuth, dataRoutes);

  
  app.use((_req, _res, next) => next(createError(404, "Not Found")));

  app.use((err, _req, res) => {
    const status = typeof err?.status === "number" ? err.status : 500;
    res.status(status).end();
  });
  
  app.use((err, _req, res) => {
    const status = err.status || 500;
    res.status(status).json({
      error: status === 500 ? "Internal Server Error" : err.message
    });
  });

  return app;
}
