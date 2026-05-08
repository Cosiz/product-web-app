# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> login: empty form shows validation
- Location: tests/app.spec.ts:21:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('btn-login')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - heading "404" [level=1] [ref=e4]
    - heading "This page could not be found." [level=2] [ref=e6]
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect, Page } from "@playwright/test"
  2   | 
  3   | // Helper: skip if redirected to login
  4   | async function requireAuth(page: Page, path: string) {
  5   |   await page.goto(path)
  6   |   if (page.url().includes("/login")) {
  7   |     test.skip(true, "Requires authentication")
  8   |   }
  9   | }
  10  | 
  11  | // ─── Login Page ───────────────────────────────────────────────────────────────
  12  | 
  13  | test("login: page renders with all elements", async ({ page }) => {
  14  |   await page.goto("/login")
  15  |   await expect(page.getByTestId("auth-login-title")).toBeVisible()
  16  |   await expect(page.getByTestId("input-email")).toBeVisible()
  17  |   await expect(page.getByTestId("input-password")).toBeVisible()
  18  |   await expect(page.getByTestId("btn-login")).toBeVisible()
  19  | })
  20  | 
  21  | test("login: empty form shows validation", async ({ page }) => {
  22  |   await page.goto("/login")
> 23  |   await page.getByTestId("btn-login").click()
      |                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  24  |   // Check for any error message
  25  |   await expect(page.locator("text=/required|is required/i")).toBeVisible()
  26  | })
  27  | 
  28  | // ─── Join Page ────────────────────────────────────────────────────────────────
  29  | 
  30  | test("join: page renders", async ({ page }) => {
  31  |   await page.goto("/join")
  32  |   await expect(page.getByTestId("input-family-name")).toBeVisible()
  33  |   await expect(page.getByTestId("input-invite-code")).toBeVisible()
  34  | })
  35  | 
  36  | // ─── Dashboard ────────────────────────────────────────────────────────────────
  37  | 
  38  | test("dashboard: page renders or redirects to login", async ({ page }) => {
  39  |   await page.goto("/dashboard")
  40  |   if (page.url().includes("/login")) {
  41  |     test.skip(true, "Not authenticated")
  42  |   }
  43  |   await expect(page.getByTestId("dashboard-welcome")).toBeVisible()
  44  |   await expect(page.getByTestId("dashboard-family-name")).toBeVisible()
  45  | })
  46  | 
  47  | test("dashboard: skeleton loading states visible during navigation", async ({ page }) => {
  48  |   await page.goto("/dashboard")
  49  |   if (page.url().includes("/login")) {
  50  |     test.skip(true, "Not authenticated")
  51  |   }
  52  |   // Dashboard should show content without spinner
  53  |   await page.waitForSelector("[data-testid='dashboard-welcome'], [data-testid='dashboard-quick-add-task']", { timeout: 5000 }).catch(() => null)
  54  | })
  55  | 
  56  | // ─── Tasks ───────────────────────────────────────────────────────────────────
  57  | 
  58  | test("tasks: page renders", async ({ page }) => {
  59  |   await page.goto("/tasks")
  60  |   if (page.url().includes("/login")) {
  61  |     test.skip(true, "Not authenticated")
  62  |   }
  63  |   await expect(page.getByTestId("input-task-title")).toBeVisible()
  64  | })
  65  | 
  66  | test("tasks: empty state renders", async ({ page }) => {
  67  |   await page.goto("/tasks")
  68  |   if (page.url().includes("/login")) {
  69  |     test.skip(true, "Not authenticated")
  70  |   }
  71  |   await expect(
  72  |     page.getByTestId("empty-tasks").or(page.getByTestId("task-list"))
  73  |   ).toBeVisible()
  74  | })
  75  | 
  76  | test("tasks: form validates required title", async ({ page }) => {
  77  |   await page.goto("/tasks")
  78  |   if (page.url().includes("/login")) {
  79  |     test.skip(true, "Not authenticated")
  80  |   }
  81  |   await page.getByTestId("btn-task-submit").click()
  82  |   await expect(page.locator("text=/title.*required|required.*title/i")).toBeVisible()
  83  | })
  84  | 
  85  | // ─── Map ─────────────────────────────────────────────────────────────────────
  86  | 
  87  | test("map: page renders map container", async ({ page }) => {
  88  |   await page.goto("/map")
  89  |   if (page.url().includes("/login")) {
  90  |     test.skip(true, "Not authenticated")
  91  |   }
  92  |   await expect(page.getByTestId("map-container")).toBeVisible()
  93  |   await expect(page.getByTestId("btn-center-map")).toBeVisible()
  94  | })
  95  | 
  96  | // ─── Feed ────────────────────────────────────────────────────────────────────
  97  | 
  98  | test("feed: page renders", async ({ page }) => {
  99  |   await page.goto("/feed")
  100 |   if (page.url().includes("/login")) {
  101 |     test.skip(true, "Not authenticated")
  102 |   }
  103 |   await expect(
  104 |     page.getByTestId("feed-list").or(page.getByTestId("empty-feed"))
  105 |   ).toBeVisible()
  106 |   await expect(page.getByTestId("btn-refresh-feed")).toBeVisible()
  107 | })
  108 | 
  109 | // ─── Album ───────────────────────────────────────────────────────────────────
  110 | 
  111 | test("album: page renders", async ({ page }) => {
  112 |   await page.goto("/album")
  113 |   if (page.url().includes("/login")) {
  114 |     test.skip(true, "Not authenticated")
  115 |   }
  116 |   await expect(
  117 |     page.getByTestId("album-grid").or(page.getByTestId("empty-album"))
  118 |   ).toBeVisible()
  119 | })
  120 | 
  121 | // ─── Settings ────────────────────────────────────────────────────────────────
  122 | 
  123 | test("settings: page renders", async ({ page }) => {
```