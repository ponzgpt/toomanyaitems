# toomany**AI**tems

**There are too many AI tools. Keep the nine that earn a slot.**

A desk covered in floating tool logos. Click once and they all sweep off, leaving
a clean canvas and nine empty slots — one per job you actually do. Fill them,
share the result, get on with your work.

Live: **[toomanyaitems.technoir.cloud](https://toomanyaitems.technoir.cloud)** ·
mirror: [ponzgpt.github.io/toomanyaitems](https://ponzgpt.github.io/toomanyaitems/)

Named after [TooManyItems](https://www.minecraftforum.net/forums/mapping-and-modding-java-edition/minecraft-mods/1272953), the Minecraft mod that
gave you a panel containing every item in the game. That mod is the thesis:
the panel is overwhelming, and the hotbar below it only holds nine.

## The one design decision

**Slots are jobs, not favourites.** There are nine, each tied to a thing people
use AI for — Think, Build, Find, Draw, Film, Speak, Remember, Wire, Own.

You cannot keep two daily drivers. Picking a second assistant visibly throws the
first back on the pile. That constraint is the whole product: a shelf of a
hundred-odd tools where you can favourite anything teaches you nothing, and
"discard the 80%" only means something if discarding is a move you have to make.

It also makes a shared stack comparable. Everybody's card has the same nine
rows, so two of them can be read side by side.

**Compute and network are not a 10th and 11th slot.** What you run this on and
how it connects (`src/data/infra.ts`) sit in a *workbench* strip above the
grid — one compute choice, one network choice — so the 3×3 stays a clean
square. A square is what actually gets shared; growing the grid to fit "and
also my VPS" would have broken that for a feature most stacks won't set.

## How it works

- **No backend.** Your stack lives in the URL fragment
  (`#s=chat:claude,code:cursor,compute:hetzner,network:tailscale`) and in
  `localStorage`. A link carries the whole stack, so following someone else's
  shows theirs instead of the hero.
- **The share card is drawn, not screenshotted.** `renderCard` paints a
  1200×630 canvas — OG proportions and a layout of its own, which a DOM capture
  cannot give, and it costs no dependency. **Share** tries the OS share sheet
  with the image attached first (where `navigator.share` supports files —
  most mobile browsers); elsewhere it downloads the card and opens a
  pre-filled X post, because X's web compose box cannot accept an attached
  file from a script, only a human dragging one in.
- **Every tool's tile links out.** Click a tile — in the shelf or in a filled
  slot — and it opens that tool's own site. In the hotbar that is a separate
  target from the small **×**, so "learn more" and "discard" are never the
  same click.
- **"Explain it"** turns your nine picks into a plain-language prompt and
  opens it in ChatGPT filled in (`chatgpt.com/?q=…` is the one provider that
  documents this), or copies it to your clipboard for Claude or Gemini — they
  don't support prompt-prefill URLs, on purpose, for the same reason a
  security-conscious person doesn't want a link silently typing into their
  chat. See [`src/lib/prompt.ts`](src/lib/prompt.ts).
- **Logos come from three tiers**, tried in order: [simple-icons](https://simpleicons.org)
  (CC0), [@lobehub/icons-static-svg](https://github.com/lobehub/lobe-icons)
  (MIT, built specifically for AI/LLM brands — this is what covers OpenAI,
  Midjourney, Runway and the rest simple-icons had to drop), then a monogram
  assigned across the whole catalogue so initials never collide (a third of
  them would otherwise: Copilot, Codex, Consensus and ComfyUI all want "CO").
  See [`LOGOS.md`](LOGOS.md) for why that's a defensible way to show a brand
  mark, and the in-app footer for the disclaimer.

## Adding a tool

One entry in [`src/data/tools.ts`](src/data/tools.ts):

```ts
{ id: 'kimi', name: 'Kimi', job: 'chat', si: null, logo: 'kimi',
  oss: false, pricing: 'free',
  note: 'Moonshot. Very long context.', url: 'https://kimi.moonshot.cn' },
```

- `job` is one of the nine. If a tool genuinely does two, file it under the one
  people reach for it for.
- `si` / `logo` — see [`LOGOS.md`](LOGOS.md) for where to look and in what
  order. `npm test` fails if a declared slug doesn't resolve, in either tier.
- `oss` means *you can get the source and self-host this tool* — not "built on
  open weights". `pricing` is the cost of the official hosted version.
- `note` is under ten words and says what the tool *is*, not that it is
  powerful, seamless or revolutionary. If it reads like the vendor wrote it,
  rewrite it.

The catalogue is opinionated on purpose. A tool earns a place by being the
answer to a job for somebody, not by existing. Free and open-source tools are
actively wanted — that's most of what `local` and `automate` already are.

## Development

```bash
npm install
npm run dev
npm run check    # tsc -b && node --test
```

`npm test` runs with no test framework — Node runs the TypeScript directly.
It covers the URL codec (a broken one silently corrupts every shared link)
and catalogue integrity: unique ids, valid jobs, resolvable icon slugs in
either tier, unique monograms, https urls.

Stack: Vite, React, TypeScript. Two runtime dependencies beyond React,
both icon sets.

## Deployment

Dockerfile + nginx, deployed by Dokploy on a Hostinger VPS to
`toomanyaitems.technoir.cloud`, same shape as this account's other sites —
see [`DEPLOYMENT.md`](DEPLOYMENT.md). `.github/workflows/pages.yml` mirrors
every push to GitHub Pages as a free, zero-config fallback.

## License

[Apache-2.0](LICENSE). The code is open; the catalogue's opinions are the point,
and those are welcome to be argued with in an issue. Brand marks belong to
their respective owners — see [`LOGOS.md`](LOGOS.md).
