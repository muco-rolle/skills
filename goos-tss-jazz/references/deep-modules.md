# Deep Modules

From "A Philosophy of Software Design," adapted for TanStack Start + Jazz.

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

## Jazz + TanStack Start Examples

### Shallow: Hook that Just Wraps useCoState (avoid)

```typescript
// Every function is a thin pass-through — adds no value
export function useTasks(listId: string) {
  const tasks = useCoState(TaskList, listId)

  return {
    tasks: tasks,
    isLoaded: tasks?.$isLoaded ?? false,
  }
}
```

Callers might as well use `useCoState` directly — the hook adds nothing.

### Deep: Hook Encapsulating CoValue Creation + Group Setup + Permissions

```typescript
export function useCreateProject() {
  const { me } = useAccount(MyAccount)
  const [isPending, setIsPending] = useState(false)

  async function createProject(data: { name: string; members: Account[] }) {
    setIsPending(true)
    try {
      // Hides: group creation, member invitations, permission setup,
      // CoValue creation, root attachment, and error handling
      const group = Group.create()
      for (const member of data.members) {
        group.addMember(member, 'writer')
      }
      const project = Project.create(
        {
          name: data.name,
          tasks: TaskList.create([], { owner: group }),
        },
        { owner: group }
      )
      me.root.projects.$jazz.push(project)
      return project
    } finally {
      setIsPending(false)
    }
  }

  return { createProject, isPending }
}
```

Two exports, simple return type — but encapsulates group creation, member management, nested CoValue creation, root attachment, and error handling. Callers don't need to know about any of it.

### Deep: Multi-User Sharing Hook

```typescript
export function useShareProject(projectId: string) {
  const project = useCoState(Project, projectId)

  async function share(email: string, role: 'reader' | 'writer') {
    // Hides: invite link generation, role validation,
    // group membership management, notification
    if (!project?.$isLoaded) throw new Error('Project not loaded')
    const inviteLink = createInviteLink(project, role)
    await sendInviteEmail(email, inviteLink)
    return inviteLink
  }

  return { share, isLoaded: project?.$isLoaded ?? false }
}
```

## Design Questions

When designing a hook or service, ask:

- Can I reduce the number of exports?
- Can I simplify the parameters?
- Can I hide more complexity inside (group setup, permission logic, CoValue wiring)?
- Is my hook a thin pass-through to `useCoState`, or does it provide real abstraction?
- Does the hook encapsulate the full CoValue lifecycle (create + configure group + attach to graph)?
