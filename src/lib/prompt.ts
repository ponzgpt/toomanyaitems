/**
 * Turns a stack into a plain-language prompt asking an assistant to explain
 * how the pieces fit and how to actually set it up.
 *
 * Only ChatGPT has a documented way to open with a prompt already typed
 * (`?q=`). Claude and Gemini deliberately do not support this — a link that
 * silently injects text into someone else's chat is exactly the kind of
 * thing a prompt-injection-safety feature exists to block — so for those we
 * copy the prompt and open a blank chat instead of pretending it prefilled.
 */
import { JOBS, TOOL_BY_ID } from '../data/tools.ts';
import { COMPUTE_BY_ID, NETWORK_BY_ID } from '../data/infra.ts';
import type { Stack } from './stack.ts';

export function buildPrompt(stack: Stack): string {
  const lines = JOBS
    .filter((j) => stack[j.id])
    .map((j) => {
      const t = TOOL_BY_ID.get(stack[j.id]!)!;
      return `- ${j.label}: ${t.name} — ${t.note}`;
    });

  const compute = stack.compute ? COMPUTE_BY_ID.get(stack.compute) : undefined;
  const network = stack.network ? NETWORK_BY_ID.get(stack.network) : undefined;
  const infra = [
    compute && `Running on: ${compute.name}`,
    network && `Connected over: ${network.name}`,
  ].filter(Boolean) as string[];

  return [
    'Here is my personal AI tool stack, one tool per job:',
    '',
    ...lines,
    ...(infra.length ? ['', ...infra] : []),
    '',
    'In plain language: explain how these fit together conceptually, then give',
    'me a short, concrete, ordered plan for setting this up myself. Call out any',
    'real gap or redundancy you see in the stack itself.',
  ].join('\n');
}

export interface AiTarget {
  id: string;
  name: string;
  /** Present only where the provider supports opening with the prompt typed in. */
  prefillUrl?: (prompt: string) => string;
  /** Fallback destination: open blank, prompt goes to the clipboard instead. */
  openUrl: string;
}

export const AI_TARGETS: AiTarget[] = [
  { id: 'chatgpt', name: 'ChatGPT', prefillUrl: (p) => `https://chatgpt.com/?q=${encodeURIComponent(p)}`, openUrl: 'https://chatgpt.com' },
  { id: 'claude', name: 'Claude', openUrl: 'https://claude.ai/new' },
  { id: 'gemini', name: 'Gemini', openUrl: 'https://gemini.google.com/app' },
];

/** Opens the target with the prompt typed in where supported, else copies it and says so. */
export async function askAbout(target: AiTarget, prompt: string): Promise<'prefilled' | 'copied' | 'failed'> {
  if (target.prefillUrl) {
    window.open(target.prefillUrl(prompt), '_blank', 'noopener');
    return 'prefilled';
  }
  try {
    await navigator.clipboard.writeText(prompt);
    window.open(target.openUrl, '_blank', 'noopener');
    return 'copied';
  } catch {
    window.open(target.openUrl, '_blank', 'noopener');
    return 'failed';
  }
}
