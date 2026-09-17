import { JOBS, TOOL_BY_ID } from '../data/tools.ts';
import type { Stack } from '../lib/stack.ts';
import { Tile } from './Tile.tsx';

interface Props {
  stack: Stack;
  swapped: string | null;
  onRemove: (job: string) => void;
  onShare: () => void;
  onDownload: () => void;
  shareLabel: string;
}

/** Nine slots, one per job. Clicking a filled slot empties it. */
export function Hotbar({ stack, swapped, onRemove, onShare, onDownload, shareLabel }: Props) {
  const filled = JOBS.filter((j) => stack[j.id]).length;

  return (
    <div className="hotbar">
      <div className="hotbar-inner">
        <div className="slots" role="list" aria-label="Your stack">
          {JOBS.map((job) => {
            const tool = stack[job.id] ? TOOL_BY_ID.get(stack[job.id]!) : undefined;
            return (
              <div
                className={`slot${swapped === job.id ? ' swapped' : ''}`}
                data-filled={Boolean(tool)}
                role="listitem"
                key={job.id}
              >
                <span className="slot-label">{job.label}</span>
                {tool ? (
                  <>
                    <Tile tool={tool} />
                    <button className="slot-tool" onClick={() => onRemove(job.id)}
                            title={`Remove ${tool.name}`}
                            aria-label={`Remove ${tool.name} from ${job.label}`}>
                      {tool.name}
                    </button>
                  </>
                ) : (
                  <>
                    <span className="slot-empty" aria-hidden="true">+</span>
                    <span className="slot-tool" style={{ color: 'var(--muted)' }}>empty</span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="hotbar-actions">
          <span className="count">{filled}/9</span>
          <button className="btn" onClick={onShare} disabled={!filled}>{shareLabel}</button>
          <button className="btn btn-primary" onClick={onDownload} disabled={!filled}>Save image</button>
        </div>
      </div>
    </div>
  );
}
