# Acceptance Tests — The GOOS Outer Loop

## Role in GOOS

The acceptance test is the outer loop of outside-in TDD. Every feature starts with a failing acceptance test that describes what the system should do from the user's perspective.

**The walking skeleton IS the first acceptance test** — the thinnest end-to-end slice that decides broad-brush architecture and front-loads integration risk before you write real features. It is always a Playwright E2E test (`@playwright/test`), never a component render — the point is proving the entire stack works together (route → page → hook → service → API).

**The development cycle:**

1. Write a failing acceptance test (outer loop — RED)
2. **Watch the test fail** — verify the failure message is useful before proceeding
3. Enter inner RED/GREEN loops: unit tests drive design of hooks, services, components
4. Acceptance test passes (outer loop — GREEN)
5. Refactor

**Key GOOS principles:**

- **Progress vs regression**: The test you're writing now measures _progress_. Once it passes, it becomes a _regression_ test.
- **Start with the simplest success case** — not error handling, not edge cases.
- **Write the test you'd want to read** — the acceptance test IS the specification.
- **Watch the test fail** — a test that fails with a clear message ("expected 'Dashboard' to be visible") is as important as one that passes.

## 3-Level Testing Strategy

| Level                    | Tool                    | Runs In  | Purpose                                        |
| ------------------------ | ----------------------- | -------- | ---------------------------------------------- |
| **Unit**                 | Vitest (Node)           | Node.js  | Pure functions — validators, services, utilities |
| **Integration/Component**| Vitest Browser Mode     | Browser  | Render real components, MSW intercepts API      |
| **E2E/Acceptance**       | Playwright              | Node→Browser | Full app, multi-page flows, SSR verification |

### When to Use Which

- **Vitest Node**: Pure logic with no React, no DOM, no API calls — `parseApiError()`, `encryptCredentials()`, Zod schemas
- **Vitest Browser Mode**: Single-page features — login form, dashboard rendering, form validation. Tests run _inside_ the real browser. This is the **inner loop** — component/integration level. These are NOT acceptance tests in the GOOS sense.
- **Playwright**: Full app exercised from outside — login → dashboard → settings. Auth persistence, SSR verification, navigation between routes. This is the **outer loop** — acceptance tests and walking skeletons live here.

## Vitest Browser Mode (Inner Loop)

Tests run _in_ the browser using `vitest-browser-react`. Components render in real Chromium — no jsdom, no fake DOM. MSW intercepts API calls at the network level.

### Basic Component Test

```tsx
import { render } from 'vitest-browser-react'
import { http, HttpResponse } from 'msw'
import { server } from '~/test/msw-server'

test('user can login with valid credentials', async () => {
  server.use(
    http.post('*/auth/admin/login', () => {
      return HttpResponse.json({ token: 'fake-token', user: { name: 'Admin' } })
    })
  )

  const screen = render(<LoginPage />, { wrapper: TestWrapper })

  await screen.getByLabelText('Email Address').fill('admin@example.com')
  await screen.getByLabelText('Password').fill('password123')
  await screen.getByRole('button', { name: 'Sign In' }).click()

  await expect.element(screen.getByText('Dashboard')).toBeVisible()
})
```

### Error State Test

```tsx
test('displays error on invalid credentials', async () => {
  server.use(
    http.post('*/auth/admin/login', () => {
      return HttpResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    })
  )

  const screen = render(<LoginPage />, { wrapper: TestWrapper })

  await screen.getByLabelText('Email Address').fill('wrong@example.com')
  await screen.getByLabelText('Password').fill('wrong')
  await screen.getByRole('button', { name: 'Sign In' }).click()

  await expect.element(screen.getByText('Invalid credentials')).toBeVisible()
})
```

### Key Vitest Browser Mode Patterns

- `render()` from `vitest-browser-react` — renders in real browser
- `screen.getByRole()`, `screen.getByLabelText()`, `screen.getByText()` — Playwright-style locators
- `expect.element()` — auto-retrying assertions (waits for element to appear)
- `.fill()`, `.click()` — real browser interactions
- MSW `server.use()` — per-test API response overrides

## Playwright E2E (Outer Loop)

Tests run in Node.js, controlling a real browser via Playwright protocol. Full application running — SSR, routing, auth, everything.

### Basic E2E Test

```typescript
// tests/e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test'

test('user can login and reach dashboard', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel('Email Address').fill('admin@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign In' }).click()

  await expect(page).toHaveURL(/.*dashboard/)
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})
```

### Page Object Model (GOOS Page Objects)

```typescript
// tests/e2e/pages/login-page.ts
import { type Page, type Locator } from '@playwright/test'

export class LoginPage {
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator

  constructor(private page: Page) {
    this.emailInput = page.getByLabel('Email Address')
    this.passwordInput = page.getByLabel('Password')
    this.submitButton = page.getByRole('button', { name: 'Sign In' })
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }
}
```

```typescript
// tests/e2e/pages/dashboard-page.ts
import { type Page, expect } from '@playwright/test'

export class DashboardPage {
  constructor(private page: Page) {}

  async expectVisible() {
    await expect(this.page).toHaveURL(/.*dashboard/)
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  }

  async expectWelcomeMessage(name: string) {
    await expect(this.page.getByText(`Welcome, ${name}`)).toBeVisible()
  }
}
```

### Using Page Objects in Tests

```typescript
import { test } from '@playwright/test'
import { LoginPage } from './pages/login-page'
import { DashboardPage } from './pages/dashboard-page'

test('user can login and see dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const dashboardPage = new DashboardPage(page)

  await loginPage.goto()
  await loginPage.login('admin@example.com', 'password123')
  await dashboardPage.expectVisible()
  await dashboardPage.expectWelcomeMessage('Admin')
})
```

**Why page objects**: Same reason GOOS recommends them — encapsulate page structure, expose behavior. When the UI changes, you update the page object, not every test.

## Walking Skeleton Examples

A walking skeleton is always a Playwright E2E test — it proves the full stack integrates end-to-end.

### Playwright (E2E)

```typescript
test('walking skeleton — app loads and renders login', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
})
```

### Playwright (SSR Verification)

```typescript
test('walking skeleton — page is server-rendered', async ({ page }) => {
  await page.goto('/login')
  // Check SSR by verifying content before hydration
  const html = await page.content()
  expect(html).toContain('Sign In')
})
```

## Playwright Best Practices

**Use role-based locators** — not CSS selectors:

```typescript
// GOOD
await page.getByRole('button', { name: 'Submit' })
await page.getByLabel('Email')

// BAD
await page.locator('.btn-primary')
await page.locator('#email-input')
```

**Use auto-retrying assertions** — Playwright's `expect` auto-retries:

```typescript
// GOOD: auto-retries until condition met or timeout
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
await expect(page).toHaveURL(/.*dashboard/)

// BAD: point-in-time check, race condition
const isVisible = await page.locator('.dashboard').isVisible()
expect(isVisible).toBe(true)
```

**Test user-visible behavior** — assert on text, roles, labels, not CSS classes or DOM structure.

**Isolate tests** — each test creates its own state, no shared state between tests.
