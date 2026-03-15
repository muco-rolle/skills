# Testing Strategy — GOOS Levels Applied to Jazz + TSS

## Role in GOOS

Every feature starts with a failing acceptance test — the outer loop of outside-in TDD. The acceptance test describes what the system should do from the user's perspective, exercising the whole system end-to-end whenever possible.

**The walking skeleton is NOT an acceptance test.** It's the infrastructure that enables writing acceptance tests — the thinnest end-to-end slice that proves build/deploy/test works. In GOOS (Ch.4): "First, work out how to build, deploy, and test a 'walking skeleton,' then use that infrastructure to write the acceptance tests for the first meaningful feature."

**The development cycle:**

1. Walking skeleton (Playwright E2E) — proves infrastructure works (one-time)
2. Write a failing acceptance test (outer loop — Playwright E2E — RED)
3. **Watch the test fail** — verify the failure message is useful before proceeding
4. Enter inner loops: Vitest Browser Mode component tests + Vitest Node unit tests drive design of hooks, CoValues, services
5. Acceptance test passes (outer loop — GREEN)
6. Refactor

**Key GOOS principles:**

- **Progress vs regression**: The test you're writing now measures _progress_. Once it passes, it becomes a _regression_ test.
- **Start with the simplest success case** — not error handling, not edge cases.
- **Write the test you'd want to read** — the acceptance test IS the specification.
- **Watch the test fail** — a test that fails with a clear message ("expected 'Task Created' to be visible") is as important as one that passes.

## 3-Level Testing Strategy

| Level                     | Tool                    | Runs In      | GOOS Role                          |
| ------------------------- | ----------------------- | ------------ | ---------------------------------- |
| **Unit**                  | Vitest (Node)           | Node.js      | Inner loop — pure functions, validators, services |
| **Component Integration** | Vitest Browser Mode     | Browser      | Intermediate — components with real Jazz sync, NOT the whole system |
| **E2E / Acceptance**      | Playwright              | Node→Browser | Outer loop — feature-level, exercises the whole system end-to-end |

### When to Use Which

- **Vitest Node (inner loop)**: Pure logic with no React, no DOM, no Jazz — Zod schemas, utility functions, data transformations
- **Vitest Browser Mode (component integration)**: Single-component features with Jazz data — task creation, collaborative editing, permission-gated UI. Tests run _inside_ the real browser with JazzTestProvider providing in-memory sync. Valuable but NOT acceptance tests — they don't exercise the whole system (no real routing, no SSR, no full app lifecycle).
- **Playwright (outer loop / acceptance)**: Multi-page flows — login → dashboard → settings. Auth persistence, SSR verification, navigation between routes. Also used for the walking skeleton.

## Playwright E2E — Acceptance Tests (Outer Loop)

Full application tests exercising the whole system end-to-end.

### Walking Skeleton (Playwright)

The walking skeleton proves build/deploy/test infrastructure works. It's the first Playwright E2E test you write.

```typescript
test('walking skeleton — app loads and renders', async ({ page }) => {
  await page.goto('/tasks')

  await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible()
})
```

### Acceptance Test

```typescript
test('user can create and view tasks', async ({ page }) => {
  await page.goto('/tasks')

  await page.getByLabel('Task title').fill('E2E task')
  await page.getByRole('button', { name: 'Add Task' }).click()

  await expect(page.getByText('E2E task')).toBeVisible()
})
```

### Page Object Model

```typescript
export class TaskListPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/tasks')
  }

  async createTask(title: string) {
    await this.page.getByLabel('Task title').fill(title)
    await this.page.getByRole('button', { name: 'Add Task' }).click()
  }

  async expectTaskVisible(title: string) {
    await expect(this.page.getByText(title)).toBeVisible()
  }
}
```

## Vitest Browser Mode — Component Integration Tests

Tests run _in_ the browser using `vitest-browser-react`. Components render in real Chromium with JazzTestProvider providing in-memory sync. These are **component integration tests**, not acceptance tests — they test components in isolation with real Jazz sync but do NOT exercise the whole system end-to-end.

### Single-User Component Test

```tsx
import { render } from 'vitest-browser-react'
import { setupJazzTestSync, createJazzTestAccount } from 'jazz-tools/testing'
import { JazzTestProvider } from '~/test/jazz-test-provider'

beforeEach(async () => {
  await setupJazzTestSync()
})

test('user can create a task', async () => {
  const account = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })

  const screen = render(
    <JazzTestProvider account={account}>
      <TaskListPage />
    </JazzTestProvider>
  )

  await screen.getByLabelText('Task title').fill('Buy groceries')
  await screen.getByRole('button', { name: 'Add Task' }).click()

  await expect.element(screen.getByText('Buy groceries')).toBeVisible()
})
```

### Multi-User Component Test

The key pattern for testing permissions and collaboration: create as User A, verify as User B.

```tsx
test('shared task is visible to team member', async () => {
  // Create two accounts
  const alice = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })
  const bob = await createJazzTestAccount({ AccountSchema: MyAccount })

  // Alice creates a shared task
  const teamGroup = Group.create()
  teamGroup.addMember(bob, 'writer')
  const task = Task.create({ title: 'Shared task' }, { owner: teamGroup })

  // Switch to Bob and reload
  setActiveAccount(bob)
  const taskAsBob = await Task.load(task.$jazz.id)

  // Render as Bob — verify task is visible
  const screen = render(
    <JazzTestProvider account={bob}>
      <TaskDetail taskId={task.$jazz.id} />
    </JazzTestProvider>
  )

  await expect.element(screen.getByText('Shared task')).toBeVisible()
})
```

**Critical**: After `setActiveAccount()`, you MUST reload CoValues with `.load(id)` to get the new permission context. The old instance retains the previous account's permissions.

### External API + Jazz Component Test

When a feature uses both Jazz data and external APIs:

```tsx
test('user can create task and notify via webhook', async () => {
  // Jazz sync for collaborative data
  const account = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })

  // MSW for external webhook API
  server.use(
    http.post('*/api/webhooks/notify', () => {
      return HttpResponse.json({ success: true })
    })
  )

  const screen = render(
    <JazzTestProvider account={account}>
      <TaskListPage />
    </JazzTestProvider>
  )

  await screen.getByLabelText('Task title').fill('Important task')
  await screen.getByRole('checkbox', { name: 'Notify team' }).click()
  await screen.getByRole('button', { name: 'Add Task' }).click()

  await expect.element(screen.getByText('Important task')).toBeVisible()
  await expect.element(screen.getByText('Team notified')).toBeVisible()
})
```

## Key Patterns

- `render()` from `vitest-browser-react` — renders in real browser
- `JazzTestProvider` wraps components with in-memory Jazz sync
- `setupJazzTestSync()` in `beforeEach` — initializes sync node
- `createJazzTestAccount()` — creates test identity
- `setActiveAccount()` — switches active user (MUST reload CoValues after)
- `expect.element()` — auto-retrying assertions
- MSW `server.use()` — per-test external API response overrides

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
await expect(page.getByText('Task created')).toBeVisible()

// BAD: point-in-time check, race condition
const isVisible = await page.locator('.task').isVisible()
expect(isVisible).toBe(true)
```

**Test user-visible behavior** — assert on text, roles, labels, not CSS classes or DOM structure.

**Isolate tests** — each test creates its own state, no shared state between tests.
