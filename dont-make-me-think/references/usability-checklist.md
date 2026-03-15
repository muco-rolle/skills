# Usability Checklist

Organized by Krug's core principles. Use this as a detailed reference when the review workflow identifies a problem area.

## Self-Evidence

Things should be obvious. If they can't be obvious, they should be self-explanatory.

### Conventions
- [ ] Navigation is in a conventional location (top or left side)
- [ ] Links look like links (underlined or clearly styled as interactive)
- [ ] Buttons look like buttons (raised, colored, with clear borders)
- [ ] Search looks like a search box (text input with search icon or label)
- [ ] Logo links to home page
- [ ] Standard terms are used ("Sign in" not "Access Portal", "Cart" not "Purchase Satchel")

### Clickability
- [ ] Every clickable element looks clickable (cursor, underline, button styling)
- [ ] Non-clickable elements don't look clickable (no underlines on plain text, no button-like styling on static elements)
- [ ] Icon buttons have visible text labels or tooltips
- [ ] Hover/focus states provide visual feedback
- [ ] Link text describes the destination (not "click here" or "read more")

### Naming
- [ ] Page names match the link text that led to them
- [ ] Navigation labels describe content, not actions ("Products" not "Explore")
- [ ] Avoid made-up words, abbreviations, or internal jargon
- [ ] Button labels describe what happens ("Save changes" not "Submit", "Create account" not "Go")

## Scanning Support

Users scan — visual design should support this.

### Visual Hierarchy
- [ ] There's a clear distinction between primary, secondary, and tertiary content
- [ ] The most important thing on the page is visually dominant
- [ ] Related items are visually grouped (proximity, borders, background)
- [ ] Different sections have clear visual boundaries

### Content Formatting
- [ ] Text blocks are short (no more than 3-4 lines before a break)
- [ ] Lists use bullets or numbers instead of comma-separated prose
- [ ] Key terms are bolded for scanning
- [ ] Headings are descriptive and scannable (not clever or vague)
- [ ] Tables are used for structured data (not paragraphs describing comparisons)

### Noise Reduction
- [ ] No visual clutter competing with primary content
- [ ] Background patterns or images don't interfere with text readability
- [ ] Decorative elements don't distract from functional elements
- [ ] Animation is purposeful (draws attention to important changes), not decorative

## Content Clarity

Every word should earn its place on the page.

### Word Elimination
- [ ] No happy talk ("Welcome to our amazing platform!")
- [ ] No unnecessary instructions ("To use search, type your query and press enter")
- [ ] No marketing fluff in functional areas ("Our revolutionary approach to settings management")
- [ ] Error messages are concise and helpful, not verbose apologies

### Paragraph Reduction
- [ ] Introductory paragraphs are 1-2 sentences max, or eliminated entirely
- [ ] Descriptions focus on what the user needs to know, not what the company wants to say
- [ ] "Learn more" content is linked, not inline

## Navigation Clarity

### Persistent Navigation
- [ ] Primary nav appears on every page (except during focused flows like checkout)
- [ ] Nav location and styling is consistent across pages
- [ ] Utility nav (sign in, cart, help) is in a consistent secondary location

### Page Identification
- [ ] Every page has a visible, prominent page name (h1)
- [ ] The page name matches what the user clicked
- [ ] The document title (browser tab) reflects the page name

### Wayfinding
- [ ] Current section is highlighted in navigation
- [ ] Current page is indicated in sub-navigation
- [ ] Breadcrumbs are present on pages more than 2 levels deep
- [ ] Breadcrumbs show the full path, not just the parent

### Navigation Sizing
- [ ] Primary nav has 4-7 items (not 15+)
- [ ] Sub-navigation doesn't exceed 7-9 items per section
- [ ] If there are too many nav items, they're organized into logical groups

## Home / Landing Page

### Identity
- [ ] It's immediately clear what the site/app is (within 3 seconds)
- [ ] There's a tagline or value proposition visible without scrolling
- [ ] The tagline describes what the site does, not a slogan or mission statement

### Starting Points
- [ ] Clear entry points for the top 2-4 user tasks
- [ ] Entry points are above the fold
- [ ] New visitors can tell where to start
- [ ] Returning users can quickly get to their most-used feature

### Content Hierarchy
- [ ] The page has a clear visual hierarchy — not everything is competing for attention
- [ ] Featured/promoted content is distinguishable from permanent navigation
- [ ] There's a clear primary call to action

## Forms

### Labeling
- [ ] Every field has a visible label (not just placeholder text)
- [ ] Labels are positioned consistently (above or to the left of fields)
- [ ] Required fields are clearly marked
- [ ] Optional fields are marked as optional (rather than marking required fields with asterisks)

### Error Handling
- [ ] Errors appear next to the field, not just at the top of the form
- [ ] Error messages explain what to do, not just what went wrong ("Enter a valid email like name@example.com" not "Invalid input")
- [ ] The form preserves all entered data on error
- [ ] Success feedback is clearly visible

### Friction Reduction
- [ ] Only ask for information you actually need
- [ ] Accept flexible input formats (phone numbers with or without dashes, etc.)
- [ ] Don't ask users to re-enter information (confirmation email fields, etc.)
- [ ] Use sensible defaults where possible
- [ ] Group related fields together
- [ ] Long forms are broken into clear steps with progress indication
