/**
 * Renders the stack as a 1200x630 card. Drawn on a canvas rather than
 * screenshotting the DOM: the share image wants OG proportions and a layout of
 * its own, which a screenshot cannot give, and this way it costs no dependency.
 */
import { JOBS, TOOLS, TOOL_BY_ID } from '../data/tools.ts';
import { mark, monogram, onPaper } from './marks.ts';
import type { Stack } from './stack.ts';

const W = 1200, H = 630, PAD = 64;
const PAPER = '#f7f4ed', PAPER2 = '#fffdf8', INK = '#1c1b19', MUTED = '#706a60', RULE = '#e2dbd0', ACCENT = '#b8420f';
const SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, monospace';

export function renderCard(stack: Stack): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 28) { ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 28) { ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); ctx.stroke(); }

  const filled = JOBS.filter((j) => stack[j.id]).length;

  ctx.fillStyle = INK;
  ctx.font = `800 52px ${SANS}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('My AI stack', PAD, PAD + 44);

  ctx.fillStyle = MUTED;
  ctx.font = `500 21px ${MONO}`;
  ctx.fillText(`${filled} of 9 slots · ${TOOLS.length - filled} tools left on the pile`, PAD, PAD + 80);

  // 3x3 of job cards.
  const gap = 16;
  const top = 190;
  const cw = (W - PAD * 2 - gap * 2) / 3;
  const ch = (H - top - PAD - 30 - gap * 2) / 3;

  JOBS.forEach((job, i) => {
    const x = PAD + (i % 3) * (cw + gap);
    const y = top + Math.floor(i / 3) * (ch + gap);
    const tool = stack[job.id] ? TOOL_BY_ID.get(stack[job.id]!) : undefined;

    ctx.beginPath();
    ctx.roundRect(x, y, cw, ch, 14);
    ctx.fillStyle = tool ? PAPER2 : 'rgba(0,0,0,0.015)';
    ctx.fill();
    ctx.strokeStyle = tool ? INK : RULE;
    ctx.lineWidth = tool ? 1.5 : 1;
    ctx.stroke();

    const size = 44;
    const ix = x + 20, iy = y + (ch - size) / 2;
    if (tool) drawTile(ctx, tool.name, tool.si, ix, iy, size);

    const tx = ix + size + 18;
    ctx.fillStyle = MUTED;
    ctx.font = `600 15px ${MONO}`;
    ctx.fillText(job.label.toUpperCase(), tx, y + ch / 2 - 8);

    ctx.fillStyle = tool ? INK : RULE;
    ctx.font = `700 23px ${SANS}`;
    ctx.fillText(tool ? fit(ctx, tool.name, cw - (tx - x) - 18) : '—', tx, y + ch / 2 + 20);
  });

  ctx.fillStyle = MUTED;
  ctx.font = `500 19px ${MONO}`;
  ctx.fillText('toomanyaitems', PAD, H - PAD + 14);
  ctx.fillStyle = ACCENT;
  ctx.font = `700 19px ${MONO}`;
  const tail = 'keep the 20% · drop the 80%';
  ctx.fillText(tail, W - PAD - ctx.measureText(tail).width, H - PAD + 14);

  return canvas;
}

function drawTile(ctx: CanvasRenderingContext2D, name: string, si: string | null, x: number, y: number, s: number) {
  ctx.save();
  ctx.beginPath(); ctx.roundRect(x, y, s, s, 9);
  ctx.fillStyle = PAPER2; ctx.fill();
  ctx.strokeStyle = RULE; ctx.lineWidth = 1; ctx.stroke();

  const m = mark(si);
  const inner = s * 0.58, off = (s - inner) / 2;
  if (m) {
    ctx.translate(x + off, y + off);
    ctx.scale(inner / 24, inner / 24);
    ctx.fillStyle = onPaper(m.hex);
    ctx.fill(new Path2D(m.path));
  } else {
    const { text, color } = monogram(name);
    ctx.beginPath(); ctx.roundRect(x + off, y + off, inner, inner, 5);
    ctx.fillStyle = color; ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `700 ${Math.round(inner * (text.length > 2 ? 0.40 : 0.52))}px ${MONO}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, x + s / 2, y + s / 2 + 1);
  }
  ctx.restore();
}

/** Long names get an ellipsis rather than bleeding out of the card. */
function fit(ctx: CanvasRenderingContext2D, text: string, max: number): string {
  if (ctx.measureText(text).width <= max) return text;
  let out = text;
  while (out.length > 1 && ctx.measureText(out + '…').width > max) out = out.slice(0, -1);
  return out + '…';
}

export function downloadCard(stack: Stack): void {
  renderCard(stack).toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-ai-stack.png';
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
