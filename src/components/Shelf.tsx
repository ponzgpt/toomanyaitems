import { JOBS, TOOLS, type JobId, type Tool } from '../data/tools.ts';
import type { Stack } from '../lib/stack.ts';
import { Tile } from './Tile.tsx';

interface Props {
  query: string;
  filter: JobId | null;
  freeOnly: boolean;
  stack: Stack;
  onPick: (tool: Tool) => void;
}

export function Shelf({ query, filter, freeOnly, stack, onPick }: Props) {
  const q = query.trim().toLowerCase();
  const match = (t: Tool) =>
    (!filter || t.job === filter) &&
    (!freeOnly || t.pricing === 'free' || t.oss) &&
    (!q || t.name.toLowerCase().includes(q) || t.note.toLowerCase().includes(q));

  const groups = JOBS.map((job) => ({
    job,
    tools: TOOLS.filter((t) => t.job === job.id && match(t)),
  })).filter((g) => g.tools.length);

  if (!groups.length) {
    return <p className="empty">Nothing matches “{query}”. That is one fewer tool to worry about.</p>;
  }

  return (
    <div className="shelf">
      {groups.map(({ job, tools }) => (
        <section className="shelf-group" key={job.id}>
          <h2>{job.label} — {job.ask}</h2>
          <div className="items">
            {tools.map((tool) => {
              const chosen = stack[job.id] === tool.id;
              return (
                <div className="item-wrap" key={tool.id}>
                  <button
                    className="item"
                    onClick={() => onPick(tool)}
                    aria-pressed={chosen}
                    aria-label={`${tool.name} — ${tool.note}${chosen ? ' (in your stack)' : ''}`}
                  >
                    <Tile tool={tool} />
                    <span className="item-name">{tool.name}</span>
                    {(tool.oss || tool.pricing === 'free') && (
                      <span className="item-tag">{tool.oss ? 'open source' : 'free'}</span>
                    )}
                    <span className="item-note">{tool.note}</span>
                  </button>
                  {tool.url && (
                    <a
                      className="item-visit"
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Visit ${tool.name}`}
                      aria-label={`Visit ${tool.name}’s site, opens in a new tab`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      ↗
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
