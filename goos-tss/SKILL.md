---
name: goos-tss
description: Use when building or testing TanStack Start applications with test-driven development, writing acceptance tests with Playwright, component tests with Vitest Browser Mode, designing hooks and services for testability, mocking APIs with MSW, or applying outside-in TDD workflow
---

# GOOS-Style TDD for TanStack Start

## Philosophy

**Core principle**: Tests verify behavior through rendered UI, not implementation details. Components can change entirely; tests shouldn't.

**Good tests** exercise real components in real browsers (Vitest Browser Mode) or full application flows (Playwright). They describe _what_ the user experiences, not _how_ the code works. A good test reads like a specification — "user can login with valid credentials" tells you exactly what capability exists. These tests survive refactors because they don't care about internal structure.

**Bad tests** mock hooks, spy on query cache internals, or assert on DOM class names. The warning sign: your test breaks when you refactor, but behavior hasn't changed.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Anti-Pattern: Horizontal Slices

**DO NOT write all tests first, then all implementation.** This is "horizontal slicing."

```
WRONG (horizontal):
  RED:   test1, test2, test3, test4, test5
  GREEN: impl1, impl2, impl3, impl4, impl5

RIGHT (vertical / tracer bullet):
  RED→GREEN: test1→impl1
  RED→GREEN: test2→impl2
  RED→GREEN: test3→impl3
```

Each cycle through the inner loop teaches you something about the design. You need that learning before writing the next test.

## The Golden Rule

**Never write new functionality without a failing test.** No exceptions.

## Quick Reference

| GOOS Principle    | TanStack Start Pattern                                                    |
| ----------------- | ------------------------------------------------------------------------- |
| Walking Skeleton  | Playwright E2E test — thinnest slice proving the full stack works end-to-end |
| Acceptance Test   | Playwright (`@playwright/test`) — full app, exercised from outside        |
| Page Objects      | Playwright Page Object Model classes                                      |
| Unit Test         | Vitest (Node) for pure functions — validators, services, utilities        |
| Mock Objects      | MSW request handlers (`http.get()`, `http.post()`)                        |
| Adapter Layer     | OpenAPI client wrapping external APIs (only mock at this boundary)        |
| Ports & Adapters  | Routes → Pages → Action Hooks → Services → OpenAPI Clients               |
| Test Data Builder | Factory functions with typed overrides                                    |
| Tell, Don't Ask   | Pages delegate to action hooks; hooks delegate to services                |
| Listen to Tests   | Difficulty testing = design feedback                                      |

## Workflow

### 1. Planning

Before writing any code:

- [ ] Confirm with user what interface changes are needed
- [ ] Determine test type: Playwright for acceptance tests (outer loop) or Vitest Browser Mode for component tests (inner loop)
- [ ] Confirm which behaviors to test (prioritize — you can't test everything)
- [ ] Identify opportunities for [deep modules](deep-modules.md)
- [ ] Design interfaces for [testability](interface-design.md)
- [ ] List behaviors to test (not implementation steps)
- [ ] Get user approval on the plan

### 2. Tracer Bullet

Write ONE failing Playwright E2E test → minimal implementation → GREEN. This is your walking skeleton — it proves the full stack works end-to-end (route → page → hook → service → API). See [acceptance-tests.md](acceptance-tests.md).

For individual features in an existing app, starting with a Vitest Browser Mode component test is pragmatic — just don't call it an "acceptance test" or "walking skeleton" in the GOOS sense.

```
Walking skeleton / acceptance test (outer loop):
  RED: page.goto('/route') → expect → GREEN: Route → Page → Hook → Service

Component test (inner loop):
  RED: render(<Page />) → expect.element() → GREEN: Component → Hook → MSW
```

### 3. Incremental Loop

For each remaining behavior:

```
RED:   Write next test → fails
GREEN: Minimal code to pass → passes
```

Rules: One test at a time. Only enough code to pass current test. Don't anticipate future tests.

### 4. Refactor

After all tests pass, look for [refactor candidates](refactoring.md). Never refactor while RED.

## Per-Cycle Checklist

```
[ ] Test describes behavior, not implementation
[ ] Test uses rendered UI or public API only
[ ] Test would survive internal refactor
[ ] Only mocking at system boundaries (MSW for APIs)
[ ] Code is minimal for this test
[ ] No speculative features added
```

## Common Mistakes

| Mistake                                       | Fix                                                          |
| --------------------------------------------- | ------------------------------------------------------------ |
| Mocking hooks or query internals              | Use MSW to control API responses; render real components     |
| Testing implementation instead of behavior    | Name tests by feature: "displays error on invalid login"     |
| Skipping the failing test step                | Watch it fail first — verify diagnostics are useful          |
| Fat pages with all logic inline               | Extract action hooks, delegate to services                   |
| Mocking fetch/axios directly                  | Use MSW handlers — decoupled from HTTP client implementation |
| Writing all tests before implementation       | Vertical slices: one RED→GREEN cycle at a time               |
| Using RTL instead of Vitest Browser Mode      | Use `vitest-browser-react` — tests run in real browser       |

## Detailed References

- **[acceptance-tests.md](acceptance-tests.md)**: 3-level testing strategy — Vitest Node, Vitest Browser Mode, Playwright
- **[goos-principles.md](goos-principles.md)**: Complete GOOS book concepts organized by part
- **[tss-testing-patterns.md](tss-testing-patterns.md)**: TanStack Start code patterns with examples
- **[tests.md](tests.md)**: Good vs bad test examples
- **[mocking.md](mocking.md)**: MSW + vi.mock strategy
- **[deep-modules.md](deep-modules.md)**: Deep vs shallow module design
- **[interface-design.md](interface-design.md)**: Designing testable hooks and services
- **[refactoring.md](refactoring.md)**: Post-TDD refactor candidates
