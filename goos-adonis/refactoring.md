# Refactor Candidates

After the TDD cycle, with all tests GREEN, look for these opportunities.

**Golden rule: never refactor while RED.** Get to GREEN first.

## General

- **Duplication** → Extract function/class
- **Long methods** → Break into private helpers (keep tests on public interface)
- **Shallow modules** → Combine or deepen (see [deep-modules.md](deep-modules.md))
- **Feature envy** → Move logic to where data lives
- **Primitive obsession** → Introduce value objects

## AdonisJS-Specific

- **Fat controllers** → Extract domain logic into services, inject with `@inject()`
- **Model with business logic** → Move complex logic to a service layer; keep models focused on persistence and relationships
- **Duplicated validation** → Extract to shared validator classes or VineJS schemas
- **Direct third-party calls** → Wrap in adapter services so they're swappable in tests
- **Inline queries** → Extract to query scopes on models or dedicated query services
- **Repeated test setup** → Extract to `group.each.setup()` or shared helper functions

## How to Refactor Safely

1. All tests are GREEN
2. Make one small change
3. Run tests — still GREEN?
4. Repeat

If a refactor breaks a test but behavior hasn't changed, the test was testing implementation. Fix the test (or delete it and write a better one), then continue.
