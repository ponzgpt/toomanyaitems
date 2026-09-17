# Agent instructions

A single-page site. The product is the **constraint** — nine slots, one per job —
and the **catalogue's opinions**, not the code.

## Layout

| Path | What it is |
|---|---|
| `src/data/tools.ts` | The catalogue and the nine jobs. The asset. |
| `src/lib/stack.ts` | URL/storage codec. Load-bearing for every shared link. |
| `src/lib/marks.ts` | simple-icons lookup, monogram fallback, contrast guard. |
| `src/lib/share.ts` | The 1200×630 canvas card. |
| `src/lib/stack.test.ts` | The whole test suite. `npm test`. |

## Non-negotiables

1. **Nine slots, one per job.** Any change that lets somebody keep two assistants
   deletes the product. Adding a tenth job needs a reason, not a gap.
2. **`decodeStack` is a trust boundary.** Its input is a URL a stranger wrote. It
   validates every pair and never throws. Do not relax it for convenience.
3. **Notes are under ten words and describe, not sell.** No "powerful",
   "seamless", "revolutionary". If it reads like the vendor wrote it, rewrite it.
4. **Never ship a brand SVG into the repo.** Marks come from simple-icons (CC0)
   or the tool gets a monogram. That boundary is deliberate.
5. **Monograms must stay unique.** They are assigned across the whole catalogue;
   adding a tool can collide. The test catches it — do not silence it by
   hand-picking initials.

## Before committing

```bash
npm run check
```
