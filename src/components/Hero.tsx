import { useMemo } from 'react';
import { TOOLS } from '../data/tools.ts';
import { Tile } from './Tile.tsx';

/** Seeded so the layout is the same every visit — a composition, not a lottery. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Placed { x: number; y: number; style: React.CSSProperties }

function layout(count: number): Placed[] {
  const rnd = mulberry32(0x7007);
  const cols = 11;
  const rows = Math.ceil(count / cols);
  const out: Placed[] = [];
  for (let i = 0; i < count; i++) {
    // Jittered grid: even coverage without the clumps pure random produces.
    const cx = ((i % cols) + 0.5) / cols;
    const cy = (Math.floor(i / cols) + 0.5) / rows;
    const x = Math.min(0.96, Math.max(0.01, cx + (rnd() - 0.5) / cols));
    const y = Math.min(0.94, Math.max(0.01, cy + (rnd() - 0.5) / rows));

    // Scatter runs outward from the middle, so the clean canvas opens from the centre.
    const vx = x - 0.5, vy = y - 0.5;
    const len = Math.hypot(vx, vy) || 1;
    const near = 1 - Math.min(1, len / 0.7);

    out.push({
      x, y,
      style: {
        '--x': `${x * 100}%`,
        '--y': `${y * 100}%`,
        '--dx': `${(rnd() - 0.5) * 22}px`,
        '--dy': `${(rnd() - 0.5) * 22}px`,
        '--r0': `${(rnd() - 0.5) * 10}deg`,
        '--r1': `${(rnd() - 0.5) * 10}deg`,
        '--dur': `${4 + rnd() * 5}s`,
        '--delay': `${-rnd() * 6}s`,
        '--fx': `${(vx / len) * 78}vw`,
        '--fy': `${(vy / len) * 78}vh`,
        '--fr': `${(rnd() - 0.5) * 120}deg`,
        '--out-delay': `${Math.round(near * 220)}ms`,
        opacity: 0.55 + rnd() * 0.45,
      } as React.CSSProperties,
    });
  }
  return out;
}

export function Hero({ cleared, onClear }: { cleared: boolean; onClear: () => void }) {
  const placed = useMemo(() => layout(TOOLS.length), []);

  return (
    <div className={`hero${cleared ? ' cleared' : ''}`}>
      {/* Decorative: the real control is the button below. */}
      <div aria-hidden="true">
        {placed.map((p, i) => (
          <div className="hero-tile" key={TOOLS[i].id} style={p.style}>
            <Tile tool={TOOLS[i]} />
          </div>
        ))}
      </div>

      <div className="hero-center">
        <p className="hero-count">{TOOLS.length} tools on this desk</p>
        <h1 className="wordmark">too many <span className="ai">AI</span>tems</h1>
        <p className="hero-sub">
          You do not need most of these. Clear the desk and keep the nine that
          actually do a job for you.
        </p>
        <button className="cta" onClick={onClear}>Clear the desk</button>
      </div>
    </div>
  );
}
