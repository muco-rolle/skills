# Hierarchy and Layout

## Visual Hierarchy

Establish three levels of content emphasis in every interface:

- **Primary content** — The main thing the user needs to see. Use large font size, dark color (grey-900), bold or semibold weight.
- **Secondary content** — Supporting information. Use smaller font size, medium grey (grey-500/600), normal weight.
- **Tertiary content** — Metadata, timestamps, fine print. Use smallest font size, light grey (grey-400), normal weight.

### Use multiple properties, not just size

Don't rely on font size alone to create hierarchy. Combine three properties:
- **Size** — Larger = more important
- **Weight** — Bolder = more important
- **Color** — Darker = more important

A small, bold, dark label can outrank a large, thin, grey heading. Use all three tools together.

### De-emphasize, don't over-emphasize

When something doesn't feel prominent enough, try making the surrounding elements less prominent instead of making the target louder. Reduce contrast on secondary content (lighter color, thinner weight, smaller size) rather than cranking up the primary content.

### Labels are secondary

Labels like "Name:", "Email:", "Price:" are supporting context, not the data itself. Make the value bold and dark; make the label small, lighter, or uppercase in a smaller size. Sometimes you can remove labels entirely if the format makes the data self-explanatory (e.g., `jane@example.com` is obviously an email).

### Separate visual hierarchy from document hierarchy

HTML heading tags (h1-h6) are for document structure and accessibility. They don't have to dictate visual size. An h2 section title can be styled smaller than a non-heading metric value if the metric is more important visually.

## Spacing and Sizing

### Use a defined scale

Pick spacing values from a constrained system. A good scale:
`4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256` (px)

In Tailwind: `p-1, p-2, p-3, p-4, p-6, p-8, p-12, p-16, p-24, p-32, p-48, p-64`

Using a scale forces you to make deliberate choices and maintains visual consistency. A linear scale (4, 8, 12, 16, 20...) gives too many similar options at the small end and not enough spread at the large end.

**Strictly avoid off-scale values** like 6px, 10px, 14px, 15px, 20px, or 40px. If 8px feels too small and 12px feels too big, pick one — the constraint is the point. Round to the nearest scale value every time.

### Give each element the space it needs

Don't distribute space evenly across all elements. A tight group of related items (like a form label and its input) should have less space between them than between unrelated sections. Space communicates relationship — closer = related, further = separate.

### Don't fill the available width

Wide content areas make text hard to read and layouts feel sparse. Constrain content width:
- Paragraphs: `max-width: 34em` (about 20-35em)
- Form elements: size to their expected content, not the container
- Cards/panels: give them breathing room rather than stretching edge-to-edge

### Grids are overrated

Don't force a 12-column grid on everything. Most interfaces work better when you:
- Give sidebars a fixed width and let the main content fill the rest
- Use auto-sizing with min/max constraints
- Size columns based on their content, not arbitrary grid fractions

A 12-column grid exists to solve specific layout problems. Don't use it as the default for every page.

## Layout Techniques

### Balance weight and size

When text gets larger (headlines, hero text), use a thinner font weight to keep it from feeling heavy. When text gets smaller (labels, captions), use a heavier weight to maintain readability.

- 48px+ headlines → weight 400-500
- 14-16px body → weight 400
- 12-13px captions → weight 500-600

### Use fewer borders

Borders create visual noise. Before adding a border to separate elements, try:
1. **More spacing** — just increase the gap between elements
2. **Different backgrounds** — use a slightly different background color for one section
3. **Box shadow** — a subtle shadow (`0 1px 3px hsla(0,0%,0%,.1)`) separates elements without the harshness of a border

If you do use a border, keep it light (grey-200 or lighter) and thin (1px).

### Match design investment to feature importance

Not every feature needs the same level of design polish. A rarely-used settings page can be simpler than a customer-facing dashboard. Don't spend time perfecting UI for features that aren't core to the product.

For early-stage features, use simple form layouts and basic typography. You can always refine later when the feature proves valuable.
