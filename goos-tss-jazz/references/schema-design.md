# Jazz Schema Design

## CoValue Types

| TypeScript Type | CoValue | Use Case |
|----------------|---------|----------|
| `object` | **CoMap** | Struct-like objects with predefined keys |
| `Record<string, T>` | **CoRecord** | Dict-like objects with arbitrary string keys |
| `T[]` | **CoList** | Ordered lists |
| `T[]` (append-only) | **CoFeed** | Session-based append-only lists |
| `string` | **CoPlainText/CoRichText** | Collaborative text editing |
| `Blob \| File` | **FileStream** | File storage |
| `Blob \| File` (image) | **ImageDefinition** | Image storage |
| `number[] \| Float32Array` | **CoVector** | Embeddings/vector data |
| `T \| U` (discriminated) | **DiscriminatedUnion** | Mixed-type lists |

Use `co.account()` and `co.profile()` for user accounts and profiles.

## Schema Definition

```ts
const Author = co.map({
  name: z.string()
});

const Post = co.map({
  title: z.string(),
  content: co.richText(),
});
```

**Key:** `z.*` for primitive types (from `jazz-tools`, NOT `zod`). `co.*` for collaborative data types.

## Choosing Scalar vs Collaborative Types

### Scalar Types (`z.*`)

Use when: full replacement updates, no collaborative editing, single writer, raw performance critical.

```ts
const myCoValue = co.map({
  title: z.string(),        // Replace entire title
  coords: z.object({ lat: z.number(), lon: z.number() }),  // Replace as unit
});
```

### Collaborative Types (`co.*`)

Use when: multiple users edit simultaneously, surgical edits needed, edit history valuable.

```ts
const myCoVal = co.map({
  content: co.richText(),   // Multiple editors
  items: co.list(Item),     // Add/remove individual items
});
```

## Relationships

### One-Directional Reference

```ts
const Post = co.map({
  title: z.string(),
  author: Author,  // Like a foreign key
});
```

### Recursive/Forward References

```ts
const Author = co.map({
  name: z.string(),
  get posts() { return co.list(Post); },  // Deferred evaluation
});
```

### Inverse Relationships

Jazz doesn't create inferred inverse relationships. Explicitly add both sides for bidirectional traversal.

### Set-Like Collections

CoLists allow duplicates. For uniqueness, use CoRecord keyed on ID:

```ts
const Author = co.map({
  name: z.string(),
  posts: co.record(z.string(), Post),
});
```

## Permissions at Schema Level

### `withPermissions()`

```ts
const Dog = co.map({
  name: z.string(),
}).withPermissions({
  onInlineCreate: "sameAsContainer",
});

const Person = co.map({
  pet: Dog,
}).withPermissions({
  default: () => Group.create().makePublic(),
});
```

**`onInlineCreate` options:**
- `"extendsContainer"` (default) — new group inheriting from container owner
- `"sameAsContainer"` — reuse container's owner (performance optimization, USE WITH CAUTION)
- `"newGroup"` — new group with active account as admin
- `{ extendsContainer: "reader" }` — override container owner's role
- Custom callback

**CAUTION with `sameAsContainer`:** Child and parent share the same group. Changes to child group affect parent and all siblings. Do NOT use if you may need granular permissions later.

## Schema Evolution

1. **Add version field** to schema
2. **Only add fields, never remove**
3. **Never change existing field types**
4. **Make new fields optional**
5. **Use `withMigration()` carefully** — runs on every load

```ts
const Post = co.map({
  version: z.number().optional(),
  title: z.string(),
  content: co.richText(),
  tags: z.array(z.string()).optional(),
}).withMigration((post) => {
  if (post.version === 2) return;
  if (!post.$jazz.has('tags')) {
    post.$jazz.set('tags', []);
  }
  post.$jazz.set('version', 2);
});
```

## Data Discovery

CoValues are only addressable by unique ID. Standard pattern:
- Attach 'root' CoValue to user account (entry point to the data graph)
- For global roots: hardcode ID or use environment variable
- Build graph from root via references

## Common Patterns

### Collaborative Task List

```ts
const Task = co.map({
  title: z.string(),
  description: co.richText(),
  completed: z.boolean(),
  assignees: co.list(User),
});

const Project = co.map({
  name: z.string(),
  tasks: co.list(Task),
});
```

### User Profile with Settings

```ts
const UserRoot = co.map({
  theme: z.literal(['light', 'dark']),
});

const UserProfile = co.profile({
  name: z.string(),
  bio: co.richText(),
});

const UserAccount = co.account({
  profile: UserProfile,
  root: UserRoot,
}).withMigration((account, creationProps) => {
  if (!account.has('root')) {
    account.$jazz.set('root', UserRoot.create({ theme: 'light' }));
  }
  if (!account.has('profile')) {
    account.$jazz.set('profile', UserProfile.create({
      name: creationProps?.name ?? 'Anonymous User',
      bio: '',
    }));
  }
});
```

## Design Checklist

- [ ] Identify which data needs collaborative editing
- [ ] Map permissions requirements to CoValue containers
- [ ] Choose scalar vs collaborative types appropriately
- [ ] Define explicit relationships (both directions if needed)
- [ ] Plan root CoValue attachment strategy
- [ ] Add version field for future evolution
- [ ] Set default permissions at schema level
- [ ] Handle recursive references with getters
- [ ] Ensure account migration initializes profile and root

## Anti-Patterns

- Don't mix permissions in single CoValue — use separate containers
- Don't rely on inferred inverse relationships — explicitly define both sides
- Don't change field types in schema updates
- Don't write expensive migrations — they run on every load
- Don't import `z` from `zod` — always use `import { z } from 'jazz-tools'`
