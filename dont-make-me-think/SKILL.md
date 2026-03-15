---
name: dont-make-me-think
description: >
  Cognitive usability review for web interfaces — audit UI code against Steve Krug's usability
  principles to find where users are being forced to think. Identifies ambiguous labels, unclear
  navigation, missing wayfinding, excessive content, hostile form patterns, and cognitive friction.
  Produces structured usability reports with severity levels and code-level fixes.
  ALWAYS use this skill when the user asks to review UI for usability, check if a page is intuitive
  or confusing, audit UX, simplify a UI, reduce cognitive load, or make an interface easier to use.
  Also use it when users describe usability symptoms like high bounce rates, form abandonment, users
  getting lost, users not finding things, "too much going on", "doesn't make sense", complaints about
  confusing navigation, or any request to check whether a page works well for users. Use it for
  reviewing settings pages, dashboards, forms, onboarding flows, checkout flows, landing pages,
  navigation components, admin panels, or any user-facing UI where the question is "is this
  understandable?" rather than "does this look good?". This skill focuses on cognitive usability —
  minimizing mental effort — not visual aesthetics. Do NOT use for visual polish requests (colors,
  shadows, typography scales, "make it look better") — those belong to refactoring-ui.
---

# Don't Make Me Think

Every question mark that pops into a user's head — "Where am I?", "What should I click?", "Why is this here?" — adds cognitive friction and makes it more likely they'll leave. The goal is to make web pages self-evident: users should be able to look at a page and get it without spending any effort thinking about it.

## Three Laws of Usability

1. **Don't make me think.** Pages should be self-evident. If something requires a moment of thought ("Is this clickable?", "What does this label mean?"), it's a usability problem.
2. **It doesn't matter how many clicks it takes, as long as each click is a mindless, unambiguous choice.** Don't flatten navigation to reduce clicks — make each step obvious instead.
3. **Get rid of half the words on each page, then get rid of half of what's left.** Every unnecessary word competes with the useful words and dilutes them.

## How Users Actually Use the Web

- **Users scan, they don't read.** They glance at each page, scan some of the text, and click on the first link that catches their interest or vaguely resembles what they're looking for.
- **Users satisfice.** They don't choose the best option — they choose the first reasonable option. Optimize for scanning, not comprehensive reading.
- **Users muddle through.** They don't figure out how things work — they find something that works and stick with it, even if it's not optimal.

## Review Workflow

When reviewing UI code for usability, follow these steps in order. Read the relevant reference file when you need detailed checklists.

### Step 1: Trunk Test

Imagine being dropped on this page from a random link. Can you immediately identify:
- **Site identity** — What site is this? (logo, name)
- **Page name** — What page am I on? (prominent heading)
- **Sections** — What are the major sections? (clear grouping)
- **Navigation options** — Where can I go? (visible nav)
- **"You are here" indicator** — Where am I in the scheme of things? (highlighted nav item, breadcrumbs)
- **Search** — How do I search? (if applicable)

See `references/trunk-test.md` for implementation details.

### Step 2: Scan for Thinking Moments

Look for anything that makes a user pause:
- **Ambiguous links/buttons** — "Click here", "Learn more", "Submit", "Go" without context
- **Unclear labels** — Clever or branded names instead of conventional ones ("Knowledge Hub" vs "Help Center")
- **Confusing choices** — Two options that look equivalent with no clear guidance
- **Mystery icons** — Icons without labels that require guessing
- **Unclear clickability** — Elements that look clickable but aren't, or are clickable but don't look it

### Step 3: Check Visual Hierarchy for Scanning

Users scan — does the visual hierarchy support this?
- **Clear headings** — Are sections labeled with descriptive, visible headings?
- **Logical grouping** — Are related items visually grouped together?
- **Nesting** — Does indentation/styling show relationships between items?
- **Scannable content** — Are long blocks of text broken up with bullets, bold key terms, or short paragraphs?

### Step 4: Evaluate Content

Look for content that wastes the user's time:
- **Happy talk** — Introductory text that says nothing useful ("Welcome to our innovative platform!")
- **Instructions** — Text explaining how to use something that should be self-evident
- **Walls of text** — Dense paragraphs where bullets or a few key words would do
- **Unnecessary words** — Anything that can be cut without losing meaning

### Step 5: Navigation Audit

Check navigation for clarity and consistency:
- **Persistent navigation** — Is the same nav available on every page? (with appropriate exceptions for forms/checkouts)
- **Page names** — Does every page have a clear name that matches what the user clicked?
- **Breadcrumbs** — On deep sites, are breadcrumbs available showing the path?
- **"You are here" indicators** — Is the current section/page highlighted in navigation?
- **Consistent conventions** — Do navigation patterns stay consistent across pages?

### Step 6: Home/Landing Page Check

Home pages have extra responsibilities:
- **Site identity and mission** — Is it clear what the site is and does within seconds?
- **Tagline** — Is there a concise, clear tagline (not a mission statement or slogan)?
- **Starting points** — Are there clear entry points for the main audiences/tasks?
- **Welcome blurb** — A short description that tells new visitors what this site is for
- **Timely content** — Signs of life that show the site is current and active

### Step 7: Goodwill Check

Users arrive with a reservoir of goodwill. Things that deplete it drive them away. Look for:
- **Hidden information** — Burying prices, support contacts, or shipping costs
- **Format punishment** — Requiring specific input formats (dashes in phone numbers, etc.)
- **Unnecessary fields** — Asking for information you don't need
- **Fake paths** — Links that look helpful but lead to marketing or dead ends

See `references/goodwill.md` for the full list of patterns.

### Step 8: Mobile Considerations

- **Visible affordances** — Are tappable elements obviously tappable without hover states?
- **Touch targets** — Are interactive elements large enough (minimum 44x44px)?
- **No hover dependence** — Does any important content/functionality require hover to discover?
- **Manageable menus** — Is navigation accessible without complex gestures?

### Step 9: Accessibility Basics

Usability includes all users:
- **Alt text** — Do meaningful images have descriptive alt text?
- **Heading structure** — Do headings follow a logical h1→h2→h3 hierarchy?
- **Form labels** — Are all inputs associated with visible labels (not just placeholders)?
- **Keyboard navigation** — Can interactive elements be reached and activated via keyboard?
- **Contrast** — Is text readable against its background?
- **Skip navigation** — Is there a skip-to-content link for keyboard users?

See `references/usability-checklist.md` for the complete checklist.

## Output Format

Structure your review as follows:

```
## Usability Review

### Critical Issues (users will fail or abandon)
For each issue:
- **What:** Description of the problem
- **Where:** File, line, and element
- **Why it matters:** Which usability principle it violates
- **Fix:** Specific code change

### Major Issues (users will struggle or get confused)
Same format as above.

### Minor Issues (users will notice friction but can work around it)
Same format as above.

### What's Working Well
Brief note on what the UI already does right — this calibrates the review.
```

**Severity definitions:**
- **Critical** — Users cannot complete their task, or will likely abandon the page
- **Major** — Users can complete their task but with significant confusion or frustration
- **Minor** — Users notice friction but can work through it without much delay

**Important constraints:**
- Stay in the usability lane. Don't suggest color palette changes, shadow adjustments, or typography scale refinements — those are visual design concerns, not cognitive usability.
- Every issue must include a concrete code fix, not just a description of the problem.
- Reference the specific Krug principle being violated.
- Acknowledge what the UI already does well — a review that only lists problems is incomplete.
