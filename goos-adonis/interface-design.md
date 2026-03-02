# Interface Design for Testability

Good interfaces make testing natural. Three principles adapted for AdonisJS.

## 1. Accept Dependencies, Don't Create Them

Use `@inject()` so the container provides dependencies — tests can swap them.

```typescript
// Testable: dependencies injected via container
@inject()
export default class OrderService {
  constructor(private paymentGateway: PaymentGateway) {}

  async placeOrder(order: Order) {
    return this.paymentGateway.charge(order.total, order.paymentToken)
  }
}

// Hard to test: creates its own dependency
export default class OrderService {
  async placeOrder(order: Order) {
    const gateway = new StripeGateway(env.get('STRIPE_KEY'))
    return gateway.charge(order.total, order.paymentToken)
  }
}
```

The first version lets tests use `container.swap(PaymentGateway, () => fake)`. The second requires mocking the constructor or the environment.

## 2. Return Results, Don't Produce Side Effects

Services that return values are easier to test than services that mutate state in place.

```typescript
// Testable: returns a result you can assert on
export default class PricingService {
  calculateTotal(items: CartItem[], coupon?: string): PriceBreakdown {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const discount = coupon ? this.resolveDiscount(coupon, subtotal) : 0
    return { subtotal, discount, total: subtotal - discount }
  }
}

// Harder to test: mutates the cart in place
export default class PricingService {
  applyPricing(cart: Cart, coupon?: string): void {
    cart.subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    cart.discount = coupon ? this.resolveDiscount(coupon, cart.subtotal) : 0
    cart.total = cart.subtotal - cart.discount
  }
}
```

The first version: call it, assert on the return value. The second: construct a Cart, call the method, then inspect the mutated Cart — more setup, less clear.

## 3. Small Surface Area

Fewer methods = fewer tests needed. Fewer parameters = simpler test setup.

```typescript
// Small surface: one method, clear input/output
export default class InvoiceGenerator {
  async generate(orderId: number): Promise<Invoice> { /* ... */ }
}

// Large surface: many methods the caller must orchestrate
export default class InvoiceGenerator {
  setOrder(order: Order): void { /* ... */ }
  setCustomer(customer: Customer): void { /* ... */ }
  setLineItems(items: LineItem[]): void { /* ... */ }
  applyTax(rate: number): void { /* ... */ }
  generate(): Invoice { /* ... */ }
}
```

The first version encapsulates the orchestration. The second leaks it to every caller — and every test must replicate it.
