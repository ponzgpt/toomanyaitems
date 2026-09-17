import { JOBS, TOOL_BY_ID } from '../data/tools.ts';
import type { Stack } from '../lib/stack.ts';
import { Tile } from './Tile.tsx';

interface Props {
  stack: Stack;
  swapped: string | null;
  onRemove: (job: string) => void;
  onShare: () => void;
  onDownload: () => void;
  onAsk: () => void;
  shareLabel: string;
}

/**
 * Nine slots, one per job. The tile visits the tool's own site (a click on a
 * brand mark is expected to do that); the small × removes it, so "learn more"
 * and "discard" are two different, unambiguous targets instead of one
 * overloaded click.
 */
export function Hotbar({ stack, swapped, onRemove, onShare, onDownload, onAsk, shareLabel }: Props) {
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
                    <div className="slot-tile">
                      <a href={tool.url} target="_blank" rel="noopener noreferrer"
                         title={`Visit ${tool.name}`} aria-label={`Visit ${tool.name}, opens in a new tab`}>
                        <Tile tool={tool} />
                      </a>
                      <button className="slot-remove" onClick={() => onRemove(job.id)}
                              aria-label={`Remove ${tool.name} from ${job.label}`}>×</button>
                    </div>
                    <span className="slot-tool">{tool.name}</span>
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
          <button className="btn" onClick={onAsk} disabled={!filled} title="Copy a prompt that explains this stack">
            Explain it
          </button>
          <button className="btn" onClick={onShare} disabled={!filled}>{shareLabel}</button>
          <button className="btn btn-primary" onClick={onDownload} disabled={!filled}>Save image</button>
        </div>
      </div>
    </div>
  );
}
