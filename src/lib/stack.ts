/**
 * A stack is one tool per job. That constraint is the product: you cannot keep
 * two daily drivers, so picking a second one is visibly discarding the first.
 *
 * Encoded as `chat:claude,code:cursor` in the URL fragment — keyed rather than
 * positional, so reordering JOBS never silently rewrites somebody's saved link.
 * `:` and `,` are both legal in a fragment, so it needs no escaping and stays
 * readable.
 */
import { JOBS, TOOL_BY_ID, type JobId } from '../data/tools.ts';

export type Stack = Partial<Record<JobId, string>>;

const JOB_IDS = new Set<string>(JOBS.map((j) => j.id));
const STORAGE_KEY = 'tmai.stack.v1';
const HASH_KEY = 's';

export function encodeStack(stack: Stack): string {
  return JOBS.filter((j) => stack[j.id])
    .map((j) => `${j.id}:${stack[j.id]}`)
    .join(',');
}

/**
 * Anything arriving here came from a URL somebody else wrote, so every pair is
 * checked: unknown job, unknown tool, or a tool filed under a job it does not
 * belong to are all dropped rather than trusted. Never throws.
 */
export function decodeStack(raw: string): Stack {
  const out: Stack = {};
  if (!raw) return out;
  for (const pair of raw.split(',')) {
    const sep = pair.indexOf(':');
    if (sep < 1) continue;
    const job = pair.slice(0, sep);
    const toolId = pair.slice(sep + 1);
    if (!JOB_IDS.has(job)) continue;
    const tool = TOOL_BY_ID.get(toolId);
    if (!tool || tool.job !== job) continue;
    out[job as JobId] = toolId; // a repeated job keeps the last one
  }
  return out;
}

export const stackSize = (s: Stack) => JOBS.filter((j) => s[j.id]).length;

export function shareUrl(stack: Stack, base = location.href): string {
  const url = new URL(base);
  url.hash = `${HASH_KEY}=${encodeStack(stack)}`;
  return url.toString();
}

/** A shared link wins over local storage: following someone's link should show theirs. */
export function readStack(): Stack {
  const hash = new URLSearchParams(location.hash.replace(/^#/, '')).get(HASH_KEY);
  if (hash) return decodeStack(hash);
  try {
    return decodeStack(localStorage.getItem(STORAGE_KEY) ?? '');
  } catch {
    return {}; // private mode, blocked storage — not worth failing over
  }
}

export function writeStack(stack: Stack): void {
  const encoded = encodeStack(stack);
  try {
    localStorage.setItem(STORAGE_KEY, encoded);
  } catch { /* see readStack */ }
  // replaceState, not a hash assignment: picking nine tools should not bury the
  // back button under nine history entries.
  history.replaceState(null, '', encoded ? `#${HASH_KEY}=${encoded}` : location.pathname);
}
