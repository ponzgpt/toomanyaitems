/**
 * The catalogue. Deliberately overwhelming — the volume is the argument.
 *
 * `si` is a simple-icons slug (CC0) when that brand ships one. Roughly half of
 * the AI industry has had its icon pulled from simple-icons on trademark
 * grounds, so the rest render as monogram tiles. Uniform tiles are the point:
 * this is an item grid, not a logo wall.
 */

export type JobId =
  | 'chat' | 'code' | 'search' | 'image' | 'video'
  | 'voice' | 'notes' | 'automate' | 'local';

export interface Job {
  id: JobId;
  /** Slot label. A verb, because slots are jobs, not categories. */
  label: string;
  /** The question the slot answers, shown when it is empty. */
  ask: string;
}

export interface Tool {
  id: string;
  name: string;
  job: JobId;
  /** simple-icons slug, or null to fall back to a monogram tile. */
  si: string | null;
  /** What it is, in a handful of words. No marketing. */
  note: string;
  url: string;
}

/** Nine slots, one per job. You cannot keep two daily drivers — that is the product. */
export const JOBS: Job[] = [
  { id: 'chat',     label: 'Think',    ask: 'Which assistant do you open first?' },
  { id: 'code',     label: 'Build',    ask: 'What writes and ships your code?' },
  { id: 'search',   label: 'Find',     ask: 'Where do you go for sourced answers?' },
  { id: 'image',    label: 'Draw',     ask: 'What makes your images?' },
  { id: 'video',    label: 'Film',     ask: 'What makes your video?' },
  { id: 'voice',    label: 'Speak',    ask: 'What handles voice and audio?' },
  { id: 'notes',    label: 'Remember', ask: 'Where does what you learn end up?' },
  { id: 'automate', label: 'Wire',     ask: 'What runs things without you?' },
  { id: 'local',    label: 'Own',      ask: 'What runs on your own machine?' },
];

