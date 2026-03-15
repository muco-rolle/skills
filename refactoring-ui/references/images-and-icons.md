# Images and Icons

## Photography

### Quality matters more than anything

A bad photo will ruin an otherwise great design. A great photo can make a simple design look professional. If you need photos:

1. **Hire a professional photographer** for custom/specific imagery
2. **Use high-quality stock photography** (Unsplash, Pexels) for generic imagery

Never design with placeholder images expecting to swap in smartphone photos later — it never works.

## Text on Background Images

The fundamental problem: photos have both light and dark areas. Light text disappears in bright spots; dark text disappears in shadows.

### Solution 1: Semi-transparent overlay

Add a dark overlay between the image and text:

```css
.hero {
  position: relative;
}
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: hsla(0, 0%, 0%, .55);
}
.hero-text {
  position: relative;
  z-index: 1;
  color: white;
}
```

Use a white overlay for dark text on a light image. Adjust opacity (0.4-0.6) until text is readable.

### Solution 2: Lower image contrast

Reduce the image's contrast and increase brightness so the dynamic range is smaller:

```css
.hero-image {
  filter: brightness(1.4) contrast(0.3);
}
```

This makes the entire image more uniform, giving text consistent contrast everywhere.

### Solution 3: Colorize the image

For a branded, artistic look:
1. Lower the image contrast
2. Desaturate the image
3. Add a solid color fill using multiply blend mode

```css
.hero-image {
  filter: contrast(0.8) saturate(0);
  mix-blend-mode: multiply;
}
.hero-wrapper {
  background-color: #035581;
}
```

### Solution 4: Text shadow

For preserving more of the photo's dynamics, add a large, blurred text shadow:

```css
.hero-text {
  text-shadow: 0 0 50px hsla(0, 0%, 0%, .4);
}
```

This creates a subtle glow behind the text without darkening the entire image. Works best combined with slightly lowered image contrast.

## User-Uploaded Content

### Control shape and size

Never display user images at their intrinsic aspect ratio — layouts will break. Use fixed containers:

```css
.user-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}
/* or as a background: */
.user-image-bg {
  width: 200px;
  height: 200px;
  background-size: cover;
  background-position: center;
}
```

### Prevent background bleed

When a user's image has a background color similar to your UI's background, the image loses its edge and bleeds into the page.

**Don't use a border** — borders clash with the image's colors.

**Use an inset box shadow** instead:
```css
.avatar {
  box-shadow: inset 0 2px 4px 0 hsla(0, 0%, 0%, .2);
}
```

For a less "inset" look, use a semi-transparent inner border:
```css
.avatar {
  box-shadow: inset 0 0 0 1px hsla(0, 0%, 0%, .1);
}
```

Both approaches create an edge that works with any image content.

## Icons

### Don't scale up small icons

Icons drawn at 16-24px are designed for that size. Scaling them to 48px or larger makes them look chunky and unprofessional — they lack the detail needed at larger sizes.

If you need large icons:
1. **Use an icon set drawn for that size** (many libraries have 24px and 48px variants)
2. **Wrap the small icon in a background shape** — a colored circle or rounded square:

```css
.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: hsl(220, 90%, 95%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-wrapper svg {
  width: 24px;  /* keep at intended size */
  height: 24px;
}
```

### Don't scale down screenshots

If you want to show a full-page screenshot in a feature section:
- **Take the screenshot at a smaller viewport** (tablet layout) so it doesn't need as much shrinking
- **Show a partial/cropped screenshot** of just the relevant area
- **Draw a simplified illustration** with details removed and text replaced with lines

Shrinking a full desktop screenshot to fit a card makes all the text unreadable.

### Don't scale down large icons

Icons designed for 128px don't work at 16px (favicon size). The detail turns to mush. Instead, redraw a simplified version specifically for the small size — fewer details, thicker strokes, bolder shapes.

## Favicons

A favicon is not your logo shrunk down. Create a simplified, high-contrast version:
1. Remove fine details
2. Thicken key shapes
3. Reduce to the most recognizable element

This gives you control over what the browser renders instead of letting it make the compromises.
