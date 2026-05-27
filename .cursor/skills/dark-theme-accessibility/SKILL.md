---
name: dark-theme-accessibility
description: Audits and fixes accessibility issues specific to dark-themed sites and apps — WCAG color contrast on near-black backgrounds, focus-visible rings, tap target sizes (44x44), keyboard interactions, reduced-motion support, modal/dialog ARIA patterns, and the modal/sheet bleed-through pitfalls (backdrop-filter + transform GPU quirks, stacking-context loss). Use when building or reviewing a dark-themed UI on any framework, when the user mentions contrast, focus rings, tap targets, keyboard navigation, ARIA, reduced motion, or asks for an a11y check.
disable-model-invocation: true
---

# Dark Theme Accessibility

Practical, opinionated checklist for getting a dark-themed UI to WCAG 2.1 AA and respectful of user preferences. Tuned for the failure modes that show up specifically on dark surfaces.

Framework-agnostic — examples use React/JSX and SCSS, but the patterns translate to Vue, Svelte, Astro, plain HTML, vanilla CSS, etc. Replace token names like `$bg`, `$accent`, `$z-overlay` with whatever your project uses.

## When to use

- Designing or reviewing any dark-themed marketing site, app, or component.
- The user asks about contrast, focus rings, tap targets, keyboard nav, ARIA, or "is this accessible?".
- A UI review (see the companion `chrome-devtools-ui-review` skill) flagged a11y issues to fix.

## Quick audit checklist

```
- [ ] All body text >= 4.5:1 contrast vs surface (>= 3:1 for >=18px / >=14px bold)
- [ ] Accent colors used on backgrounds also meet contrast for their text size
- [ ] Every interactive element has a visible :focus-visible state
- [ ] Tap targets >= 44x44 CSS pixels on mobile
- [ ] Forms: labels associated; errors announced; required marked
- [ ] Dialogs: role="dialog" + aria-modal + aria-labelledby + Escape closes + focus trap
- [ ] Sticky headers don't cover anchor targets (scroll-margin-top on targets)
- [ ] prefers-reduced-motion honored for transforms/animations
- [ ] Page has a single <h1>; heading levels don't skip
- [ ] Color is never the only carrier of meaning (add icon/text/underline)
- [ ] No element relies on hover-only to be discoverable
```

## Contrast on dark backgrounds

WCAG AA thresholds: **4.5:1** for normal text, **3:1** for large text (≥24px regular or ≥18.66px bold) and non-text UI (focus indicators, icons).

Example ratios on a near-black background (`#0a0a0a`). Treat these as a reference scale — adjust the actual hex values to your palette.

| Pair | Ratio | Use for |
|------|-------|---------|
| `#ededed` on `#0a0a0a` | ~18.7:1 | Primary text |
| `#8b8b94` on `#0a0a0a` | ~5.9:1  | Secondary text |
| `#9a9aa3` on `#0a0a0a` | ~7:1    | Muted / meta text — **floor for readable copy** |
| Medium violet (`#7c5cff`) on `#0a0a0a` | ~4.6:1 | Borderline accent — safe for ≥18px or as bg fill |
| Lighter violet (`#a594ff`) on `#0a0a0a` | ~7.8:1 | Safer accent for accent text |

**Pitfall**: `#5a5a63` "muted gray" on `#0a0a0a` is ~2.9:1 — fails AA even for large text. If the design calls for very-muted copy, raise lightness, don't lower opacity.

### Measure contrast in the browser

Replace the two selectors with the elements you're checking.

```js
// Paste in DevTools console — returns the ratio between two computed colors.
((fg, bg) => {
  const lum = (c) => {
    const [r,g,b] = c.match(/\d+/g).map(Number).map(v => {
      v /= 255; return v <= 0.03928 ? v/12.92 : ((v + 0.055)/1.055) ** 2.4;
    });
    return 0.2126*r + 0.7152*g + 0.0722*b;
  };
  const L1 = lum(fg), L2 = lum(bg);
  return ((Math.max(L1,L2) + 0.05) / (Math.min(L1,L2) + 0.05)).toFixed(2);
})(
  getComputedStyle(document.querySelector("YOUR_TEXT_SELECTOR")).color,
  getComputedStyle(document.body).backgroundColor
)
```

### Gradient text

Gradient-clipped headlines can drop below threshold at the lighter end. Either keep the gradient stops above ~`#b8b8c4` on a near-black bg, or use a solid color for body-sized copy.

## Focus indicators

Every interactive element must have a `:focus-visible` ring that meets 3:1 against the adjacent background AND against the element's normal state.

```scss
@mixin focus-ring($color: $accent) {
  outline: 2px solid transparent;
  outline-offset: 2px;
  &:focus-visible { outline-color: $color; }
}
```

- Use `:focus-visible`, not `:focus` — avoids ring on mouse click.
- Don't remove the outline without replacing it (`outline: none` alone is a fail).
- For elements on dark surfaces, an accent or white outline at 2px usually clears 3:1. If the accent is too close in hue to the surface, switch to white for `:focus-visible`.

## Tap targets

Minimum **44×44 CSS pixels** for any pointer/touch target on mobile (Apple HIG, WCAG 2.5.5 AAA).

```scss
.nav-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding-inline: $space-3;
}
```

Common offenders to check:
- Wordmark / brand link in the header.
- Inline nav links (often only ~32px tall by default).
- Icon-only buttons (set explicit width/height, not just icon size).
- Hamburger toggle (44×44, not 40×40 — easy to forget).
- "Learn more" / "Read more" affordances — must be real `<a>` or `<button>`, not `<span>`s.

