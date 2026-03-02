# AdonisJS v7 Testing Patterns (GOOS-Adapted)

Maps GOOS concepts to AdonisJS v7 + Japa equivalents with concrete examples.

## Concept Mapping

| GOOS Concept            | AdonisJS v7 Equivalent                                                   |
| ----------------------- | ------------------------------------------------------------------------ |
| JUnit                   | Japa test runner (`@japa/runner`)                                        |
| jMock                   | `container.swap()` + Sinon.js + Fake classes                             |
| Hamcrest Matchers       | `@japa/assert` assertions                                                |
| Test Fixtures           | `group.each.setup()` / `group.each.teardown()`                           |
| Walking Skeleton        | `node ace make:*` + functional test hitting real route                   |
| Ports & Adapters        | AdonisJS Services + IoC Container + `@inject()`                          |
| Mock Objects            | `container.swap(Service, () => new FakeService())`                       |
| Adapter Layer           | AdonisJS Service classes wrapping third-party APIs                       |
| Acceptance Tests        | Japa functional (`@japa/api-client`) or browser (`@japa/browser-client`) |
| Integration Tests       | Japa tests hitting real DB with Lucid ORM                                |
| Unit Tests              | Japa tests with `container.swap()` for isolation                         |
| Interface Discovery     | TypeScript interfaces + IoC container bindings                           |
| Object Peer Stereotypes | Constructor injection via `@inject()` for dependencies                   |
| Page Objects            | Class-based pages (`BasePage` from `@japa/browser-client`)               |
| Value Types             | TypeScript branded types / value object classes                          |
| Test Data Builders      | AdonisJS model factories                                                 |
| End-to-End Tests        | Japa browser tests with `@japa/browser-client`                           |

## Walking Skeleton in AdonisJS

The thinnest slice: one route, one controller, one test proving they connect end-to-end.

```typescript
// tests/functional/health.spec.ts
import { test } from '@japa/runner';

test.group('Walking Skeleton', () => {
  test('application responds to health check', async ({ client }) => {
    const response = await client.get('/health');
    response.assertStatus(200);
    response.assertBodyContains({ status: 'ok' });
  });
});
```

```typescript
// start/routes.ts
import router from '@adonisjs/core/services/router';

router.get('/health', async () => {
  return { status: 'ok' };
});
```

Run: `node ace test --files="tests/functional/health.spec.ts"`

## Outside-In TDD Flow

### Step 1: Failing Acceptance Test (Outer Loop)

```typescript
// tests/functional/posts/create_post.spec.ts
import { test } from '@japa/runner';

test.group('Create Post', (group) => {
  group.each.setup(async () => {
    // Transaction-based test isolation
  });

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

This test fails — no route, no controller, no model exist yet.

### Step 2: Unit Tests Drive Design (Inner Loop)

```typescript
// tests/unit/posts/create_post_service.spec.ts
import { test } from '@japa/runner';
import app from '@adonisjs/core/services/app';
import CreatePostService from '#services/create_post_service';

test.group('CreatePostService', () => {
  test('creates a post with valid data', async ({ assert }) => {
    const service = await app.container.make(CreatePostService);
    const post = await service.execute({
      userId: 1,
      title: 'TDD with AdonisJS',
      body: 'Outside-in is the way.',
    });

    assert.equal(post.title, 'TDD with AdonisJS');
    assert.equal(post.userId, 1);
  });
});
```

### Step 3: Implement Until Acceptance Test Passes

Build route → controller → service → model, running unit tests along the way, until the acceptance test goes green.

## Verify Through the Interface

GOOS principle: verify behavior through the same public interface a real user/caller would use. Don't bypass the interface to check side effects.

```typescript
// BAD: Bypasses interface to verify via direct DB query
test('creates a user', async ({ client, assert }) => {
  await client.post('/users').json({ name: 'Alice', email: 'alice@test.com' });

  const row = await db.from('users').where('email', 'alice@test.com').first();
  assert.isNotNull(row);
});

// GOOD: Verifies through the public API
test('creates a user that is retrievable', async ({ client }) => {
  const createResponse = await client
    .post('/users')
    .json({ name: 'Alice', email: 'alice@test.com' });
  createResponse.assertStatus(201);

  const getResponse = await client.get(`/users/${createResponse.body().id}`);
  getResponse.assertStatus(200);
  getResponse.assertBodyContains({ name: 'Alice', email: 'alice@test.com' });
});
```

Why this matters: the "bad" test is coupled to the database schema. If you change the table name, add a view, or switch storage — the test breaks even though behavior is identical. The "good" test only cares about observable behavior through the API.

## Container Swap Pattern (Test Doubles)

GOOS says "only mock types you own." In AdonisJS, use `container.swap()` to replace your own services.

### Define the Service

```typescript
// app/services/payment_gateway.ts
import { inject } from '@adonisjs/core'
import Stripe from 'stripe'

