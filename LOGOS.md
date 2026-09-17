# Where the logos come from

Three tiers, tried in that order — see [`src/lib/marks.ts`](src/lib/marks.ts).

1. **[simple-icons](https://simpleicons.org)** (CC0). Marks the trademark holder explicitly
   released for free redistribution. The safest tier, and also the smallest: several AI
   companies have had their mark pulled on request — OpenAI, Midjourney and Runway among them.
2. **[@lobehub/icons-static-svg](https://github.com/lobehub/lobe-icons)** (MIT). A set built
   specifically to identify AI/LLM brands. This is what fills the OpenAI-shaped hole above.
3. **Monogram.** Assigned across the whole catalogue so initials never collide — see
   `marks.ts`'s `candidates()` ladder — with a colour derived from the name so it stays the
   same across sessions and inside a shared image.

## Why tier 2 is fine to use this way

A brand mark shown once, unmodified, purely to identify that vendor's own product — "this row
is ChatGPT" — is the same use every software comparison site makes: G2, Capterra, Product
Hunt, AlternativeTo, Slack's own App Directory. That is nominative fair use: identifying a
product, not claiming affiliation with it. It is a materially lower bar than what simple-icons
requires for CC0 inclusion, which is the trademark holder pre-clearing the mark for **anyone
to freely modify and redistribute** — a company can reasonably decline that while having no
issue at all with being correctly labelled on a page like this one.

**toomanyAItems is not affiliated with, endorsed by, or sponsored by any company whose mark
appears here.** All trademarks belong to their respective owners. That line is in the app
footer too, not just this file.

## Adding a tool's logo

1. Check `node_modules/@lobehub/icons-static-svg/icons/<slug>.svg` first — it already covers
   most AI/LLM brands. Use the **mono** variant (`<slug>.svg`, not `-color` or `-text`) so it
   fits the tinted-tile system every other mark uses.
2. Not there either? Check [simpleicons.org](https://simpleicons.org) — broader than AI, and
   the safer tier when a brand has both.
3. Neither has it: leave `si` and `logo` both `null`. The monogram fallback is not a
   placeholder to feel bad about — it is a deliberate part of the design, not a defect to fix
   by any means necessary.
4. If a vendor ever asks for their mark removed, delete it from `src/lib/lobe-marks.data.json`
   (or set that tool's `logo` to `null`) and it falls straight back to a monogram — no other
   code changes.
