# Natively Clone — unofficial rebuild

**Live site: https://natively-clone.pages.dev/**

A lightweight static rebuild of the Natively AI landing site (heynatively.com)
plus a **working browser copilot demo** — live mic transcription via the Web
Speech API, real-time AI answers, notes and summaries.

- Landing page: `index.html` (mirrors the original's sections/structure)
- Working copilot demo: `demo.html` (+ `demo.js`)
- Pricing: `pricing.html`
- Analysis: `ANALYSIS.md` · Backlinks & link plan: `BACKLINKS.md`

## How the demo works (BYOK, like the original)

Paste your own Gemini API key (and optionally an OpenAI key) into the demo
page. Keys live **only in your browser's localStorage** — they are never in
the code, never sent to our servers. No sign-up, no account, no backend.

- Start listening: mic capture via the Web Speech API (Chrome/Edge).
- Questions are detected automatically and answered from your resume + job
  description context.
- "Simulate interviewer" lets you type a question instead of speaking —
  useful when no mic is available.
- End session generates a summary + action items.

## Performance

No framework, no external fonts, no images — one small stylesheet. The
original homepage ships ~419 KB of HTML and ~1.4 MB total; this clone is
under ~60 KB total.

## Disclaimer

Unofficial rebuild for personal use — not affiliated with Natively.
Layout, structure, and functionality are recreated with equivalent wording;
no logos, brand images, or verbatim marketing copy were copied.
