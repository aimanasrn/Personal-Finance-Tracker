import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../lib/prisma.js";
import { app } from "../app.js";
import { createSession } from "./helpers/auth.js";
import { resetDatabase } from "./helpers/db.js";

describe.sequential("transactions", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("rejects unauthenticated transaction creation", async () => {
    const response = await request(app)
      .post("/api/workspaces/ws_123/transactions")
      .send({ amount: 12.5, type: "EXPENSE", categoryId: "cat_123", date: "2026-05-24" });

    expect(response.status).toBe(401);
  });

  it("creates a transaction in the active workspace", async () => {
    const session = await createSession("owner@example.com");
    const category = await prisma.category.findFirstOrThrow({
      where: { workspaceId: session.workspaceId, name: "Food" }
    });

    const response = await request(app)
      .post(`/api/workspaces/${session.workspaceId}/transactions`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({
        categoryId: category.id,
        amount: 35.5,
        type: "EXPENSE",
        date: "2026-05-24",
        note: "Groceries"
      });

    expect(response.status).toBe(201);
    expect(response.body.categoryId).toBe(category.id);
    expect(Number(response.body.amount)).toBe(35.5);
  });

  it("rejects categories from another workspace", async () => {
    const sessionA = await createSession("owner@example.com");
    const sessionB = await createSession("other@example.com");
    const foreignCategory = await prisma.category.findFirstOrThrow({
      where: { workspaceId: sessionB.workspaceId, name: "Food" }
    });

    const response = await request(app)
      .post(`/api/workspaces/${sessionA.workspaceId}/transactions`)
      .set("Authorization", `Bearer ${sessionA.token}`)
      .send({
        categoryId: foreignCategory.id,
        amount: 18,
        type: "EXPENSE",
        date: "2026-05-24"
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "CATEGORY_NOT_FOUND" });
  });
});
