# Depth and Shadows

## Light Source Simulation

UIs look more polished when they simulate how light interacts with physical surfaces. In interfaces, light always comes from above.

### Raised elements (buttons, cards)

A raised element catches light on its top edge and casts shadow below:

1. **Light top edge** — Add an inset box-shadow or top border slightly lighter than the element:
   ```css
   box-shadow: inset 0 1px 0 hsl(224, 84%, 74%);
   ```
   Choose this lighter color by hand. Don't use semi-transparent white — it can desaturate the underlying color.

2. **Shadow below** — Add a small, sharp shadow with slight vertical offset:
   ```css
   box-shadow: 0 1px 3px hsla(0, 0%, 0%, .2);
   ```
   Keep blur small (1-3px) — real close-to-surface shadows are sharp.

### Inset elements (inputs, wells, recessed areas)

An inset element is below the surface, so light is blocked at the top and reaches the bottom:

1. **Dark top shadow** — The surface above blocks light:
   ```css
   box-shadow: inset 0 2px 2px hsla(0, 0%, 0%, .1);
   ```

2. **Light bottom edge** — The bottom lip angles toward the light:
   ```css
   border-bottom: 1px solid hsla(0, 0%, 100%, .15);
   /* or: box-shadow: inset 0 -2px 0 hsla(0, 0%, 100%, .15); */
   ```

This applies to text inputs, checkboxes, toggle wells, and any "recessed" component.

### Don't overdo it

Borrow subtle cues from how light works — don't try for photo-realism. A 1px highlight and a small shadow add depth without making the interface feel busy.

## Shadow Elevation System

Shadows position elements on a virtual z-axis. Define a fixed set (5 levels) and use them consistently:

| Level | Shadow | Use For |
|-------|--------|---------|
| **xs** | `0 1px 3px hsla(0,0%,0%,.2)` | Buttons, form inputs, small interactive elements |
| **sm** | `0 4px 6px hsla(0,0%,0%,.1)` | Dropdowns, tooltips, popovers |
| **md** | `0 5px 15px hsla(0,0%,0%,.2)` | Cards, panels, raised sections |
| **lg** | `0 10px 24px hsla(0,0%,0%,.2)` | Slide-out drawers, large popovers |
| **xl** | `0 15px 35px hsla(0,0%,0%,.2)` | Modal dialogs, full-screen overlays |

Higher shadows = more user attention. Don't use an xl shadow on a subtle card.

### Two-part shadows

Real shadows come from two light sources: direct light and ambient light. Use two `box-shadow` values:

```css
/* Direct light: larger, softer, more offset */
/* Ambient light: smaller, tighter, less offset */
box-shadow:
  0 4px 6px rgba(0,0,0,.07),   /* direct */
  0 1px 3px rgba(0,0,0,.1);    /* ambient */
```

At higher elevations, the ambient shadow fades (objects far from the surface barely block ambient light):

```css
/* Low elevation */
box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24);

/* High elevation */
box-shadow: 0 15px 25px rgba(0,0,0,.15), 0 5px 10px rgba(0,0,0,.05);
```

### Interaction shadows

Shadows can reinforce interaction:
- **Hover/drag**: Increase the shadow to make the element feel like it's lifting off the page
- **Click/press**: Decrease the shadow (or remove it) to make the element feel pushed down

```css
.card { box-shadow: 0 4px 6px hsla(0,0%,0%,.1); }
.card:hover { box-shadow: 0 10px 24px hsla(0,0%,0%,.15); }

.button { box-shadow: 0 1px 3px hsla(0,0%,0%,.2); }
.button:active { box-shadow: 0 1px 1px hsla(0,0%,0%,.2); }
```

## Flat Design Depth

Even without traditional shadows, you can create depth:

### Color-based depth

Lighter elements feel closer; darker elements feel further away:
```css
/* Closer to user (raised) */
background: hsl(220, 15%, 98%);

/* Background surface */
background: hsl(220, 15%, 93%);

/* Recessed/further (well, input) */
background: hsl(220, 15%, 88%);
```

### Solid shadows

A short, solid shadow with no blur radius creates a flat-but-elevated look:
```css
box-shadow: 0 3px 0 hsl(220, 7%, 83%);
```

This gives cards and buttons a subtle lift without breaking a flat design aesthetic.

## Overlapping Elements

### Cross boundary overlapping

Instead of containing an element entirely within a section, let it cross the boundary between two sections:
```css
.card {
  margin-bottom: -60px;
  position: relative;
  z-index: 10;
}
```

This creates a layered feeling and adds visual interest without any extra design elements.

### Overlapping images

When images overlap each other, they can visually clash. Add an "invisible border" that matches the background color:
```css
.avatar {
  border: 4px solid #FFFFFF; /* matches background */
}
```

This creates clear separation between overlapping images while maintaining the layered look.