@inject()
export default class PaymentGateway {
  constructor(private stripe: Stripe) {}

  async charge(amount: number, token: string): Promise<{ id: string; status: string }> {
    const result = await this.stripe.charges.create({ amount, source: token })
    return { id: result.id, status: result.status }
  }
}
```

### Swap in Tests

```typescript
// tests/functional/payments/charge.spec.ts
import { test } from '@japa/runner';
import app from '@adonisjs/core/services/app';
import PaymentGateway from '#services/payment_gateway';

test.group('Payment', (group) => {
  group.each.setup(() => {
    // Swap PaymentGateway with a fake
    app.container.swap(PaymentGateway, () => {
      return {
        async charge(amount: number, _token: string) {
          return { id: 'fake-charge-id', status: 'succeeded' };
        },
      };
    });
  });

  group.each.teardown(() => {
    app.container.restore(PaymentGateway);
  });

  test('processes payment successfully', async ({ client }) => {
    const user = await UserFactory.create();
    const response = await client
      .post('/payments/charge')
      .loginAs(user)
      .json({ amount: 1000, token: 'tok_test' });

    response.assertStatus(200);
    response.assertBodyContains({ status: 'succeeded' });
  });
});
```

### Mocking Strategy

**When to use `container.swap()`**: external APIs, email services, payment gateways, file storage, SMS providers — anything at a system boundary you don't control.

**When NOT to mock**: your own services collaborating with each other, Lucid models, framework internals. Let your services call each other through the real container. If you're swapping one of your own domain services just to simplify test setup, that's a design smell — the service may be doing too much.

**SDK-style adapters**: Design adapters with specific methods per operation, not a generic fetch wrapper. Each method is independently mockable with a simple return value.

```typescript
// GOOD: Specific methods, each independently mockable
export default class StripeAdapter {
  async chargeCard(amount: number, token: string) {
    /* ... */
  }
  async refund(chargeId: string) {
    /* ... */
  }
  async createCustomer(email: string) {
    /* ... */
  }
}

// BAD: Generic wrapper requires conditional mock logic
export default class StripeAdapter {
  async request(method: string, path: string, data?: any) {
    /* ... */
  }
}
```

**Framework-provided fakes**: AdonisJS already wraps common external services with built-in test fakes. Use these instead of building custom adapters:

- **Email**: `mail.fake()` → captures sent messages, provides `mails.assertSent()`, `mails.assertNotSent()`, `mails.assertSentCount()`
- **File storage**: `drive.fake()` → captures uploaded files, provides `drive.assertExists()`, `drive.assertMissing()`

Only build custom adapter services for third-party APIs the framework doesn't already wrap (payment gateways, geocoding, SMS providers without AdonisJS packages, domain-specific APIs).

See [mocking.md](mocking.md) for the complete mocking reference.

## Adapter Layer Pattern

GOOS principle: never mock types you don't own. Wrap third-party APIs in your own adapter.

```typescript
// app/services/geocoding_service.ts — Your adapter (you own this)
import { inject } from '@adonisjs/core'
import { HttpClient } from '#services/http_client'
import env from '#start/env'

@inject()
export default class GeocodingService {
  constructor(private httpClient: HttpClient) {}

  async geocode(address: string): Promise<{ lat: number; lng: number }> {
    const response = await this.httpClient.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json', {
      qs: { access_token: env.get('MAPBOX_TOKEN') },
    })
    const [lng, lat] = response.body.features[0].center
    return { lat, lng }
  }
}
```

```typescript
// Test: swap your adapter, NOT the third-party HTTP client
class FakeGeocodingService {
  geocoded: string[] = []

  async geocode(address: string) {
    this.geocoded.push(address)
    return { lat: 40.7128, lng: -74.006 }
  }
}

const fakeGeocoding = new FakeGeocodingService()
app.container.swap(GeocodingService, () => fakeGeocoding)
```

## Test Data Builders (Model Factories)

GOOS recommends test data builders with sensible defaults. AdonisJS model factories serve this role.

```typescript
// database/factories/user_factory.ts
import factory from '@adonisjs/lucid/factories';
import User from '#models/user';

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: 'test-password',
    };
  })
  .relation('posts', () => PostFactory)
  .build();
