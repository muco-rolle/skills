---
name: write-prd
description: Collaboratively write a Product Requirements Document through structured interview and codebase exploration. Use when user wants to create a PRD, define requirements, plan a new capability, or write a spec.
---

# Write PRD

Write a PRD by interviewing the user, exploring the codebase, and producing a structured document.

## Rules

- **One question at a time.** Never fire a list of questions. Wait for the answer before asking the next.
- **Exhaust each concern.** Follow up on vague answers before moving on. "We'll figure it out later" gets recorded as an open question, not silently accepted.
- **Stay grounded in the codebase.** Every claim about "how things work today" must be verified by reading code. Don't trust the user's memory of their own codebase.
- **Decisions over descriptions.** A PRD records what was decided and why, not prose about the problem domain. If a section reads like a blog post, rewrite it.
- **No rotting details.** Don't include specific file paths, function names, or code snippets. They go stale fast. Use module names and interface descriptions instead.
- **User can skip.** If the user says "skip" or "move on," respect it but record what was skipped as an open question.

## Process

### 1. Get the problem statement

Ask the user for a detailed description of the problem and any solution ideas. Push back on one-liners — ask what triggered this, who's affected, and what happens if they do nothing.

### 2. Explore the codebase

Verify the user's assertions. Specifically look for:

- Existing code that partially solves this problem
- Data models and schema that will be affected
- Integration points (routes, events, external services)
- Testing patterns already established in the area

### 3. Interview the user

Walk through each concern area in [INTERVIEW.md](INTERVIEW.md). One question at a time, following up on vague answers. The goal is to resolve every design decision before writing.

### 4. Sketch modules

Identify the major modules to build or modify. For each module, describe:

- **What it encapsulates** — the functionality hidden behind the interface
- **Its interface** — the narrow surface other code touches
- **Interface boundaries** — where this module ends and the next begins

Actively look for deep modules: lots of functionality behind a simple, stable interface. Check with the user that these match their expectations and which ones need tests.

### 5. Write the PRD

Use [TEMPLATE.md](TEMPLATE.md) to produce the final document. Every section has inline guidance — read it before filling in. Submit the PRD as a GitHub issue.

## Anti-patterns

- **Premature template filling** — Don't start writing the PRD before the interview is done. The template is for recording decisions, not driving discovery.
- **Accepting deferrals silently** — If the user says "I'll decide later," record it in Further Notes as an open question. Never let it vanish.
- **Shallow user stories** — "As a user, I want to use the feature" is not a user story. Each story must name a specific actor, action, and measurable benefit.
- **Copy-pasting the user's words** — Rewrite in precise, technical language. The user's casual description is input, not output.
- **Ignoring unhappy paths** — For every user story, ask: what happens when this fails? Timeouts, bad input, partial state, race conditions.

## Review Checklist

Before submitting, verify:

- [ ] Problem statement explains why this matters, not just what it is
- [ ] Every user story has a specific actor, action, and benefit
- [ ] Implementation decisions record what was decided AND why
- [ ] Out of scope section exists and is non-empty
- [ ] No file paths, function names, or code snippets in the document
- [ ] All deferred decisions are recorded as open questions
- [ ] Testing section references existing test patterns in the codebase
