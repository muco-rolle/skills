# Refactor Candidates

After the TDD cycle, with all tests GREEN, look for these opportunities.

**Golden rule: never refactor while RED.** Get to GREEN first.

## General

- **Duplication** → Extract function/component/hook
- **Long methods** → Break into private helpers (keep tests on public interface)
- **Shallow modules** → Combine or deepen (see [deep-modules.md](deep-modules.md))
- **Feature envy** → Move logic to where data lives
- **Primitive obsession** → Introduce Zod schemas or value types

## TanStack Start-Specific

- **Fat pages** → Extract domain logic into action hooks (`useLogin`, `useCreateMerchant`); keep pages presentational
- **Inline API calls** → Move to action hooks using `openapi-react-query` clients; pages shouldn't call `lclient` directly
- **Duplicated MSW handlers** → Extract to shared handler factories in `src/test/msw-handlers.ts`
- **Repeated test wrappers** → Consolidate into shared `TestWrapper` with QueryClient + ChakraProvider
- **Business logic in components** → Extract to pure service functions (encryption, parsing, validation)
- **God hooks** → Split `useAuth` into focused hooks (`useLogin`, `useLogout`, `useProfile`)
- **Direct fetch calls** → Route through OpenAPI typed clients so MSW can intercept
- **Duplicated error handling** → Extract shared `parseApiError()` utility
- **Inline Zod schemas** → Move to `src/app/{domain}/validators/` for reuse and testability

## How to Refactor Safely

1. All tests are GREEN
2. Make one small change
3. Run tests — still GREEN?
4. Repeat

If a refactor breaks a test but behavior hasn't changed, the test was testing implementation. Fix the test (or delete it and write a better one), then continue.
