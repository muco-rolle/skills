# Color

## Use HSL, Not Hex

Hex (#3B82F6) and RGB are hard to reason about — you can't tell by looking if two hex codes are related shades. HSL represents color the way humans perceive it:

- **Hue** (0-360°) — Position on the color wheel. 0°=red, 120°=green, 240°=blue
- **Saturation** (0-100%) — How vivid. 0%=grey, 100%=pure color
- **Lightness** (0-100%) — How light. 0%=black, 50%=pure color, 100%=white

With HSL, you can see at a glance that `hsl(220, 95%, 34%)` and `hsl(220, 69%, 80%)` are both blue — one dark, one light.

**HSL vs HSB:** Don't confuse them. HSL lightness 50% = pure color; HSB brightness 100% = pure color only when saturation is 100%. Browsers use HSL, so use HSL.

## Building a Color Palette

You need far more colors than "pick 5 hex codes." A real interface needs:

### Three categories of color

1. **Greys** (8-10 shades) — Text, backgrounds, borders, panels. Most of your UI is grey.
2. **Primary** (5-10 shades) — Your brand color for primary actions, active states, links.
3. **Accent colors** (5-10 shades each) — Semantic colors:
   - **Red** — Errors, destructive actions, danger
   - **Yellow/Amber** — Warnings, pending states
   - **Green** — Success, positive trends, confirmations
   - **Teal/Cyan** — Info, new features, highlights

For complex UIs (dashboards, calendars), you may need up to 10 different colors with 5-10 shades each.

## Constructing a Shade Scale

For each color, build a 9-shade scale (100 to 900):

### Step 1: Choose the base color (shade 500)

Pick a shade that works as a button background with white text. For primary and accent colors, this is the most "usable" shade.

### Step 2: Pick the edges

- **Shade 900** (darkest): Should work as text color. Very dark, still has recognizable hue.
- **Shade 100** (lightest): Should work as a tinted background (alerts, badges). Very light, just a hint of color.

### Step 3: Fill the gaps

Pick shade 700 (between 500 and 900) and shade 300 (between 100 and 500). Each should feel like a balanced midpoint.

Then fill 200, 400, 600, 800 the same way — each bisects its neighbors.

### Greys: same process, different start

For greys, the base color matters less. Start with the edges:
- 900: darkest text color (not pure black — use something like `hsl(210, 15%, 13%)`)
- 100: lightest background (subtle off-white, like `hsl(210, 16%, 97%)`)

True black (#000) looks unnatural. Start with a very dark grey instead.

## Saturation and Lightness

### Don't let lightness kill your saturation

In HSL, the same saturation value looks less vivid at extreme lightness (near 0% or 100%). To keep lighter and darker shades looking rich, **increase saturation** as lightness moves away from 50%.

A shade at lightness 90% needs higher saturation than one at lightness 50% to look comparably vivid.

### Perceived brightness varies by hue

Different hues have inherently different perceived brightness at the same HSL lightness:
- **Bright hues** (60°/yellow, 180°/cyan, 300°/magenta) — naturally appear lighter
- **Dark hues** (0°/red, 120°/green, 240°/blue) — naturally appear darker

You can calculate perceived brightness: `sqrt(0.299*r² + 0.587*g² + 0.114*b²) / 255`

### Rotate hue for richer shades

Instead of only adjusting lightness to create darker/lighter shades, also rotate the hue slightly:

- **Lighter shades** → rotate toward the nearest bright hue (60°, 180°, or 300°)
- **Darker shades** → rotate toward the nearest dark hue (0°, 120°, or 240°)

This keeps dark shades warm and rich instead of dull, and light shades vibrant instead of washed-out.

**Limit rotation to 20-30°** or the color will look like a different hue entirely.

Example: For a yellow (hue ~50°), rotate darker shades toward orange (hue ~30°). The dark shades become warm brown instead of muddy olive.

## Grey Temperature

True grey (saturation 0%) is rarely what you want. Add a slight color to your greys:

### Cool greys
Saturate with blue (hue ~210°):
```
hsl(209, 15%, 28%)   /* dark */
hsl(207, 12%, 43%)
hsl(208, 12%, 58%)
hsl(210, 16%, 76%)
hsl(208, 21%, 88%)   /* light */
```

### Warm greys
Saturate with yellow/orange (hue ~40°):
```
hsl(41, 15%, 28%)   /* dark */
hsl(40, 12%, 43%)
hsl(39, 12%, 58%)
hsl(39, 16%, 76%)
hsl(39, 21%, 88%)   /* light */
```

Match the grey temperature to your brand: tech products often use cool greys, lifestyle/food products warm greys.

Increase saturation slightly for lighter and darker shades to maintain consistent temperature.

## Accessibility

### WCAG Contrast Requirements

- **Normal text** (under ~18px): minimum 4.5:1 contrast ratio — **AA**
- **Large text** (18px+ or 14px+ bold): minimum 3:1 contrast ratio — **AA**
- **Enhanced (AAA)**: 7:1 for normal, 4.5:1 for large

### Colored backgrounds

White text on a colored background often needs a surprisingly dark shade to hit 4.5:1. This can create hierarchy problems — dark backgrounds grab too much attention.

**Solution: flip the contrast.** Instead of light text on dark background, use dark colored text on a light colored background:

```
/* Instead of this: */
background: hsl(120, 60%, 45%);  /* saturated green */
color: white;

/* Do this: */
background: hsl(120, 50%, 92%);  /* light green */
color: hsl(120, 60%, 25%);       /* dark green text */
```

### Colored text on colored backgrounds

For secondary text on a dark colored panel, don't just lighten the background color — it'll look washed out. Instead, **rotate the hue** toward a brighter color (cyan, magenta, or yellow):

```
/* Background */
background: hsl(240, 34%, 34%);

/* Instead of: hsl(240, 44%, 69%) — too close to white */
/* Use: hsl(188, 100%, 65%) — rotated toward cyan, still colorful */
```

### Don't rely on color alone

Always supplement color with another indicator:
- **Status badges**: Add icons (checkmark, X, warning triangle) alongside red/green/yellow
- **Trend indicators**: Add up/down arrows alongside green/red colors
- **Charts/graphs**: Use contrast (light vs dark shades of same hue) instead of different colors, or add patterns/labels
- **Form errors**: Add an icon and text message, not just a red border
