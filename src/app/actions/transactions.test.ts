import { beforeEach, describe, expect, it, vi } from "vitest";

const redirectMock = vi.fn((location: string) => {
  throw new Error(`REDIRECT:${location}`);
});
const revalidatePathMock = vi.fn();
const requireUserIdMock = vi.fn();
const getSessionAccessTokenMock = vi.fn();
const fromMock = vi.fn();

function createCategoryQueryMock(result: { data: unknown; error: unknown }) {
  const maybeSingleMock = vi.fn().mockResolvedValue(result);
  const orMock = vi.fn().mockReturnValue({
    maybeSingle: maybeSingleMock
  });
  const eqMock = vi.fn().mockReturnValue({
    or: orMock
  });
  const selectMock = vi.fn().mockReturnValue({
    eq: eqMock
  });

  return {
    selectMock,
    eqMock,
    orMock,
    maybeSingleMock
  };
}

vi.mock("next/navigation", () => ({
  redirect: redirectMock
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock
}));

vi.mock("@/lib/auth/session", () => ({
  getSessionAccessToken: getSessionAccessTokenMock,
  requireUserId: requireUserIdMock
}));

const createServerSupabaseClientMock = vi.fn(() => ({
  from: fromMock
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: createServerSupabaseClientMock
}));

