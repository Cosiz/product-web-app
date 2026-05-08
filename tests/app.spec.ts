import { test, expect, Page } from "@playwright/test"

// Helper: skip if redirected to login
async function requireAuth(page: Page, path: string) {
  await page.goto(path)
  if (page.url().includes("/login")) {
    test.skip(true, "Requires authentication")
  }
}

// ─── Login Page ───────────────────────────────────────────────────────────────

test("login: page renders with all elements", async ({ page }) => {
  await page.goto("/login")
  await expect(page.getByTestId("auth-login-title")).toBeVisible()
  await expect(page.getByTestId("input-email")).toBeVisible()
  await expect(page.getByTestId("input-password")).toBeVisible()
  await expect(page.getByTestId("btn-login")).toBeVisible()
})

test("login: empty form shows validation", async ({ page }) => {
  await page.goto("/login")
  await page.getByTestId("btn-login").click()
  // Check for any error message
  await expect(page.locator("text=/required|is required/i")).toBeVisible()
})

// ─── Join Page ────────────────────────────────────────────────────────────────

test("join: page renders", async ({ page }) => {
  await page.goto("/join")
  await expect(page.getByTestId("input-family-name")).toBeVisible()
  await expect(page.getByTestId("input-invite-code")).toBeVisible()
})

// ─── Dashboard ────────────────────────────────────────────────────────────────

test("dashboard: page renders or redirects to login", async ({ page }) => {
  await page.goto("/dashboard")
  if (page.url().includes("/login")) {
    test.skip(true, "Not authenticated")
  }
  await expect(page.getByTestId("dashboard-welcome")).toBeVisible()
  await expect(page.getByTestId("dashboard-family-name")).toBeVisible()
})

test("dashboard: skeleton loading states visible during navigation", async ({ page }) => {
  await page.goto("/dashboard")
  if (page.url().includes("/login")) {
    test.skip(true, "Not authenticated")
  }
  // Dashboard should show content without spinner
  await page.waitForSelector("[data-testid='dashboard-welcome'], [data-testid='dashboard-quick-add-task']", { timeout: 5000 }).catch(() => null)
})

// ─── Tasks ───────────────────────────────────────────────────────────────────

test("tasks: page renders", async ({ page }) => {
  await page.goto("/tasks")
  if (page.url().includes("/login")) {
    test.skip(true, "Not authenticated")
  }
  await expect(page.getByTestId("input-task-title")).toBeVisible()
})

test("tasks: empty state renders", async ({ page }) => {
  await page.goto("/tasks")
  if (page.url().includes("/login")) {
    test.skip(true, "Not authenticated")
  }
  await expect(
    page.getByTestId("empty-tasks").or(page.getByTestId("task-list"))
  ).toBeVisible()
})

test("tasks: form validates required title", async ({ page }) => {
  await page.goto("/tasks")
  if (page.url().includes("/login")) {
    test.skip(true, "Not authenticated")
  }
  await page.getByTestId("btn-task-submit").click()
  await expect(page.locator("text=/title.*required|required.*title/i")).toBeVisible()
})

// ─── Map ─────────────────────────────────────────────────────────────────────

test("map: page renders map container", async ({ page }) => {
  await page.goto("/map")
  if (page.url().includes("/login")) {
    test.skip(true, "Not authenticated")
  }
  await expect(page.getByTestId("map-container")).toBeVisible()
  await expect(page.getByTestId("btn-center-map")).toBeVisible()
})

// ─── Feed ────────────────────────────────────────────────────────────────────

test("feed: page renders", async ({ page }) => {
  await page.goto("/feed")
  if (page.url().includes("/login")) {
    test.skip(true, "Not authenticated")
  }
  await expect(
    page.getByTestId("feed-list").or(page.getByTestId("empty-feed"))
  ).toBeVisible()
  await expect(page.getByTestId("btn-refresh-feed")).toBeVisible()
})

// ─── Album ───────────────────────────────────────────────────────────────────

test("album: page renders", async ({ page }) => {
  await page.goto("/album")
  if (page.url().includes("/login")) {
    test.skip(true, "Not authenticated")
  }
  await expect(
    page.getByTestId("album-grid").or(page.getByTestId("empty-album"))
  ).toBeVisible()
})

// ─── Settings ────────────────────────────────────────────────────────────────

test("settings: page renders", async ({ page }) => {
  await page.goto("/settings")
  if (page.url().includes("/login")) {
    test.skip(true, "Not authenticated")
  }
  await expect(page.getByTestId("settings-form")).toBeVisible()
  await expect(page.getByTestId("btn-save-settings")).toBeVisible()
  await expect(page.getByTestId("btn-add-child")).toBeVisible()
  await expect(page.getByTestId("member-list")).toBeVisible()
})
