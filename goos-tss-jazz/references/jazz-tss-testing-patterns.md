# TanStack Start + Jazz Testing Patterns (GOOS-Adapted)

Maps GOOS concepts to TanStack Start + Jazz + React + Vitest + Playwright equivalents with concrete examples.

## Concept Mapping

| GOOS Concept            | TanStack Start + Jazz Equivalent                                       |
| ----------------------- | ---------------------------------------------------------------------- |
| JUnit                   | Vitest (`vitest`)                                                      |
| jMock                   | Jazz: `setupJazzTestSync()` / HTTP: MSW (`msw`) + `vi.fn()`           |
| Hamcrest Matchers       | Vitest `expect` + `expect.element()` (browser mode)                    |
| Test Fixtures           | `beforeEach(() => setupJazzTestSync())` + MSW `server.use()`          |
| Walking Skeleton        | Playwright E2E test — thinnest slice proving build/deploy/test works   |
| Ports & Adapters        | Routes → Pages → Hooks (useCoState) → CoValues → Jazz Sync ← MSW     |
| Mock Objects            | Jazz sync (in-memory) for collaborative data; MSW for external APIs    |
| Adapter Layer           | OpenAPI typed clients wrapping external APIs (mock only at this seam)  |
| Acceptance Tests        | Playwright E2E — outer loop, exercises the whole system end-to-end     |
| Component Integration   | Vitest Browser Mode + JazzTestProvider — components with real Jazz sync|
| Unit Tests              | Vitest (Node) — inner loop, pure functions                             |
| Interface Discovery     | TypeScript types driven by tests + CoValue schema design               |
| Object Peer Stereotypes | Hook dependencies (Jazz context, CoValues, MSW-controlled APIs)        |
| Page Objects            | Playwright Page Object Model classes                                   |
| Value Types             | CoValue schemas (`co.map()`, `co.list()`) + Zod schemas               |
| Test Data Builders      | Factory functions for CoValues with typed overrides                     |
| End-to-End Tests        | Playwright browser tests with `@playwright/test`                       |
| Multi-User Testing      | `createJazzTestAccount()` + `setActiveAccount()` + `.load()`           |

## Outside-In TDD Flow

### Step 1: Failing Acceptance Test (Outer Loop — Playwright E2E)

```typescript
// e2e/project.spec.ts — Playwright, exercises the whole system
test('user can create a project with tasks', async ({ page }) => {
  await page.goto('/projects')

  await page.getByLabel('Project name').fill('My Project')
  await page.getByRole('button', { name: 'Create Project' }).click()

  await expect(page.getByText('My Project')).toBeVisible()
})
```

This test fails — no route, no ProjectPage, no hook, no schema exist yet.

### Step 2: Component Integration Tests + Unit Tests Drive Implementation

```tsx
// Component integration test — Vitest Browser Mode (intermediate level)
beforeEach(async () => {
  await setupJazzTestSync()
})

test('ProjectPage renders and creates a project', async () => {
  const account = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })

  const screen = render(
    <JazzTestProvider account={account}>
      <ProjectPage />
    </JazzTestProvider>
  )

  await screen.getByLabelText('Project name').fill('My Project')
  await screen.getByRole('button', { name: 'Create Project' }).click()

  await expect.element(screen.getByText('My Project')).toBeVisible()
})
```

```typescript
// Unit test — Vitest Node (inner loop)
test('project name must not be empty', () => {
  const result = projectNameSchema.safeParse('')
  expect(result.success).toBe(false)
})
```

### Step 3: Implement Until Acceptance Test Passes

Build route → ProjectPage → useCreateProject hook → Project CoValue schema → Group setup, driving implementation with VBM component tests and Vitest unit tests along the way, until the Playwright E2E acceptance test goes green.

## Verify Through the Interface

GOOS principle: verify behavior through the same interface a real user would use — the rendered UI.

```tsx
// BAD: Bypasses UI to verify CoValue internals
test('task is created', async () => {
  // ...setup...
  await screen.getByRole('button', { name: 'Add Task' }).click()
  // Inspecting CoValue internals — coupled to Jazz implementation
  expect(task.$jazz.id).toBeDefined()
  expect(task.title).toBe('Buy groceries')
})

// GOOD: Verifies through visible UI
test('task appears in list after creation', async () => {
  // ...setup with JazzTestProvider...
  await screen.getByLabelText('Task title').fill('Buy groceries')
  await screen.getByRole('button', { name: 'Add Task' }).click()

  await expect.element(screen.getByText('Buy groceries')).toBeVisible()
})
```

