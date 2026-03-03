# TanStack Start Testing Patterns (GOOS-Adapted)

Maps GOOS concepts to TanStack Start + React 19 + Vitest + Playwright equivalents with concrete examples.

## Concept Mapping

| GOOS Concept            | TanStack Start Equivalent                                              |
| ----------------------- | ---------------------------------------------------------------------- |
| JUnit                   | Vitest (`vitest`)                                                      |
| jMock                   | MSW (`msw`) + `vi.mock()` + `vi.fn()`                                 |
| Hamcrest Matchers       | Vitest `expect` + `expect.element()` (browser mode)                    |
| Test Fixtures           | `beforeEach()` / `afterEach()` + MSW `server.use()`                   |
| Walking Skeleton        | Vitest Browser Mode test or Playwright test on real route              |
| Ports & Adapters        | Routes → Pages → Action Hooks → Services → OpenAPI Clients            |
| Mock Objects            | MSW request handlers (`http.get()`, `http.post()`)                     |
| Adapter Layer           | OpenAPI typed clients (`lclient`, `uclient`) wrapping external APIs    |
| Acceptance Tests        | Playwright (`@playwright/test`) for E2E flows                         |
| Integration Tests       | Vitest Browser Mode (`vitest-browser-react`) for component tests       |
| Unit Tests              | Vitest (Node) for pure functions                                       |
| Interface Discovery     | TypeScript types driven by tests                                       |
| Object Peer Stereotypes | Hook dependencies (query clients, services, callbacks)                 |
| Page Objects            | Playwright Page Object Model classes                                   |
| Value Types             | TypeScript branded types / Zod schemas                                 |
| Test Data Builders      | Factory functions with typed overrides                                 |
| End-to-End Tests        | Playwright browser tests with `@playwright/test`                       |

## Outside-In TDD Flow

### Step 1: Failing Acceptance Test (Outer Loop)

```tsx
// Component test — Vitest Browser Mode
test('user can login with valid credentials', async () => {
  server.use(
    http.post('*/auth/admin/login', () => {
      return HttpResponse.json({ token: 'tok', user: { name: 'Admin' } })
    })
  )

  const screen = render(<LoginPage />, { wrapper: TestWrapper })

  await screen.getByLabelText('Email Address').fill('admin@example.com')
  await screen.getByLabelText('Password').fill('password123')
  await screen.getByRole('button', { name: 'Sign In' }).click()

  await expect.element(screen.getByText('Dashboard')).toBeVisible()
})
```

This test fails — no LoginPage, no hook, no API integration exist yet.

### Step 2: Unit Tests Drive Design (Inner Loop)

```typescript
// tests/unit/auth/encryption.test.ts — pure function, Vitest Node
test('encryptCredentials encrypts email and password', () => {
  const result = encryptCredentials({
    email: 'admin@example.com',
    password: 'secret',
  })

  expect(result.email).not.toBe('admin@example.com')
  expect(result.password).not.toBe('secret')
})
```

```typescript
// tests/unit/auth/parse-api-error.test.ts
test('parseApiError extracts field errors from 422 response', () => {
  const error = createAxiosError(422, {
    errors: [{ path: 'email', message: 'Already taken' }],
  })

  expect(parseApiError(error)).toEqual([
    { field: 'email', message: 'Already taken' },
  ])
})
```

### Step 3: Implement Until Acceptance Test Passes

Build LoginPage → useLogin hook → encryptCredentials service → MSW-controlled API, running unit tests along the way, until the component test goes green.

## Verify Through the Interface

GOOS principle: verify behavior through the same interface a real user would use — the rendered UI.

```tsx
// BAD: Bypasses UI to verify query cache state
test('login stores token', async () => {
  const queryClient = new QueryClient()
  render(<LoginPage />, { wrapper: createWrapper(queryClient) })
  // ...trigger login...
  const cache = queryClient.getMutationCache().getAll()
  expect(cache[0].state.data).toHaveProperty('token')
})

// GOOD: Verifies through visible UI
test('login redirects to dashboard', async () => {
  server.use(
    http.post('*/auth/admin/login', () => {
      return HttpResponse.json({ token: 'tok', user: { name: 'Admin' } })
    })
  )

  const screen = render(<LoginPage />, { wrapper: TestWrapper })
  await screen.getByLabelText('Email Address').fill('admin@example.com')
  await screen.getByLabelText('Password').fill('password')
  await screen.getByRole('button', { name: 'Sign In' }).click()

  await expect.element(screen.getByText('Dashboard')).toBeVisible()
})
```

Why this matters: the "bad" test is coupled to TanStack Query internals. If you switch query libraries or change caching strategy, the test breaks even though behavior is identical.

## Test Data Builders

GOOS recommends test data builders with sensible defaults. In TSS, use factory functions with typed overrides.

