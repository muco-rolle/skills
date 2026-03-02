# Deep Modules

From "A Philosophy of Software Design," adapted for AdonisJS.

**Deep module** = small interface + lots of implementation

```
┌─────────────────────┐
│   Small Interface   │  ← Few methods, simple params
├─────────────────────┤
│                     │
│                     │
│  Deep Implementation│  ← Complex logic hidden
│                     │
│                     │
└─────────────────────┘
```

**Shallow module** = large interface + little implementation (avoid)

```
┌─────────────────────────────────┐
│       Large Interface           │  ← Many methods, complex params
├─────────────────────────────────┤
│  Thin Implementation            │  ← Just passes through
└─────────────────────────────────┘
```

## AdonisJS Example

### Shallow: CRUD Wrapper Service (avoid)

```typescript
// Every method is a thin pass-through to Lucid — adds no value
export default class UserService {
  async findById(id: number) { return User.find(id) }
  async findByEmail(email: string) { return User.findBy('email', email) }
  async create(data: object) { return User.create(data) }
  async update(id: number, data: object) { /* ... */ }
  async delete(id: number) { /* ... */ }
  async list(page: number) { return User.query().paginate(page) }
  async count() { return User.query().count('*') }
}
```

Many methods, no real logic — callers might as well use the model directly.

### Deep: Domain Logic Behind Simple Interface

```typescript
@inject()
export default class OrderFulfillmentService {
  constructor(
    private inventory: InventoryAdapter,
    private shipping: ShippingAdapter,
  ) {}

  /**
   * One method hides: inventory check, reservation, shipping rate
   * calculation, carrier selection, label generation, and
   * inventory deduction.
   */
  async fulfill(orderId: number): Promise<FulfillmentResult> {
    const order = await Order.findOrFail(orderId)
    await this.inventory.reserve(order.items)
    const rate = await this.shipping.bestRate(order.address, order.items)
    const label = await this.shipping.createLabel(rate)
    await this.inventory.deduct(order.items)
    order.status = 'fulfilled'
    order.trackingNumber = label.trackingNumber
    await order.save()
    return { trackingNumber: label.trackingNumber, carrier: rate.carrier }
  }
}
```

One method, simple return type — but encapsulates significant complexity. Callers don't need to know about inventory, shipping, or label generation.

## Design Questions

When designing a service, ask:

- Can I reduce the number of methods?
- Can I simplify the parameters?
- Can I hide more complexity inside?
- Is my service a thin pass-through, or does it provide real abstraction?
