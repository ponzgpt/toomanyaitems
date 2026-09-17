# Agent instructions

A single-page site. The product is the **constraint** — nine slots, one per job —
and the **catalogue's opinions**, not the code.

## Layout

| Path | What it is |
|---|---|
| `src/data/tools.ts` | The catalogue and the nine jobs. The asset. |
| `src/data/infra.ts` | Compute/network options for the workbench strip. Not jobs. |
| `src/lib/stack.ts` | URL/storage codec. Load-bearing for every shared link. |
| `src/lib/marks.ts` | Two-tier icon lookup (simple-icons, lobehub), monogram fallback, contrast guard. |
| `src/lib/prompt.ts` | Builds the "Explain it" prompt and opens/copies it per provider. |
| `src/lib/share.ts` | The 1200×630 canvas card. |
| `src/lib/stack.test.ts` | The whole test suite. `npm test`. |

## Non-negotiables

1. **Nine slots, one per job.** Any change that lets somebody keep two assistants
   deletes the product. Adding a tenth job needs a reason, not a gap — and
   compute/network are workbench fields, not jobs; they must never grow the
   3×3 grid (see README's "one design decision").
2. **`decodeStack` is a trust boundary.** Its input is a URL a stranger wrote. It
   validates every pair — job-keyed tools and the two infra keys — and never
   throws. Do not relax it for convenience.
3. **Notes are under ten words and describe, not sell.** No "powerful",
   "seamless", "revolutionary". If it reads like the vendor wrote it, rewrite it.
4. **`oss` means self-hostable, not "built on open weights".** DeepSeek's chat
   app isn't oss even though its weights are; `llama.cpp` is. Don't blur that
   to make a tool look more open than the product on offer actually is.
5. **Never hand-write or paste in a brand SVG.** Marks come from one of the two
   tiers in `marks.ts` — simple-icons (CC0) or `@lobehub/icons-static-svg`
   (MIT) — or the tool gets a monogram. See `LOGOS.md` for why that boundary
   exists and where to look before adding a new one by hand.
6. **Monograms must stay unique.** They are assigned across the whole catalogue;
   adding a tool can collide. The test catches it — do not silence it by
   hand-picking initials.
7. **ChatGPT is the only provider with a documented prompt-prefill URL.**
   Don't add fake prefill support for Claude or Gemini in `prompt.ts` — they
   deliberately don't offer it, and the copy-to-clipboard fallback is the
   honest behaviour, not a stopgap to "fix".

## Before committing

```bash
npm run check
```
