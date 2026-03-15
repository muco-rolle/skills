# Jazz Performance Optimization

## Cryptographic Initialization

In browsers and mobile, the fastest crypto is auto-initialized. On servers and edge runtimes, initialize manually.

### Priority
1. **Node-API Crypto** (fastest) — Node.js, Deno
2. **WASM Crypto** — Edge runtimes

## Minimize Group Extensions

Deep dependency chains slow initial load.

```ts
// SLOW: Inline creation creates dependency chain
const task = await Task.create({
  column: { board: { team: myTeam } }
});

// FASTER: Flat structure with references
const board = await Board.create({ team: myTeam });
const column = await Column.create({ board });
const task = await Task.create({ column });
```

### Use `sameAsContainer`

For data that **always** shares parent permissions:

```ts
import { setDefaultSchemaPermissions } from "jazz-tools";
setDefaultSchemaPermissions({ onInlineCreate: "sameAsContainer" });
```

**CAUTION:** Child and parent share the same group. Changes to child group affect parent and siblings. Do NOT use if you may need granular permissions later.

**Best practice:** Keep group extension depth under 3-4 levels.

## Data Type Trade-offs

### CoText vs `z.string()`
- **CoText:** Character-level collaborative editing (shared documents)
- **`z.string()`:** Atomic updates (names, URLs, IDs, statuses)

### CoMap vs `z.object()`
- **CoMap:** Different users edit different keys simultaneously
- **`z.object()`:** Single logical unit, replaced atomically

```ts
const Sprite = co.map({
  position: z.object({ x: z.number(), y: z.number() }),  // Atomic update
});
```

## UI Performance

### Load What You Need

Prefer **shallow loading** and pass IDs to child components. Each child loads its own data.

```tsx
// SLOW: Top-level deeply loads all items
const myData = useCoState(SomeList, id, {
  resolve: { $each: { content: true } }
});

// FAST: Top-level loads shallowly, children load their own data
const DisplayComponent = ({ itemId }: { itemId: string }) => {
  const item = useCoState(SomeItem, itemId, {
    resolve: { content: true }
  });
  if (!item?.$isLoaded) return <div>Loading...</div>;
  return <div>{item.content}</div>;
};

const MyList = () => {
  const list = useCoState(SomeList, listId);
  if (!list?.$isLoaded) return <div>Loading...</div>;
  return list.map(item => (
    <DisplayComponent key={item.$jazz.id} itemId={item.$jazz.id} />
  ));
};
```

### Avoiding Expensive Selectors (React)

Selector functions run on every CoValue update, even when `equalityFn` prevents re-renders. Keep selectors lightweight.

```tsx
// SLOW: Expensive computation in selector
const project = useCoState(Project, id, {
  select: (p) => ({
    name: p.name,
    sortedTasks: p.tasks.sort(expensiveSort),  // Runs on every update!
  })
});

// FAST: Lightweight selector + useMemo
const project = useCoState(Project, id, {
  select: (p) => ({ name: p.name, tasks: p.tasks }),
  equalityFn: (a, b) => a.name === b.name && a.tasks.length === b.tasks.length,
});

const sortedTasks = useMemo(
  () => project.tasks.sort(expensiveSort),
  [project.tasks]
);
```

## Quick Checklist

- [ ] Crypto initialized (WASM async with loading state, Node-API where supported)
- [ ] `sameAsContainer` for tightly coupled inline objects
- [ ] CoText only for collaborative text, `z.string()` otherwise
- [ ] CoMap only when keys edited independently, `z.object()` otherwise
- [ ] React selectors thin, heavy work in `useMemo`
- [ ] Group extension depth under 3-4 levels
- [ ] Shallow loading with IDs passed to children

## Common Pitfalls

- **Over-CoValueing:** Every string/object as CoText/CoMap bloats sync
- **Synchronous WASM:** Blocks UI on load
- **Deep Nesting:** >4 levels without `sameAsContainer`
- **Heavy Selectors:** Expensive computation inside selector functions
- **Deep loading at top level:** Loading all nested data when only a page is rendered
