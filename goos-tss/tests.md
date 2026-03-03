# Good and Bad Tests

TanStack Start + Vitest Browser Mode + Playwright examples of what to aim for and what to avoid.

## Good Tests

### Component Tests (Vitest Browser Mode)

**Integration-style**: Render real components in real browser, MSW controls API responses.

```tsx
// GOOD: Tests observable behavior through rendered UI
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

**Verify through the interface**: Trigger action, assert on what the user sees.

```tsx
// GOOD: Verifies error handling through visible UI
test('displays validation errors for empty form', async () => {
  const screen = render(<LoginPage />, { wrapper: TestWrapper })

  await screen.getByRole('button', { name: 'Sign In' }).click()

  await expect.element(screen.getByText('Email is required')).toBeVisible()
  await expect.element(screen.getByText('Password is required')).toBeVisible()
})
```

### E2E Tests (Playwright)

```typescript
// GOOD: Full flow through real app
test('user can login and navigate to settings', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email Address').fill('admin@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign In' }).click()

  await expect(page).toHaveURL(/.*dashboard/)
  await page.getByRole('link', { name: 'Settings' }).click()
  await expect(page).toHaveURL(/.*settings/)
})
```

### Unit Tests (Vitest Node)

```typescript
// GOOD: Pure function, no DOM, no API
test('parseApiError extracts field errors', () => {
  const error = new AxiosError('Bad Request', '400', undefined, undefined, {
    status: 400,
    data: { errors: [{ path: 'email', message: 'Invalid email' }] },
  } as any)

  const result = parseApiError(error)
  expect(result).toEqual([{ field: 'email', message: 'Invalid email' }])
})
```

### Characteristics of Good Tests

- Tests behavior users care about (visible UI, navigation, error messages)
- Uses rendered output or public API only
- Survives internal refactors
- Describes WHAT the system does, not HOW
- Test name reads like a specification

## Bad Tests

### Mocking Hook Internals

```tsx
// BAD: Mocking the hook bypasses all real behavior
vi.mock('~/app/auth/actions/useLogin', () => ({
  useLogin: () => ({
    login: vi.fn().mockResolvedValue({ token: 'fake' }),
    isPending: false,
    error: null,
  }),
}))

test('login page calls useLogin', async () => {
  const screen = render(<LoginPage />, { wrapper: TestWrapper })
  await screen.getByRole('button', { name: 'Sign In' }).click()
  // This tests nothing — you mocked away all the behavior
})
```

### Testing CSS Classes / DOM Structure

```tsx
// BAD: Coupled to implementation details
test('login button has correct styling', async () => {
  const screen = render(<LoginPage />, { wrapper: TestWrapper })
  const button = screen.getByRole('button', { name: 'Sign In' })
  await expect.element(button).toHaveAttribute('class', 'chakra-button css-1a2b3c')
})
```

### Asserting on Query Cache

```tsx
// BAD: Bypasses the UI to check internal state
test('login mutation fires', async () => {
  const queryClient = new QueryClient()
  render(<LoginPage />, { wrapper: ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )})

  // Inspecting query cache internals — coupled to TanStack Query implementation
  const mutations = queryClient.getMutationCache().getAll()
  expect(mutations).toHaveLength(1)
})
```

### Using querySelector

```tsx
// BAD: Fragile DOM selectors
test('shows error message', async () => {
  const screen = render(<LoginPage />, { wrapper: TestWrapper })
  const errorDiv = document.querySelector('.error-message.text-red-500')
  expect(errorDiv).toBeTruthy()
})
```

### Red Flags

- Mocking custom hooks (`vi.mock('~/app/.../useLogin')`)
- Testing CSS classes, DOM attributes, or component structure
- Asserting on call counts (`expect(fn).toHaveBeenCalledTimes(1)`)
- Using `querySelector` or `document.getElementById`
- Test breaks when refactoring without behavior change
- Test name describes HOW not WHAT ("calls mutateAsync then navigates")
- Verifying query cache state instead of rendered output
- Mocking React internals (useState, useEffect)

## Good Browser Tests (Playwright)

**GOOD: Role-based locators + page objects**

```typescript
test('user can create a merchant', async ({ page }) => {
  const merchantPage = new CreateMerchantPage(page)
  await merchantPage.goto()
  await merchantPage.fillDetails('Acme Corp', 'acme@example.com')
  await merchantPage.submit()
  await expect(page.getByText('Merchant created')).toBeVisible()
})
```

**BAD: Fragile CSS selectors**

```typescript
test('user can create a merchant', async ({ page }) => {
  await page.goto('/merchants/create')
  await page.locator('#name-input').fill('Acme Corp')
  await page.locator('#email-input').fill('acme@example.com')
  await page.locator('.btn.btn-primary.submit-btn').click()
  await page.locator('.success-toast.visible').isVisible()
})
```

### Browser Test Red Flags

- Using CSS class selectors instead of `getByRole`, `getByLabel`, `getByText`
- Testing DOM structure instead of user-visible content
- Not using auto-retrying assertions (`isVisible()` instead of `expect().toBeVisible()`)
- Shared state between tests
- Testing against live third-party APIs instead of mocking

See [mocking.md](mocking.md) for when and how to mock.
