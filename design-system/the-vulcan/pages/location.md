# Location — motion weight: light

Overrides `../MASTER.md`.

People check the location before they check anything else. Nothing here may delay
or obscure an address.

## Motion budget
- Walking destinations become a vertical timeline whose connecting line fills as the
  section scrolls, driven by a `requestAnimationFrame`-gated custom property on `scaleY`.
- Drive destinations stay a plain grid below. No animation.
- `ScrollReveal` on list rows, staggered by row, capped at 4 x 60ms.

## Hard rules
- **Never animate or lazy-load the map behind an interaction.** The embed loads with
  the page and the address is in the DOM as text.
- The hero is `ahuriri-waterfront.jpg` with alt text "Ahuriri waterfront at sunset".
  It previously showed the house exterior under waterfront alt text — do not regress this.
