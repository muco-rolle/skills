# Acceptance Tests — The GOOS Outer Loop

## Role in GOOS

The acceptance test is the outer loop of outside-in TDD. Every feature starts with a failing acceptance test that describes what the system should do from the user's perspective.

**The walking skeleton IS the first acceptance test** — but it's more than a test. It's an _architectural decision_: the thinnest end-to-end slice that decides broad-brush architecture (routing, rendering, database, deployment) and front-loads integration risk before you write real features.

**The development cycle:**

1. Write a failing acceptance test (outer loop — RED)
2. **Watch the test fail** — verify the failure message is useful and diagnostic before proceeding
3. Enter inner RED/GREEN loops: unit tests drive design of services, models, adapters
4. Acceptance test passes (outer loop — GREEN)
5. Refactor

**Key Ch 4-5 principles:**

- **Progress vs regression**: The acceptance test you're writing now measures _progress_ (current feature). Once it passes, it becomes a _regression_ test (protecting past features). Separate these concerns — don't mix "are we building?" with "have we broken?"
- **Start with the simplest success case** — not degenerate cases, not error handling, not edge cases. The first test for a feature should walk the happy path.
- **Write the test you'd want to read** — the acceptance test IS the specification. If a teammate can't read the test and understand what the feature does, rewrite it.
- **Watch the test fail** — a test that fails with a clear diagnostic message ("expected 201 Created, got 404 Not Found") is as important as a test that passes. If the failure is confusing, fix the diagnostics first.

## Choosing Your Acceptance Test Tool

| App Type            | Frontend                                       | Acceptance Test Tool                |
| ------------------- | ---------------------------------------------- | ----------------------------------- |
| **API**             | JSON consumers (Tuyau, TanStack Query, mobile) | `@japa/api-client`                  |
| **Hypermedia**      | Edge.js templates + Vite                       | `@japa/browser-client` (Playwright) |
| **React (Inertia)** | React + Inertia + SSR                          | `@japa/browser-client` (Playwright) |
| **Vue (Inertia)**   | Vue + Inertia + SSR                            | `@japa/browser-client` (Playwright) |

**Rule of thumb**: If a user sees rendered HTML, use browser tests. If a client consumes JSON, use API tests.

## API Acceptance Tests (`@japa/api-client`)

Test JSON request/response cycles through the full HTTP stack — no rendering involved.

```typescript
// tests/functional/posts/create_post.spec.ts
import { test } from '@japa/runner';

test.group('Create Post', () => {
  test('authenticated user can create a post', async ({ client }) => {
    const user = await UserFactory.create();

    const response = await client
      .post('/posts')
      .loginAs(user)
      .json({ title: 'TDD with AdonisJS', body: 'Outside-in is the way.' });

    response.assertStatus(201);
    response.assertBodyContains({ title: 'TDD with AdonisJS' });
  });
});
```

## Browser Acceptance Tests (`@japa/browser-client`)

Test server-rendered HTML or SSR + hydrated SPA through a real browser via Playwright.

### Basic Browser Test

```typescript
// tests/browser/auth/register.spec.ts
import { test } from '@japa/runner';

test.group('Registration', () => {
  test('user can register an account', async ({ visit }) => {
    const page = await visit('/register');

    await page.getByLabel('Name').fill('Alice');
    await page.getByLabel('Email').fill('alice@example.com');
    await page.getByLabel('Password').fill('secure-password');
    await page.getByRole('button', { name: 'Create account' }).click();

    await page.assertPath('/dashboard');
    await page.assertTextContains('body', 'Welcome, Alice');
  });
});
```

**Prefer class-based pages for browser tests.** The inline `visit('/path')` style above is fine for walking skeletons or trivially simple pages. For real features, use class-based pages (below) — they ARE the GOOS Page Object pattern, encapsulating page structure so tests read as behavior specifications, not DOM manipulation scripts.

### Browser Test with Class-Based Page

```typescript
// tests/browser/posts/create_post.spec.ts
import { test } from '@japa/runner';
import { CreatePostPage } from '../pages/create_post_page.js';
import { ViewPostPage } from '../pages/view_post_page.js';

test.group('Create Post', () => {
  test('user can create and view a post', async ({ visit }) => {
    const createPage = await visit(CreatePostPage);
    await createPage.fillPost('TDD with AdonisJS', 'Outside-in is the way.');
    await createPage.submit();

    const viewPage = createPage.page.use(ViewPostPage);
    await viewPage.assertViewingPost('TDD with AdonisJS');
  });
});
```

## Class-Based Pages = GOOS Page Objects

