# Migration & Reflection Guide

## What Migration Is

Migration is the core habit that separates BuJo from a to-do list. At the end of each month (or sprint), you review every incomplete task and deliberately decide its fate. This forces intentionality — if a task isn't worth the effort of rewriting it, it isn't worth doing.

Migration is NOT batch automation. Each task gets individual attention.

## Monthly Migration Process

### Step 1: Scan
Find all incomplete tasks:
```bash
grep -rn "\- \[ \]" bujo/daily/ bujo/monthly/ bujo/collections/
```

### Step 2: Decide (One at a Time)
For each incomplete task, choose one:

| Action | Mark as | Destination |
|--------|---------|------------|
| **Complete it now** | `[x]` | Done |
| **Migrate forward** | `[>]` | Next month's task list, with fresh `[ ]` |
| **Schedule for later** | `[<]` | Future log, with fresh `[ ]` |
| **Drop it** | `[~]` | Nowhere — it no longer matters |
| **Move to collection** | `[>]` | Specific collection, with fresh `[ ]` |

Present each task to the user individually. Don't batch-process.

### Step 3: Create Next Month
After migration, create the new monthly log (see [TEMPLATES.md](TEMPLATES.md)) pre-populated with:
- Migrated tasks (fresh `[ ]` entries)
- Items from the future log that fall in the new month
- Known events and deadlines

### Step 4: Update Index
Add the new monthly log to bujo/index.md.

## The 3+ Migration Rule

If a task has been migrated 3 or more times without progress, it signals a systemic issue. Don't just migrate it again. Instead:

1. **Surface it to the user**: "This task has been migrated N times."
2. **Investigate**: Is it too vague? Too large? Blocked? Not actually important?
3. **Resolve**: Break it down, delegate it, schedule a dedicated block, or drop it with `[~]`.

Chronic migration is a symptom, not a habit to sustain.

## Monthly Reflection Prompts

Ask these during migration review:

- What worked well this month?
- What didn't get done, and why?
- Are there patterns in what gets migrated vs completed?
- Is any collection stale or no longer serving its purpose?
- What should next month's priorities be?

## Daily Reflection

### Morning (when creating today's log)
- What are the 1-3 tasks that would make today successful?
- Are there any priority (`*`) items from yesterday still open?
- Check: any events on the monthly calendar for today?

### End of Day (when closing today's log)
- What did you complete?
- What needs to migrate to tomorrow?
- Anything worth noting that wasn't a task? (insights, decisions, concerns)

## Sprint-End Reflection

For sprint collections specifically:

- Did we hit the sprint goal?
- Which tasks were completed vs migrated vs dropped?
- Were estimates reasonable?
- What blocked progress?
- Fill in the Retrospective section of the sprint collection.
