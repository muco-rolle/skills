# Interface Design for Testability

Good interfaces make testing natural. Three principles adapted for TanStack Start + React.

## 1. Accept Dependencies, Don't Create Them

Hooks use query clients mockable via MSW at the network boundary — no need to inject dependencies manually. The key is to keep API calls going through the OpenAPI client so MSW can intercept them.

```typescript
// Testable: API calls go through openapi-react-query client → MSW intercepts
export function useLogin() {
  const mutation = userQueryClient.useMutation('post', '/auth/admin/login')

  async function login(data: LoginInput) {
    const encrypted = encryptCredentials(data)
    return mutation.mutateAsync({ body: encrypted })
  }

  return { login, isPending: mutation.isPending, error: mutation.error }
}

// Hard to test: creates its own fetch — can't intercept with MSW
export function useLogin() {
  async function login(data: LoginInput) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin/login`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return res.json()
  }

  return { login }
}
```

The first version lets MSW handlers control API responses. The second bypasses the client layer entirely.

## 2. Return Results, Don't Produce Side Effects

Hooks and services that return values are easier to test than those that mutate external state.

```typescript
// Testable: pure function returns a result you can assert on
export function parseApiError(error: unknown): { field: string; message: string }[] {
  if (error instanceof AxiosError && error.response?.data?.errors) {
    return error.response.data.errors.map((e: any) => ({
      field: e.path,
      message: e.message,
    }))
  }
  return [{ field: 'root', message: 'An unexpected error occurred' }]
}

// Harder to test: mutates form state as a side effect
export function applyApiErrors(form: UseFormReturn, error: unknown): void {
  const errors = parseApiError(error)
  errors.forEach((e) => form.setError(e.field, { message: e.message }))
}
```

The first version: call it, assert on the return value. The second: construct a form instance, call the method, then inspect mutated state.

## 3. Small Surface Area

Fewer return values from hooks = fewer things to test. Fewer parameters = simpler test setup.

```typescript
// Small surface: focused hook with clear contract
export function useLogin() {
  const mutation = userQueryClient.useMutation('post', '/auth/admin/login')

  return {
    login: (data: LoginInput) => mutation.mutateAsync({ body: encryptCredentials(data) }),
    isPending: mutation.isPending,
    error: mutation.error,
  }
}

// Large surface: hook that does too much
export function useAuth() {
  const loginMutation = userQueryClient.useMutation('post', '/auth/admin/login')
  const logoutMutation = userQueryClient.useMutation('post', '/auth/logout')
  const profileQuery = userQueryClient.useQuery('get', '/auth/profile')
  const refreshMutation = userQueryClient.useMutation('post', '/auth/refresh')

  return {
    login: (data: LoginInput) => loginMutation.mutateAsync({ body: data }),
    logout: () => logoutMutation.mutateAsync({}),
    refresh: () => refreshMutation.mutateAsync({}),
    profile: profileQuery.data,
    isLoading: loginMutation.isPending || profileQuery.isPending,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    isAuthenticated: !!profileQuery.data,
  }
}
```

The first version encapsulates one concern. The second leaks multiple responsibilities — and every test must set up MSW handlers for endpoints it doesn't even care about.
