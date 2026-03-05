# BuJo Markdown Templates

## Index (bujo/index.md)

```markdown
# Index

## Monthly Logs
- [2026-03](monthly/2026-03.md)

## Collections
<!-- Add collections as you create them -->
```

## Future Log (bujo/future-log.md)

```markdown
# Future Log

## Q1 2026 (Jan–Mar)

## Q2 2026 (Apr–Jun)

## Q3 2026 (Jul–Sep)

## Q4 2026 (Oct–Dec)
```

Entries in the future log use the same notation. When a month arrives, migrate relevant items to the monthly log.

## Monthly Log (bujo/monthly/YYYY-MM.md)

```markdown
# March 2026

## Calendar
- 03 — Sprint 12 starts
- 07 — Design review
- 14 — Sprint 12 demo
- 21 — Quarterly planning
- 28 — Sprint 13 demo

## Tasks
- [ ] Ship user preferences feature
- [ ] Hire senior backend engineer
- [ ] Finalize Q2 roadmap
```

The calendar section is a bird's-eye view of the month — deadlines, events, milestones. One line per notable date. The tasks section holds items migrated from last month or pulled from the future log.

## Daily Log (bujo/daily/YYYY-MM-DD.md)

```markdown
# 2026-03-05

## Morning Priorities
- [ ] First priority task
- [ ] Second priority task

## Log
<!-- Tasks, events, and notes as the day unfolds -->

## End of Day
- Completed:
- Migrated:
- Learned:
```

Daily logs are append-only. Don't go back and rewrite — the history is the point.

## Collection (bujo/collections/COLLECTION-NAME.md)

```markdown
# Collection Name

**Mission**: One sentence describing what this collection exists to accomplish.

## Tasks
- [ ] First task
- [ ] Second task

## Notes
<!-- Observations, decisions, and context -->
```

## Sprint Collection (bujo/collections/sprint-NN.md)

```markdown
# Sprint NN — Title

**Goal**: What does "done" look like at the end of this sprint?
**Duration**: YYYY-MM-DD to YYYY-MM-DD

## Tasks
- [ ] Task broken down to 1-day granularity
- [ ] Another task

## Progress
<!-- Daily updates during the sprint -->

### YYYY-MM-DD
- [x] Completed item
- (o) Standup — noted blocker on X

## Retrospective
<!-- Fill at sprint end -->
- What went well:
- What didn't:
- What to change:
```
