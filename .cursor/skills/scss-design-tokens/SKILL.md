---
name: scss-design-tokens
description: Sets up a token-driven SCSS architecture (colors, spacing, radii, shadows, motion, typography, breakpoints, mixins) for any site, app, or component library. Theme-agnostic — works for dark, light, or multi-theme projects. Use when starting a new SCSS project, scaffolding a design system, adding shared variables, consolidating hardcoded values, or when the user mentions "design tokens", "SCSS variables", "breakpoints", "spacing scale", "mixins", or "global styles".
disable-model-invocation: true
---

# SCSS Design Tokens

A token-first SCSS architecture that scales from a marketing page to a full app. Every component imports tokens from one place; no magic numbers in component files.

The starter values below are **placeholders**. Replace the palette, fonts, radii, and spacing scale with whatever the project's brand demands — keep the *structure* and the *naming conventions*.

## When to use

- New site, app, or component library that uses SCSS (not Tailwind/CSS-in-JS).
- The user wants a "design system", "shared variables", "tokens", or "responsive breakpoints".
- A project has drifted into hardcoded colors/sizes and needs consolidation.

## File layout

Create these five files under `src/styles/` (adjust path to project). Leading underscores mark them as partials so Sass never compiles them on their own.

```
src/styles/
├── _variables.scss     // colors, spacing, radii, shadows, z-index, motion
├── _typography.scss    // font stacks, weights, fluid type scale
├── _breakpoints.scss   // $bp-* values + up()/down()/between() mixins
├── _mixins.scss        // container, focus-ring, gradient-text, button-base, etc.
└── global.scss         // reset + base body theme; imported once from app entry
```

Import the entry file once from your app root (e.g. `import "./styles/global.scss"` in `main.jsx`/`main.ts`). Component SCSS files `@use` the partials they need — never `@import`, and never re-import `global.scss`.

## Quick-start templates

> All hex values, font stacks, breakpoint widths, and spacing numbers below are sensible defaults — swap for the project's brand before shipping.

### `_variables.scss`

```scss
// ---- Surfaces (dark starter — flip lightness for light theme) ---------
$bg:           #0a0a0a;
$bg-elevated:  #111113;
$surface:      #16161a;
$surface-2:    #1c1c22;

// ---- Borders & overlays -----------------------------------------------
$border:        rgba(255, 255, 255, 0.08);
$border-strong: rgba(255, 255, 255, 0.14);
$overlay:       rgba(0, 0, 0, 0.6);

// ---- Text -------------------------------------------------------------
$text-primary:   #ededed;
$text-secondary: #8b8b94;
$text-muted:     #9a9aa3;  // keep >= 4.5:1 contrast on $bg

// ---- Brand accents (REPLACE with project palette) ---------------------
$accent:    #7c5cff;
$accent-2:  #4c8dff;
$success:   #22c55e;
$danger:    #ef4444;
$warning:   #f59e0b;
$info:      #38bdf8;

// ---- Gradients --------------------------------------------------------
$gradient-accent: linear-gradient(135deg, $accent 0%, $accent-2 100%);

// ---- Spacing (4px base, named not numbered-in-pixels) -----------------
$space-1: 4px;   $space-2: 8px;   $space-3: 12px;  $space-4: 16px;
$space-5: 24px;  $space-6: 32px;  $space-7: 48px;  $space-8: 64px;
$space-9: 96px;  $space-10: 128px;

// ---- Radii ------------------------------------------------------------
$radius-sm: 6px;  $radius-md: 10px;  $radius-lg: 16px;  $radius-xl: 24px;
$radius-full: 999px;

// ---- Shadows ----------------------------------------------------------
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
$shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
$shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.55);

// ---- Layout -----------------------------------------------------------
$container-max: 1200px;

// ---- Z-index (named tiers, not raw numbers) ---------------------------
$z-base: 1;  $z-sticky: 100;  $z-overlay: 200;  $z-modal: 300;

// ---- Motion -----------------------------------------------------------
$ease: cubic-bezier(0.22, 0.61, 0.36, 1);
$duration-fast: 140ms;  $duration-base: 240ms;  $duration-slow: 420ms;
```

