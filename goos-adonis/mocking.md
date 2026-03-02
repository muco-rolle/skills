# Mocking in AdonisJS

## When to Mock

Mock at **system boundaries** only — things you don't control:

- External APIs without framework support (Stripe, Twilio, geocoding) — use `container.swap()` with custom adapters
- Email, file storage — use AdonisJS built-in fakes (`mail.fake()`, `drive.fake()`)
- Payment processing
- Time / randomness

## When NOT to Mock

- **Your own domain services** collaborating with each other — let them call through the real container
- **Lucid models** — use a real test database
- **Framework internals** (Route, HttpContext, middleware) — use functional tests via `@japa/api-client`
- **Value objects / DTOs** — use real instances

If you're tempted to mock your own service, ask: should this be a functional test instead?

## Primary Mechanism: `container.swap()`

AdonisJS IoC container lets you replace any injectable service with a fake.

```typescript
test.group('Checkout', (group) => {
  group.each.setup(() => {
    app.container.swap(PaymentGateway, () => ({
      async charge(amount: number, token: string) {
        return { id: 'fake-charge-id', status: 'succeeded' }
      },
    }))
  })

  group.each.teardown(() => {
    app.container.restore(PaymentGateway)
  })

  test('processes payment for order', async ({ client }) => {
    const user = await UserFactory.create()
    const response = await client
      .post('/checkout')
      .loginAs(user)
      .json({ items: [{ productId: 1, quantity: 2 }], token: 'tok_test' })

    response.assertStatus(200)
    response.assertBodyContains({ status: 'succeeded' })
  })
})
```

Always restore in teardown to prevent test pollution.

## Spy Pattern: Recording Fakes

When you need to verify a call was made (e.g., "did we geocode the address?"), use a recording fake:

```typescript
class FakeGeocodingService {
  geocoded: string[] = []

  async geocode(address: string) {
    this.geocoded.push(address)
    return { lat: 40.7128, lng: -74.006 }
  }
}

test.group('Order Placement', (group) => {
  let fakeGeocoding: FakeGeocodingService

  group.each.setup(() => {
    fakeGeocoding = new FakeGeocodingService()
    app.container.swap(GeocodingService, () => fakeGeocoding)
  })

  group.each.teardown(() => {
    app.container.restore(GeocodingService)
  })

  test('geocodes shipping address on order placement', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await client.post('/orders').loginAs(user).json({
      items: [{ productId: 1, quantity: 2 }],
      shippingAddress: '123 Main St, New York, NY',
    })

    assert.lengthOf(fakeGeocoding.geocoded, 1)
    assert.equal(fakeGeocoding.geocoded[0], '123 Main St, New York, NY')
  })
})
```

This is preferable to Sinon spies for most cases — the recording fake is explicit, typed, and easy to understand.

## SDK-Style Adapters

Design adapters with specific methods per operation. Each method returns a predictable shape, making fakes trivial.

```typescript
// GOOD: Each method is independently mockable
@inject()
export default class StripeAdapter {
  async chargeCard(amount: number, token: string) {
    // Real Stripe call
  }

  async refund(chargeId: string) {
    // Real Stripe call
  }
}

// Fake is simple — one return value per method
app.container.swap(StripeAdapter, () => ({
  async chargeCard() { return { id: 'ch_fake', status: 'succeeded' } },
  async refund() { return { id: 're_fake', status: 'refunded' } },
}))
```

```typescript
// BAD: Generic wrapper requires conditional mock logic
export default class StripeAdapter {
  async request(method: string, path: string, data?: any) { /* ... */ }
}

// Mock must inspect args to return different shapes — fragile
app.container.swap(StripeAdapter, () => ({
  async request(method: string, path: string) {
    if (path.includes('charges')) return { id: 'ch_fake' }
    if (path.includes('refunds')) return { id: 're_fake' }
  },
}))
```

## When Sinon Is Still Useful

- **Faking timers**: `sinon.useFakeTimers()` for time-dependent logic
- **Complex spy behavior**: When you need to verify call order across multiple boundaries
- **Stubbing individual methods** on an object you partially want real

Keep Sinon usage minimal. If you find yourself reaching for it often, consider whether your design could be improved to make simple fakes sufficient.

## AdonisJS Built-In Fakes

AdonisJS provides test fakes for services it already wraps — no custom adapter needed:

```typescript
// Email — use mail.fake() instead of building a custom adapter
import mail from '@adonisjs/mail/services/main'

test.group('Registration', (group) => {
  group.each.setup(() => mail.fake())
  group.each.teardown(() => mail.restore())

  test('sends welcome email on registration', async ({ client }) => {
    await client.post('/register').json({
      name: 'Alice',
      email: 'alice@test.com',
      password: 'secure-password',
    })

    mail.mails.assertSent((message) => {
      return message.to.includes('alice@test.com')
        && message.subject === 'Welcome, Alice!'
    })
  })
})
```

Use `container.swap()` with custom adapters only for services the framework doesn't wrap (payment gateways, geocoding, domain-specific APIs).

## Mocking in Browser Tests

Browser tests (`@japa/browser-client`) have two mocking layers:

### Server-Side: `container.swap()` (Same as API Tests)

Works identically — replace services your code calls during the request. Use for payment gateways, email services, external APIs, etc.

```typescript
test.group('Checkout', (group) => {
  group.each.setup(() => {
    app.container.swap(PaymentGateway, () => ({
      async charge() { return { id: 'fake-id', status: 'succeeded' } },
    }))
  })

  group.each.teardown(() => {
    app.container.restore(PaymentGateway)
  })

  test('user completes checkout', async ({ visit }) => {
    const page = await visit('/checkout')
    await page.getByRole('button', { name: 'Pay now' }).click()
    await page.assertTextContains('body', 'Payment successful')
  })
})
```

### Client-Side Network: `page.route()`

Intercept XHR/fetch requests the browser makes — useful for external scripts, analytics, or third-party API calls initiated client-side.

```typescript
test('dashboard loads without external API', async ({ visit, browserContext }) => {
  // Set up route interception BEFORE navigation
  await browserContext.route('**/api.external-service.com/**', (route) => {
    route.fulfill({ status: 200, body: JSON.stringify({ data: 'mocked' }) })
  })

  const page = await visit('/dashboard')
  await page.assertTextContains('body', 'Dashboard')
})
```

### When to Use Which

- **`container.swap()`**: For services your server-side code calls (adapters, gateways, senders)
- **`page.route()`**: For external requests the browser makes directly (third-party scripts, client-side API calls)

See [tests.md](tests.md) for good vs bad test examples.
