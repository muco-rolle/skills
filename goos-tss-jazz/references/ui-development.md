# Jazz React UI Development

## Core Setup: JazzReactProvider

```tsx
import { JazzReactProvider } from "jazz-tools/react";

function App({ children }) {
  return (
    <JazzReactProvider
      sync={{ peer: "wss://cloud.jazz.tools/?key=..." }}
      AccountSchema={MyAccount}
    >
      {children}
    </JazzReactProvider>
  );
}
```

**Key props:**
- `sync.peer` — Jazz Cloud or self-hosted sync server
- `sync.when` — `"always"`, `"signedUp"`, or `"never"`
- `AccountSchema` — your custom account schema
- `enableSSR` — for Next.js/SSR frameworks

## Reactive Data Hooks

### Standard Hooks

- **`useCoState(Schema, id, options?)`** — loads any CoValue by ID. Re-renders on changes.
- **`useCoStates(Schema, ids, options?)`** — loads multiple CoValues by IDs.
- **`useAccount(Schema?, options?)`** — retrieves current account with optional deep loading.

### Suspense Hooks

- **`useSuspenseCoState`** — integrates with React Suspense boundaries
- **`useSuspenseCoStates`** — multiple CoValues with Suspense
- **`useSuspenseAccount`** — account with Suspense

### Hook Options

All reactive hooks accept:
- **`resolve`** — query to control loading depth
- **`select`** — selector function (keep lightweight, use `useMemo` for heavy work)
- **`equalityFn`** — custom equality check to prevent unnecessary re-renders

```tsx
const project = useCoState(Project, projectId, {
  resolve: { tasks: { $each: true } },
  select: (p) => ({ name: p.name, taskCount: p.tasks.length }),
  equalityFn: (a, b) => a.name === b.name && a.taskCount === b.taskCount,
});
```

### Error Handling

```tsx
import { getJazzErrorType } from "jazz-tools/react";

// In ErrorBoundary
const errorType = getJazzErrorType(error);
// "unauthorized" | "deleted" | "unavailable"
```

## Working with Data Types

### CoMap / CoRecord
- **Read**: `user.name` (like standard JS object)
- **Write**: `user.$jazz.set('name', 'Alice')`, `user.$jazz.delete('key')`

### CoList
- **Read**: `list[0]`, `list.map(...)`, `list.forEach(...)`
- **Write**: `list.$jazz.push(item)`, `list.$jazz.splice(...)`, `list.$jazz.remove(index)`

### CoText
- **Read**: `text.toString()` or use directly in template
- **Write**: `text.insertAfter(index, str)`, `text.deleteRange({ from, to })`, `text.$jazz.applyDiff(newText)`

### CoFeed
- **Read**: `Object.values(feed.perAccount).flatMap(f => Array.from(f.all))`
- **Write**: `feed.$jazz.push(item)` (append-only)

## Other Hooks

- **`usePasskeyAuth`** — custom passkey auth UI (signUp, logIn methods)
- **`usePassphraseAuth`** — wordlist-based login/recovery
- **`useIsAuthenticated`** — boolean auth check
- **`useAgent`** — current agent (detect guests: `agent.$type$ !== "Account"`)
- **`useLogOut`** — returns logout function
- **`useSyncConnectionStatus`** — sync connection status

## Image Handling

### Display

```tsx
import { Image } from "jazz-tools/react";

<Image imageId={photo.$jazz.id} width={600} alt="Product" />
<Image imageId={photo.$jazz.id} loading="lazy" />
```

### Create

```ts
import { createImage } from "jazz-tools/media";

const image = await createImage(file, {
  owner: group,
  placeholder: "blur",
  maxSize: 2048,
});
```

## Authentication Patterns

### Passkey (Built-in)

```tsx
import { PasskeyAuthBasicUI } from "jazz-tools/react";
// Quick prototyping — use usePasskeyAuth for custom UI
```

### BetterAuth

```tsx
import { AuthProvider } from "jazz-tools/better-auth/auth/react";
import { betterAuthClient } from "@/lib/auth-client";

<JazzReactProvider sync={{ peer: "wss://..." }}>
  <AuthProvider betterAuthClient={betterAuthClient}>
    {children}
  </AuthProvider>
</JazzReactProvider>
```

### Clerk

```tsx
import { JazzReactProviderWithClerk } from "jazz-tools/react";
import { useClerk } from "@clerk/clerk-react";

const clerk = useClerk();
<JazzReactProviderWithClerk clerk={clerk} sync={{ peer: "wss://..." }}>
  {children}
</JazzReactProviderWithClerk>
```

## Collaboration & Invites

```ts
import { createInviteLink, useAcceptInvite } from "jazz-tools/react";

// Create
const link = createInviteLink(project, "writer");

// Accept
useAcceptInvite({
  invitedObjectSchema: Project,
  onAccept: async (projectId) => {
    const project = await Project.load(projectId);
    me.root.projects.$jazz.push(project);
  },
});
```

## Advanced Patterns

### Form Handling
- **Live updates**: Mutate CoValues directly in `onChange` handlers
- **Partial schemas**: Use `.partial()` for incremental form building
- **Save/Cancel**: Use `unstable_branch` in `useCoState` for isolated editing

### Developer Tools

```tsx
import { JazzInspector } from "jazz-tools/react";
<JazzInspector /> // Visual CoValue auditing
```

## Troubleshooting

### "Data not appearing"
1. Check `$isLoaded` before rendering
2. Use `resolve` for nested data loading
3. Ensure component is within `<JazzReactProvider />`

### "Infinite re-render loops"
1. Ensure `select` function is stable
2. Move expensive computations to `useMemo`
3. Use `equalityFn` to prevent unnecessary updates

### "Reactivity not triggering"
1. Use `.$jazz.set()` / `.$jazz.push()` — NOT direct assignment
2. Nested scalar updates don't trigger parent change unless parent property is replaced
