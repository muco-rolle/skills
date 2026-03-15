# Typography

## Font Selection

### Keep it to 1-2 families

Most interfaces need just one font family. If you use two, pair a display/serif font for headlines with a neutral sans-serif for body text. Three or more families almost always creates visual chaos.

Good defaults:
- **System font stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` — fast, familiar, professional
- **Neutral sans-serif:** Inter, Roboto, Open Sans, Source Sans Pro — safe for any UI
- **Display/headline:** Use only if the brand calls for personality at large sizes

Create variety through size, weight, color, and letter-spacing — not more font families.

### Font weight matters more than family

Most of the "character" in your typography comes from how you use weight, not which font you pick. A single family with weights 400, 500, 600, and 700 gives you plenty of range.

## Font Size Scale

Use this scale and don't invent sizes between them:

```
12px  — Fine print, badges, metadata
14px  — Secondary text, table cells, form labels
16px  — Body text (base size)
18px  — Slightly emphasized body, lead paragraphs
20px  — Section subheadings
24px  — Section headings
30px  — Page titles
36px  — Large page titles
48px  — Hero headings
60px  — Display text
72px  — Marketing hero text
```

Tailwind equivalents: `text-xs` through `text-7xl`

## Line Height

Line-height and font size are **inversely proportional** — larger text needs less line spacing, smaller text needs more:

| Font Size | Line Height | Use Case |
|-----------|-------------|----------|
| 12-14px | 1.75-2.0 | Small text, dense tables |
| 16-18px | 1.5-1.75 | Body text |
| 20-24px | 1.4-1.5 | Subheadings |
| 30-36px | 1.2-1.3 | Headings |
| 48px+ | 1.0-1.15 | Hero text, display |

Line-height also depends on **line length** — wider content needs taller line-height because the reader's eye has to travel further to find the next line:
- Narrow column (20em): line-height 1.5
- Medium column (30em): line-height 1.6-1.75
- Wide content (40em+): line-height 1.8-2.0

## Line Length

Optimal reading width is **20-35em** (roughly 45-75 characters per line).

```css
p { max-width: 34em; }
/* or in Tailwind: max-w-prose */
```

Don't let paragraphs stretch to fill wide containers. Use `max-width` on text content even when the container is wider.

It's perfectly fine to use different max-widths within the same content area — a heading can be wider than the paragraph below it.

## Alignment

### Left-align body text

Always left-align body text for English and other left-to-right languages. The consistent left edge gives the eye a reliable anchor.

### Center-align sparingly

Center alignment works for:
- Headlines (1-2 lines max)
- Short feature descriptions (under 3 lines)
- Card titles

If centered text wraps to more than 2-3 lines, switch to left-align. If you have multiple blocks of centered text and one is longer than the others, shorten it to match instead of letting it wrap.

### Right-align numbers

In tables with numeric data, right-align the numbers so decimal points line up. This makes values much easier to compare at a glance.

### Justify with hyphenation

Justified text can work for a formal/print aesthetic, but enable hyphenation to prevent awkward word-spacing gaps:

```css
.justified-text {
  text-align: justify;
  hyphens: auto;
}
```

### Baseline alignment for mixed sizes

When placing different font sizes on the same line (e.g., a large title with smaller action links), align them by their **baseline** — the imaginary line letters sit on:

```css
.mixed-sizes { align-items: baseline; }
/* NOT: align-items: center; */
```

Center alignment offsets the baselines and looks sloppy. Baseline alignment uses the natural reference your eyes already perceive.

## Letter Spacing

### Tighten headlines

Fonts designed for body text (Open Sans, Source Sans) have wider letter-spacing for small-size legibility. When used at headline sizes (24px+), tighten the spacing:

```css
h1 { letter-spacing: -0.05em; }
```

Don't try the reverse — headline fonts (Oswald, Condensed families) don't work well at small sizes even with increased spacing.

### Widen all-caps text

All-caps text lacks the variety of ascenders and descenders that distinguish lowercase letters. Increase letter-spacing to compensate:

```css
.all-caps {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

## Links

### Not every link needs a color

In a block of prose, links should stand out — use color and/or underline. But in interfaces where everything is a link (navigation, video titles, article lists), making every link blue creates visual noise.

Instead:
- Use **font weight** (semibold) to indicate clickable items
- Add **underline on hover** for discoverability
- Reserve colored links for primary actions or inline-text links
- Some links (navigation, card titles) don't need any special treatment at all — their context makes them obviously clickable
