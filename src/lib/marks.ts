/**
 * Brand marks, CC0, from simple-icons. Imported by name so the bundler ships
 * these 37 and not the other 3,400.
 *
 * Roughly half the AI industry is absent here: simple-icons removes marks on
 * request from the trademark holder, and OpenAI, Midjourney and Runway are all
 * gone. Those tools render as monogram tiles instead — see monogram().
 */
import {
  siAnytype,
  siClaude,
  siClaudecode,
  siCline,
  siCoderabbit,
  siCrewai,
  siCursor,
  siDeepgram,
  siDeepseek,
  siDify,
  siElevenlabs,
  siFlux,
  siGithubcopilot,
  siGooglegemini,
  siHuggingface,
  siKagi,
  siLangchain,
  siLmstudio,
  siLogseq,
  siMake,
  siMeta,
  siMistralai,
  siN8n,
  siNotion,
  siObsidian,
  siOllama,
  siPerplexity,
  siPoe,
  siQwen,
  siReplit,
  siSuno,
  siV0,
  siVllm,
  siWarp,
  siWindsurf,
  siZapier,
  siZedindustries,
} from 'simple-icons';

interface Mark { path: string; hex: string }

const MARKS: Record<string, Mark> = {
  anytype: { path: siAnytype.path, hex: "#"+siAnytype.hex },
  claude: { path: siClaude.path, hex: "#"+siClaude.hex },
  claudecode: { path: siClaudecode.path, hex: "#"+siClaudecode.hex },
  cline: { path: siCline.path, hex: "#"+siCline.hex },
  coderabbit: { path: siCoderabbit.path, hex: "#"+siCoderabbit.hex },
  crewai: { path: siCrewai.path, hex: "#"+siCrewai.hex },
  cursor: { path: siCursor.path, hex: "#"+siCursor.hex },
  deepgram: { path: siDeepgram.path, hex: "#"+siDeepgram.hex },
  deepseek: { path: siDeepseek.path, hex: "#"+siDeepseek.hex },
  dify: { path: siDify.path, hex: "#"+siDify.hex },
  elevenlabs: { path: siElevenlabs.path, hex: "#"+siElevenlabs.hex },
  flux: { path: siFlux.path, hex: "#"+siFlux.hex },
  githubcopilot: { path: siGithubcopilot.path, hex: "#"+siGithubcopilot.hex },
  googlegemini: { path: siGooglegemini.path, hex: "#"+siGooglegemini.hex },
  huggingface: { path: siHuggingface.path, hex: "#"+siHuggingface.hex },
  kagi: { path: siKagi.path, hex: "#"+siKagi.hex },
  langchain: { path: siLangchain.path, hex: "#"+siLangchain.hex },
  lmstudio: { path: siLmstudio.path, hex: "#"+siLmstudio.hex },
  logseq: { path: siLogseq.path, hex: "#"+siLogseq.hex },
  make: { path: siMake.path, hex: "#"+siMake.hex },
  meta: { path: siMeta.path, hex: "#"+siMeta.hex },
  mistralai: { path: siMistralai.path, hex: "#"+siMistralai.hex },
  n8n: { path: siN8n.path, hex: "#"+siN8n.hex },
  notion: { path: siNotion.path, hex: "#"+siNotion.hex },
  obsidian: { path: siObsidian.path, hex: "#"+siObsidian.hex },
  ollama: { path: siOllama.path, hex: "#"+siOllama.hex },
  perplexity: { path: siPerplexity.path, hex: "#"+siPerplexity.hex },
  poe: { path: siPoe.path, hex: "#"+siPoe.hex },
  qwen: { path: siQwen.path, hex: "#"+siQwen.hex },
  replit: { path: siReplit.path, hex: "#"+siReplit.hex },
  suno: { path: siSuno.path, hex: "#"+siSuno.hex },
  v0: { path: siV0.path, hex: "#"+siV0.hex },
  vllm: { path: siVllm.path, hex: "#"+siVllm.hex },
  warp: { path: siWarp.path, hex: "#"+siWarp.hex },
  windsurf: { path: siWindsurf.path, hex: "#"+siWindsurf.hex },
  zapier: { path: siZapier.path, hex: "#"+siZapier.hex },
  zedindustries: { path: siZedindustries.path, hex: "#"+siZedindustries.hex },
};

/** The mark for a simple-icons slug, or null when that brand has none. */
export function mark(slug: string | null): Mark | null {
  return slug ? MARKS[slug] ?? null : null;
}

/**
 * Fallback tiles for brands with no CC0 mark — half the catalogue.
 *
 * Assigned across the whole catalogue rather than per name, because a third of
 * these collide on naive initials (Copilot/Codex/Consensus/ComfyUI all give
 * "CO"), and a wall of identical tiles defeats the point of the tile.
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
    if (t.si) continue;
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

/**
 * Some brand colours (Hugging Face yellow, Deepgram green) vanish against
 * paper. Darken anything above the readable luminance ceiling rather than
 * special-casing brands, so a palette change upstream cannot reintroduce this.
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
