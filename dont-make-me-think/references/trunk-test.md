# The Trunk Test

The trunk test simulates being dropped on a random page of a website with no context — as if you were blindfolded and locked in the trunk of a car, then released on a random page. Can you immediately answer these six questions?

## The Six Questions

### 1. What site is this? (Site ID)
The logo or site name should be in a consistent, prominent location (typically top-left). It should be visible without scrolling and clearly identifiable as the site identity.

**Common failures:**
- Logo is tiny or low-contrast
- Site name only appears on the home page
- Logo is replaced by a hamburger menu on mobile with no visible site name

**Implementation pattern:**
```html
<header>
  <a href="/" aria-label="Home">
    <img src="logo.svg" alt="SiteName" class="h-8" />
  </a>
  <!-- or text-based -->
  <a href="/" class="text-xl font-bold">SiteName</a>
</header>
```

### 2. What page am I on? (Page Name)
Every page needs a prominent heading that matches what the user clicked to get there. The page name should be the most visually prominent text on the page.

**Common failures:**
- No visible page name (just content starting immediately)
- Page name doesn't match the link text that led here
- Page name is styled the same as body text
- Tab/document title doesn't match the visible page name

**Implementation pattern:**
```html
<h1 class="text-2xl font-bold mb-6">Account Settings</h1>
```
The h1 text should match the nav link text. If the nav says "Settings", the page heading should say "Settings" (not "Manage Your Preferences").

### 3. What are the major sections? (Sections)
The page's content areas should be visually distinct through headings, spacing, borders, or background changes.

**Common failures:**
- Content runs together with no visual breaks
- Sections exist but have no headings
- Too many sections competing for attention with no clear hierarchy

### 4. What are my navigation options? (Local Navigation)
The user should be able to see where they can go from here. Primary navigation should be persistent and visible.

**Common failures:**
- Navigation hidden behind a hamburger menu on desktop
- Too many nav items (more than 7±2 creates choice overload)
- Nav items use internal jargon or clever names instead of standard terms

### 5. Where am I in the site? ("You Are Here")
The current location should be highlighted in the navigation. This is the single most overlooked usability requirement.

**Common failures:**
- Current page/section not highlighted in nav
- Breadcrumbs missing on deep pages
- "You are here" indicator is too subtle (slightly bolder text vs clearly different color/background)

**Implementation patterns:**
```html
<!-- Highlighted nav item -->
<nav>
  <a href="/dashboard">Dashboard</a>
  <a href="/settings" aria-current="page" class="font-bold border-b-2 border-blue-600">Settings</a>
  <a href="/help">Help</a>
</nav>

<!-- Breadcrumbs -->
<nav aria-label="Breadcrumb">
  <ol class="flex gap-2 text-sm text-gray-500">
    <li><a href="/">Home</a></li>
    <li aria-hidden="true">/</li>
    <li><a href="/products">Products</a></li>
    <li aria-hidden="true">/</li>
    <li aria-current="page" class="text-gray-900">Widget Pro</li>
  </ol>
</nav>
```

### 6. How can I search? (Search)
If the site has enough content to warrant search, the search box should be visible (not hidden behind an icon) and look like a standard search input.

**Common failures:**
- Search hidden behind a magnifying glass icon with no text field
- Search labeled as something else ("Quick Find", "Explore")
- Search placed in an unexpected location (footer, sidebar bottom)

**Implementation pattern:**
```html
<form role="search">
  <label for="search" class="sr-only">Search</label>
  <input
    type="search"
    id="search"
    placeholder="Search..."
    class="border rounded px-3 py-2"
  />
</form>
```

## How to Apply the Trunk Test

1. Open the page (or read the component code)
2. Ask each of the six questions
3. For each one you can't answer immediately, flag it as a usability issue
4. The fix is always to make the answer more visible, more prominent, or more conventional
