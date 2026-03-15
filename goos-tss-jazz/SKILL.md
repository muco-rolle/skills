---
name: goos-tss-jazz
description: Use when building or testing TanStack Start + Jazz applications with test-driven development, writing acceptance tests with Playwright E2E, component integration tests with Vitest Browser Mode, designing Jazz schemas and permissions, optimizing Jazz performance, building Jazz React UIs, mocking with MSW for external APIs, using setupJazzTestSync for Jazz sync, or applying outside-in TDD workflow to collaborative local-first apps
---

# GOOS-Style TDD for TanStack Start + Jazz

## Philosophy

**Core principle**: Tests verify behavior through rendered UI, not implementation details. Components can change entirely; tests shouldn't.

**Jazz eliminates the HTTP layer for collaborative data.** Traditional apps mock APIs with MSW — Jazz apps use real in-memory sync via `setupJazzTestSync()`. This creates a **two-boundary testing model**:

1. **Jazz sync boundary** — collaborative data flows through in-memory sync nodes. **Never mock jazz-tools.** Use `setupJazzTestSync()` + `createJazzTestAccount()` for authentic multi-user testing.
2. **HTTP boundary** — external APIs (payment providers, email services, etc.) are mocked with MSW, same as any TanStack Start app.

See [mocking.md](references/mocking.md) for the two-boundary strategy and [tests.md](references/tests.md) for examples.

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

| GOOS Principle    | TanStack Start + Jazz Pattern                                              |
| ----------------- | -------------------------------------------------------------------------- |
| Walking Skeleton  | Playwright E2E test — thinnest slice proving build/deploy/test works       |
| Acceptance Test   | Playwright E2E — feature-level, exercises the whole system end-to-end      |
| Integration Test  | Vitest Browser Mode + JazzTestProvider — components with real Jazz sync    |
| Page Objects      | Playwright Page Object Model classes                                       |
| Unit Test         | Vitest (Node) for pure functions — validators, services, utilities         |
| Mock Objects      | `setupJazzTestSync()` for Jazz data; MSW for external HTTP APIs            |
| Adapter Layer     | OpenAPI client wrapping external APIs (only mock at this boundary)         |
| Ports & Adapters  | Routes → Pages → Hooks (useCoState) → CoValues → Jazz Sync ← MSW for HTTP|
| Multi-User        | `createJazzTestAccount()` + `setActiveAccount()` + reload CoValues         |
| Test Data Builder | Factory functions for CoValues with typed overrides                         |
| Tell, Don't Ask   | Pages delegate to hooks; hooks encapsulate CoValue mutations + groups      |
| Listen to Tests   | Difficulty testing = design feedback                                       |

## Workflow

### 1. Planning

Before writing any code:

