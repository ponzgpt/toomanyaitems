# toomany**AI**tems

**There are too many AI tools. Keep the nine that earn a slot.**

A desk covered in floating tool logos. Click once and they all sweep off, leaving
a clean canvas and nine empty slots — one per job you actually do. Fill them,
share the result, get on with your work.

Named after [TooManyItems](https://www.minecraftforum.net/forums/mapping-and-modding-java-edition/minecraft-mods/1272953), the Minecraft mod that
gave you a panel containing every item in the game. That mod is the thesis:
the panel is overwhelming, and the hotbar below it only holds nine.

## The one design decision

**Slots are jobs, not favourites.** There are nine, each tied to a thing people
use AI for — Think, Build, Find, Draw, Film, Speak, Remember, Wire, Own.

You cannot keep two daily drivers. Picking a second assistant visibly throws the
first back on the pile. That constraint is the whole product: a shelf of 90
tools where you can favourite anything teaches you nothing, and "discard the
80%" only means something if discarding is a move you have to make.

It also makes a shared stack comparable. Everybody's card has the same nine
rows, so two of them can be read side by side.

## How it works

- **No backend.** Your stack lives in the URL fragment (`#s=chat:claude,code:cursor`)
  and in `localStorage`. A link carries the whole stack, so following someone
  else's shows theirs instead of the hero.
- **The share card is drawn, not screenshotted.** `renderCard` paints a
  1200×630 canvas — OG proportions and a layout of its own, which a DOM capture
  cannot give, and it costs no dependency.
- **Half the logos do not exist.** simple-icons removes brand marks when the
  trademark holder asks, and OpenAI, Midjourney and Runway are all gone. Those
  render as monogram tiles, assigned across the whole catalogue so no two read
  alike — a third of them collide on naive initials (Copilot, Codex, Consensus
  and ComfyUI all want to be "CO").

## Adding a tool

One entry in [`src/data/tools.ts`](src/data/tools.ts):

```ts
{ id: 'kimi', name: 'Kimi', job: 'chat', si: null,
  note: 'Moonshot. Very long context.', url: 'https://kimi.moonshot.cn' },
```

- `job` is one of the nine. If a tool genuinely does two, file it under the one
  people reach for it for.
- `si` is a [simple-icons](https://simpleicons.org) slug, or `null` for a
  monogram tile. `npm test` fails if a slug does not resolve.
- `note` is under ten words and says what the tool *is*, not that it is
  powerful, seamless or revolutionary. If it reads like the vendor wrote it,
  rewrite it.

The catalogue is opinionated on purpose. A tool earns a place by being the
answer to a job for somebody, not by existing.

## Development

```bash
npm install
npm run dev
npm run check    # tsc -b && node --test
```

`npm test` is 17 assertions with no test framework — Node runs the TypeScript
directly. It covers the URL codec (a broken one silently corrupts every shared
link) and catalogue integrity: unique ids, valid jobs, resolvable icon slugs,
unique monograms, https urls.

Stack: Vite, React, TypeScript. One runtime dependency beyond React.

## License

[Apache-2.0](LICENSE). The code is open; the catalogue's opinions are the point,
and those are welcome to be argued with in an issue.
