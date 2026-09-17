import { useEffect, useRef, useState } from 'react';
import { JOBS, TOOLS, type JobId, type Tool } from './data/tools.ts';
import { readStack, writeStack, shareUrl, stackSize, type Stack } from './lib/stack.ts';
import { downloadCard } from './lib/share.ts';
import { Hero } from './components/Hero.tsx';
import { Shelf } from './components/Shelf.tsx';
import { Hotbar } from './components/Hotbar.tsx';

const SWEEP_MS = 1000;

export default function App() {
  // A shared link already carries a stack, so skip the hero and show theirs.
  const [initial] = useState(readStack);
  const [phase, setPhase] = useState<'hero' | 'sweeping' | 'desk'>(
    stackSize(initial) ? 'desk' : 'hero',
  );
  const [stack, setStack] = useState<Stack>(initial);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<JobId | null>(null);
  const [swapped, setSwapped] = useState<string | null>(null);
  const [shareLabel, setShareLabel] = useState('Copy link');
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => { writeStack(stack); }, [stack]);

  function clearDesk() {
    setPhase('sweeping');
    later(() => setPhase('desk'), SWEEP_MS);
  }

  function pick(tool: Tool) {
    setStack((s) => (s[tool.job] === tool.id
      ? { ...s, [tool.job]: undefined }        // clicking your pick again drops it
      : { ...s, [tool.job]: tool.id }));       // otherwise it replaces what was there
    setSwapped(tool.job);
    later(() => setSwapped(null), 450);
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(shareUrl(stack));
      setShareLabel('Copied');
    } catch {
      setShareLabel('Copy failed');       // clipboard is blocked outside https and in some browsers
    }
    later(() => setShareLabel('Copy link'), 1800);
  }

  if (phase !== 'desk') {
    return <Hero cleared={phase === 'sweeping'} onClear={clearDesk} />;
  }

  const filled = stackSize(stack);

  return (
    <>
      <main className="workspace">
        <div className="ws-head">
          <h1>Build your stack</h1>
          <p>One tool per job. Picking a second one throws the first back on the pile.</p>
        </div>

        <div className="controls">
          <input
            className="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${TOOLS.length} tools…`}
            aria-label="Search tools"
          />
          <div className="jobs">
            <button className="job-chip" aria-pressed={filter === null} onClick={() => setFilter(null)}>All</button>
            {JOBS.map((j) => (
              <button
                className="job-chip"
                key={j.id}
                aria-pressed={filter === j.id}
                onClick={() => setFilter(filter === j.id ? null : j.id)}
              >
                {j.label}
              </button>
            ))}
          </div>
        </div>

        <Shelf query={query} filter={filter} stack={stack} onPick={pick} />

        <p className="foot">
          {filled === 9
            ? 'Nine slots, nine decisions. The other 80 are somebody else’s problem.'
            : `${TOOLS.length - filled} tools you have not committed to.`}
          <br />
          Catalogue is opinionated and open —{' '}
          <a href="https://github.com/ponzgpt/toomanyaitems">suggest a tool</a>.
        </p>
      </main>

      <Hotbar
        stack={stack}
        swapped={swapped}
        onRemove={(job) => setStack((s) => ({ ...s, [job]: undefined }))}
        onShare={share}
        onDownload={() => downloadCard(stack)}
        shareLabel={shareLabel}
      />
    </>
  );
}
