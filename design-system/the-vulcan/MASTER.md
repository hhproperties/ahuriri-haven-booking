# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** The Vulcan
**Generated:** 2026-09-04 01:16:16
**Category:** Travel/Tourism Agency

---

## Global Rules

### Color Palette

> **Reconciled against the shipped brand on 2026-09-04.** The generator proposed a
> sky-blue + adventure-orange SaaS palette. The Vulcan already ships a warm
> cream/timber brand (see `src/styles.css`). The shipped brand wins. Do not
> re-litigate this on a future generator run.

| Role | Hex | Token | Notes |
|------|-----|-------|-------|
| Background | `#EFE8DA` | `--cream` | Primary page ground, body copy on dark bands |
| Foreground | `#17181A` | `--matte` | Primary text, buttons, dark section backgrounds |
| Accent | `#6B4630` | `--wood` | Underlines, dividers, hover states, colour inside words |
| Accent (light) | `#BD8A5E` | `--wood-light` | Keyword highlight on dark bands |
| Deepest | `#0A0A0A` | `--gloss` | Rare premium hover fills |

**Rule:** cream sections and matte sections alternate down the page.

**Contrast watch-list.** The cream-on-cream palette is this site's likely WCAG
failure point. `#17181A` at 60% opacity on `#EFE8DA` is the muted body style used
throughout — verify any new use of it, and scrim any text set over photography.

### Typography

> **Reconciled.** The generator proposed Calistoga + Inter. The shipped brand is
> Fraunces (display) + Archivo (UI/body), already loaded in `src/routes/__root.tsx`.
> The shipped brand wins.

- **Display:** Fraunces — variable optical sizing, italic used for numerals and emphasis
- **Body / UI:** Archivo — uppercase with wide tracking for eyebrows and labels
- **Do not add a third family.** Both are already in the critical-path font request.

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #EA580C;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #0EA5E9;
  border: 2px solid #0EA5E9;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #F0F9FF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #0EA5E9;
  outline: none;
  box-shadow: 0 0 0 3px #0EA5E920;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Aurora UI

**Keywords:** Vibrant gradients, smooth blend, Northern Lights effect, mesh gradient, luminous, atmospheric, abstract

**Best For:** Modern SaaS, creative agencies, branding, music platforms, lifestyle, premium products, hero sections

**Key Effects:** Large flowing CSS/SVG gradients, subtle 8-12s animations, depth via color layering, smooth morph

### Page Pattern

**Pattern Name:** Scroll-Triggered Storytelling

- **Conversion Strategy:** Keep the narrative understandable without scroll-driven effects. Use progress indicator. Mobile: simplify animations. Keep DOM reading order complete; disable parallax and scroll-scrub under reduced motion. Pause scroll animation when offscreen or hidden and render each chapter in its final readable state under reduced motion.
- **CTA Placement:** End of each chapter (mini) + Final climax CTA
- **Section Order:** Intro hook > Chapter 1 (problem) > Chapter 2 (journey) > Chapter 3 (solution) > Climax CTA

---

## Anti-Patterns (Do NOT Use)

- ❌ Generic photos — every image must be of this property or of Ahuriri
- ❌ Complex booking — the path to a date and a price stays short

### Motion anti-patterns (from the motion brief, binding)

- ❌ **Scroll-jacking** — never hijack, throttle, snap or reverse native scroll
- ❌ **Horizontal-scroll pinned galleries** — use a carousel with real controls
- ❌ **Entrance animation on the booking CTA, price, or availability** — painted and interactive at first frame
- ❌ **Animation over 500ms** in the critical path
- ❌ **Parallax on text** — images only, and gently
- ❌ **Custom smooth-scroll libraries** (Lenis, Locomotive) — native scroll only
- ❌ **Re-triggering scroll reveals** — reveal once, then disconnect the observer
- ❌ **Setting React state from a scroll event** — write to a CSS custom property instead

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile

---

## Spacing scale (binding)

Defined once as custom properties in `src/styles.css`. Every section uses them
via `.section-y` / `.section-y-tight`. **No one-off `py-*` values on sections.**

| Token | Desktop (md+) | Mobile | Use |
|---|---|---|---|
| `--section-y` | 140px | 72px | vertical padding on every section |
| `--section-y-tight` | 96px | 56px | stats band, footer |
| `--stack-lg` | 48px | 32px | heading → content |
| `--stack-md` | 24px | 20px | between related blocks |

## Alignment rule (binding)

**Statement sections centre. Content sections left-align.**

A statement section makes one short claim and gets out of the way — the intro
band, the closing CTA. Everything a guest reads to make a decision — galleries,
room detail, amenities, location, reviews — is a content section and left-aligns.

Centred text also takes a measure: display lines cap at 28ch, body at 52ch.
Centring a 90-character serif sentence is what this rule exists to prevent.

## Light → dark boundary (binding)

One treatment sitewide: `.to-dark`, a 96px cream-to-matte vertical gradient at
the top of the dark section. Not a decorative divider graphic, and not a hard cut.

## Tertiary accent

`--sage: #4A5D4E`, pulled from the courtyard planting. **Three uses only:** the
active scrollytelling step indicator, the walk-timeline fill, and its dot markers.
It is not a fourth brand colour and does not belong on buttons or headings.

## Display type ceiling

- Hero: `clamp(3rem, 7vw, 6.5rem)`
- Section headings: `clamp(2.25rem, 4.5vw, 4rem)`
- Display `line-height: 1.05` — needed for italic descender clearance on Fraunces
  at the top of the clamp.
- `text-wrap: balance` on display, `pretty` on body. Both are progressive
  enhancements: the layout must still hold where they are unsupported.
