import { mark, monogram, onPaper } from '../lib/marks.ts';

/** Anything with a name and (maybe) an icon slug — a Tool or an Infra entry. */
export interface Iconable {
  name: string;
  si: string | null;
  /** Infra entries (infra.ts) have no lobehub tier; Tool always passes this. */
  logo?: string | null;
}

/** One inventory tile. Brand mark where one exists (either source), monogram where not. */
export function Tile({ tool }: { tool: Iconable }) {
  const m = mark(tool.si, tool.logo ?? null);
  if (m) {
    const fill = onPaper(m.hex);
    return (
      <span className="tile">
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          {m.paths.map((d, i) => <path key={i} d={d} fill={fill} />)}
        </svg>
      </span>
    );
  }
  const { text, color } = monogram(tool.name);
  return (
    <span className="tile">
      <span className="mono" data-len={text.length} style={{ background: color }} aria-hidden="true">{text}</span>
    </span>
  );
}