### Light theme starter (swap into `_variables.scss`)

```scss
$bg:           #ffffff;
$bg-elevated:  #fafafa;
$surface:      #f4f4f5;
$surface-2:    #e7e7ea;

$border:        rgba(0, 0, 0, 0.08);
$border-strong: rgba(0, 0, 0, 0.14);
$overlay:       rgba(255, 255, 255, 0.7);

$text-primary:   #111114;
$text-secondary: #4b4b52;
$text-muted:     #5e5e66;   // keep >= 4.5:1 on $bg

$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.06);
$shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
$shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.12);
```

For multi-theme projects, define tokens once as CSS custom properties on `:root` / `[data-theme="light"]` blocks inside `global.scss` and have `_variables.scss` map Sass vars to `var(--token)`. Single-theme projects can keep tokens as pure Sass.

### `_breakpoints.scss`

```scss
$bp-sm: 640px;
$bp-md: 768px;
$bp-lg: 1024px;
$bp-xl: 1280px;
$bp-2xl: 1536px;

@mixin up($bp)   { @media (min-width: $bp) { @content; } }
@mixin down($bp) { @media (max-width: ($bp - 1px)) { @content; } }
@mixin between($min, $max) {
  @media (min-width: $min) and (max-width: ($max - 1px)) { @content; }
}
```

Mobile-first by default: write base styles, layer on `@include up($bp-md) { ... }`.

### `_typography.scss`

```scss
// Swap font stacks for the project's chosen webfonts.
$font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, sans-serif;
$font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
  "Liberation Mono", "Courier New", monospace;
$font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

$fw-regular: 400; $fw-medium: 500; $fw-semibold: 600; $fw-bold: 700;

// Fixed sizes
$fs-xs: 0.75rem; $fs-sm: 0.875rem; $fs-base: 1rem;
$fs-lg: 1.125rem; $fs-xl: 1.25rem; $fs-2xl: 1.5rem;

// Fluid sizes (use for headings)
$fs-3xl:     clamp(1.75rem, 1.4rem + 1.5vw, 2.25rem);
$fs-4xl:     clamp(2rem,    1.6rem + 2vw,   3rem);
$fs-display: clamp(2.5rem,  1.6rem + 4.5vw, 5rem);

$lh-tight: 1.1; $lh-snug: 1.25; $lh-normal: 1.5; $lh-relaxed: 1.65;
$ls-tight: -0.02em; $ls-snug: -0.01em; $ls-normal: 0; $ls-wide: 0.04em;
```

### `_mixins.scss`

```scss
@use "variables" as *;
@use "breakpoints" as *;
@use "typography" as *;

@mixin container {
  width: 100%;
  max-width: $container-max;
  margin-inline: auto;
  padding-inline: $space-4;
  @include up($bp-md) { padding-inline: $space-5; }
  @include up($bp-lg) { padding-inline: $space-6; }
}

@mixin gradient-text($gradient: $gradient-accent) {
  background: $gradient;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

@mixin focus-ring($color: $accent) {
  outline: 2px solid transparent;
  outline-offset: 2px;
  &:focus-visible { outline-color: $color; }
}

@mixin button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  min-height: 44px;          // tap target
  padding-inline: $space-5;
  border: 1px solid transparent;
  border-radius: $radius-md;
  font: $fw-medium $fs-sm/1 $font-sans;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  text-decoration: none;
  transition: background-color $duration-fast $ease,
    border-color $duration-fast $ease, color $duration-fast $ease,
    transform $duration-fast $ease, box-shadow $duration-fast $ease;
  @include focus-ring;
  &:active { transform: translateY(1px); }
}

@mixin visually-hidden {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
```

### `global.scss`

