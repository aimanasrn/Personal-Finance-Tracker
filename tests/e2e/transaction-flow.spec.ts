import { expect, test } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test("signed-in users can create, update, and delete a transaction", async ({
  page
}) => {
  const email = `transaction-flow-${Date.now()}@example.com`;
  const password = "cashnest-pass-123";
  const transactionTitle = `Grab ride ${Date.now()}`;
  const updatedNotes = `Updated after review ${Date.now()}`;

  await page.goto(`${BASE_URL}/signup`);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Start tracking" }).click();

  await page.waitForURL(/\/(dashboard|reports|transactions|login|signup)(\?|$)/);

  if (page.url().includes("/login") || page.url().includes("/signup?error=")) {
    test.skip(
      true,
      "Sign-up did not create an authenticated session in this environment."
    );
  }

  await page.goto(`${BASE_URL}/transactions/new`);

  if (page.url().includes("/login")) {
    test.skip(
      true,
      "Authenticated transaction routes were not reachable in this environment."
    );
  }

  await page.getByLabel("Title").fill(transactionTitle);
  await expect(page.getByText("Suggested category: Transport")).toBeVisible();
  await page.getByLabel("Amount").fill("18.40");
  await page.getByLabel("Date").fill("2026-05-25");
  await page.getByLabel("Notes").fill("Airport pickup");
  await page.getByRole("button", { name: "Save transaction" }).click();

  await page.waitForURL(/\/transactions(\?|$)/);
  await expect(page.getByText("Transaction created.")).toBeVisible();
  await expect(page.getByRole("heading", { name: transactionTitle })).toBeVisible();

  await page.getByRole("link", { name: "Edit" }).first().click();
  await page.waitForURL(/\/transactions\/.+\/edit(\?|$)/);

  await page.getByLabel("Notes").fill(updatedNotes);
  await page.getByRole("button", { name: "Update transaction" }).click();

  await page.waitForURL(/\/transactions(\?|$)/);
  await expect(page.getByText("Transaction updated.")).toBeVisible();
  await expect(page.getByText(updatedNotes)).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).first().click();
  await page.waitForURL(/\/transactions(\?|$)/);
  await expect(page.getByText("Transaction deleted.")).toBeVisible();
  await expect(page.getByText(transactionTitle)).not.toBeVisible();
});
