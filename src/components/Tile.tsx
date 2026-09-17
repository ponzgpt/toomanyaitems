import { mark, monogram, onPaper } from '../lib/marks.ts';
import type { Tool } from '../data/tools.ts';

/** One inventory tile. Brand mark where a CC0 one exists, monogram where it does not. */
export function Tile({ tool }: { tool: Tool }) {
  const m = mark(tool.si);
  if (m) {
    return (
      <span className="tile">
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d={m.path} fill={onPaper(m.hex)} />
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
