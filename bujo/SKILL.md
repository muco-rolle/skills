---
name: bujo
description: Manage tasks, projects, goals, sprints, and daily work using the Bullet Journal method in markdown. Covers setup, daily logging with rapid logging notation, creating collections for projects and initiatives, monthly and sprint migration reviews, sprint planning, daily/weekly/monthly reflection, tracking decisions, waiting-for lists, and goal-driven planning. Use this skill when the user wants to bullet journal, create a daily log, do a migration or monthly review, plan a sprint, create a collection to track a project or initiative, reflect on their day or week, review open tasks, manage what they're waiting on, or organize personal/project work in a lightweight markdown-based system. Also use when the user mentions bujo, task review, end-of-day reflection, or asks what to do about tasks that keep getting deferred. Do NOT use for Jira, Linear, Asana, GitHub Projects, Gantt charts, OKR frameworks, or other dedicated project management tools
---

# Bullet Journal Agent

## Philosophy

The Bullet Journal is a mindfulness practice disguised as a productivity system. Its power comes from **intentionality** — every task you write down is a choice about how to spend your time. Migration forces you to confront that choice repeatedly.

This is NOT a to-do app. Don't automate away the reflection. Don't batch-process decisions. The friction is the feature.

## Rules

1. **One question at a time** — Never overwhelm with multiple decisions. Present one task, one choice, one prompt.
7. **Never invent content for the user** — Don't fill calendars with guessed events, create placeholder tasks, or assume priorities. Ask, then populate. Empty is better than wrong.
2. **Always update the index** — Every new monthly log or collection gets an entry in `bujo/index.md`.
3. **Daily logs are append-only** — Never edit past entries. Mark tasks with their fate (`[x]`, `[>]`, `[<]`, `[~]`) but don't delete them.
4. **Use notation consistently** — Follow [NOTATION.md](NOTATION.md) for all entries. No inventing new symbols.
5. **Migration is manual** — Scan for incomplete tasks and present each one individually. The user decides the fate of each task.
6. **Collections emerge from need** — Don't create collections proactively. Create them when 3+ related tasks appear scattered across daily logs.

## Quick Reference

| I want to... | Workflow | Files involved |
|---|---|---|
| Start using BuJo | Setup | index.md, future-log.md, monthly/YYYY-MM.md, daily/YYYY-MM-DD.md |
| Log my day | Daily Logging | daily/YYYY-MM-DD.md |
| Track a project | Create Collection | collections/PROJECT.md, index.md |
| End-of-month review | Migration Review | monthly/YYYY-MM.md (old + new), daily/*.md |
| Plan a sprint | Sprint Planning | collections/sprint-NN.md, index.md |
| Reflect on my day | Daily Reflection | daily/YYYY-MM-DD.md |
| Find all open tasks | Grep | `grep -rn "\- \[ \]" bujo/` |
| Find priority items | Grep | `grep -rn "^\*" bujo/` |

## Workflows

### Setup

When the user wants to start bullet journaling:

1. Ask: "What project or area of your life is this BuJo for?"
2. Create the directory structure:
   ```
   bujo/
     index.md
     future-log.md
     monthly/YYYY-MM.md    (current month)
     daily/YYYY-MM-DD.md   (today)
     collections/           (empty for now)
   ```
3. Use templates from [TEMPLATES.md](TEMPLATES.md)
4. **STOP and ask the user** before populating the calendar: "Do you have any upcoming deadlines, events, or milestones to seed the future log or this month's calendar?" Do NOT invent placeholder events. Leave the calendar empty until the user responds. The calendar belongs to the user, not to you.
5. Populate based on their response — only what they tell you
6. Explain the notation briefly — point them to [NOTATION.md](NOTATION.md)

### Daily Logging

When the user wants to log their day or asks to create today's log:

1. Create `bujo/daily/YYYY-MM-DD.md` using the daily log template
2. Check yesterday's log for any open tasks — carry forward as `- [ ]` (don't mark yesterday's as migrated for day-to-day carry — migration notation is for monthly reviews)
3. Check the monthly calendar for today's events
4. Ask: "What are your 1-3 priorities for today?" and fill the Morning Priorities section
5. As the user reports work throughout the day, append to the Log section using proper notation
6. At end of day (if asked), fill the End of Day summary

### Create Collection

When the user wants to track a project, initiative, or topic:

1. Ask: "What's the mission — in one sentence, what should this collection accomplish?"
2. Determine collection type (goal-driven, challenge-driven, task-driven, or reference) — see [COLLECTIONS.md](COLLECTIONS.md)
3. Ask about scope: "What's in and what's out?"
4. Create `bujo/collections/COLLECTION-NAME.md` using appropriate template
5. Add entry to `bujo/index.md`
6. If relevant tasks exist in daily logs, ask if the user wants to migrate them here

### Migration Review

When the user wants to do a monthly review or migration:

1. Scan all incomplete tasks: `grep -rn "\- \[ \]" bujo/daily/ bujo/monthly/ bujo/collections/`
2. Present the monthly reflection prompts from [MIGRATION.md](MIGRATION.md)
3. **One task at a time**, present each incomplete task and ask: "Complete, migrate, schedule, move to collection, or drop?"
4. Mark each task in its original location with the appropriate symbol
5. Flag any task migrated 3+ times — investigate per the 3+ Migration Rule
6. Create next month's log with migrated items and future log entries
7. Update `bujo/index.md`

Follow the full process in [MIGRATION.md](MIGRATION.md).

### Sprint Planning

When the user wants to plan a sprint:

1. Ask: "What's the sprint goal — what does done look like?"
2. Ask about duration (default 2 weeks)
3. Draft a task breakdown at 1-day granularity, then **STOP and present it to the user for review** before creating files. Ask: "Here's how I'd break this down — what would you add, remove, or reorder?" The user knows their codebase and team better than you do. Don't finalize the sprint without their input.
4. Create `bujo/collections/sprint-NN.md` using the sprint template from [TEMPLATES.md](TEMPLATES.md)
5. Add entry to `bujo/index.md`
6. Add sprint start/end dates to the monthly calendar

### Daily Reflection

When the user wants to close out their day:

1. Read today's daily log
2. Summarize: tasks completed, tasks still open, events that happened
3. Ask the end-of-day reflection prompts from [MIGRATION.md](MIGRATION.md)
4. Update the End of Day section

## Anti-Patterns

| Anti-Pattern | Why It's Bad | What to Do Instead |
|---|---|---|
| Hoarding tasks | Open tasks pile up without review, creating anxiety | Migrate monthly — if it's not worth rewriting, drop it |
| Skipping migration | You lose the intentionality that makes BuJo work | Schedule monthly reviews; they're the highest-value habit |
| Over-designing collections | Complex structures become maintenance burdens | Start minimal — add structure only when the collection proves its value |
| Treating the daily log as a backlog | Daily logs become overwhelming dumping grounds | Daily logs are for TODAY. Backlogs belong in collections or monthly tasks |
| Automating decisions | Batch-processing tasks removes the reflection that makes BuJo effective | Present one task at a time. Let the user feel the weight of each decision |

## References

- **[NOTATION.md](NOTATION.md)** — Rapid logging symbols, entry types, signifiers. Read when creating any BuJo entry.
- **[TEMPLATES.md](TEMPLATES.md)** — Markdown templates for all BuJo components. Read when creating files.
- **[MIGRATION.md](MIGRATION.md)** — Migration process, reflection prompts, 3+ rule. Read during monthly review.
- **[COLLECTIONS.md](COLLECTIONS.md)** — Collection types, design process, PM examples. Read when creating collections.
