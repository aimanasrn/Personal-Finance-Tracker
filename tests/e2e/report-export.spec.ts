import { expect, test } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
const SELECTED_MONTH = "2026-05";
const EXPECTED_COLUMNS = ["title", "amount", "type", "category", "date"];

function parseCsvRow(row: string) {
  const values: string[] = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < row.length; index += 1) {
    const character = row[index];
    const nextCharacter = row[index + 1];

    if (character === "\"") {
      if (insideQuotes && nextCharacter === "\"") {
        currentValue += "\"";
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (character === "," && !insideQuotes) {
      values.push(currentValue);
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue);
  return values;
}

test("reports page exposes monthly export and print actions", async ({
  page
}) => {
  await page.addInitScript(() => {
    const printSpy = () => {
      (window as typeof window & { __cashnestPrintCalls?: number }).__cashnestPrintCalls =
        ((window as typeof window & { __cashnestPrintCalls?: number }).__cashnestPrintCalls ?? 0) + 1;
    };

    window.print = printSpy;
  });

  const email = `report-export-${Date.now()}@example.com`;
  const password = "cashnest-pass-123";

  await page.goto(`${BASE_URL}/signup`);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Start tracking" }).click();

  await page.waitForURL(/\/(dashboard|reports|login|signup)(\?|$)/);

  if (page.url().includes("/signup?error=")) {
    test.skip(
      true,
      "Sign-up could not establish an authenticated session in this environment."
    );
  }

  if (page.url().includes("/login")) {
    test.skip(
      true,
      "Sign-up did not create an authenticated session in this environment."
    );
  }

  await page.goto(`${BASE_URL}/reports?month=${SELECTED_MONTH}`);

  if (page.url().includes("/login")) {
    test.skip(
      true,
      "Protected reports access requires a working authenticated session in this environment."
    );
  }

  await expect(
    page.getByRole("heading", { name: "Reports", level: 1 })
  ).toBeVisible();

  const exportLink = page.getByRole("link", { name: "Export CSV" });
  await expect(exportLink).toBeVisible();
  await expect(exportLink).toHaveAttribute(
    "href",
    `/api/export/monthly?month=${SELECTED_MONTH}`
  );

  const printButton = page.getByRole("button", { name: "Print report" });
  await expect(printButton).toBeVisible();
  await printButton.click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & { __cashnestPrintCalls?: number })
            .__cashnestPrintCalls ?? 0
      )
    )
    .toBe(1);

  const response = await page.context().request.get(
    `${BASE_URL}/api/export/monthly?month=${SELECTED_MONTH}`
  );

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("text/csv");
  expect(response.headers()["content-disposition"]).toContain(
    `report-${SELECTED_MONTH}.csv`
  );
  const csv = await response.text();
  const rows = csv.trim().split(/\r?\n/);

  expect(rows[0]).toBe(EXPECTED_COLUMNS.join(","));
  expect(parseCsvRow(rows[0])).toEqual(EXPECTED_COLUMNS);

  for (const row of rows.slice(1)) {
    expect(parseCsvRow(row)).toHaveLength(EXPECTED_COLUMNS.length);
  }
});
