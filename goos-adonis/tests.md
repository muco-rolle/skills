# Good and Bad Tests

AdonisJS/Japa examples of what to aim for and what to avoid.

## Good Tests

**Integration-style**: Test through real interfaces, not mocks of internal parts.

```typescript
// GOOD: Tests observable behavior through the HTTP API
test('authenticated user can create a post', async ({ client }) => {
  const user = await UserFactory.create()

  const response = await client
    .post('/posts')
    .loginAs(user)
    .json({ title: 'TDD with AdonisJS', body: 'Outside-in is the way.' })

  response.assertStatus(201)
  response.assertBodyContains({ title: 'TDD with AdonisJS' })
})
```

**Verify through the interface**: Create then retrieve via the same API.

```typescript
// GOOD: Verifies the system works end-to-end via public API
test('created post is retrievable', async ({ client }) => {
  const user = await UserFactory.create()

  const createResponse = await client
    .post('/posts')
    .loginAs(user)
    .json({ title: 'My Post', body: 'Content' })

  const getResponse = await client
    .get(`/posts/${createResponse.body().id}`)
    .loginAs(user)

  getResponse.assertStatus(200)
  getResponse.assertBodyContains({ title: 'My Post' })
})
```

### Characteristics of Good Tests

- Tests behavior users/callers care about
- Uses public API only (HTTP client or service public methods)
- Survives internal refactors
- Describes WHAT the system does, not HOW
- One logical assertion per test
- Test name reads like a specification

## Bad Tests

**Implementation-coupled**: Tests that break when you refactor without changing behavior.

```typescript
// BAD: Mocking internal service to count calls
test('controller calls service.create', async ({ client }) => {
  const spy = sinon.spy(PostService.prototype, 'create')
  const user = await UserFactory.create()

  await client.post('/posts').loginAs(user)
    .json({ title: 'Post', body: 'Content' })

  assert.isTrue(spy.calledOnce)
  spy.restore()
})
```

**Bypassing the interface**: Checking the database directly instead of through the API.

```typescript
// BAD: Verifies by querying DB directly
test('creates a post', async ({ client, assert }) => {
  const user = await UserFactory.create()

  await client.post('/posts').loginAs(user)
    .json({ title: 'My Post', body: 'Content' })

  const row = await db.from('posts').where('title', 'My Post').first()
  assert.isNotNull(row)
})
```

### Red Flags

- Mocking internal collaborators (your own services/models)
- Testing private methods
- Asserting on call counts or call order
- Test breaks when refactoring without behavior change
- Test name describes HOW not WHAT ("calls createPost then saves to DB")
- Verifying through external means instead of the interface
- Test setup requires knowing implementation details (exact DB schema, internal state)

## Good Browser Tests

Browser tests (`@japa/browser-client`) for Hypermedia and Inertia apps. Same principles as API tests — test behavior, not structure.

**GOOD: Role-based locators + class-based page**
```typescript
import { CreatePostPage } from '../pages/create_post_page.js'

test('user can create a post', async ({ visit }) => {
  const page = await visit(CreatePostPage)
  await page.fillPost('My Post', 'Content here.')
  await page.submit()
  await page.page.assertTextContains('body', 'My Post')
})
```

**BAD: Fragile CSS selectors**
```typescript
test('user can create a post', async ({ visit }) => {
  const page = await visit('/posts/create')
  await page.locator('#title-input').fill('My Post')
  await page.locator('#body-textarea').fill('Content here.')
  await page.locator('.btn.btn-primary.submit-btn').click()
  await page.locator('.post-title.h1-styled').isVisible()
})
```

**GOOD: Asserting on visible text content**
```typescript
test('dashboard shows welcome message', async ({ visit }) => {
  const page = await visit('/dashboard')
  await page.assertTextContains('body', 'Welcome back, Alice')
  await page.assertVisible(page.getByRole('navigation'))
})
```

**BAD: Asserting on DOM structure / class names**
```typescript
test('dashboard shows welcome message', async ({ visit }) => {
  const page = await visit('/dashboard')
  await page.assertExists(page.locator('.welcome-msg.text-lg.font-bold'))
  await page.assertExists(page.locator('nav.sidebar.sidebar--expanded'))
})
```

### Browser Test Red Flags

- Using CSS class selectors instead of `getByRole`, `getByLabel`, `getByText`
- Testing DOM structure instead of user-visible content
- Not using auto-retrying assertions (manual `isVisible()` checks instead of `assertVisible()`)
- Sharing state between browser tests (each test should create its own data)
- Testing against live third-party sites instead of mocking (use `container.swap()` or `page.route()`)

See [mocking.md](mocking.md) for when and how to mock.