- [ ] Confirm with user what interface changes are needed
- [ ] Identify which data is **collaborative** (Jazz CoValues) vs **external HTTP** (MSW)
- [ ] Plan Jazz schema: CoValue types, relationships, permissions groups
- [ ] Determine test levels: Playwright E2E (acceptance/walking skeleton), Vitest Browser Mode (component integration), Vitest Node (unit)
- [ ] Confirm which behaviors to test (prioritize — you can't test everything)
- [ ] Identify opportunities for [deep modules](references/deep-modules.md)
- [ ] Design interfaces for [testability](references/interface-design.md)
- [ ] List behaviors to test (not implementation steps)
- [ ] Get user approval on the plan

### 2. Walking Skeleton (Playwright E2E)

Write ONE failing Playwright E2E test → minimal implementation → GREEN. This is your walking skeleton — the thinnest end-to-end slice that proves build/deploy/test infrastructure works. It is NOT an acceptance test itself; it's the infrastructure that enables writing acceptance tests.

```
RED: page.goto('/route') → expect → GREEN: Route → Page → Hook → CoValue → Jazz Sync
```

### 3. Feature Loop (Acceptance → Implementation)

For each feature, start with a failing Playwright acceptance test (outer loop), then drive implementation with Vitest Browser Mode component tests and Vitest Node unit tests (inner loops). See [acceptance-tests.md](references/acceptance-tests.md).

```
Outer:     RED: Playwright E2E acceptance test (exercises whole system)
Inner:     [VBM component tests + Vitest unit tests drive implementation]
Outer:     GREEN: Playwright acceptance test passes
```

### 4. Incremental Loop

For each remaining behavior:

```
RED:   Write next test → fails
GREEN: Minimal code to pass → passes
```

Rules: One test at a time. Only enough code to pass current test. Don't anticipate future tests.

### 5. Refactor

After all tests pass, look for [refactor candidates](references/refactoring.md). Never refactor while RED.

## Per-Cycle Checklist

```
[ ] Test describes behavior, not implementation
[ ] Test uses rendered UI or public API only
[ ] Test would survive internal refactor
[ ] Jazz sync uses setupJazzTestSync() — never vi.mock('jazz-tools')
[ ] External APIs mocked with MSW at HTTP boundary
[ ] CoValues reloaded after setActiveAccount() in multi-user tests
[ ] Code is minimal for this test
[ ] No speculative features added
```

## Common Mistakes

| Mistake                                          | Fix                                                            |
| ------------------------------------------------ | -------------------------------------------------------------- |
| Mocking jazz-tools with vi.mock()                | Use setupJazzTestSync() for real in-memory sync                |
| Not reloading CoValues after setActiveAccount()  | Always `.load(id)` after switching accounts                    |
| Asserting on CoValue internals (.$jazz.id)       | Assert on rendered UI — what the user sees                     |
| Mocking hooks or query internals                 | Use MSW for external APIs; Jazz sync for collaborative data    |
| Testing implementation instead of behavior       | Name tests by feature: "displays task after creation"          |
| Skipping the failing test step                   | Watch it fail first — verify diagnostics are useful            |
| Fat pages with all logic inline                  | Extract hooks encapsulating CoValue creation + group setup     |
| Using RTL instead of Vitest Browser Mode         | Use `vitest-browser-react` — tests run in real browser         |
| Writing all tests before implementation          | Vertical slices: one RED→GREEN cycle at a time                 |
| Using Account as CoValue owner                   | Always use Groups — `{ owner: group }` or inline creation      |

## Jazz Domain Quick Reference

### Schema Design
CoValue types: CoMap, CoList, CoFeed, CoRecord, CoPlainText, CoRichText, FileStream, ImageDefinition. Use `z.*` for scalar fields, `co.*` for collaborative types. Relationships via direct references. See [schema-design.md](references/schema-design.md).

### Permissions & Security
Groups own CoValues. Roles: admin > manager > writer > reader > writeOnly. Invite flows via `createInviteLink()` + `useAcceptInvite()`. Nested CoValues inherit permissions. See [permissions-security.md](references/permissions-security.md).

### Performance
Initialize crypto (Node-API or WASM). Use `sameAsContainer` for tightly coupled data. Keep group depth under 3-4 levels. Thin selectors + `useMemo`. See [performance.md](references/performance.md).

### UI Development
`JazzReactProvider` for setup. `useCoState` / `useAccount` for reactive data. `<Image />` for media. Auth via Passkey, BetterAuth, or Clerk. See [ui-development.md](references/ui-development.md).

## Detailed References

- **[goos-principles.md](references/goos-principles.md)**: Complete GOOS book concepts organized by part
- **[acceptance-tests.md](references/acceptance-tests.md)**: 3-level testing strategy with Jazz sync + multi-user patterns
- **[jazz-tss-testing-patterns.md](references/jazz-tss-testing-patterns.md)**: GOOS → TSS+Jazz concept mapping, outside-in flow, test data builders
- **[mocking.md](references/mocking.md)**: Two-boundary model — Jazz sync vs MSW
- **[tests.md](references/tests.md)**: Good vs bad Jazz+TSS test examples
- **[deep-modules.md](references/deep-modules.md)**: Deep vs shallow module design for Jazz hooks
- **[interface-design.md](references/interface-design.md)**: Designing testable Jazz components and hooks
- **[refactoring.md](references/refactoring.md)**: Post-TDD refactor candidates for Jazz apps
- **[schema-design.md](references/schema-design.md)**: CoValue types, relationships, migrations, permission configuration
- **[permissions-security.md](references/permissions-security.md)**: Groups, roles, invites, cascading permissions
- **[performance.md](references/performance.md)**: Crypto init, data model efficiency, UI rendering
- **[ui-development.md](references/ui-development.md)**: React hooks, providers, media, auth patterns
