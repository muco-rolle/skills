# Collection Design Guide

## When to Create a Collection

Create a collection when:
- 3+ related tasks are scattered across daily logs
- A new project, initiative, or goal starts
- A recurring concern keeps appearing in daily notes
- You need a dedicated space for a specific topic

Don't create a collection speculatively. Let the need emerge from your daily logs.

## Collection Types

### Goal-Driven
For outcomes with a clear finish line.
- Example: "Launch v2 API", "Complete SOC2 audit"
- Structure: Mission statement, milestones, tasks, notes

### Challenge-Driven
For ongoing problems without a clear end state.
- Example: "Reduce page load time", "Improve developer onboarding"
- Structure: Problem statement, experiments tried, results, next actions

### Task-Driven
For a batch of related work items.
- Example: "Q2 Tech Debt", "Migration to new auth provider"
- Structure: Task list with context notes

### Reference
For information you revisit but don't act on sequentially.
- Example: "Architecture decisions", "Vendor contacts", "Meeting notes archive"
- Structure: Organized by topic, append-only

## Designing a Collection

### Step 1: Mission Statement
Write one sentence: what does this collection exist to accomplish?

### Step 2: Five Whys
Ask "why does this matter?" up to five times to find the real motivation. This prevents creating collections for surface-level goals that don't address the actual need.

### Step 3: Scope
What's in and out? A collection without boundaries grows into a dumping ground.

### Step 4: Structure
Pick the minimal structure that serves the mission. You can always add sections later.

## PM-Specific Collection Examples

### Kanban Board
```markdown
# Kanban — Project Name

## Backlog
- [ ] Item description

## In Progress
- [ ] Item with assignee @name

## Blocked
* - [ ] Item — blocked on: reason

## Done
- [x] Completed item (YYYY-MM-DD)
```

### Decision Log
```markdown
# Decisions — Project Name

## YYYY-MM-DD: Decision Title
**Context**: Why this decision came up
**Options considered**: A, B, C
**Decision**: B
**Rationale**: Why B was chosen
**Consequences**: What this means going forward
```

### Waiting-For List
```markdown
# Waiting For

- [ ] Response from vendor on pricing (asked 2026-03-01) @vendor
- [ ] Design review feedback (submitted 2026-03-03) @sarah
- [ ] Legal sign-off on DPA (sent 2026-02-28) @legal
```

### Multi-Project Dashboard
```markdown
# Active Projects

| Project | Status | Next Milestone | Owner | Health |
|---------|--------|---------------|-------|--------|
| Auth v2 | In Progress | Beta 03-15 | @tom | On Track |
| Data Export | Planning | Kickoff 03-10 | @sarah | At Risk |
```

### Sprint Board
See the Sprint Collection template in [TEMPLATES.md](TEMPLATES.md).
