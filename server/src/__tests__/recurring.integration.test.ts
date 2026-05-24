import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../lib/prisma.js";
import { app } from "../app.js";
import { createSession } from "./helpers/auth.js";
import { resetDatabase } from "./helpers/db.js";

describe.sequential("recurring expenses", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("rejects unauthenticated recurring expense creation", async () => {
    const response = await request(app)
      .post("/api/workspaces/ws_123/recurring-expenses")
      .send({ name: "Rent", amount: 800, categoryId: "cat_123", dayOfMonth: 1 });

    expect(response.status).toBe(401);
  });

  it("generates, pays, and skips planned expense instances", async () => {
    const session = await createSession("owner@example.com");
    const category = await prisma.category.findFirstOrThrow({
      where: { workspaceId: session.workspaceId, name: "Housing" }
    });

    const createRecurring = await request(app)
      .post(`/api/workspaces/${session.workspaceId}/recurring-expenses`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({ categoryId: category.id, name: "Rent", amount: 800, dayOfMonth: 1, note: "Monthly rent" });

    expect(createRecurring.status).toBe(201);

    const generate = await request(app)
      .post(`/api/workspaces/${session.workspaceId}/recurring-expenses/generate`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({ month: 5, year: 2026 });

    expect(generate.status).toBe(201);
    expect(generate.body).toHaveLength(1);

    const pay = await request(app)
      .post(`/api/workspaces/${session.workspaceId}/recurring-expenses/instances/${generate.body[0].id}/pay`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(pay.status).toBe(200);
    expect(pay.body.status).toBe("PAID");

    const duplicatePay = await request(app)
      .post(`/api/workspaces/${session.workspaceId}/recurring-expenses/instances/${generate.body[0].id}/pay`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(duplicatePay.status).toBe(409);
    expect(duplicatePay.body).toEqual({ error: "INVALID_INSTANCE_STATE" });

    const anotherRecurring = await request(app)
      .post(`/api/workspaces/${session.workspaceId}/recurring-expenses`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({ categoryId: category.id, name: "Internet", amount: 120, dayOfMonth: 15 });

    const secondGenerate = await request(app)
      .post(`/api/workspaces/${session.workspaceId}/recurring-expenses/generate`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({ month: 5, year: 2026 });

    const pendingInstance = secondGenerate.body.find(
      (instance: { recurringExpenseId: string; status: string }) =>
        instance.recurringExpenseId === anotherRecurring.body.id && instance.status === "PENDING"
    );

    const skip = await request(app)
      .post(`/api/workspaces/${session.workspaceId}/recurring-expenses/instances/${pendingInstance.id}/skip`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(skip.status).toBe(200);
    expect(skip.body.status).toBe("SKIPPED");

    const transactions = await prisma.transaction.findMany({
      where: { workspaceId: session.workspaceId }
    });
    expect(transactions).toHaveLength(1);
    expect(Number(transactions[0].amount)).toBe(800);
  });
});
