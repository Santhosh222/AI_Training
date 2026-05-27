---
name: chrome-devtools-ui-review
description: Reviews a running site live in Chrome via the chrome-devtools MCP server across mobile/tablet/desktop, click-tests every interactive element, captures viewport + full-page screenshots, and produces an actionable findings report. Use when the user asks to "review the UI", "test responsiveness", "check accessibility live", "open localhost", "click through buttons", or wants a visual QA pass on a running web app.
disable-model-invocation: true
---

# Chrome DevTools UI Review

A repeatable workflow for reviewing a live web app through the `user-chrome-devtools` MCP server. Read-only by default: produces findings and screenshots, never edits source files.

## When to use

- Dev server is running and the user asks for a UI/UX or accessibility review.
- A new component shipped and you want a visual regression pass.
- Reviewing responsive behavior, click-throughs, hover/focus states, or contrast.

## Prerequisites

1. The `user-chrome-devtools` MCP server is configured and authenticated.
2. The site is already running locally (e.g. `http://localhost:5173`). Confirm by reading the terminals folder before starting — do not start the dev server yourself unless asked.
3. Output directory exists for screenshots, e.g. `.review/` in the workspace root.

## Tools you'll use

Always read each tool's JSON descriptor at `mcps/user-chrome-devtools/tools/<tool>.json` before first use. Most-used:

| Tool | Purpose |
|------|---------|
| `navigate_page` | Load or reload a URL |
| `emulate` | Set viewport via `"<w>x<h>x<dpr>,mobile,touch"` |
| `take_snapshot` | Accessibility tree of the current page (uids for `click`) |
| `click` | Click an element by `uid` from the latest snapshot |
| `take_screenshot` | Save PNG; pass `fullPage: true` for full doc, omit for viewport |
| `evaluate_script` | Run JS in the page (measure sizes, read computed styles, check contrast) |
| `press_key` | Send a key (e.g. Escape) to test keyboard interactions |
| `list_console_messages` | Pull console errors/warnings |

Use `emulate` (not `resize_page`) to switch viewports — `resize_page` does not emulate mobile flags.

## Standard viewports

| Name | Args to `emulate` |
|------|-------------------|
| Mobile (iPhone 14-ish) | `"390x844x3,mobile,touch"` |
| Tablet (iPad-ish, between md/lg) | `"820x1180x2,mobile,touch"` |
| Desktop | `"1440x900x2"` |

After every `emulate` call, reload the page so layout reflects the new viewport.

## Workflow

Copy this checklist into your working notes and tick items as you go:

```
- [ ] Confirm dev server is up
- [ ] Mobile pass (390x844): screenshot + click-through + measurements
- [ ] Tablet pass (820x1180): screenshot + click-through
- [ ] Desktop pass (1440x900): screenshot + click-through + keyboard tab order
- [ ] Console errors check
- [ ] Compile findings report
```

### Step 1 — Set up

1. Read `terminals/*.txt` to confirm the dev server is healthy.
2. Decide the target URL (default `http://localhost:5173/`).
3. Make sure `.review/` exists in the workspace.

### Step 2 — For each viewport

1. Call `emulate` with the viewport string.
2. Call `navigate_page` with the URL (reloads under the new viewport).
3. `take_screenshot` with `fullPage: true` → `.review/<name>-<w>-full.png`.
4. `take_snapshot` to get the a11y tree and element `uid`s.
5. Click-test every interactive `uid` (buttons, links, toggles). For each: capture the resulting state (snapshot or screenshot), then close/reset before moving on.
6. For mobile menus / dialogs:
   - Open with `click`.
   - `take_screenshot` (viewport-only, NOT fullPage — the dialog only covers viewport area).
   - Press `Escape` via `press_key` to verify keyboard close.
   - Click a link inside to verify it closes the sheet AND navigates.
7. Save focused crops with descriptive names like `<viewport>-nav-open.png`, `<viewport>-hero.png`.

### Step 3 — Measurements with `evaluate_script`

Don't eyeball — measure. Useful one-liners:

```js
// Tap target height for a button
document.querySelector(".hero__cta")?.getBoundingClientRect().height
```

```js
// Contrast of two colors (returns ratio)
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
  getComputedStyle(document.querySelector(".hero__meta")).color,
  getComputedStyle(document.body).backgroundColor
)
```

```js
// Check horizontal overflow
({ scrollWidth: document.documentElement.scrollWidth,
   clientWidth: document.documentElement.clientWidth })
```

```js
// Computed z-index for an element
getComputedStyle(document.querySelector(".navbar__sheet")).zIndex
```

### Step 4 — Console & network sanity

- `list_console_messages` — flag any errors/warnings that show up on load or interaction.
- Optional: `list_network_requests` to spot 404s on fonts/images.

### Step 5 — Findings report

Output a single Markdown report at the end of the session with these sections:

```markdown
### Summary
1–3 sentences on overall impression + single highest-impact issue.

### Findings by category
For each: Spacing, Responsiveness, Alignment, Interactive elements, Accessibility, Visual hierarchy.
- [Severity] short description. Where (component + viewport). Suggested fix referencing tokens/variables.

### Interactive elements table
| Element | href / behavior | Works as expected? | Notes |

### Prioritized improvements
1–10 numbered items ordered by impact-to-effort.

### Screenshots captured
| Viewport | File |
```

Severity tags: `[High]` blocking / a11y failures, `[Medium]` noticeable issue but not blocking, `[Low]` polish.

## Coverage checklist (per viewport)

- **Spacing**: section padding, gaps between sections, CTA breathing room.
- **Responsiveness**: overflow, awkward wrap, orphan grid cells (especially the 768–1023px band).
- **Alignment**: centered titles vs. left-aligned cards, equal card heights.
- **Interactive elements**: every link's `href`, every button's behavior, hover/focus states. Flag empty hrefs and missing target IDs.
- **Accessibility**: tap targets ≥44×44px, focus-visible rings, contrast ratios, dialog `aria-*`, body scroll lock, Escape-to-close.
- **Visual hierarchy**: font size jumps, weight/contrast between heading levels, accent usage.

## Click-through coverage rules

- Visit **every** clickable element in the snapshot, not a sample.
- For mobile menus, test: open → tap link → menu closes AND navigates; open → Escape → menu closes; open → tap toggle again → menu closes.
- For forms: tab through to verify focus order matches DOM order.
- After each interaction, snapshot or screenshot before clicking the next thing — otherwise findings get tangled.

## Anti-patterns

- ❌ Using `resize_page` for responsiveness — it doesn't set mobile/touch flags. Use `emulate`.
- ❌ Taking only full-page screenshots when reviewing a dialog (use viewport-only).
- ❌ Reading uids from one snapshot and clicking them after navigation/state change. `take_snapshot` again after every state change.
- ❌ Editing source files during the review. This skill is read-only — surface findings, let the user (or a separate skill) implement.
- ❌ Saying "looks fine on tablet" without `evaluate_script` measurements.

## Related

- For fixes: use the `dark-theme-accessibility` skill to validate proposed changes against WCAG.
- For token-based fixes: use `scss-design-tokens` so fixes reuse existing variables.
