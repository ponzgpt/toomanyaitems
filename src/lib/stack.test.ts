/**
 * The one runnable check: `npm test`. No framework — Node runs TypeScript.
 * Covers the two things that silently break in production: the URL codec
 * (shared links) and catalogue integrity (missing icons, bad job ids).
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { encodeStack, decodeStack, stackSize, type Stack } from './stack.ts';
import { mark, monogram, onPaper } from './marks.ts';
import { JOBS, TOOLS, TOOL_BY_ID } from '../data/tools.ts';
import { COMPUTE, NETWORK } from '../data/infra.ts';
import { buildPrompt } from './prompt.ts';

test('round-trips a stack', () => {
  const s: Stack = { chat: 'claude', code: 'cursor', local: 'ollama' };
  assert.deepEqual(decodeStack(encodeStack(s)), s);
});

test('encodes in JOBS order, not insertion order', () => {
  assert.equal(encodeStack({ local: 'ollama', chat: 'claude' }), 'chat:claude,local:ollama');
});

test('empty stack round-trips to empty', () => {
  assert.equal(encodeStack({}), '');
  assert.deepEqual(decodeStack(''), {});
  assert.equal(stackSize({}), 0);
});

test('drops an unknown job', () => {
  assert.deepEqual(decodeStack('nope:claude,chat:claude'), { chat: 'claude' });
});

test('drops an unknown tool', () => {
  assert.deepEqual(decodeStack('chat:notathing'), {});
});

test('drops a tool filed under the wrong job', () => {
  // A crafted link must not smuggle a video tool into the chat slot.
  assert.deepEqual(decodeStack('chat:runway'), {});
});

test('survives garbage without throwing', () => {
  for (const junk of ['', ':', ',,,', 'chat', 'chat:', ':claude', 'a:b:c', '%%%', '__proto__:x']) {
    assert.doesNotThrow(() => decodeStack(junk), junk);
  }
  assert.deepEqual(decodeStack('__proto__:x'), {});
  assert.equal(({} as Record<string, unknown>).x, undefined, 'prototype untouched');
});

test('a repeated job keeps the last one', () => {
  assert.deepEqual(decodeStack('chat:claude,chat:chatgpt'), { chat: 'chatgpt' });
});

test('every tool has a unique id', () => {
  assert.equal(TOOL_BY_ID.size, TOOLS.length);
});

test('every tool belongs to a declared job', () => {
  const ids = new Set(JOBS.map((j) => j.id));
  for (const t of TOOLS) assert.ok(ids.has(t.job), `${t.id} has job ${t.job}`);
});

test('every declared icon slug resolves to a real mark', () => {
  // Catches a typo in tools.ts, or a mark either source has since removed.
  for (const t of TOOLS.filter((t) => t.si || t.logo)) {
    assert.ok(mark(t.si, t.logo), `${t.id} declares si:${t.si} logo:${t.logo} but no mark resolves`);
  }
});

test('every job has something to put in it', () => {
  for (const j of JOBS) {
    assert.ok(TOOLS.some((t) => t.job === j.id), `job ${j.id} is empty`);
  }
});

test('monogram covers every tool without a mark', () => {
  for (const t of TOOLS.filter((t) => !mark(t.si, t.logo))) {
    const m = monogram(t.name);
    assert.match(m.text, /^[A-Z0-9]{2,3}$/, `${t.name} -> ${m.text}`);
    assert.match(m.color, /^hsl\(/);
  }
});

test('monogram is deterministic', () => {
  assert.deepEqual(monogram('Midjourney'), monogram('Midjourney'));
});

test('every tool url is https', () => {
  for (const t of TOOLS) assert.ok(t.url.startsWith('https://'), `${t.id}: ${t.url}`);
});

test('no two monogram tiles read the same', () => {
  // A third of the catalogue collides on naive initials; a wall of identical
  // "CO" tiles is worse than no tile at all.
  const seen = new Map<string, string>();
  for (const t of TOOLS.filter((t) => !mark(t.si, t.logo))) {
    const { text } = monogram(t.name);
    assert.ok(!seen.has(text), `${t.name} and ${seen.get(text)} both render "${text}"`);
    seen.set(text, t.name);
  }
});

test('monograms stay short enough to read in a tile', () => {
  for (const t of TOOLS.filter((t) => !mark(t.si, t.logo))) {
    assert.ok(monogram(t.name).text.length <= 3, `${t.name} -> ${monogram(t.name).text}`);
  }
});

// ── compute/network (workbench) ─────────────────────────────────────────────

test('compute and network round-trip alongside tool picks', () => {
  const s: Stack = { chat: 'claude', compute: 'hetzner', network: 'tailscale' };
  assert.deepEqual(decodeStack(encodeStack(s)), s);
});

test('an unknown compute or network id is dropped, not trusted', () => {
  assert.deepEqual(decodeStack('compute:nope,network:nope,chat:claude'), { chat: 'claude' });
});

test('compute/network do not count toward the 9-slot size', () => {
  assert.equal(stackSize({ compute: 'hetzner', network: 'tailscale' }), 0);
});

test('every infra icon slug resolves to a real mark', () => {
  for (const i of [...COMPUTE, ...NETWORK].filter((i) => i.si)) {
    assert.ok(mark(i.si, null), `${i.id} declares si:${i.si} but no mark resolves`);
  }
});

test('every infra entry has a unique id within its list', () => {
  for (const list of [COMPUTE, NETWORK]) {
    const ids = list.map((i) => i.id);
    assert.equal(new Set(ids).size, ids.length);
  }
});

// ── the explain-it prompt ────────────────────────────────────────────────────

test('the prompt lists every chosen tool and stays silent on empty jobs', () => {
  const p = buildPrompt({ chat: 'claude', code: 'cursor' });
  assert.match(p, /Claude/);
  assert.match(p, /Cursor/);
  assert.doesNotMatch(p, /Find:/);
});

test('the prompt mentions compute and network only when set', () => {
  assert.doesNotMatch(buildPrompt({ chat: 'claude' }), /Running on|Connected over/);
  const p = buildPrompt({ chat: 'claude', compute: 'hetzner', network: 'tailscale' });
  assert.match(p, /Running on: Hetzner/);
  assert.match(p, /Connected over: Tailscale/);
});

test('an empty stack still produces a non-empty prompt', () => {
  assert.ok(buildPrompt({}).length > 0);
});

// ── contrast guard ──────────────────────────────────────────────────────────

test('onPaper darkens a colour too light for the paper background', () => {
  const darkened = onPaper('#ffd21e'); // Hugging Face yellow
  assert.notEqual(darkened, '#ffd21e');
  assert.match(darkened, /^#[0-9a-f]{6}$/);
});

test('onPaper leaves an already-dark colour untouched', () => {
  assert.equal(onPaper('#1c1b19'), '#1c1b19');
});
