/**
 * Brand marks from two permissively-licensed sources, plus a monogram
 * fallback for the rest.
 *
 * - simple-icons (CC0): marks the trademark holder explicitly released for
 *   free redistribution. Roughly 40% of AI tools — several removed on
 *   request (OpenAI, Midjourney, Runway among them).
 * - @lobehub/icons-static-svg (MIT): a set built specifically to identify
 *   AI/LLM brands, sourced from official marks. Used here the same way any
 *   "best AI tools" directory uses a vendor's logo — to identify their
 *   product, not to claim affiliation. See LOGOS.md.
 *
 * Both ship the same shape (currentColor SVG path(s), 24x24 viewBox), so one
 * render path in Tile.tsx and share.ts covers all three tiers.
 */
import {
  siAnytype, siClaude, siClaudecode, siCline, siCoderabbit, siCrewai,
  siCursor, siDeepgram, siDeepseek, siDify, siElevenlabs, siFlux,
  siGithubcopilot, siGooglegemini, siHuggingface, siKagi, siLangchain,
  siLmstudio, siLogseq, siMake, siMeta, siMistralai, siN8n, siNotion,
  siObsidian, siOllama, siPerplexity, siPoe, siQwen, siReplit, siSuno,
  siV0, siVllm, siWarp, siWindsurf, siZapier, siZedindustries,
  siNodered, siAffine,
  // Workbench strip (infra.ts) — compute and network brands, not AI tools.
  siRaspberrypi, siSynology, siUnraid, siTruenas, siProxmox, siHetzner,
  siDigitalocean, siVultr, siTailscale, siZerotier, siWireguard, siCloudflare,
} from 'simple-icons';
import lobe from './lobe-marks.data.json' with { type: 'json' };

export interface Mark { paths: string[]; hex: string }

const INK = '#1c1b19';

const SI: Record<string, Mark> = Object.fromEntries(
  Object.entries({
    anytype: siAnytype, claude: siClaude, claudecode: siClaudecode, cline: siCline,
    coderabbit: siCoderabbit, crewai: siCrewai, cursor: siCursor, deepgram: siDeepgram,
    deepseek: siDeepseek, dify: siDify, elevenlabs: siElevenlabs, flux: siFlux,
    githubcopilot: siGithubcopilot, googlegemini: siGooglegemini, huggingface: siHuggingface,
    kagi: siKagi, langchain: siLangchain, lmstudio: siLmstudio, logseq: siLogseq,
    make: siMake, meta: siMeta, mistralai: siMistralai, n8n: siN8n, notion: siNotion,
    obsidian: siObsidian, ollama: siOllama, perplexity: siPerplexity, poe: siPoe,
    qwen: siQwen, replit: siReplit, suno: siSuno, v0: siV0, vllm: siVllm, warp: siWarp,
    windsurf: siWindsurf, zapier: siZapier, zedindustries: siZedindustries,
    nodered: siNodered, affine: siAffine,
    raspberrypi: siRaspberrypi, synology: siSynology, unraid: siUnraid,
    truenas: siTruenas, proxmox: siProxmox, hetzner: siHetzner,
    digitalocean: siDigitalocean, vultr: siVultr, tailscale: siTailscale,
    zerotier: siZerotier, wireguard: siWireguard, cloudflare: siCloudflare,
  }).map(([slug, icon]) => [slug, { paths: [icon.path], hex: `#${icon.hex}` }]),
);

const LOBE: Record<string, Mark> = Object.fromEntries(
  Object.entries(lobe as Record<string, { paths: string[]; hex: string | null }>)
    .map(([slug, v]) => [slug, { paths: v.paths, hex: v.hex ?? INK }]),
);

/**
 * `si` (simple-icons slug) wins when both are set — it is the vetted,
 * longer-standing set. `logo` (lobehub slug) fills the gap for brands
 * simple-icons does not carry.
 */
export function mark(si: string | null, logo: string | null = null): Mark | null {
  return (si && SI[si]) || (logo && LOBE[logo]) || null;
}

/**
 * Some brand colours (Hugging Face yellow, Tavily's pale blue) vanish
 * against paper. Darken anything above the readable luminance ceiling
 * rather than special-casing brands, so a palette change upstream cannot
 * reintroduce this.
 */
export function onPaper(hex: string): string {
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const lum = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  if (lum <= 0.55) return hex;
  const k = Math.sqrt(0.45 / lum); // scale toward the ceiling, keeping the hue
  const to = (v: number) => Math.round(Math.min(255, v * 255 * k)).toString(16).padStart(2, '0');
  return `#${rgb.map(to).join('')}`;
}

/**
 * Fallback tiles for brands with no self-hosted mark either. Assigned across
 * the whole catalogue rather than per name, because naive initials collide
 * often (Copilot/Codex/Consensus/ComfyUI all give "CO"), and a wall of
 * identical tiles defeats the point of the tile.
 */
import { TOOLS } from '../data/tools.ts';

/** Shortest-first ladder; the first spelling nobody has taken wins. */
function candidates(name: string): string[] {
  const clean = name.replace(/[^A-Za-z0-9 .]/g, ' ');
  const words = clean.split(/[\s.]+/).filter(Boolean);
  const first = words[0] ?? '?';
  const caps = clean.replace(/[^A-Z0-9]/g, '');
  return [
    words.length > 1 ? words[0][0] + words[1][0] : '', // Le Chat -> LC
    caps.length > 1 ? caps[0] + caps[1] : '',          // CapCut  -> CC
    first.slice(0, 2),                                 // Grok    -> GR
    first.slice(0, 3),                                 // Granola -> GRA
    first[0] + first.slice(-1),
    first.slice(0, 4),
  ]
    .filter((c) => c.length > 1)
    .map((c) => c.toUpperCase());
}

const ASSIGNED: Map<string, string> = (() => {
  const taken = new Set<string>();
  const out = new Map<string, string>();
  for (const t of TOOLS) {
    if (mark(t.si, t.logo)) continue;
    const text = candidates(t.name).find((c) => !taken.has(c)) ?? t.name.slice(0, 3).toUpperCase();
    taken.add(text);
    out.set(t.name, text);
  }
  return out;
})();

export function monogram(name: string): { text: string; color: string } {
  const text = ASSIGNED.get(name) ?? candidates(name)[0] ?? '??';

  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  // Golden-angle stepping keeps neighbouring tiles from landing on the same hue.
  const hue = Math.round((h * 137.508) % 360);
  return { text, color: `hsl(${hue} 42% 44%)` };
}
