/**
 * A stack is one tool per job, plus at most one compute and one network
 * choice underneath. The 9-job constraint is the product: you cannot keep
 * two daily drivers, so picking a second one is visibly discarding the
 * first. Compute/network are not jobs — see infra.ts — so they never grow
 * the grid past 3x3.
 *
 * Encoded as `chat:claude,code:cursor,compute:hetzner` in the URL fragment —
 * keyed rather than positional, so reordering JOBS never silently rewrites
 * somebody's saved link. `:` and `,` are both legal in a fragment, so it
 * needs no escaping and stays readable.
 */
import { JOBS, TOOL_BY_ID, type JobId } from '../data/tools.ts';
import { COMPUTE_BY_ID, NETWORK_BY_ID } from '../data/infra.ts';

export type Stack = Partial<Record<JobId, string>> & {
  compute?: string;
  network?: string;
};

const JOB_IDS = new Set<string>(JOBS.map((j) => j.id));
const STORAGE_KEY = 'tmai.stack.v2';
const HASH_KEY = 's';
const INFRA_KEYS = ['compute', 'network'] as const;

export function encodeStack(stack: Stack): string {
  const jobPairs = JOBS.filter((j) => stack[j.id]).map((j) => `${j.id}:${stack[j.id]}`);
  const infraPairs = INFRA_KEYS.filter((k) => stack[k]).map((k) => `${k}:${stack[k]}`);
  return [...jobPairs, ...infraPairs].join(',');
}

/**
 * Anything arriving here came from a URL somebody else wrote, so every pair is
 * checked: unknown key, unknown id, or a tool filed under a job it does not
 * belong to are all dropped rather than trusted. Never throws.
 */
export function decodeStack(raw: string): Stack {
  const out: Stack = {};
  if (!raw) return out;
  for (const pair of raw.split(',')) {
    const sep = pair.indexOf(':');
    if (sep < 1) continue;
    const key = pair.slice(0, sep);
    const id = pair.slice(sep + 1);

    if (key === 'compute') { if (COMPUTE_BY_ID.has(id)) out.compute = id; continue; }
    if (key === 'network') { if (NETWORK_BY_ID.has(id)) out.network = id; continue; }
    if (!JOB_IDS.has(key)) continue;
    const tool = TOOL_BY_ID.get(id);
    if (!tool || tool.job !== key) continue;
    out[key as JobId] = id; // a repeated key keeps the last one
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
