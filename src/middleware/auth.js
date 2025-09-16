import createError from "http-errors";
import { verifyJwt } from "../auth/jwt.js";

export function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw createError(401, "Missing or invalid Authorization header");
    }
    const decoded = verifyJwt(token);
    req.user = { id: decoded.sub, username: decoded.username };
    next();
  } catch {
    next(createError(401, "Unauthorized"));
  }
}
