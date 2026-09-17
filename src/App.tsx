import { useEffect, useRef, useState } from 'react';
import { JOBS, TOOLS, type JobId, type Tool } from './data/tools.ts';
import { readStack, writeStack, shareUrl, stackSize, type Stack } from './lib/stack.ts';
import { downloadCard, renderCard } from './lib/share.ts';
import { buildPrompt, askAbout, type AiTarget } from './lib/prompt.ts';
import { Hero } from './components/Hero.tsx';
import { Shelf } from './components/Shelf.tsx';
import { Hotbar } from './components/Hotbar.tsx';
import { Workbench } from './components/Workbench.tsx';
import { AskMenu } from './components/AskMenu.tsx';

const SWEEP_MS = 1000;
const SHARE_TEXT = 'My AI stack — keep the 20%, drop the 80%.';

export default function App() {
  // A shared link already carries a stack, so skip the hero and show theirs.
  const [initial] = useState(readStack);
  const [phase, setPhase] = useState<'hero' | 'sweeping' | 'desk'>(
    stackSize(initial) ? 'desk' : 'hero',
  );
  const [stack, setStack] = useState<Stack>(initial);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<JobId | null>(null);
  const [freeOnly, setFreeOnly] = useState(false);
  const [swapped, setSwapped] = useState<string | null>(null);
  const [shareLabel, setShareLabel] = useState('Share');
  const [askOpen, setAskOpen] = useState(false);
  const [askStatus, setAskStatus] = useState('');
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

  function setInfra(key: 'compute' | 'network', value: string) {
    setStack((s) => ({ ...s, [key]: value || undefined }));
  }

  /**
   * Mobile (and some desktop browsers): the OS share sheet, image attached —
   * X's own app is one of the targets a person picks there. Everywhere else:
   * X does not let a web page attach a file to its compose box, so this
   * downloads the card and opens a prefilled X post for the person to attach
   * it to, and copies the link as a fallback for anywhere that isn't X.
   */
  async function share() {
    const url = shareUrl(stack);
    const nav = navigator as Navigator & { canShare?: (d: unknown) => boolean };

    let file: File | undefined;
    try {
      const blob = await new Promise<Blob | null>((res) => renderCard(stack).toBlob(res, 'image/png'));
      if (blob) file = new File([blob], 'my-ai-stack.png', { type: 'image/png' });
    } catch { /* canvas can fail in odd environments — fall through to link-only share */ }

    if (file && nav.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'My AI stack', text: SHARE_TEXT });
        setShareLabel('Shared'); later(() => setShareLabel('Share'), 1800); return;
      } catch { /* user cancelled — try the next tier rather than treat it as failure */ }
    }
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My AI stack', text: SHARE_TEXT, url });
        setShareLabel('Shared'); later(() => setShareLabel('Share'), 1800); return;
      } catch { /* fall through to the desktop path */ }
    }

    downloadCard(stack);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(url)}`,
      '_blank', 'noopener',
    );
    try { await navigator.clipboard.writeText(url); } catch { /* clipboard blocked — the X tab still opened */ }
    setShareLabel('Saved — attach it on X'); later(() => setShareLabel('Share'), 2600);
  }

  async function ask(target: AiTarget) {
    const result = await askAbout(target, buildPrompt(stack));
    setAskStatus(
      result === 'prefilled' ? `Opened in ${target.name}.`
      : result === 'copied' ? `Copied — paste it into ${target.name}.`
      : `Opened ${target.name} — clipboard was blocked, you’ll need to type it.`,
    );
    later(() => { setAskOpen(false); setAskStatus(''); }, 2200);
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

        <Workbench compute={stack.compute} network={stack.network} onChange={setInfra} />

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
          <button className="job-chip job-chip-accent" aria-pressed={freeOnly} onClick={() => setFreeOnly((v) => !v)}>
            Free &amp; open only
          </button>
        </div>

        <Shelf query={query} filter={filter} freeOnly={freeOnly} stack={stack} onPick={pick} />

        <p className="foot">
          {filled === 9
            ? 'Nine slots, nine decisions. The other tools on the desk are somebody else’s problem.'
            : `${TOOLS.length - filled} tools you have not committed to.`}
          <br />
          Catalogue is opinionated and open —{' '}
          <a href="https://github.com/ponzgpt/toomanyaitems">suggest a tool</a>.
          <br />
          <span className="disclaimer">
            Not affiliated with or endorsed by any tool shown here. Marks belong to their owners —{' '}
            <a href="https://github.com/ponzgpt/toomanyaitems/blob/main/LOGOS.md">sourcing</a>.
          </span>
        </p>
      </main>

      <Hotbar
        stack={stack}
        swapped={swapped}
        onRemove={(job) => setStack((s) => ({ ...s, [job]: undefined }))}
        onShare={share}
        onDownload={() => downloadCard(stack)}
        onAsk={() => { setAskStatus(''); setAskOpen((v) => !v); }}
        shareLabel={shareLabel}
      />
      {askOpen && <AskMenu status={askStatus} onPick={ask} onClose={() => setAskOpen(false)} />}
    </>
  );
}
