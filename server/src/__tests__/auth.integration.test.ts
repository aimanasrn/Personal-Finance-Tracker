import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../lib/prisma.js";
import { app } from "../app.js";
import { resetDatabase } from "./helpers/db.js";

describe.sequential("auth", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("signs up a user and creates a personal workspace", async () => {
    const response = await request(app).post("/api/auth/sign-up").send({
      email: "owner@example.com",
      password: "password123"
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe("owner@example.com");
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.workspaces).toHaveLength(1);
    expect(response.body.workspaces[0].type).toBe("PERSONAL");

    const categories = await prisma.category.findMany({
      where: { workspaceId: response.body.workspaces[0].id }
    });
    expect(categories).toHaveLength(4);
  });

  it("rejects duplicate sign-up", async () => {
    await request(app).post("/api/auth/sign-up").send({
      email: "owner@example.com",
      password: "password123"
    });

    const response = await request(app).post("/api/auth/sign-up").send({
      email: "owner@example.com",
      password: "password123"
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: "EMAIL_ALREADY_EXISTS" });
  });
});
