# Mocking in TanStack Start

## When to Mock

Mock at **system boundaries** only — things you don't control:

- **External APIs** — use MSW request handlers (primary mechanism)
- **Browser APIs** — `vi.stubGlobal()` for localStorage, crypto, etc.
- **Module boundaries** — `vi.mock()` for encryption, env-dependent modules
- **Time / randomness** — `vi.useFakeTimers()`, `vi.spyOn(Math, 'random')`

## When NOT to Mock

- **React components** — render real components, don't mock children
- **Custom hooks** — let them run with real logic; control inputs via MSW
- **Zod validators** — use real schemas with real data
- **TanStack Router** — use `TestWrapper` with real router/query providers
- **TanStack Query** — use real QueryClient; control responses via MSW
- **Chakra UI components** — render them; they work in Vitest Browser Mode

If you're tempted to mock a hook, ask: should I control the API response via MSW instead?

## Primary Mechanism: MSW (Mock Service Worker)

MSW intercepts network requests at the service worker level. Works in both Vitest Browser Mode and Playwright.

### Server Setup

```typescript
// src/test/msw-server.ts
import { setupServer } from 'msw/node'
import { handlers } from './msw-handlers'

export const server = setupServer(...handlers)
```

```typescript
// src/test/msw-handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('*/auth/admin/login', () => {
    return HttpResponse.json({ token: 'default-token', user: { name: 'Admin' } })
  }),
  http.get('*/merchants', () => {
    return HttpResponse.json({ data: [], meta: { total: 0 } })
  }),
]
```

### Vitest Setup

```typescript
// src/test/setup.ts
import { server } from './msw-server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Per-Test Overrides

```tsx
test('displays error on 401', async () => {
  // Override the default handler for this test only
  server.use(
    http.post('*/auth/admin/login', () => {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    })
  )

  const screen = render(<LoginPage />, { wrapper: TestWrapper })
  await screen.getByRole('button', { name: 'Sign In' }).click()
  await expect.element(screen.getByText('Invalid credentials')).toBeVisible()
})
```

### Network Delay Simulation

```tsx
import { delay } from 'msw'

test('shows loading state during login', async () => {
  server.use(
    http.post('*/auth/admin/login', async () => {
      await delay(100)
      return HttpResponse.json({ token: 'tok' })
    })
  )

  const screen = render(<LoginPage />, { wrapper: TestWrapper })
  await screen.getByRole('button', { name: 'Sign In' }).click()
  await expect.element(screen.getByText('Signing in...')).toBeVisible()
})
```

## `vi.mock()` — Module Boundaries Only

Use `vi.mock()` sparingly, only for modules that can't be controlled via MSW.

### Encryption (Pure Module)

```typescript
// Mock encryption because it depends on env vars and crypto internals
vi.mock('~/app/auth/services/encryption', () => ({
  encryptCredentials: vi.fn((data) => ({ ...data, encrypted: true })),
}))
```

### Environment Variables

```typescript
vi.mock('~/env', () => ({
  env: {
    VITE_API_URL: 'http://localhost:3000',
    VITE_LEAPA_ENCRYPTION_KEY: 'test-key',
  },
}))
```

### Navigation (When Not Using Full Router)

```typescript
const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return { ...actual, useNavigate: () => mockNavigate }
})
```

## Never Mock These

| Don't Mock                    | Instead                                        |
| ----------------------------- | ---------------------------------------------- |
| Custom hooks (`useLogin`)     | Control API responses with MSW                 |
| React components              | Render them — they work in real browser         |
| Zod schemas                   | Use real schemas with test data                 |
| QueryClient internals         | Assert on rendered output, not cache state      |
| `fetch` or `axios` directly   | Use MSW — decoupled from HTTP client            |
| Router/navigation             | Use TestWrapper with real providers when possible |

## QueryClient Test Wrapper

```tsx
// src/test/test-wrapper.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from '~/config/chakra/theme'

export function createTestWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={system}>
          {children}
        </ChakraProvider>
      </QueryClientProvider>
    )
  }
}

export const TestWrapper = createTestWrapper()
```

## `vi.fn()` for Callback Spying

Use when you need to verify a callback was called — not for mocking entire modules.

```tsx
test('calls onSuccess after login', async () => {
  server.use(
    http.post('*/auth/admin/login', () => {
      return HttpResponse.json({ token: 'tok' })
    })
  )

  const onSuccess = vi.fn()
  const screen = render(<LoginForm onSuccess={onSuccess} />, { wrapper: TestWrapper })

  await screen.getByLabelText('Email Address').fill('admin@example.com')
  await screen.getByLabelText('Password').fill('password')
  await screen.getByRole('button', { name: 'Sign In' }).click()

  await vi.waitFor(() => expect(onSuccess).toHaveBeenCalled())
})
```

## MSW in Playwright (E2E)

For Playwright E2E tests, you have two options:

### Option 1: Real API (Preferred for E2E)

Let E2E tests hit the real API with a test environment — most realistic.

### Option 2: Playwright Route Interception

```typescript
test('dashboard loads with mocked data', async ({ page }) => {
  await page.route('**/api/merchants', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [{ id: 1, name: 'Test Merchant' }] }),
    })
  })

  await page.goto('/dashboard')
  await expect(page.getByText('Test Merchant')).toBeVisible()
})
```

Use `page.route()` when you need to control external API responses in E2E without a test backend.

See [tests.md](tests.md) for good vs bad test examples.
