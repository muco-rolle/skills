# Interface Design for Testability

Good interfaces make testing natural. Three principles adapted for TanStack Start + Jazz.

## 1. Dependencies from JazzProvider Context

Jazz hooks get their dependencies from JazzProvider context — no manual injection needed. The key is to use JazzTestProvider in tests for authentic in-memory sync.

```typescript
// Testable: uses useCoState which gets context from JazzProvider/JazzTestProvider
export function useTaskList(listId: string) {
  const tasks = useCoState(TaskList, listId, {
    resolve: { $each: true },
  })
  return { tasks, isLoaded: tasks?.$isLoaded ?? false }
}

// Hard to test: creates its own Jazz context — can't use JazzTestProvider
export function useTaskList(listId: string) {
  // DON'T: manual context setup bypasses test infrastructure
  const ctx = createJazzContext({ peer: 'wss://cloud.jazz.tools' })
  const tasks = ctx.load(TaskList, listId)
  return { tasks }
}
```

The first version works with JazzTestProvider in tests — real in-memory sync, real permissions. The second bypasses the provider entirely.

## 2. Separate Reads from Writes

Hooks that separate data loading (useCoState) from mutations are easier to test independently.

```typescript
// Testable: reads and writes separated
export function useTask(taskId: string) {
  const task = useCoState(Task, taskId)
  return task
}

export function useCompleteTask() {
  return async function completeTask(task: Task) {
    task.$jazz.set('completed', true)
    task.$jazz.set('completedAt', new Date().toISOString())
  }
}

// Harder to test: mixed concerns
export function useTaskWithActions(taskId: string) {
  const task = useCoState(Task, taskId)
  const [error, setError] = useState<string | null>(null)

  async function complete() {
    try {
      task?.$jazz.set('completed', true)
      task?.$jazz.set('completedAt', new Date().toISOString())
      await notifyTeam(task) // side effect mixed in
    } catch (e) {
      setError(e.message)
    }
  }

  async function reassign(userId: string) { /* ... */ }
  async function addComment(text: string) { /* ... */ }
  async function archive() { /* ... */ }

  return { task, complete, reassign, addComment, archive, error }
}
```

The first version: each hook is focused and testable. The second leaks multiple responsibilities — every test must set up Jazz sync for endpoints it doesn't even care about.

## 3. Small Surface Area

Fewer return values from hooks = fewer things to test. Fewer parameters = simpler test setup.

```typescript
// Small surface: focused hook with clear contract
export function useCreateTask(listId: string) {
  const list = useCoState(TaskList, listId)

  return async function createTask(title: string) {
    if (!list?.$isLoaded) throw new Error('List not loaded')
    const task = Task.create(
      { title, completed: false },
      { owner: list.$jazz.owner }
    )
    list.$jazz.push(task)
    return task
  }
}

// Large surface: hook that does too much
export function useProjectManager(projectId: string) {
  const project = useCoState(Project, projectId)

  return {
    project,
    createTask: (title: string) => { /* ... */ },
    deleteTask: (taskId: string) => { /* ... */ },
    inviteMember: (email: string) => { /* ... */ },
    removeMember: (userId: string) => { /* ... */ },
    updateSettings: (settings: Settings) => { /* ... */ },
    archiveProject: () => { /* ... */ },
    isLoaded: project?.$isLoaded ?? false,
    error: null,
  }
}
```

The first version encapsulates one concern. The second has too many responsibilities — and tests become complex trying to set up the full project context.