```scss
@use "variables" as *;
@use "typography" as *;
@use "mixins" as *;

*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html, body { height: 100%; }
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // Set "dark", "light", or "light dark" to match your theme strategy.
  color-scheme: dark;
  scroll-behavior: smooth;
}
body {
  font: $fw-regular $fs-base/$lh-normal $font-sans;
  color: $text-primary;
  background-color: $bg;
  overflow-x: hidden;
}
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; color: inherit; }
button { background: none; border: none; cursor: pointer; }
a { color: inherit; text-decoration: none; }

::selection {
  // Use the brand accent — keep enough alpha for legibility on either theme.
  background-color: color-mix(in srgb, $accent 40%, transparent);
  color: $text-primary;
}

// Anchors land below sticky headers (adjust to your header height + buffer).
main :where(section[id], [id]) { scroll-margin-top: 80px; }

.sr-only { @include visually-hidden; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

> Note: `color-mix(in srgb, ...)` requires modern browsers (Chrome 111+, Safari 16.4+, Firefox 113+). If you need to support older browsers, fall back to a hand-tuned `rgba()`.

## Component SCSS pattern

Every component SCSS file starts with `@use` declarations, then writes mobile-first styles.

```scss
@use "../../styles/variables" as *;
@use "../../styles/typography" as *;
@use "../../styles/breakpoints" as *;
@use "../../styles/mixins" as *;

.card {
  padding: $space-5;
  background-color: $bg-elevated;
  border: 1px solid $border;
  border-radius: $radius-lg;

  @include up($bp-md) { padding: $space-6; }
}
```

## Authoring rules

- **No raw pixel values in components.** If a token doesn't exist, add one to `_variables.scss`.
- **No raw hex colors in components.** Same rule, same reason.
- **One source of truth per concept.** Don't redefine `$accent` locally; extend it (`$accent-soft`, `$accent-strong`) in `_variables.scss`.
- **Use named z-index tiers** (`$z-sticky`, `$z-overlay`, `$z-modal`). Never write `z-index: 9999`.
- **Mobile-first only.** Use `@include up($bp-*)` to layer up; reserve `down()` for true desktop-only overrides.
- **`@use`, never `@import`.** `@import` is deprecated in Dart Sass.
- **Always namespace `@use` with `as *`** for token files so `$accent` etc. stay short, or use a prefix (`@use "variables" as v`) if collisions appear.

## Customising for the project

Before building components, sit with the brand once:

1. Replace `$accent` / `$accent-2` with the brand palette. Extend (don't fork) to `$accent-soft`, `$accent-strong`, etc.
2. Pick the type scale: keep `clamp()`-based fluid sizes for headings, swap fixed sizes if the brand uses a different rhythm.
3. Decide the breakpoint policy. The defaults (`640/768/1024/1280/1536`) follow Tailwind conventions; adjust if the design specifies different breakpoints.
4. Pick a spacing base (4px is conventional; 8px works too — just halve the scale).
5. Settle radii and shadow vocabulary. Shadows should be quieter on light backgrounds (lower alpha) than on dark.
6. If supporting multiple themes, move surface/text tokens to CSS custom properties on `:root` / `[data-theme]` selectors.

## Common pitfalls

- **`calc()` with Sass variables**: works in Dart Sass (`calc(64px + $space-6)` → `calc(64px + 32px)`), but if a build errors, switch to interpolation: `calc(64px + #{$space-6})`.
- **Forgetting `@use "typography" as *`** in `_mixins.scss` when a mixin references `$font-sans` — every partial must `@use` what it consumes.
- **Hardcoding contrast colors.** Always validate `$text-muted` and any accent-on-bg combo against WCAG AA (≥4.5:1 for body, ≥3:1 for large text). For dark-theme-specific guidance, see the companion `dark-theme-accessibility` skill.
- **Breakpoints disagreeing across components.** Single source = `_breakpoints.scss`. Never write `@media (min-width: 768px)` inline.
- **Token sprawl.** If a value only appears once, consider whether it earns a name. The point of tokens is reuse — single-use values can stay inline.

## Migration checklist (existing project)

When pulling an existing project onto this system:

- [ ] Create the five partials with starter values, then swap in the brand palette.
- [ ] Import `global.scss` once at app entry; delete old `index.css` / `App.css`.
- [ ] Component-by-component: replace hex/px values with tokens. Add new tokens when needed.
- [ ] Replace inline `@media` queries with `@include up()` / `down()`.
- [ ] Run `npm run build` (or equivalent) after each component to catch SCSS errors early.
- [ ] Grep for raw `#` colors and `px` values; the only legitimate remaining ones are inside `_variables.scss` and 1px borders.
