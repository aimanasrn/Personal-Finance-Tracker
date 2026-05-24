import { Router } from "express";
import { getErrorResponse } from "../../lib/http.js";
import { signIn, signUp } from "./service.js";

export const authRouter = Router();

authRouter.post("/sign-up", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: "INVALID_INPUT" });
  }

  try {
    const result = await signUp(email, password);
    return res.status(201).json(result);
  } catch (error) {
    const response = getErrorResponse(error);
    return res.status(response.statusCode).json(response.body);
  }
});

authRouter.post("/sign-in", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "INVALID_INPUT" });
  }

  try {
    const result = await signIn(email, password);
    return res.status(200).json(result);
  } catch (error) {
    const response = getErrorResponse(error);
    return res.status(response.statusCode).json(response.body);
  }
});
