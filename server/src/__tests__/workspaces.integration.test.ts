import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../lib/prisma.js";
import { app } from "../app.js";
import { resetDatabase } from "./helpers/db.js";

async function signUpAndToken(email: string) {
  const response = await request(app).post("/api/auth/sign-up").send({
    email,
    password: "password123"
  });

  return response.body.token as string;
}

describe.sequential("workspaces", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("requires auth to list workspaces", async () => {
    const response = await request(app).get("/api/workspaces");
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "UNAUTHORIZED" });
  });

  it("lists only the current user's workspaces", async () => {
    const tokenA = await signUpAndToken("owner@example.com");
    await signUpAndToken("other@example.com");

    const response = await request(app)
      .get("/api/workspaces")
      .set("Authorization", `Bearer ${tokenA}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].type).toBe("PERSONAL");
  });

  it("creates a household workspace and default categories", async () => {
    const token = await signUpAndToken("owner@example.com");

    const response = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Home" });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Home");
    expect(response.body.type).toBe("HOUSEHOLD");

    const categories = await prisma.category.findMany({
      where: { workspaceId: response.body.id }
    });
    expect(categories).toHaveLength(4);
  });

  it("creates household invites for workspace members", async () => {
    const token = await signUpAndToken("owner@example.com");
    const createWorkspace = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Home" });

    const response = await request(app)
      .post(`/api/workspaces/${createWorkspace.body.id}/invites`)
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "partner@example.com" });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe("partner@example.com");
    expect(response.body.token).toEqual(expect.any(String));
  });
});
