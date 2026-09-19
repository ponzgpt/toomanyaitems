# toomanyaitems
One-page AI stack picker: nine slots, one tool per job. The product is the constraint and the catalogue's opinions (`src/data/tools.ts`). Live: https://toomanyaitems.technoir.cloud

## Commands
- Check (before every commit and deploy): `npm run check`
- Dev: `npm run dev`
- Deploy: `./scripts/deploy.sh`

## Non-negotiables
1. Nine slots, one per job: never allow two tools in a job, and compute/network (`src/data/infra.ts`) never grow the 3×3 grid.
2. `decodeStack` in `src/lib/stack.ts` is a trust boundary: it validates every pair from a stranger's URL and never throws.
3. Tool notes are under ten words and describe, never sell.
4. `oss` means self-hostable, not open weights.
5. Brand marks come only from simple-icons or `@lobehub/icons-static-svg` via `src/lib/marks.ts`, else a monogram; never hand-write an SVG (see `LOGOS.md`).
6. Monograms stay unique across the catalogue; fix a collision, never silence the test.
7. Only ChatGPT gets a prompt-prefill URL in `src/lib/prompt.ts`; the others use copy-to-clipboard on purpose.
