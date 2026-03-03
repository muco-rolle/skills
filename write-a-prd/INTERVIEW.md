# Interview Guide

## Techniques

- **Ask "why" twice.** The first answer is surface-level. The second reveals the real constraint.
- **Propose wrong answers.** "So the user just refreshes the page to see updates?" forces the user to articulate what they actually want.
- **Name the trade-off.** "That gives us X but costs us Y — is that acceptable?" makes implicit decisions explicit.
- **Explore negative space.** "What does this feature NOT do?" is as important as what it does.
- **Anchor to concrete scenarios.** Replace abstract discussion with "Walk me through what happens when..."

## Pacing

- One question at a time. Wait for the answer.
- If an answer is vague ("it should just work"), follow up: "What does 'just work' look like for a user who..."
- If the user says "I don't know," help them decide by presenting 2–3 concrete options with trade-offs. Record whatever they choose (or record it as an open question if they defer).

## Concern Checklist

Work through these areas. Skip or reorder if the conversation naturally goes there.

### 1. Problem clarity

- What specific problem are we solving?
- Who has this problem? (Name the actor, not "the user")
- How are they solving it today? What's painful about that?
- What happens if we don't build this?
- How will we know this problem is solved?

### 2. Scope boundaries

- What's the smallest version that delivers value?
- What's explicitly out of scope and why?
- Are there adjacent features the user is tempted to bundle in?
- Where does this feature end and manual process / another feature begin?
- What's the next iteration after v1 (so we don't accidentally block it)?

### 3. User stories completeness

- Who are ALL the actors? (Not just the primary user — admins, systems, third parties)
- What does each actor do step by step?
- What are the unhappy paths? (bad input, timeout, permission denied, empty state)
- Are there bulk operations or edge case volumes?
- What notifications or side effects does each action trigger?

### 4. Data and schema

- What new data needs to be stored?
- What existing data is read or modified?
- What are the relationships and constraints?
- What happens to existing data when this ships? (migrations, backfills)
- Are there data retention or privacy concerns?

### 5. Dependencies

- What must exist before this works? (other features, services, migrations)
- Are there external APIs or third-party services involved?
- What's the deployment order if this touches multiple systems?
- Are there shared resources that could cause contention?

### 6. Trade-offs and alternatives

- What alternatives were considered and rejected?
- What are we sacrificing for simplicity / speed / correctness?
- Are there performance vs. correctness trade-offs?
- What would change if we had twice the time? Half the time?

### 7. Verification and testing

- How do we verify this works end-to-end?
- What existing test patterns should we follow?
- Which modules need isolated tests vs. integration tests?
- What does a regression look like and how would tests catch it?

### 8. Failure and rollback

- What happens if this feature fails in production?
- Can we ship incrementally and roll back a slice?
- What's the blast radius of a bug here?
- Are there data changes that can't be undone?

## Exit Conditions

The interview is done when:

- All 8 areas above have been covered (or explicitly skipped by the user)
- Every design decision has a recorded resolution or is marked as an open question
- The user confirms they have nothing else to add

Produce a short transition summary before moving to module sketching:

- **Decisions resolved** — what was settled
- **Open questions** — what was deferred
- **Risks surfaced** — concerns that need monitoring
