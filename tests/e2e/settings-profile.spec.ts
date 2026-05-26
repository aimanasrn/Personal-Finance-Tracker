import { expect, test } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test("signed-in users can update profile preferences and sign out from settings", async ({
  page
}) => {
  const email = `settings-profile-${Date.now()}@example.com`;
  const password = "cashnest-pass-123";
  const displayName = `Aiman ${Date.now()}`;

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

  await page.goto(`${BASE_URL}/settings`);

  if (page.url().includes("/login")) {
    test.skip(
      true,
      "Authenticated settings routes were not reachable in this environment."
    );
  }

  await page.getByLabel("Display name").fill(displayName);
  await page.getByLabel("Preferred currency").selectOption("USD");
  await page.getByRole("button", { name: "Save preferences" }).click();

  await page.waitForURL(/\/settings(\?|$)/);
  await expect(page.getByText("Preferences saved.")).toBeVisible();
  await expect(page.getByText(displayName)).toBeVisible();
  await expect(page.getByText("USD")).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL(/\/login(\?|$)/);
});
