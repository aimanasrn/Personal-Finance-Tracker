import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../lib/prisma.js";
import { app } from "../app.js";
import { createSession } from "./helpers/auth.js";
import { resetDatabase } from "./helpers/db.js";

describe.sequential("dashboard", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("rejects unauthenticated dashboard access", async () => {
    const response = await request(app).get("/api/workspaces/ws_123/dashboard?month=5&year=2026");
    expect(response.status).toBe(401);
  });

  it("returns monthly budget totals, goals, and planned expenses", async () => {
    const session = await createSession("owner@example.com");
    const category = await prisma.category.findFirstOrThrow({
      where: { workspaceId: session.workspaceId, name: "Housing" }
    });

    await request(app)
      .post(`/api/workspaces/${session.workspaceId}/budgets`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({ categoryId: category.id, month: 5, year: 2026, amount: 900 });

    await request(app)
      .post(`/api/workspaces/${session.workspaceId}/goals`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({ name: "Emergency fund", targetAmount: 5000, currentAmount: 800 });

    await request(app)
      .post(`/api/workspaces/${session.workspaceId}/transactions`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({ categoryId: category.id, amount: 450, type: "EXPENSE", date: "2026-05-10" });

    const recurring = await request(app)
      .post(`/api/workspaces/${session.workspaceId}/recurring-expenses`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({ categoryId: category.id, name: "Rent", amount: 700, dayOfMonth: 1 });

    expect(recurring.status).toBe(201);

    await request(app)
      .post(`/api/workspaces/${session.workspaceId}/recurring-expenses/generate`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({ month: 5, year: 2026 });

    const response = await request(app)
      .get(`/api/workspaces/${session.workspaceId}/dashboard?month=5&year=2026`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(response.status).toBe(200);
    expect(response.body.budgets).toHaveLength(1);
    expect(response.body.goals).toHaveLength(1);
    expect(response.body.plannedExpenses).toHaveLength(1);
    expect(response.body.spentTotal).toBe(450);
  });
});