describe("transaction actions", () => {
  beforeEach(() => {
    redirectMock.mockClear();
    revalidatePathMock.mockClear();
    requireUserIdMock.mockReset();
    getSessionAccessTokenMock.mockReset();
    createServerSupabaseClientMock.mockClear();
    fromMock.mockReset();
    requireUserIdMock.mockResolvedValue("user-123");
    getSessionAccessTokenMock.mockResolvedValue("access-token-123");
  });

  it("loads transaction categories with the signed-in access token so default categories remain visible under RLS", async () => {
    const orderNameMock = vi.fn().mockResolvedValue({
      data: [
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Transport",
          type: "expense",
          color: "#0284c7",
          icon: "car",
          is_default: true
        }
      ],
      error: null
    });
    const orderDefaultMock = vi.fn().mockReturnValue({
      order: orderNameMock
    });
    const orMock = vi.fn().mockReturnValue({
      order: orderDefaultMock
    });
    const selectMock = vi.fn().mockReturnValue({
      or: orMock
    });

    fromMock.mockImplementation((table: string) => {
      if (table === "categories") {
        return {
          select: selectMock
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    const { listTransactionCategories } = await import("./transactions");
    const categories = await listTransactionCategories("user-123");

    expect(getSessionAccessTokenMock).toHaveBeenCalledTimes(1);
    expect(createServerSupabaseClientMock).toHaveBeenCalledWith({
      accessToken: "access-token-123"
    });
    expect(categories).toEqual([
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Transport",
        type: "expense",
        color: "#0284c7",
        icon: "car",
        isDefault: true
      }
    ]);
  });

  it("normalizes form data for creation", async () => {
    const formData = new FormData();
    formData.set("title", "  Grab ride home  ");
    formData.set("amount", "12.50");
    formData.set("type", "expense");
    formData.set("categoryId", "550e8400-e29b-41d4-a716-446655440000");
    formData.set("transactionDate", "2026-05-24");
    formData.set("notes", "   ");

    const { normalizeTransactionInput } = await import("./transactions");

    expect(normalizeTransactionInput(formData)).toEqual({
      title: "Grab ride home",
      amount: 12.5,
      type: "expense",
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
      transactionDate: "2026-05-24",
      notes: undefined
    });
  });

  it("creates a transaction for the authenticated user and redirects to the ledger", async () => {
    const categoryQuery = createCategoryQueryMock({
      data: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        type: "income"
      },
      error: null
    });
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    fromMock.mockImplementation((table: string) => {
      if (table === "categories") {
        return {
          select: categoryQuery.selectMock
        };
      }

      if (table === "transactions") {
        return {
          insert: insertMock
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    const formData = new FormData();
    formData.set("title", "Salary");
    formData.set("amount", "4200");
    formData.set("type", "income");
    formData.set("categoryId", "550e8400-e29b-41d4-a716-446655440000");
    formData.set("transactionDate", "2026-05-24");

    const { createTransactionAction } = await import("./transactions");

    await expect(createTransactionAction(formData)).rejects.toThrow(
      "REDIRECT:/transactions?message=Transaction+created."
    );

    expect(requireUserIdMock).toHaveBeenCalledTimes(1);
    expect(createServerSupabaseClientMock).toHaveBeenCalledWith({
      accessToken: "access-token-123"
    });
    expect(fromMock).toHaveBeenCalledWith("categories");
    expect(fromMock).toHaveBeenCalledWith("transactions");
    expect(categoryQuery.eqMock).toHaveBeenCalledWith(
      "id",
      "550e8400-e29b-41d4-a716-446655440000"
    );
    expect(categoryQuery.orMock).toHaveBeenCalledWith(
      "user_id.is.null,user_id.eq.user-123"
    );
    expect(insertMock).toHaveBeenCalledWith({
      user_id: "user-123",
      title: "Salary",
      amount: 4200,
      type: "income",
      category_id: "550e8400-e29b-41d4-a716-446655440000",
      transaction_date: "2026-05-24",
      notes: null
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/transactions");
    expect(revalidatePathMock).toHaveBeenCalledWith("/dashboard");
  });

  it("redirects invalid create payloads back to the new page without touching persistence", async () => {
    const formData = new FormData();
    formData.set("title", "A");
    formData.set("amount", "12");
    formData.set("type", "expense");
    formData.set("categoryId", "550e8400-e29b-41d4-a716-446655440000");
    formData.set("transactionDate", "2026-05-24");

    const { createTransactionAction } = await import("./transactions");

    await expect(createTransactionAction(formData)).rejects.toThrow(
      /^REDIRECT:\/transactions\/new\?error=/
    );

    expect(fromMock).not.toHaveBeenCalled();
  });

  it("rejects create payloads when the category is not owned by the user or a default category", async () => {
    const categoryQuery = createCategoryQueryMock({
      data: null,
      error: null
    });
    const insertMock = vi.fn();
    fromMock.mockImplementation((table: string) => {
      if (table === "categories") {
        return {
          select: categoryQuery.selectMock
        };
      }

      if (table === "transactions") {
        return {
          insert: insertMock
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    const formData = new FormData();
    formData.set("title", "Grab ride");
    formData.set("amount", "12");
    formData.set("type", "expense");
    formData.set("categoryId", "550e8400-e29b-41d4-a716-446655440000");
    formData.set("transactionDate", "2026-05-24");

    const { createTransactionAction } = await import("./transactions");

    await expect(createTransactionAction(formData)).rejects.toThrow(
      "REDIRECT:/transactions/new?error=Select+a+valid+category+for+this+transaction."
    );

    expect(insertMock).not.toHaveBeenCalled();
  });

  it("updates a transaction within the authenticated user's scope", async () => {
    const transactionId = "550e8400-e29b-41d4-a716-446655440007";
    const categoryQuery = createCategoryQueryMock({
      data: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        type: "expense"
      },
      error: null
    });
    const ownedTransactionQuery = {
      maybeSingleMock: vi.fn().mockResolvedValue({
        data: { id: transactionId },
        error: null
      })
    };
    const ownedTransactionEqUserIdMock = vi.fn().mockReturnValue({
      maybeSingle: ownedTransactionQuery.maybeSingleMock
    });
    const ownedTransactionEqIdMock = vi.fn().mockReturnValue({
      eq: ownedTransactionEqUserIdMock
    });
    const ownedTransactionSelectMock = vi.fn().mockReturnValue({
      eq: ownedTransactionEqIdMock
    });
    const matchMock = vi.fn().mockResolvedValue({ error: null });
    const updateMock = vi.fn().mockReturnValue({
      match: matchMock
    });
    fromMock.mockImplementation((table: string) => {
      if (table === "categories") {
        return {
          select: categoryQuery.selectMock
        };
      }

      if (table === "transactions") {
        return {
          select: ownedTransactionSelectMock,
          update: updateMock
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    const formData = new FormData();
    formData.set("title", "Grab ride home");
    formData.set("amount", "19.4");
    formData.set("type", "expense");
    formData.set("categoryId", "550e8400-e29b-41d4-a716-446655440000");
    formData.set("transactionDate", "2026-05-20");
    formData.set("notes", "Airport");

    const { updateTransactionAction } = await import("./transactions");

    await expect(updateTransactionAction(transactionId, formData)).rejects.toThrow(
      "REDIRECT:/transactions?message=Transaction+updated."
    );

    expect(createServerSupabaseClientMock).toHaveBeenCalledWith({
      accessToken: "access-token-123"
    });
    expect(updateMock).toHaveBeenCalledWith({
      title: "Grab ride home",
      amount: 19.4,
      type: "expense",
      category_id: "550e8400-e29b-41d4-a716-446655440000",
      transaction_date: "2026-05-20",
      notes: "Airport"
    });
    expect(matchMock).toHaveBeenCalledWith({
      id: transactionId,
      user_id: "user-123"
    });
    expect(ownedTransactionSelectMock).toHaveBeenCalledWith("id");
  });

  it("rejects updates when the category type does not match the transaction type", async () => {
    const transactionId = "550e8400-e29b-41d4-a716-446655440008";
    const categoryQuery = createCategoryQueryMock({
      data: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        type: "income"
      },
      error: null
    });
    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: { id: transactionId },
      error: null
    });
    const eqUserIdMock = vi.fn().mockReturnValue({
      maybeSingle: maybeSingleMock
    });
    const eqIdMock = vi.fn().mockReturnValue({
      eq: eqUserIdMock
    });
    const selectMock = vi.fn().mockReturnValue({
      eq: eqIdMock
    });
    const updateMock = vi.fn();
    fromMock.mockImplementation((table: string) => {
      if (table === "categories") {
        return {
          select: categoryQuery.selectMock
        };
      }

      if (table === "transactions") {
        return {
          select: selectMock,
          update: updateMock
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    const formData = new FormData();
    formData.set("title", "Grab ride home");
    formData.set("amount", "19.4");
    formData.set("type", "expense");
    formData.set("categoryId", "550e8400-e29b-41d4-a716-446655440000");
    formData.set("transactionDate", "2026-05-20");

    const { updateTransactionAction } = await import("./transactions");

    await expect(updateTransactionAction(transactionId, formData)).rejects.toThrow(
      `REDIRECT:/transactions/${transactionId}/edit?error=Select+a+valid+category+for+this+transaction.`
    );

    expect(updateMock).not.toHaveBeenCalled();
  });

  it("rejects updates for malformed transaction identifiers before querying persistence", async () => {
    const formData = new FormData();
    formData.set("title", "Grab ride home");
    formData.set("amount", "19.4");
    formData.set("type", "expense");
    formData.set("categoryId", "550e8400-e29b-41d4-a716-446655440000");
    formData.set("transactionDate", "2026-05-20");

    const { updateTransactionAction } = await import("./transactions");

    await expect(
      updateTransactionAction("not-a-valid-uuid", formData)
    ).rejects.toThrow(
      "REDIRECT:/transactions?error=We+couldn%27t+find+that+transaction.+Refresh+the+ledger+and+try+again."
    );

    expect(fromMock).not.toHaveBeenCalled();
  });

  it("redirects delete requests with a friendly error when the transaction identifier is malformed", async () => {
    const { deleteTransactionAction } = await import("./transactions");

    await expect(deleteTransactionAction("not-a-valid-uuid")).rejects.toThrow(
      "REDIRECT:/transactions?error=We+couldn%27t+find+that+transaction.+Refresh+the+ledger+and+try+again."
    );

    expect(fromMock).not.toHaveBeenCalled();
  });

  it("does not report a successful update when no owned transaction matches the identifier", async () => {
    const categoryQuery = createCategoryQueryMock({
      data: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        type: "expense"
      },
      error: null
    });
    const eqUserIdMock = vi.fn().mockResolvedValue({
      data: null,
      error: null
    });
    const eqIdMock = vi.fn().mockReturnValue({
      eq: eqUserIdMock
    });
    const transactionSelectMock = vi.fn().mockReturnValue({
      eq: eqIdMock
    });
    const updateMock = vi.fn();

    fromMock.mockImplementation((table: string) => {
      if (table === "categories") {
        return {
          select: categoryQuery.selectMock
        };
      }

      if (table === "transactions") {
        return {
          select: transactionSelectMock,
          update: updateMock
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    const formData = new FormData();
    formData.set("title", "Grab ride home");
    formData.set("amount", "19.4");
    formData.set("type", "expense");
    formData.set("categoryId", "550e8400-e29b-41d4-a716-446655440000");
    formData.set("transactionDate", "2026-05-20");

    const { updateTransactionAction } = await import("./transactions");

    await expect(
      updateTransactionAction("550e8400-e29b-41d4-a716-446655440001", formData)
    ).rejects.toThrow(
      "REDIRECT:/transactions?error=We+couldn%27t+find+that+transaction.+Refresh+the+ledger+and+try+again."
    );

    expect(transactionSelectMock).toHaveBeenCalledWith("id");
    expect(eqIdMock).toHaveBeenCalledWith(
      "id",
      "550e8400-e29b-41d4-a716-446655440001"
    );
    expect(eqUserIdMock).toHaveBeenCalledWith("user_id", "user-123");
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("deletes a transaction within the authenticated user's scope", async () => {
    const transactionId = "550e8400-e29b-41d4-a716-446655440009";
    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: { id: transactionId },
      error: null
    });
    const eqUserIdMock = vi.fn().mockReturnValue({
      maybeSingle: maybeSingleMock
    });
    const eqIdMock = vi.fn().mockReturnValue({
      eq: eqUserIdMock
    });
    const selectMock = vi.fn().mockReturnValue({
      eq: eqIdMock
    });
    const matchMock = vi.fn().mockResolvedValue({ error: null });
    const deleteMock = vi.fn().mockReturnValue({
      match: matchMock
    });
    fromMock.mockReturnValue({
      select: selectMock,
      delete: deleteMock
    });

    const { deleteTransactionAction } = await import("./transactions");

    await expect(deleteTransactionAction(transactionId)).rejects.toThrow(
      "REDIRECT:/transactions?message=Transaction+deleted."
    );

    expect(createServerSupabaseClientMock).toHaveBeenCalledWith({
      accessToken: "access-token-123"
    });
    expect(deleteMock).toHaveBeenCalledTimes(1);
    expect(matchMock).toHaveBeenCalledWith({
      id: transactionId,
      user_id: "user-123"
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/transactions");
  });
});