export const TOOLS: Tool[] = [
  // ── Think ────────────────────────────────────────────────────────────────
  { id: 'chatgpt',      name: 'ChatGPT',      job: 'chat', si: null,           note: 'The default. Widest tool and app ecosystem.',        url: 'https://chatgpt.com' },
  { id: 'claude',       name: 'Claude',       job: 'chat', si: 'claude',       note: 'Long context, strong on writing and code.',          url: 'https://claude.ai' },
  { id: 'gemini',       name: 'Gemini',       job: 'chat', si: 'googlegemini', note: 'Deepest Google Workspace integration.',              url: 'https://gemini.google.com' },
  { id: 'grok',         name: 'Grok',         job: 'chat', si: null,           note: 'Wired into X, loosest content policy.',              url: 'https://grok.com' },
  { id: 'deepseek',     name: 'DeepSeek',     job: 'chat', si: 'deepseek',     note: 'Open weights, very cheap reasoning.',                url: 'https://chat.deepseek.com' },
  { id: 'qwen',         name: 'Qwen',         job: 'chat', si: 'qwen',         note: 'Alibaba. Open weights, strong multilingual.',        url: 'https://chat.qwen.ai' },
  { id: 'lechat',       name: 'Le Chat',      job: 'chat', si: 'mistralai',    note: 'Mistral. EU-hosted, fast.',                          url: 'https://chat.mistral.ai' },
  { id: 'copilot',      name: 'Copilot',      job: 'chat', si: null,           note: 'Microsoft. Sits inside Office and Windows.',         url: 'https://copilot.microsoft.com' },
  { id: 'poe',          name: 'Poe',          job: 'chat', si: 'poe',          note: 'Many models behind one subscription.',               url: 'https://poe.com' },
  { id: 'metaai',       name: 'Meta AI',      job: 'chat', si: 'meta',         note: 'Inside WhatsApp and Instagram.',                     url: 'https://meta.ai' },
  { id: 'kimi',         name: 'Kimi',         job: 'chat', si: null,           note: 'Moonshot. Very long context.',                       url: 'https://kimi.moonshot.cn' },

  // ── Build ────────────────────────────────────────────────────────────────
  { id: 'claudecode',   name: 'Claude Code',  job: 'code', si: 'claudecode',   note: 'Terminal agent. Edits and runs your repo.',          url: 'https://claude.com/claude-code' },
  { id: 'cursor',       name: 'Cursor',       job: 'code', si: 'cursor',       note: 'VS Code fork built around the model.',               url: 'https://cursor.com' },
  { id: 'ghcopilot',    name: 'GitHub Copilot', job: 'code', si: 'githubcopilot', note: 'In-editor completion, everywhere.',               url: 'https://github.com/features/copilot' },
  { id: 'codex',        name: 'Codex',        job: 'code', si: null,           note: 'OpenAI coding agent, CLI and cloud.',                url: 'https://openai.com/codex' },
  { id: 'windsurf',     name: 'Windsurf',     job: 'code', si: 'windsurf',     note: 'Agentic editor with flow-style context.',            url: 'https://windsurf.com' },
  { id: 'zed',          name: 'Zed',          job: 'code', si: 'zedindustries',note: 'Fast native editor, agents built in.',               url: 'https://zed.dev' },
  { id: 'cline',        name: 'Cline',        job: 'code', si: 'cline',        note: 'Open-source agent inside VS Code.',                  url: 'https://cline.bot' },
  { id: 'aider',        name: 'Aider',        job: 'code', si: null,           note: 'Terminal pair programmer, git-native.',              url: 'https://aider.chat' },
  { id: 'replit',       name: 'Replit',       job: 'code', si: 'replit',       note: 'Prompt to deployed app, in the browser.',            url: 'https://replit.com' },
  { id: 'v0',           name: 'v0',           job: 'code', si: 'v0',           note: 'Vercel. Prompt to React UI.',                        url: 'https://v0.app' },
  { id: 'lovable',      name: 'Lovable',      job: 'code', si: null,           note: 'Prompt to full-stack app, non-technical.',           url: 'https://lovable.dev' },
  { id: 'bolt',         name: 'Bolt',         job: 'code', si: null,           note: 'StackBlitz. In-browser full-stack builds.',          url: 'https://bolt.new' },
  { id: 'warp',         name: 'Warp',         job: 'code', si: 'warp',         note: 'Terminal with an agent attached.',                   url: 'https://warp.dev' },
  { id: 'coderabbit',   name: 'CodeRabbit',   job: 'code', si: 'coderabbit',   note: 'Automated PR review.',                               url: 'https://coderabbit.ai' },
  { id: 'devin',        name: 'Devin',        job: 'code', si: null,           note: 'Cognition. Autonomous long-running agent.',          url: 'https://devin.ai' },

  // ── Find ─────────────────────────────────────────────────────────────────
  { id: 'perplexity',   name: 'Perplexity',   job: 'search', si: 'perplexity', note: 'Answers with citations. The category default.',      url: 'https://perplexity.ai' },
  { id: 'kagi',         name: 'Kagi',         job: 'search', si: 'kagi',       note: 'Paid search, no ads, AI on top.',                    url: 'https://kagi.com' },
  { id: 'exa',          name: 'Exa',          job: 'search', si: null,         note: 'Search API built for agents.',                       url: 'https://exa.ai' },
  { id: 'tavily',       name: 'Tavily',       job: 'search', si: null,         note: 'Retrieval API for LLM pipelines.',                   url: 'https://tavily.com' },
  { id: 'youcom',       name: 'You.com',      job: 'search', si: null,         note: 'Multi-model answer engine.',                         url: 'https://you.com' },
  { id: 'phind',        name: 'Phind',        job: 'search', si: null,         note: 'Search tuned for developers.',                       url: 'https://phind.com' },
  { id: 'glean',        name: 'Glean',        job: 'search', si: null,         note: 'Search across your company’s own tools.',       url: 'https://glean.com' },
  { id: 'elicit',       name: 'Elicit',       job: 'search', si: null,         note: 'Literature review over real papers.',                url: 'https://elicit.com' },
  { id: 'consensus',    name: 'Consensus',    job: 'search', si: null,         note: 'Answers drawn from scientific papers.',              url: 'https://consensus.app' },

  // ── Draw ─────────────────────────────────────────────────────────────────
  { id: 'midjourney',   name: 'Midjourney',   job: 'image', si: null,          note: 'Best-looking output, weakest control.',              url: 'https://midjourney.com' },
  { id: 'flux',         name: 'Flux',         job: 'image', si: 'flux',        note: 'Black Forest Labs. Open weights, strong prompts.',   url: 'https://blackforestlabs.ai' },
  { id: 'sd',           name: 'Stable Diffusion', job: 'image', si: null,      note: 'The open ecosystem everything else forks.',          url: 'https://stability.ai' },
  { id: 'ideogram',     name: 'Ideogram',     job: 'image', si: null,          note: 'The one that gets text in images right.',            url: 'https://ideogram.ai' },
  { id: 'krea',         name: 'Krea',         job: 'image', si: null,          note: 'Realtime canvas, many models in one place.',         url: 'https://krea.ai' },
  { id: 'recraft',      name: 'Recraft',      job: 'image', si: null,          note: 'Vector and brand-consistent output.',                url: 'https://recraft.ai' },
  { id: 'leonardo',     name: 'Leonardo',     job: 'image', si: null,          note: 'Game and concept art pipelines.',                    url: 'https://leonardo.ai' },
  { id: 'firefly',      name: 'Adobe Firefly',job: 'image', si: null,          note: 'Licensed training data, inside Creative Cloud.',     url: 'https://firefly.adobe.com' },
  { id: 'canva',        name: 'Canva',        job: 'image', si: null,          note: 'Design for people who do not design.',               url: 'https://canva.com' },
  { id: 'nanobanana',   name: 'Nano Banana',  job: 'image', si: null,          note: 'Google. Conversational image editing.',              url: 'https://gemini.google.com' },

  // ── Film ─────────────────────────────────────────────────────────────────
  { id: 'runway',       name: 'Runway',       job: 'video', si: null,          note: 'The editor filmmakers actually use.',                url: 'https://runwayml.com' },
  { id: 'sora',         name: 'Sora',         job: 'video', si: null,          note: 'OpenAI. Longest coherent shots.',                    url: 'https://sora.com' },
  { id: 'veo',          name: 'Veo',          job: 'video', si: null,          note: 'Google. Generates synced audio too.',                url: 'https://deepmind.google/models/veo' },
  { id: 'kling',        name: 'Kling',        job: 'video', si: null,          note: 'Kuaishou. Strong physics and motion.',               url: 'https://klingai.com' },
  { id: 'luma',         name: 'Luma',         job: 'video', si: null,          note: 'Dream Machine. Fast iteration.',                     url: 'https://lumalabs.ai' },
  { id: 'pika',         name: 'Pika',         job: 'video', si: null,          note: 'Short social clips and effects.',                    url: 'https://pika.art' },
  { id: 'heygen',       name: 'HeyGen',       job: 'video', si: null,          note: 'Talking avatars and dubbing.',                       url: 'https://heygen.com' },
  { id: 'synthesia',    name: 'Synthesia',    job: 'video', si: null,          note: 'Corporate training video at scale.',                 url: 'https://synthesia.io' },
  { id: 'descript',     name: 'Descript',     job: 'video', si: null,          note: 'Edit video by editing the transcript.',              url: 'https://descript.com' },
  { id: 'capcut',       name: 'CapCut',       job: 'video', si: null,          note: 'ByteDance. Where short-form actually gets cut.',     url: 'https://capcut.com' },

  // ── Speak ────────────────────────────────────────────────────────────────
  { id: 'elevenlabs',   name: 'ElevenLabs',   job: 'voice', si: 'elevenlabs',  note: 'The voice quality bar. Cloning and dubbing.',        url: 'https://elevenlabs.io' },
  { id: 'suno',         name: 'Suno',         job: 'voice', si: 'suno',        note: 'Full songs from a prompt.',                          url: 'https://suno.com' },
  { id: 'udio',         name: 'Udio',         job: 'voice', si: null,          note: 'Music generation, finer editing control.',           url: 'https://udio.com' },
  { id: 'whisper',      name: 'Whisper',      job: 'voice', si: null,          note: 'OpenAI. Open transcription you can self-host.',      url: 'https://github.com/openai/whisper' },
  { id: 'deepgram',     name: 'Deepgram',     job: 'voice', si: 'deepgram',    note: 'Realtime speech-to-text API.',                       url: 'https://deepgram.com' },
  { id: 'assemblyai',   name: 'AssemblyAI',   job: 'voice', si: null,          note: 'Transcription plus audio understanding.',            url: 'https://assemblyai.com' },
  { id: 'granola',      name: 'Granola',      job: 'voice', si: null,          note: 'Meeting notes that merge with your own.',            url: 'https://granola.ai' },
  { id: 'otter',        name: 'Otter',        job: 'voice', si: null,          note: 'Meeting transcription, the incumbent.',              url: 'https://otter.ai' },

  // ── Remember ─────────────────────────────────────────────────────────────
  { id: 'notion',       name: 'Notion',       job: 'notes', si: 'notion',      note: 'Docs, databases and AI in one workspace.',           url: 'https://notion.so' },
  { id: 'obsidian',     name: 'Obsidian',     job: 'notes', si: 'obsidian',    note: 'Local markdown files you own forever.',              url: 'https://obsidian.md' },
  { id: 'notebooklm',   name: 'NotebookLM',   job: 'notes', si: null,          note: 'Google. Grounded strictly in your sources.',         url: 'https://notebooklm.google.com' },
  { id: 'logseq',       name: 'Logseq',       job: 'notes', si: 'logseq',      note: 'Outliner, local-first, open source.',                url: 'https://logseq.com' },
  { id: 'anytype',      name: 'Anytype',      job: 'notes', si: 'anytype',     note: 'Local-first and encrypted.',                         url: 'https://anytype.io' },
  { id: 'tana',         name: 'Tana',         job: 'notes', si: null,          note: 'Structured outliner with AI nodes.',                 url: 'https://tana.inc' },
  { id: 'capacities',   name: 'Capacities',   job: 'notes', si: null,          note: 'Object-based notes instead of folders.',             url: 'https://capacities.io' },
  { id: 'mem',          name: 'Mem',          job: 'notes', si: null,          note: 'Self-organising notes.',                             url: 'https://mem.ai' },
  { id: 'reflect',      name: 'Reflect',      job: 'notes', si: null,          note: 'Networked notes, fast and encrypted.',               url: 'https://reflect.app' },

  // ── Wire ─────────────────────────────────────────────────────────────────
  { id: 'n8n',          name: 'n8n',          job: 'automate', si: 'n8n',      note: 'Self-hostable workflows. Fair-code.',                url: 'https://n8n.io' },
  { id: 'zapier',       name: 'Zapier',       job: 'automate', si: 'zapier',   note: 'Most integrations, least control.',                  url: 'https://zapier.com' },
  { id: 'make',         name: 'Make',         job: 'automate', si: 'make',     note: 'Visual scenarios, cheaper at volume.',               url: 'https://make.com' },
  { id: 'langchain',    name: 'LangChain',    job: 'automate', si: 'langchain',note: 'The framework everyone starts with.',                url: 'https://langchain.com' },
  { id: 'llamaindex',   name: 'LlamaIndex',   job: 'automate', si: null,       note: 'Retrieval and document pipelines.',                  url: 'https://llamaindex.ai' },
  { id: 'crewai',       name: 'CrewAI',       job: 'automate', si: 'crewai',   note: 'Role-based multi-agent orchestration.',              url: 'https://crewai.com' },
  { id: 'dify',         name: 'Dify',         job: 'automate', si: 'dify',     note: 'Self-hostable LLM app platform.',                    url: 'https://dify.ai' },
  { id: 'flowise',      name: 'Flowise',      job: 'automate', si: null,       note: 'Drag-and-drop LLM flows, open source.',              url: 'https://flowiseai.com' },
  { id: 'activepieces', name: 'Activepieces', job: 'automate', si: null,       note: 'Open-source Zapier alternative.',                    url: 'https://activepieces.com' },

  // ── Own ──────────────────────────────────────────────────────────────────
  { id: 'ollama',       name: 'Ollama',       job: 'local', si: 'ollama',      note: 'One command to run a model locally.',                url: 'https://ollama.com' },
  { id: 'lmstudio',     name: 'LM Studio',    job: 'local', si: 'lmstudio',    note: 'Desktop app for local models.',                      url: 'https://lmstudio.ai' },
  { id: 'llamacpp',     name: 'llama.cpp',    job: 'local', si: null,          note: 'The inference engine under most of these.',          url: 'https://github.com/ggml-org/llama.cpp' },
  { id: 'openwebui',    name: 'Open WebUI',   job: 'local', si: null,          note: 'Self-hosted chat UI for your own models.',           url: 'https://openwebui.com' },
  { id: 'jan',          name: 'Jan',          job: 'local', si: null,          note: 'Offline-first open-source desktop client.',          url: 'https://jan.ai' },
  { id: 'vllm',         name: 'vLLM',         job: 'local', si: 'vllm',        note: 'Serving engine for real throughput.',                url: 'https://vllm.ai' },
  { id: 'comfyui',      name: 'ComfyUI',      job: 'local', si: null,          note: 'Node graphs for local image and video.',             url: 'https://comfy.org' },
  { id: 'huggingface',  name: 'Hugging Face', job: 'local', si: 'huggingface', note: 'Where the open weights live.',                       url: 'https://huggingface.co' },
  { id: 'localai',      name: 'LocalAI',      job: 'local', si: null,          note: 'Drop-in OpenAI-compatible local API.',               url: 'https://localai.io' },
];

export const TOOLS_BY_JOB = (job: JobId) => TOOLS.filter((t) => t.job === job);
export const TOOL_BY_ID = new Map(TOOLS.map((t) => [t.id, t]));