```

```typescript
// Usage in tests — override only what matters
test('admin can manage users', async ({ client }) => {
  const admin = await UserFactory.merge({ role: 'admin' }).create();
  const response = await client.get('/admin/users').loginAs(admin);
  response.assertStatus(200);
});
```

## Test Structure (Canonical Form)

GOOS canonical structure: Arrange → Act → Assert

```typescript
test('user can update their profile', async ({ client, assert }) => {
  // Arrange (Given)
  const user = await UserFactory.create();

  // Act (When)
  const response = await client
    .put(`/users/${user.id}`)
    .loginAs(user)
    .json({ name: 'Updated Name' });

  // Assert (Then)
  response.assertStatus(200);
  await user.refresh();
  assert.equal(user.name, 'Updated Name');
});
```

## Listening to the Tests (AdonisJS Design Smells)

| Test Smell                                 | Design Problem                    | AdonisJS Fix                                    |
| ------------------------------------------ | --------------------------------- | ----------------------------------------------- |
| Test needs many `container.swap()` calls   | Controller does too much          | Extract services, inject fewer dependencies     |
| Can't test without database                | Business logic coupled to Lucid   | Extract pure service layer above models         |
| Test setup is 30+ lines                    | Object has too many dependencies  | Split into smaller services                     |
| Assertions check DB directly in unit test  | Testing persistence, not behavior | Use functional test for DB, unit test for logic |
| Mocking the framework (Route, HttpContext) | Testing at wrong level            | Use functional tests via `@japa/api-client`     |
| Test name describes implementation         | Testing methods, not behavior     | Rename: "calculates shipping cost for express"  |

## Test Levels in AdonisJS

### Acceptance Tests — API (`@japa/api-client`)

```typescript
// tests/functional/ — exercises full HTTP stack, JSON APIs
test('user registration flow', async ({ client }) => {
  const response = await client.post('/register').json({
    email: 'new@example.com',
    password: 'secure-password',
    name: 'New User',
  });
  response.assertStatus(201);
});
```

### Acceptance Tests — Browser (`@japa/browser-client`)

```typescript
// tests/browser/ — exercises rendered pages via Playwright
test('user can register through the form', async ({ visit }) => {
  const page = await visit('/register');
  await page.getByLabel('Email').fill('new@example.com');
  await page.getByLabel('Password').fill('secure-password');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.assertPath('/dashboard');
});
```

```typescript
// With class-based page object (= GOOS Page Object)
import { RegisterPage } from '../pages/register_page.js';

test('user can register through the form', async ({ visit }) => {
  const page = await visit(RegisterPage);
  await page.fillRegistration('new@example.com', 'secure-password');
  await page.submit();
  await page.assertRegistered();
});
```

See [acceptance-tests.md](acceptance-tests.md) for complete reference including page objects, Playwright best practices, and walking skeleton examples for all app types.

### Integration Tests

```typescript
// tests/integration/ — tests real DB interactions
test('user model hashes password on save', async ({ assert }) => {
  const user = await User.create({
    email: 'test@example.com',
    password: 'plain-text',
    name: 'Test',
  });
  assert.notEqual(user.password, 'plain-text');
});
```

### Unit Tests

```typescript
// tests/unit/ — isolated with container.swap
test('pricing service applies discount', async ({ assert }) => {
  const pricing = new PricingService();
  const result = pricing.applyDiscount(100, 'SAVE20');
  assert.equal(result, 80);
});
```

## Ports & Adapters in AdonisJS

```
┌─────────────────────────────────────────────────────┐
│  Acceptance Tests                                   │
│  API: @japa/api-client | Browser: @japa/browser-client  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Routes + Controllers (HTTP Adapter)          │  │
│  │  ┌───────────────────────────────────┐        │  │
│  │  │  Views (Edge/Inertia) | JSON      │        │  │
│  │  ├───────────────────────────────────┤        │  │
│  │  │  Services (Domain Logic / Ports)  │        │  │
│  │  │  ┌───────────────────────────┐    │        │  │
│  │  │  │  Models (Persistence)     │    │        │  │
│  │  │  │  Adapters (External APIs) │    │        │  │
│  │  │  └───────────────────────────┘    │        │  │
│  │  └───────────────────────────────────┘        │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

- **Controllers**: Thin HTTP adapters — parse request, call service, format response
- **Services**: Domain logic, injected via `@inject()`, swappable in tests
- **Models**: Lucid ORM for persistence
- **Adapters**: Your wrapper classes around third-party APIs the framework doesn't wrap (PaymentGateway, GeocodingService). For email/file storage, use AdonisJS's built-in services and fakes.