## Keyboard interaction

| Element | Required behavior |
|---------|-------------------|
| All buttons/links | Tab focusable in DOM order; Enter / Space activates |
| Custom toggles | `aria-expanded` reflects state; `aria-controls` points to the controlled element |
| Modal / sheet | Escape closes; focus trapped inside while open; focus restored to opener on close |
| Anchor links under sticky header | `scroll-margin-top: <header-height + buffer>px` on the target |

### Modal / sheet ARIA pattern

```jsx
<button
  type="button"
  aria-label={open ? "Close menu" : "Open menu"}
  aria-expanded={open}
  aria-controls="primary-sheet"
  onClick={() => setOpen(v => !v)}
>...</button>

<div
  id="primary-sheet"
  role="dialog"
  aria-modal="true"
  aria-labelledby="primary-sheet-title"
  aria-hidden={!open}
>
  <h2 className="sr-only" id="primary-sheet-title">Navigation</h2>
  {/* sheet content */}
</div>
```

Behavior to implement:
- Body scroll lock (`document.body.style.overflow = "hidden"`) while open.
- `Escape` key closes the dialog.
- Each interactive element inside closes the dialog when activated (or whatever the dialog's purpose dictates).
- Restore focus to the opener on close.

For a full focus-trap, use a library (`focus-trap-react`, `@radix-ui/react-dialog`, native `<dialog>`) — DIY traps are easy to get wrong.

## Modal / mobile sheet bleed-through (the pitfall)

If page content shows **through** an "opaque" sheet or modal, the cause is almost always one of:

1. **`backdrop-filter` + `transform` combo** — some Chromium/WebKit GPU paths render the element semi-transparent during paint. Fix: drop `backdrop-filter` from the animated layer; use a solid `background-color` only. Animate `opacity` (and `visibility` for cleanup) without `translateY`/`scale`.
2. **Z-index loss inside a stacking context** — `isolation: isolate` or any ancestor `transform`/`filter`/`will-change` creates a new stacking context. The sheet's z-index only compares within that context, so it can sit behind siblings outside it. Move the sheet to a portal at `<body>` level if your framework supports it.
3. **Sheet covers the toggle/close button** — `inset: 0` + a `z-index` above the header hides the toggle (close icon). Use `inset: <header-height> 0 0 0` so the header (and the X) stays visible, and elevate the header background to solid while the sheet is open.

### Working pattern

Generic selector names — adapt to your project's conventions. Token names (`$bg`, `$z-overlay`, `$duration-base`, `$ease`) should be replaced with your project's equivalents from `_variables.scss`.

```scss
.app-sheet {
  position: fixed;
  inset: 64px 0 0 0;            // sits below a 64px sticky header
  background-color: $bg;        // SOLID — no rgba, no alpha
  z-index: $z-overlay;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity $duration-base $ease,
              visibility 0s linear $duration-base;
  overflow-y: auto;
  overscroll-behavior: contain;

  &.is-open {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transition: opacity $duration-base $ease, visibility 0s linear 0s;
  }
}

// While the sheet is open, force the header background solid so the close
// affordance sits on opaque surface and the two layers read as one.
.app-header.is-sheet-open {
  background-color: $bg;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
```

If you must keep `backdrop-filter` for an aesthetic, gate it behind `@supports (backdrop-filter: blur(16px))` on a *non-animated* parent and animate a child layer.

## Reduced motion

Respect `prefers-reduced-motion: reduce`. Cover transforms, parallax, auto-playing video, scroll-linked effects.

```scss
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

For component-specific lifts/translates, also remove the transform:

```scss
@media (prefers-reduced-motion: reduce) {
  .interactive-card:hover { transform: none; }
}
```

## Semantics & structure

- One `<h1>` per page; never skip heading levels.
- Use `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` — not generic `<div>`s.
- Label every `<nav>` with `aria-label` when there's more than one nav on the page (e.g. "Primary", "Mobile", "Footer").
- Decorative SVGs: `aria-hidden="true"`. Meaningful SVGs: `<title>` child + `role="img"` + `aria-labelledby`.
- Add a skip link before the header: `<a class="sr-only sr-only-focusable" href="#main">Skip to content</a>`.

## Color is not the only signal

- Form errors: red border AND an icon AND a text message.
- Links inside paragraphs: underline OR distinct weight + color, not color alone.
- Active state: don't rely solely on accent hue — add weight, icon, or background.
- Required form fields: asterisk AND `aria-required="true"`.

## Fix workflow

When a live review (or audit) returns findings, work through them in this order:

1. **High severity first**: contrast failures, missing interactive elements (e.g. `<span>` masquerading as link), keyboard traps.
2. **Tap targets**: bulk-add `min-height: 44px` via shared button/link mixins.
3. **Focus indicators**: ensure every clickable surface uses `@include focus-ring` (or equivalent).
4. **Dialog/sheet correctness**: ARIA attributes, Escape close, scroll lock, focus return, bleed-through pattern above.
5. **Reduced motion**: confirm the global override exists; add component-level transform overrides where the global rule doesn't reach.
6. **Scroll anchoring**: add `scroll-margin-top` once globally on `[id]` targets.

After each fix, re-run a focused live review on the affected component to verify.

## Related skills

- `chrome-devtools-ui-review` — live verification via Chrome DevTools MCP.
- `scss-design-tokens` — where to define the lighter `$text-muted`, the focus-ring color, named z-index tiers, motion tokens, etc.
