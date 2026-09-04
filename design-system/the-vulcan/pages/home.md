# Home — motion weight: heaviest

Overrides `../MASTER.md`.

The homepage carries the scrollytelling centrepiece and is the LCP-critical page.
Roughly 60% of traffic lands here on a phone, on rural data, mid-comparison against
Airbnb listings. Every effect must survive that.

## Motion budget
- Hero: parallax on the image only, capped at 8% of scroll distance. Overlay content
  never moves. Image is `fetchpriority="high"`, never lazy — it is the LCP element.
- `ScrollReveal` on: section headings, amenity tiles, gallery items, review cards.
- `ScrollReveal` never on: nav, hero headline, price, any CTA.
- Stagger capped at 4 items x 60ms. A fast scroller must not watch an empty page.

## Section order and treatment
| Section | Treatment |
|---|---|
| Hero | Restrained parallax + scroll cue that fades by 400px |
| Stats | Counters animate from zero on first view; final values immediately under reduced motion |
| Intro | ScrollReveal only |
| Gallery | Embla carousel + Dialog lightbox, AspectRatio to hold layout |
| **A day at The Vulcan** | Sticky-figure scrollytelling, `md+` only. Cross-fade only. |
| Amenities (12 tiles) | Card grid, hover `translateY(-2px)` + soft shadow at `--motion-fast` |
| Reviews | Carousel, manual advance. Empty state if the data source is down — never invented content. |
| Booking CTA | No entrance animation. First frame, interactive. |

## Mobile
Build the mobile version of the scrollytelling section first, then enhance upward.
Below `md` the sticky mechanism is discarded entirely for stacked image-then-text cards.
Never attempt a sticky column on a 375px viewport whose browser chrome resizes on scroll.