Why this matters: the "bad" test is coupled to CoValue internals. If you change how tasks are stored or loaded, the test breaks even though behavior is identical.

## Test Data Builders for CoValues

GOOS recommends test data builders with sensible defaults. For Jazz, create factory functions that handle group setup.

```typescript
// src/test/factories/task.ts
import { Group } from 'jazz-tools'

export async function buildTask(
  overrides: Partial<{ title: string; completed: boolean }> = {},
  options: { owner?: Group } = {}
) {
  const owner = options.owner ?? Group.create()
  return Task.create(
    {
      title: 'Test Task',
      completed: false,
      ...overrides,
    },
    { owner }
  )
}

// Usage in tests — override only what matters
test('completed tasks show checkmark', async () => {
  const account = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })
  const task = await buildTask({ completed: true })

  const screen = render(
    <JazzTestProvider account={account}>
      <TaskItem taskId={task.$jazz.id} />
    </JazzTestProvider>
  )

  await expect.element(screen.getByRole('img', { name: 'Completed' })).toBeVisible()
})
```

## Ports & Adapters in TanStack Start + Jazz

```
┌───────────────────────────────────────────────────────────────┐
│  Tests                                                        │
│  E2E/Acceptance: Playwright | Component Integration: VBM      │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Routes (TanStack Router file-based)                    │  │
│  │  ┌───────────────────────────────────────────────────┐  │  │
│  │  │  Pages (Presentational Components)                │  │  │
│  │  │  ┌─────────────────────────────────────────────┐  │  │  │
│  │  │  │  Hooks (useCoState, custom action hooks)    │  │  │  │
│  │  │  │  ┌──────────────────┐  ┌────────────────┐   │  │  │  │
│  │  │  │  │ CoValues (Jazz)  │  │ OpenAPI Clients│   │  │  │  │
│  │  │  │  │ ↕ Jazz Sync      │  │ ↕ MSW          │   │  │  │  │
│  │  │  │  │ (in-memory test) │  │ (HTTP boundary)│   │  │  │  │
│  │  │  │  └──────────────────┘  └────────────────┘   │  │  │  │
│  │  │  └─────────────────────────────────────────────┘  │  │  │
│  │  └───────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

**Two boundaries, two strategies:**
- **Jazz Sync (left)**: CoValues flow through `setupJazzTestSync()` — real in-memory sync, never mocked
- **HTTP (right)**: External APIs intercepted by MSW at the network level

## Listening to the Tests (Design Smells)

| Test Smell                                         | Design Problem                  | Fix                                                      |
| -------------------------------------------------- | ------------------------------- | --------------------------------------------------------- |
| Need many MSW handlers AND Jazz setup              | Feature mixes too many concerns | Split Jazz data hooks from external API hooks              |
| Can't test without full router setup               | Component coupled to routing    | Separate page logic from route concerns                    |
| Test setup is 30+ lines of account/group creation  | Component has too many users    | Extract multi-user setup into test helpers                 |
| Need to vi.mock('jazz-tools')                      | Wrong testing approach          | Use setupJazzTestSync() — never mock Jazz                  |
| Assertions check CoValue.$jazz properties          | Testing internals, not behavior | Assert on rendered UI output                               |
| Test name describes implementation                 | Testing methods, not behavior   | Rename: "shared task visible to team member"               |
| Must create complex group hierarchies for one test | Permissions model too complex   | Simplify ownership structure or extract permission helpers  |
| CoValues not appearing after setActiveAccount      | Missing reload step             | Always `.load(id)` after switching accounts                |

## Test Structure (Canonical Form)

GOOS canonical structure: Arrange → Act → Assert

```tsx
test('team member can complete a shared task', async () => {
  // Arrange (Given)
  await setupJazzTestSync()
  const alice = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })
  const bob = await createJazzTestAccount({ AccountSchema: MyAccount })
  const teamGroup = Group.create()
  teamGroup.addMember(bob, 'writer')
  const task = Task.create({ title: 'Review PR', completed: false }, { owner: teamGroup })

  setActiveAccount(bob)
  const screen = render(
    <JazzTestProvider account={bob}>
      <TaskItem taskId={task.$jazz.id} />
    </JazzTestProvider>
  )

  // Act (When)
  await screen.getByRole('checkbox', { name: 'Complete task' }).click()

  // Assert (Then)
  await expect.element(screen.getByText('Completed')).toBeVisible()
})
```
