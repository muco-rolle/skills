# Refactor Candidates

After the TDD cycle, with all tests GREEN, look for these opportunities.

**Golden rule: never refactor while RED.** Get to GREEN first.

## General

- **Duplication** → Extract function/component/hook
- **Long methods** → Break into private helpers (keep tests on public interface)
- **Shallow modules** → Combine or deepen (see [deep-modules.md](deep-modules.md))
- **Feature envy** → Move logic to where data lives
- **Primitive obsession** → Introduce CoValue schemas or Zod validators

## Jazz-Specific

- **Inline CoValue creation** → Extract to hooks that encapsulate group setup + CoValue creation + graph attachment
- **Scattered permission logic** → Centralize into permission helper functions or hooks
- **God hooks** → Split `useProject` into focused hooks (`useCreateTask`, `useShareProject`, `useProjectSettings`)
- **Raw Group.create() everywhere** → Extract group factory functions that set up standard role patterns
- **Duplicated account/group setup in tests** → Extract to test factories (`buildTask()`, `buildProject()`)
- **CoValue creation without owner** → Audit and add explicit `{ owner: group }` to prevent accidental private data
- **Mixed Jazz + external API hooks** → Separate hooks for Jazz data operations vs external API calls

## TanStack Start-Specific

- **Fat pages** → Extract domain logic into hooks; keep pages presentational
- **Inline API calls** → Move to hooks using OpenAPI clients; pages shouldn't call APIs directly
- **Duplicated MSW handlers** → Extract to shared handler factories in `src/test/msw-handlers.ts`
- **Repeated test wrappers** → Consolidate into shared JazzTestProvider + MSW setup
- **Business logic in components** → Extract to pure service functions
- **Direct fetch calls** → Route through OpenAPI typed clients so MSW can intercept

## How to Refactor Safely

1. All tests are GREEN
2. Make one small change
3. Run tests — still GREEN?
4. Repeat

If a refactor breaks a test but behavior hasn't changed, the test was testing implementation. Fix the test (or delete it and write a better one), then continue.