```typescript
// src/test/factories/merchant.ts
import type { components } from '~/config/client/types/leapa'

type Merchant = components['schemas']['Merchant']

export function buildMerchant(overrides: Partial<Merchant> = {}): Merchant {
  return {
    id: 1,
    name: 'Test Merchant',
    email: 'merchant@example.com',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides,
  }
}
```

```typescript
// Usage in tests — override only what matters
test('displays inactive merchant badge', async () => {
  const merchant = buildMerchant({ status: 'inactive' })

  server.use(
    http.get('*/merchants/1', () => HttpResponse.json(merchant))
  )

  const screen = render(<MerchantDetail id={1} />, { wrapper: TestWrapper })
  await expect.element(screen.getByText('Inactive')).toBeVisible()
})
```

## Test Structure (Canonical Form)

GOOS canonical structure: Arrange → Act → Assert

```tsx
test('user can update merchant name', async () => {
  // Arrange (Given)
  server.use(
    http.get('*/merchants/1', () => HttpResponse.json(buildMerchant())),
    http.put('*/merchants/1', () => HttpResponse.json(buildMerchant({ name: 'Updated' })))
  )
  const screen = render(<EditMerchantPage id={1} />, { wrapper: TestWrapper })

  // Act (When)
  await screen.getByLabelText('Name').fill('Updated')
  await screen.getByRole('button', { name: 'Save' }).click()

  // Assert (Then)
  await expect.element(screen.getByText('Merchant updated')).toBeVisible()
})
```

## Ports & Adapters in TanStack Start

```
┌──────────────────────────────────────────────────────┐
│  Acceptance Tests                                    │
│  E2E: Playwright | Component: Vitest Browser Mode    │
│  ┌────────────────────────────────────────────────┐  │
│  │  Routes (TanStack Router file-based)           │  │
│  │  ┌────────────────────────────────────────┐    │  │
│  │  │  Pages (Presentational Components)     │    │  │
│  │  │  ┌────────────────────────────────┐    │    │  │
│  │  │  │  Action Hooks (useLogin, etc.) │    │    │  │
│  │  │  │  ┌────────────────────────┐    │    │    │  │
│  │  │  │  │  Services (pure fns)   │    │    │    │  │
│  │  │  │  │  ┌────────────────┐    │    │    │    │  │
│  │  │  │  │  │ OpenAPI Clients│←MSW│    │    │    │  │
│  │  │  │  │  └────────────────┘    │    │    │    │  │
│  │  │  │  └────────────────────────┘    │    │    │  │
│  │  │  └────────────────────────────────┘    │    │  │
│  │  └────────────────────────────────────────┘    │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

- **Routes**: Thin TanStack Router file-based routes — import and render pages
- **Pages**: Presentational components in `src/pages/` — compose UI and wire hooks
- **Action Hooks**: Domain logic hooks (`useLogin`, `useCreateMerchant`) — orchestrate services and mutations
- **Services**: Pure functions (`encryptCredentials`, `parseApiError`) — no React, no side effects
- **OpenAPI Clients**: Typed fetch clients (`lclient`, `uclient`) — MSW intercepts at this boundary

## Listening to the Tests (Design Smells)

| Test Smell                                    | Design Problem                  | Fix                                             |
| --------------------------------------------- | ------------------------------- | ------------------------------------------------ |
| Test needs many MSW handlers for unrelated APIs| Page/hook does too much         | Extract focused hooks per feature                |
| Can't test without full router setup          | Component tightly coupled to routing | Separate page logic from route concerns      |
| Test setup is 30+ lines of MSW handlers       | Component has too many API deps | Split into smaller components with focused hooks |
| Need to mock hooks with `vi.mock()`           | Hook creates own dependencies   | Use MSW to control API boundary instead          |
| Assertions check query cache state            | Testing internals, not behavior | Assert on rendered UI output                     |
| Test name describes implementation            | Testing methods, not behavior   | Rename: "displays error on invalid credentials"  |

## Test Levels in TanStack Start

### Unit Tests (Vitest Node)

```typescript
// tests/unit/ — pure functions, no DOM, no React
test('login schema rejects empty email', () => {
  const result = loginSchema.safeParse({ email: '', password: 'test' })
  expect(result.success).toBe(false)
})
```

### Integration/Component Tests (Vitest Browser Mode)

```tsx
// tests/browser/ — real components in real browser
test('login form validates inputs', async () => {
  const screen = render(<LoginPage />, { wrapper: TestWrapper })
  await screen.getByRole('button', { name: 'Sign In' }).click()
  await expect.element(screen.getByText('Email is required')).toBeVisible()
})
```

### E2E/Acceptance Tests (Playwright)

```typescript
// tests/e2e/ — full app through real browser
test('complete login flow', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email Address').fill('admin@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL(/.*dashboard/)
})
```

See [acceptance-tests.md](acceptance-tests.md) for the complete testing strategy reference.
