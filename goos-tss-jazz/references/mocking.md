# Mocking in TanStack Start + Jazz

## Two Boundaries, Two Strategies

Jazz+TSS apps have **two distinct system boundaries** with different mocking strategies:

### Boundary 1: Jazz Sync (Collaborative Data)

**Strategy: Real in-memory sync — NEVER mock.**

Jazz data flows through `setupJazzTestSync()`, which creates an in-memory sync node. This gives you authentic multi-user synchronization, real permission enforcement, and genuine CoValue behavior — all without a network.

```typescript
import { setupJazzTestSync, createJazzTestAccount, setActiveAccount } from 'jazz-tools/testing'

beforeEach(async () => {
  await setupJazzTestSync()
})

test('collaborative editing works', async () => {
  const alice = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })

  // Create real CoValues with real permissions
  const group = Group.create()
  const doc = Document.create({ title: 'Draft' }, { owner: group })

  // Real sync, real permissions — no mocking
  expect(doc.title).toBe('Draft')
})
```

### Boundary 2: External HTTP APIs

**Strategy: MSW request handlers — same as any TanStack Start app.**

External services (payment APIs, email providers, webhooks) are mocked with MSW at the network level.

```typescript
import { http, HttpResponse } from 'msw'
import { server } from '~/test/msw-server'

test('sends notification via external API', async () => {
  server.use(
    http.post('*/api/notifications/send', () => {
      return HttpResponse.json({ delivered: true })
    })
  )
  // ...render component, trigger action, assert on UI...
})
```

## JazzTestProvider Wrapper

Components using Jazz hooks need a test provider:

```tsx
import { JazzTestProvider } from '~/test/jazz-test-provider'

test('task list loads', async () => {
  const account = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })

  const screen = render(
    <JazzTestProvider account={account}>
      <TaskList />
    </JazzTestProvider>
  )

  await expect.element(screen.getByRole('heading', { name: 'Tasks' })).toBeVisible()
})
```

Combine with MSW when a feature uses both Jazz data and external APIs:

```tsx
test('task creation notifies external service', async () => {
  // Jazz boundary: in-memory sync
  const account = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })

  // HTTP boundary: MSW
  server.use(
    http.post('*/api/webhooks', () => HttpResponse.json({ ok: true }))
  )

  const screen = render(
    <JazzTestProvider account={account}>
      <TaskListPage />
    </JazzTestProvider>
  )

  await screen.getByLabelText('Title').fill('New task')
  await screen.getByRole('button', { name: 'Create' }).click()

  await expect.element(screen.getByText('New task')).toBeVisible()
  await expect.element(screen.getByText('Webhook sent')).toBeVisible()
})
```

## MSW Setup

```typescript
// src/test/msw-server.ts
import { setupServer } from 'msw/node'
import { handlers } from './msw-handlers'

export const server = setupServer(...handlers)
```

```typescript
// src/test/setup.ts
import { server } from './msw-server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## `vi.mock()` — Module Boundaries Only

Use sparingly, only for modules that can't be controlled via MSW or Jazz sync.

```typescript
// Environment variables
vi.mock('~/env', () => ({
  env: {
    VITE_API_URL: 'http://localhost:3000',
    VITE_JAZZ_CLOUD_KEY: 'test-key',
  },
}))

// Encryption (depends on env/crypto internals)
vi.mock('~/app/auth/services/encryption', () => ({
  encryptCredentials: vi.fn((data) => ({ ...data, encrypted: true })),
}))
```

## Never Mock These

| Don't Mock                           | Instead                                                   |
| ------------------------------------ | --------------------------------------------------------- |
| `jazz-tools` (import)               | Use `setupJazzTestSync()` for real in-memory sync         |
| `useCoState`, `useAccount`           | Provide JazzTestProvider with real account                 |
| CoValue creation/loading             | Create real CoValues — they work in test sync              |
| Group.create() / addMember()         | Use real groups — permission enforcement is the point      |
| `setActiveAccount()`                 | Call it directly — it's a test utility, not something to mock |
| Custom hooks (`useCreateTask`)       | Control data via Jazz sync or MSW; render real components  |
| React components                     | Render them — they work in real browser                    |
| Zod schemas                          | Use real schemas with test data                            |
| `fetch` or `axios` directly          | Use MSW — decoupled from HTTP client                       |
| TanStack Router/Query                | Use TestWrapper with real providers                         |

## `vi.fn()` for Callback Spying

Use when you need to verify a callback was called — not for mocking entire modules.

```tsx
test('calls onTaskCreated after creation', async () => {
  const account = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })
  const onTaskCreated = vi.fn()

  const screen = render(
    <JazzTestProvider account={account}>
      <TaskForm onTaskCreated={onTaskCreated} />
    </JazzTestProvider>
  )

  await screen.getByLabelText('Title').fill('New task')
  await screen.getByRole('button', { name: 'Create' }).click()

  await vi.waitFor(() => expect(onTaskCreated).toHaveBeenCalled())
})
```

See [tests.md](tests.md) for good vs bad test examples.
