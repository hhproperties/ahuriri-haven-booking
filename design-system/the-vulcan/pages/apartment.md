# Apartment — motion weight: medium

Overrides `../MASTER.md`.

This is the page someone reads when they are already interested. It is a tour, not
a pitch: the job is to let them see every room without friction.

## Motion budget
- `ScrollReveal` on each room block. Stagger capped at 4 x 60ms, then reset per row.
- The existing alternating left/right room layout stays. Do not animate the alternation.
- Hover scale on room images stays but drops to `--motion-base`; the current
  1200ms transform is outside the 500ms ceiling.

## Rules
- Eight room blocks currently render. Each image needs explicit dimensions or
  `AspectRatio` — this page ships the most unsized photography on the site.
- No parallax here. The page is already long; parallax on a long tour page reads as lag.
