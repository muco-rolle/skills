# Good and Bad Tests

TanStack Start + Jazz + Vitest Browser Mode + Playwright examples of what to aim for and what to avoid.

## Good Tests

### Component Test with Jazz Sync

```tsx
// GOOD: Real Jazz sync, real component, asserts on visible UI
test('user can create a task', async () => {
  await setupJazzTestSync()
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

### Multi-User Permission Test

```tsx
// GOOD: Tests real permission enforcement through UI
test('reader cannot edit shared task', async () => {
  await setupJazzTestSync()
  const alice = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })
  const bob = await createJazzTestAccount({ AccountSchema: MyAccount })

  const teamGroup = Group.create()
  teamGroup.addMember(bob, 'reader')
  Task.create({ title: 'Protected task', completed: false }, { owner: teamGroup })

  setActiveAccount(bob)

  const screen = render(
    <JazzTestProvider account={bob}>
      <TaskListPage />
    </JazzTestProvider>
  )

  await expect.element(screen.getByText('Protected task')).toBeVisible()
  // Edit button should not be present for readers
  expect(screen.getByRole('button', { name: 'Edit' }).query()).toBeNull()
})
```

### Real-Time Sync Test

```tsx
// GOOD: Tests that sync updates propagate to UI
test('task updates appear in real-time', async () => {
  await setupJazzTestSync()
  const account = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })

  const task = Task.create({ title: 'Original title', completed: false })

  const screen = render(
    <JazzTestProvider account={account}>
      <TaskDetail taskId={task.$jazz.id} />
    </JazzTestProvider>
  )

  await expect.element(screen.getByText('Original title')).toBeVisible()

  // Mutate the CoValue directly — simulates another user editing
  task.$jazz.set('title', 'Updated title')

  await expect.element(screen.getByText('Updated title')).toBeVisible()
})
```

### Jazz + External API Test

```tsx
// GOOD: Both boundaries used correctly
test('creating task sends webhook notification', async () => {
  await setupJazzTestSync()
  const account = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })

  // External API via MSW
  server.use(
    http.post('*/webhooks/task-created', () => {
      return HttpResponse.json({ notified: true })
    })
  )

  const screen = render(
    <JazzTestProvider account={account}>
      <TaskListPage />
    </JazzTestProvider>
  )

  await screen.getByLabelText('Task title').fill('Important task')
  await screen.getByRole('button', { name: 'Add Task' }).click()

  await expect.element(screen.getByText('Important task')).toBeVisible()
  await expect.element(screen.getByText('Notification sent')).toBeVisible()
})
```

### Characteristics of Good Tests

- Uses `setupJazzTestSync()` for collaborative data — never mocks jazz-tools
- Uses MSW for external HTTP APIs only
- Tests behavior users care about (visible UI, navigation, error messages)
- Uses rendered output or public API only
- Survives internal refactors
- Reloads CoValues after `setActiveAccount()`
- Test name reads like a specification

## Bad Tests

### Mocking jazz-tools

```tsx
// BAD: Mocking jazz-tools bypasses all real Jazz behavior
vi.mock('jazz-tools', () => ({
  useCoState: vi.fn().mockReturnValue({
    title: 'Fake task',
    completed: false,
  }),
}))

test('task renders', async () => {
  const screen = render(<TaskItem taskId="fake-id" />)
  // Tests nothing — you mocked away all Jazz behavior
})
```

### Asserting on CoValue Internals

```tsx
// BAD: Testing Jazz internals, not user-visible behavior
test('task is created with correct id', async () => {
  await setupJazzTestSync()
  const account = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })

  const task = Task.create({ title: 'Test' })

  // These assert on implementation details
  expect(task.$jazz.id).toMatch(/^co_/)
  expect(task.$jazz.owner).toBeDefined()
  expect(task.$jazz.createdBy).toBe(account.$jazz.id)
})
```

### Not Reloading CoValues After Account Switch

```tsx
// BAD: Uses stale CoValue after switching accounts
test('bob cannot edit alice task', async () => {
  const alice = await createJazzTestAccount({
    AccountSchema: MyAccount,
    isCurrentActiveAccount: true,
  })
  const bob = await createJazzTestAccount({ AccountSchema: MyAccount })

  const group = Group.create()
  group.addMember(bob, 'reader')
  const task = Task.create({ title: 'Alice task' }, { owner: group })

  setActiveAccount(bob)
  // BUG: `task` still has alice's permission context!
  // Should be: const taskAsBob = await Task.load(task.$jazz.id)
  expect(() => task.$jazz.set('title', 'Hacked')).toThrow() // May NOT throw!
})
```

### Mocking Custom Hooks

```tsx
// BAD: Mocking the hook bypasses all real behavior
vi.mock('~/hooks/useCreateTask', () => ({
  useCreateTask: () => ({
    createTask: vi.fn(),
    isPending: false,
  }),
}))

test('create button exists', async () => {
  const screen = render(<TaskListPage />)
  // Tests nothing meaningful
})
```

### Testing CSS / DOM Structure

```tsx
// BAD: Coupled to implementation details
test('task has correct class', async () => {
  const screen = render(
    <JazzTestProvider account={account}>
      <TaskItem taskId={taskId} />
    </JazzTestProvider>
  )
  const item = screen.getByRole('listitem')
  await expect.element(item).toHaveAttribute('class', 'task-item completed')
})
```

## Red Flags

- `vi.mock('jazz-tools')` or `vi.mock('jazz-tools/react')` — ALWAYS wrong
- Asserting on `.$jazz.id`, `.$jazz.owner`, `.$jazz.createdBy` — test through UI
- Not calling `setupJazzTestSync()` in `beforeEach`
- Using `setActiveAccount()` without reloading CoValues
- Mocking custom hooks (`vi.mock('~/hooks/useCreateTask')`)
- Testing CSS classes, DOM attributes, or component structure
- Using `querySelector` or `document.getElementById`
- Test name describes HOW not WHAT ("calls $jazz.set then re-renders")
- Creating CoValues without proper group setup in multi-user tests
- Using Account as owner instead of Group

See [mocking.md](mocking.md) for the two-boundary mocking strategy.
