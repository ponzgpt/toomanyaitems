import { useEffect, useRef } from 'react';
import { AI_TARGETS, type AiTarget } from '../lib/prompt.ts';

// re-export so App.tsx has one import path for the type
export type { AiTarget };

interface Props {
  status: string;
  onPick: (target: (typeof AI_TARGETS)[number]) => void;
  onClose: () => void;
}

/** Small popover anchored to the "Explain it" button. Closes on outside click or Escape. */
export function AskMenu({ status, onPick, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <div className="ask-menu" ref={ref} role="menu">
      {status ? (
        <p className="ask-status">{status}</p>
      ) : (
        <>
          <p className="ask-hint">Open a plan for this stack in —</p>
          {AI_TARGETS.map((t) => (
            <button key={t.id} className="ask-option" role="menuitem" onClick={() => onPick(t)}>
              {t.name}
              <span className="ask-mode">{t.prefillUrl ? 'opens filled in' : 'copies the prompt'}</span>
            </button>
          ))}
        </>
      )}
    </div>
  );
}
