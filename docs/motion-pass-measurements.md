# Motion pass — measurements

Measured in the build container, 2026-09-04. Read the caveats: some of these
numbers cannot be taken as production figures.

## CLS — no change, and no problem to fix

| Scenario | Before (ed423f0) | After |
|---|---|---|
| 375px, local network | 0.0000 | 0.0000 |
| 1440px, local network | 0.0000 | 0.0000 |
| 375px, 1.6Mbps + 4x CPU throttle | 0.0000 | 0.0000 |

**Correction to the feature 3 commit message.** That commit says the page
"previously shipped large unsized photos and reflowed as each one landed". That
is wrong. The old gallery already reserved its box with Tailwind's
`aspect-[4/5]` on the figure, so there was no layout shift to fix, and the
measurements above show none before or after.

Moving to shadcn `AspectRatio` is still worth having — it makes the reservation
explicit and survives someone editing the class list — but it did not fix a
measured CLS problem, and the claim that it did was not verified before it was
written down.

## LCP — not measured

The dev server reports ~12.7s, which is meaningless: modules are unbundled and
unminified, and this container's proxy blocks `fonts.googleapis.com`, so the
font request times out and drags the paint with it. The production build is a
Cloudflare Workers bundle that will not run under plain `node`, so there is no
way to serve a realistic build from here.

**LCP and INP still need measuring on a Vercel preview deploy.** Two changes in
this pass should move LCP and are worth confirming there:

- the hero headline no longer fades in from `opacity: 0` over 1000ms
- the hero image now carries `fetchPriority="high"`

## JS budget — over by ~6KB

Homepage initial JS, gzipped. Method: sum every built chunk except other
routes' chunks and the lazily-loaded date picker.

| | bytes |
|---|---|
| Before (ed423f0) | 173,932 |
| After | 220,855 |
| **Delta** | **+46,923 (+45.8KB)** |
| Budget | 40,960 (40KB) |
| **Over by** | **~5,963 (5.8KB)** |

Already clawed back: importing shadcn `Calendar` directly pulled react-day-picker
into the shared routes chunk (69KB gzipped). Lazy-loading it behind the
"Check availability" tap dropped that chunk to 38KB and moved 21KB into a chunk
most visitors never fetch.

What the remaining +45.8KB buys:

| Cost | Feature |
|---|---|
| Embla carousel | 3 — gallery |
| Radix Dialog | 3 — lightbox |
| Radix Popover | 4 — availability peek |
| lucide `createLucideIcon` chunk, 10.7KB | 3 — the carousel's two arrows and the dialog's close X |

The lucide chunk alone would bring the pass under budget, and on the homepage it
currently pays for three icons. It is not worth removing: feature 6 (amenity
tiles) needs lucide by name in the brief, so it would come straight back. The
honest position is that this pass is 5.8KB over and feature 6 will need a real
budget conversation, not that the budget was met.

## Accessibility gate

Measured on the homepage in Chromium.

| Check | Result |
|---|---|
| Text contrast | **Pass.** 23 distinct colour/size/background combinations, 0 failures. Tightest is 5.89:1 against a 4.5 requirement. |
| Keyboard path | **Pass.** Tab order runs logo → menu → hero CTAs → gallery tiles → carousel dots, with no focus trap and a visible ring at every stop. Lightbox: Enter opens, arrows move, Escape closes, focus returns to the tile that opened it. |
| Images have alt | **Pass.** 0 images without an alt attribute. Sticky scrollytelling images carry empty alt inside an aria-hidden column. |
| Horizontal scroll at 375px | **Pass.** None. |
| Reduced motion | **Pass.** Verified the hero CTA is at opacity 1 with `reducedMotion: "reduce"`; ScrollReveal renders a plain element and the CSS safety net zeroes any remaining transition. |
| Emoji as icons | **One pre-existing instance.** `✦` (U+2726) is used as a separator in the marquee ticker. Decorative, not an icon, and not introduced by this pass — but it is in the dingbats block and the checklist forbids it, so it is worth replacing when the marquee is touched in the shell work. |

Not machine-checked: text set over photography (the hero) has no opaque ancestor
to measure against. It carries a bottom-heavy gradient scrim plus a text shadow;
it needs a human eye on a real screen, not a computed ratio.

## Still to verify on a preview deploy

- LCP, INP (cannot be measured in this container — see above)
- 200% browser zoom reflow
- Real-device touch drag on the carousel