Japa's `BasePage` from `@japa/browser-client` maps directly to the GOOS Page Object pattern. Page objects encapsulate page structure and expose behavior — exactly what GOOS recommends.

### Defining Pages

```typescript
// tests/browser/pages/create_post_page.ts
import { BasePage } from '@japa/browser-client';

export class CreatePostPage extends BasePage {
  url = '/posts/create';

  async fillPost(title: string, body: string) {
    await this.page.getByLabel('Title').fill(title);
    await this.page.getByLabel('Body').fill(body);
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Publish' }).click();
  }
}
```

```typescript
// tests/browser/pages/view_post_page.ts
import { BasePage } from '@japa/browser-client';

export class ViewPostPage extends BasePage {
  async assertViewingPost(title: string) {
    await this.page.assertPathMatches(/\/posts\/[0-9]+/);
    await this.page.assertExists(
      this.page.getByRole('heading', { level: 1, name: title }),
    );
  }
}
```

```typescript
// tests/browser/pages/posts_listing_page.ts
import { BasePage } from '@japa/browser-client';

export class PostsListingPage extends BasePage {
  url = '/posts';

  async assertPostsCount(count: number) {
    await this.page.assertElementsCount(this.page.getByRole('article'), count);
  }

  async assertHasPost(title: string) {
    await this.page.assertExists(
      this.page.getByRole('heading', { name: title }),
    );
  }

  async paginateTo(pageNumber: number) {
    await this.page
      .getByRole('navigation', { name: 'Pagination' })
      .getByRole('link', { name: String(pageNumber) })
      .click();
  }
}
```

### Page Transitions with `.use()`

`.use()` navigates between collaborating page objects — the GOOS pattern of page objects handing off to each other:

```typescript
test('user creates post and sees it in the listing', async ({ visit }) => {
  const createPage = await visit(CreatePostPage);
  await createPage.fillPost('My Post', 'Content here.');
  await createPage.submit();

  // Transition to listing page after redirect
  const listingPage = createPage.page.use(PostsListingPage);
  await listingPage.assertHasPost('My Post');
});
```

**Why page objects**: Same reason GOOS recommends them — encapsulate page structure, expose behavior. When the HTML changes, you update the page object, not every test.

## Playwright Best Practices (Adapted for Japa)

**Use role-based locators** — not CSS selectors:

```typescript
// GOOD
await page.getByRole('button', { name: 'Submit' });
await page.getByLabel('Email');

// BAD
await page.locator('.btn-primary');
await page.locator('#email-input');
```

**Use auto-retrying assertions** — Japa's page assertions auto-retry like Playwright's web-first assertions:

```typescript
// GOOD: auto-retries until condition met or timeout
await page.assertTextContains('body', 'Welcome');
await page.assertExists(page.getByRole('heading', { name: 'Dashboard' }));
await page.assertVisible(page.getByRole('alert'));

// BAD: point-in-time check, race condition
const isVisible = await page.locator('.alert').isVisible();
assert.isTrue(isVisible);
```

**Test user-visible behavior** — assert on text, roles, labels, not CSS classes or DOM structure.

**Isolate tests** — each test creates its own data, no shared state between tests.

**Don't test third-party sites** — mock external services via `container.swap()` or `page.route()` (see [mocking.md](mocking.md)).

**Separate browser suite** — configure browser tests in their own suite with longer timeout:

```typescript
// tests/bootstrap.ts
configure({
  suites: [
    {
      name: 'functional',
      files: ['tests/functional/**/*.spec.ts'],
    },
    {
      name: 'browser',
      timeout: 30 * 1000,
      files: ['tests/browser/**/*.spec.ts'],
    },
  ],
  plugins: [
    browserClient({
      runInSuites: ['browser'],
    }),
  ],
});
```

## Walking Skeleton Examples

### API App

```typescript
// tests/functional/health.spec.ts
test('walking skeleton — API responds', async ({ client }) => {
  const response = await client.get('/health');
  response.assertStatus(200);
  response.assertBodyContains({ status: 'ok' });
});
```

### Hypermedia App (Edge)

```typescript
// tests/browser/home.spec.ts
test('walking skeleton — homepage renders', async ({ visit }) => {
  const page = await visit('/');
  await page.assertTextContains('body', 'Welcome');
});
```

### Inertia App (React/Vue)

```typescript
// tests/browser/home.spec.ts
test('walking skeleton — homepage renders with hydration', async ({
  visit,
}) => {
  const page = await visit('/');
  await page.assertTextContains('body', 'Welcome');
  // Inertia hydrates — assert an interactive element works
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.assertPath('/getting-started');
});
```
