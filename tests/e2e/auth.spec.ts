import { expect, test } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test("protected settings redirects guests to login and auth pages show friendly status messages", async ({
  page
}) => {
  await page.goto(`${BASE_URL}/settings`);
  await page.waitForURL(/\/login(\?|$)/);

  await page.goto(
    `${BASE_URL}/login?error=We+couldn%27t+start+your+session.+Please+try+again.`
  );
  await expect(
    page.getByText("We couldn't start your session. Please try again.")
  ).toBeVisible();

  await page.goto(
    `${BASE_URL}/signup?message=Check+your+email+to+confirm+your+account+before+logging+in.`
  );
  await expect(
    page.getByText(
      "Check your email to confirm your account before logging in."
    )
  ).toBeVisible();
});
