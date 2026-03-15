# The Goodwill Reservoir

Users arrive at your site with a reservoir of goodwill. It's not infinite, and each negative experience drains it. When it runs out, they leave — and they rarely come back. The reservoir is refilled by positive experiences, but drains much faster than it fills.

## Things That Drain Goodwill

### Hiding Information Users Want

Burying key information makes users feel manipulated.

- **Hidden pricing** — Making users request a demo or sign up before seeing costs
- **Buried support contact** — Help pages with no phone number, email, or chat option visible
- **Hidden shipping costs** — Revealing fees only at the final checkout step
- **Vague feature descriptions** — "Enterprise features" with no specifics

```html
<!-- Bad: forces interaction to reveal basic info -->
<button onclick="showPricing()">Request Pricing</button>

<!-- Good: show it directly -->
<div class="pricing">
  <span class="text-3xl font-bold">$29/mo</span>
  <span class="text-gray-500">per user, billed annually</span>
</div>
```

### Punishing Users for Not Reading Your Mind

Requiring specific formats when you could accept flexible input.

- **Phone number format** — Rejecting `5551234567` because you wanted `(555) 123-4567`
- **Date format** — Rejecting `3/15/2026` because you wanted `03/15/2026`
- **Name format** — Rejecting names with hyphens, apostrophes, or spaces
- **Credit card spaces** — Rejecting `4111 1111 1111 1111` because you wanted no spaces

```html
<!-- Bad: punishes reasonable input -->
<input type="tel" pattern="\(\d{3}\) \d{3}-\d{4}"
  title="Format: (555) 123-4567" />

<!-- Good: accept any reasonable format, clean it up yourself -->
<input type="tel" inputmode="numeric"
  placeholder="Phone number" />
```

### Asking for Unnecessary Information

Every extra field is a tax on the user's time and patience.

- **Requiring phone number** for an email-only service
- **Fax number fields** (in the 2020s)
- **"How did you hear about us?"** during signup
- **Title/salutation dropdowns** when you'll only use first name
- **Requiring account creation** before purchase

```html
<!-- Bad: 12 required fields for a newsletter -->
<form>
  <input required placeholder="First Name" />
  <input required placeholder="Last Name" />
  <input required placeholder="Company" />
  <input required placeholder="Job Title" />
  <input required placeholder="Phone" />
  <input required placeholder="Email" />
  <!-- ... more unnecessary fields ... -->
</form>

<!-- Good: ask only what you need -->
<form>
  <input required type="email" placeholder="Email address" />
  <button type="submit">Subscribe</button>
</form>
```

### Creating Fake Paths

Links or buttons that look helpful but don't deliver.

- **"Help" links that go to FAQ** with no actual support channel
- **"Learn more" that leads to marketing** instead of details
- **"Free trial" that requires a credit card** without disclosure
- **Search results that don't match** what was searched for

### Putting Up Walls

Interrupting users before they've gotten value.

- **Newsletter popups** before the user has read anything
- **Mandatory registration** before browsing content
- **Cookie consent walls** that are harder to dismiss than accept
- **Surveys** asking "How are we doing?" before the user has done anything

### Amateurish Design Signals

These signal "this site might not be trustworthy":

- Broken layouts or overlapping elements
- Outdated copyright years in the footer
- Dead links
- Content that refers to events or dates in the past
- "Under construction" or "Coming soon" sections on live pages

## Things That Build Goodwill

### Being Transparent

- Show pricing, shipping costs, and return policies upfront
- Tell users what will happen before they click ("You'll receive a confirmation email")
- Show estimated delivery dates, processing times, queue positions
- Explain why you need information ("We ask for your phone number in case there's a delivery issue")

```html
<!-- Explain why you need optional info -->
<label for="phone">
  Phone <span class="text-gray-500">(optional — only used for delivery issues)</span>
</label>
<input type="tel" id="phone" />
```

### Being Forgiving

- Accept flexible input formats (strip spaces, normalize dashes)
- Preserve form data on errors (never clear the form)
- Provide undo for destructive actions instead of confirmation dialogs
- Let users recover from mistakes easily

### Being Helpful

- Provide good error messages that tell users what to do
- Offer smart defaults and suggestions
- Remember user preferences
- Make important tasks easy and fast

### Being Honest

- If something is broken, say so clearly
- Don't disguise ads as content
- Don't use dark patterns (trick wording, hidden opt-outs, misdirection)
- Make unsubscribing as easy as subscribing

## Detecting Goodwill Issues in Code

Look for these patterns:

| Code Pattern | Goodwill Problem |
|---|---|
| `pattern="..."` with strict regex on text inputs | Format punishment |
| Many `required` attributes on non-essential fields | Unnecessary information |
| Modal/dialog on page load with no prior interaction | Putting up walls |
| `href="#"` or `onclick` with no meaningful destination | Fake paths |
| No `aria-describedby` on error messages | Poor error communication |
| Prices behind `onclick` or `data-*` toggle | Hidden information |
| `confirm("Are you sure?")` dialogs | Missing undo patterns |
