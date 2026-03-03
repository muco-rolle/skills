# Deep Modules

From "A Philosophy of Software Design," adapted for TanStack Start + React.

**Deep module** = small interface + lots of implementation

```
┌─────────────────────┐
│   Small Interface   │  ← Few exports, simple params
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
│       Large Interface           │  ← Many exports, complex params
├─────────────────────────────────┤
│  Thin Implementation            │  ← Just passes through
└─────────────────────────────────┘
```

## TanStack Start Example

### Shallow: CRUD Wrapper Hook (avoid)

```typescript
// Every function is a thin pass-through to the query client — adds no value
export function usePosts() {
  const list = leapaQueryClient.useQuery('get', '/posts')
  const create = leapaQueryClient.useMutation('post', '/posts')
  const update = leapaQueryClient.useMutation('put', '/posts/{id}')
  const remove = leapaQueryClient.useMutation('delete', '/posts/{id}')

  return {
    posts: list.data,
    isLoading: list.isPending,
    createPost: create.mutateAsync,
    updatePost: update.mutateAsync,
    deletePost: remove.mutateAsync,
    createError: create.error,
    updateError: update.error,
    deleteError: remove.error,
  }
}
```

Many exports, no real logic — callers might as well use the query client directly.

### Deep: Domain Logic Behind Simple Interface

```typescript
export function useLogin() {
  const navigate = useNavigate()
  const mutation = userQueryClient.useMutation('post', '/auth/admin/login')

  async function login(data: LoginInput) {
    // Hides: input validation, credential encryption, API call,
    // token storage, error parsing, and navigation
    const validated = loginSchema.parse(data)
    const encrypted = encryptCredentials(validated)
    const result = await mutation.mutateAsync({ body: encrypted })
    storeAuthToken(result.token)
    navigate({ to: '/dashboard' })
    return result
  }

  return {
    login,
    isPending: mutation.isPending,
    error: mutation.error ? parseApiError(mutation.error) : null,
  }
}
```

Three exports, simple return types — but encapsulates validation, encryption, API interaction, token management, error parsing, and navigation. Callers don't need to know about any of it.

## Design Questions

When designing a hook or service, ask:

- Can I reduce the number of exports?
- Can I simplify the parameters?
- Can I hide more complexity inside?
- Is my hook a thin pass-through, or does it provide real abstraction?
