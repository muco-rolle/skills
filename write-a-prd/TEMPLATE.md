# PRD Template

Use this template after the interview is complete. Read the HTML comment guidance in each section before filling it in.

---

## Problem Statement

<!-- GOOD: "Facility managers currently track appointment availability in a shared
spreadsheet, leading to double-bookings 3-4 times per week. This causes patient
frustration and wasted clinician time."

BAD: "We need a scheduling feature."

Instructions: State the problem from the user's perspective. Include who is affected,
what pain they experience, and the cost of the status quo. This must explain WHY,
not just WHAT. -->

## Solution

<!-- GOOD: "A calendar-based availability system where clinicians set recurring slots
and patients book directly. Double-booking is prevented by optimistic locking on
the slot record."

BAD: "Build a scheduling module."

Instructions: Describe the solution from the user's perspective but include enough
technical direction to constrain implementation. Name the mechanism, not just the outcome. -->

## User Stories

<!-- GOOD:
1. As a clinician, I want to define recurring weekly availability slots, so that
   I don't have to manually open each day.
2. As a patient, I want to see only available slots when booking, so that I never
   encounter a double-booking.
3. As a facility manager, I want to override a clinician's availability for a
   specific date (e.g., holiday), so that patients aren't shown slots that won't
   be honored.

BAD:
1. As a user, I want to use the scheduling feature.

Instructions: Each story must have a SPECIFIC actor (not "user"), a concrete action,
and a measurable benefit. Cover happy paths, unhappy paths (what happens on failure),
edge cases (empty states, bulk operations), and all actors (admins, systems, third
parties). Aim for exhaustive coverage. -->

1. As a <actor>, I want <action>, so that <benefit>.

## Implementation Decisions

<!-- Instructions: Record WHAT was decided and WHY. Use bullet points. Include:
- Modules to build/modify (by name, not file path)
- Interface boundaries between modules
- Schema changes (table names, key relationships, constraints)
- Architectural decisions (sync vs. async, polling vs. push, etc.)
- API contracts (route shapes, not exact paths)

Do NOT include specific file paths, function names, or code snippets.
They go stale fast. -->

## Testing Decisions

<!-- Instructions: Record:
- Which modules get isolated unit tests and why
- Which flows get integration/acceptance tests
- What existing test patterns to follow (reference by description, not file path)
- What a regression looks like and how tests would catch it

GOOD: "Slot booking gets an acceptance test covering the double-booking race
condition, following the existing appointment test pattern using database
transactions for isolation."

BAD: "Write tests for everything." -->

## Out of Scope

<!-- Instructions: This section must be non-empty. List things that were explicitly
discussed and excluded. For each item, briefly state why it's out of scope.

GOOD: "Recurring appointment series (patient books the same slot every week) —
deferred to v2 because it requires a recurrence rule engine."

BAD: (empty section) -->

## Further Notes

<!-- Instructions: Capture anything that doesn't fit above:
- Open questions that were deferred during the interview
- Risks that were surfaced but not fully resolved
- Assumptions that should be validated
- Links to related PRDs, issues, or documentation

Every deferred decision from the interview MUST appear here as an open question. -->
