# Rapid Logging Notation

## Task States

Tasks use markdown checkboxes with extended states:

```
- [ ] Open task (not started)
- [x] Completed task
- [>] Migrated task (moved to a different collection or month)
- [<] Scheduled task (moved to the future log)
- [~] Irrelevant task (no longer matters)
```

When migrating or scheduling, keep the original entry and mark it. The destination gets a fresh `- [ ]`.

## Entry Types

### Tasks (checkbox)
```
- [ ] Review PR #42
- [x] Deploy staging build
```

### Events (o)
Events are objective, logged after they happen. No checkbox — events aren't actionable.
```
- (o) Sprint retrospective 2pm
- (o) Customer demo — positive feedback on new dashboard
```

### Notes (---)
Observations, ideas, quotes. Indented under the context they belong to.
```
--- Auth service latency is 200ms higher than expected
--- "Ship the smallest thing that teaches you the most" — user interview insight
```

## Signifiers

Prefix any entry with a signifier for emphasis:

```
* - [ ] Fix production login bug          (* = priority — do this first)
! --- Idea: cache user preferences locally (! = inspiration — revisit later)
```

- `*` **Priority** — Must be addressed today/this sprint. Use sparingly.
- `!` **Inspiration** — Ideas worth capturing but not actionable right now.

## Realistic Daily Log Example

```markdown
## 2026-03-05

### Morning Priorities
* - [ ] Fix auth token refresh bug
- [ ] Write migration for user preferences table

### Log
- (o) Standup 9:15am — blocked on staging deploy
- [x] Fix auth token refresh bug
- [ ] Write migration for user preferences table
- (o) 1:1 with Sarah — discussed Q2 roadmap
! --- What if we offered a self-service data export?
--- Decision: use PostgreSQL advisory locks for job deduplication
- [>] Update API docs for v2 endpoints (moved to next week)

### End of Day
- Completed: 1 task
- Migrated: 1 task
- Open: 1 task
```

## Grep Patterns

Find all incomplete tasks across the bujo:
```bash
grep -rn "\- \[ \]" bujo/
```

Find all priority items:
```bash
grep -rn "^\*" bujo/
```

Find all migrated tasks:
```bash
grep -rn "\- \[>\]" bujo/
```

Find all inspiration entries:
```bash
grep -rn "^!" bujo/
```
