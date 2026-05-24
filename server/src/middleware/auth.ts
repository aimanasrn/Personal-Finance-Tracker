import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/auth.js";

export type AuthedRequest = Request & { userId: string };

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  try {
    const payload = verifyToken(token);
    (req as AuthedRequest).userId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }
}
