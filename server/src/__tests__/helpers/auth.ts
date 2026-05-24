import request from "supertest";
import { app } from "../../app.js";

export async function createSession(email: string) {
  const response = await request(app).post("/api/auth/sign-up").send({
    email,
    password: "password123"
  });

  return {
    token: response.body.token as string,
    workspaceId: response.body.workspaces[0].id as string
  };
}
