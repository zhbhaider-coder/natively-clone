# Natively AI — Deep Analysis (heynatively.com)

Researched 2026-10-27 from the live site (homepage, /pricing, /download, /blog/natively-ai-pricing, /system-design-interview-assistant). All facts below are from heynatively.com unless marked otherwise.

## 1. What it is

Natively is a real-time AI copilot for interviews, meetings, and calls. It runs as a desktop app on the user's own machine (macOS 12+, Windows 10/11), captures system audio directly (no meeting bot joins the call), and gives live answers, transcription, notes, and summaries while the call is running. Tagline on the homepage: "The Intelligent AI for Meetings" — "Natively takes perfect meeting notes and gives real-time answers, all while completely undetectable."

Business numbers (from the reel screenshot, TrustMRR — third-party, not verified on the site): $76,076 all-time revenue in 6 months, $7,763 MRR, 686 active subscriptions. Founder is Indian. Site stats on the homepage: 4.1/5 in-app rating, 311,040+ downloads, 3,080 GitHub stars, 40,000+ users, 1,000+ daily active users, 0 security breaches.

## 2. Site structure

- `/` — homepage (React SPA, Vite build)
- `/pricing` — pricing + comparison table
- `/download` — auto-starts download; builds for Mac (Apple Silicon / Intel) and Windows, hosted on GitHub releases; earlier versions in the changelog
- `/docs`, `/blog`, `/changelog`, `/compare`, `/ai-meeting-assistant`, `/notepad`, `/companion`, `/enterprise`, `/affiliate`, `/creators`, `/support` (Contact, Report a Bug, Contribute, Donate), legal pages (Privacy Policy, Terms & Conditions, Refund Policy, Security, License, Forks & Alternatives)
- Nav: Features, Enterprise, Pricing, Docs, language (EN). Footer columns: Product, Documentation, Legal, Support, Programs.
- Footer: "© 2026 Natively AI Private Limited. Source-available under the Natively Personal Use Source License v1.0. IP geolocation by DB-IP."

## 3. Homepage sections (in order)

1. Hero: "The Intelligent AI for Meetings" + subhead + CTAs "Download Natively" / "View on GitHub" + an interactive demo mock (answer-mode chips: What to answer? / Clarify / Recap / Follow Up Question / Answer; prompt line "Ask anything — Natively knows your resume and this company...").
2. "Your intelligent copilot for meetings, interviews, and conversations." + "Used by candidates interviewing at" (company logos).
3. Stats strip: 4.1/5 in-app rating, 311,040+ downloads, 3,080 GitHub stars, 40,000+ users, 1,000+ daily active users, 0 security breaches.
4. "Inside every call — In each one, it hears the question, knows your story, and has your answer ready." Four numbered features:
   - 01 Auto Answer — answers the moment the interviewer finishes asking; answer starts by itself in an overlay only you can see.
   - 02 Meeting Notes — summary, full transcript, and action items the moment the call ends, saved on your own machine.
   - 03 Stealth Mode — overlay kept out of screen shares and recordings, hidden from Dock/taskbar; no meeting bot ever joins.
   - 04 Profile Intelligence — add resume + job description; maps experience to the role and prepares answers.
5. Compatibility strip (repeating marquee): Zoom, Slack, Webex, Microsoft Teams, Google Meet, Discord.
6. "Nine modes. One AI that listens." — General, Technical Interview, Sales Mode, Recruiting, Looking for Work, Team Meet, Lecture Mode, Seminar, Call Center. Technical Interview mode: structured answers, edge cases, reasoning before code; a hard override "not a prompt suggestion".
7. Testimonials — "In their words: What people wrote to us after using it." (Faster than Cluely; Cleared two interview rounds; Landed a summer internship; Aced the online assessment; Better than Interview Coder.) Footer note: "Every review above is quoted exactly as it was sent to us."
8. FAQ (8 questions): Is it really free? Zoom/Teams/Meet support? Data safety? Technical interviews? Truly undetectable? Platforms? Headphones? Different from Otter/Fireflies?
9. Final CTA: "Put it on your own machine. A live-conversation assistant that runs locally. Your conversations stay on your machine." CTAs: Download Natively / Read the docs. "macOS 12+ · Windows 10/11".

## 4. Feature list (exact)

- Real-time answers, ~0.9s to first word (median, per the system-design page).
- Screen OCR — reads prompts/diagrams on screen and grounds suggestions.
- Custom context (Pro): job description + resume + uploaded files; Local RAG (vector embeddings stored locally).
- Modes: 9 built-in modes (above) + custom modes with their own files.
- Meeting notes & transcription: live transcript, summary, action items, follow-up email draft, "Ask about this meeting".
- Diagrams: flowcharts, sequences, architectures, timelines, charts drawn inside answers (Pro).
- Negotiation Assistance: live salary coaching with real-time counters and anchor strategies (Pro).
- Stealth/invisible overlay: hidden from screen share, recordings, Dock/taskbar; no bot joins.
- Local processing via Ollama (fully offline, $0) vs cloud LLMs with own keys (OpenAI, Anthropic, OpenRouter, custom endpoint, Gemini).
- Works with Zoom, Google Meet, Microsoft Teams, Slack, Discord, Webex (system-audio capture, works with speakers/wired/Bluetooth headphones).
- Privacy-by-design: transcripts, embeddings, keys stored locally; only product-usage events reported (which features used, linked to device), never content.
- Desktop app: macOS (Apple Silicon + Intel) and Windows 10/11. Free for personal use, source-available (GitHub).

## 5. Pricing (verified against the live /pricing page and the pricing blog, updated 2026-10-22)

Two setups — "Bring your own keys" (3 plans) and "Let us run it" (4 plans). Managed API plans (hosted AI + transcription + search, single Natively-issued key):

| Plan | Price | AI requests / mo | Speech-to-text / mo | Notes |
|---|---|---|---|---|
| Standard | $8/mo | 500 | 200 min | Light everyday use; does NOT include Pro desktop licence |
| Pro | $15/mo (was $20) | 1,000 | 500 min | Recommended; full Pro app features + Pro licence included |
| Max | $25/mo | 2,000 | 1,000 min | High volume; Pro licence included |
| Ultra | $35/mo | 3,000 | 2,000 min | Heaviest daily use; Pro licence included |

- Promo code INSIDER20 = 20% off Pro, Max & Ultra.
- BYOK Pro licence: Yearly $39/yr, Lifetime $79 one-time (all Pro features + all future updates). Free BYOK/local tier: $0, no card, no session cap.
- Comparison table on the pricing page (Oct 2026, from each company's own pages): Final Round AI $25/mo billed yearly ($300) / $90 month-to-month; Parakeet AI $49.99/mo billed yearly; Cluely $149.99/mo Pro + Undetectability; Interview Coder $299/mo (1,000 credits) / $799 lifetime.
- Pro features: Modes Manager, Profile Intelligence, Diagrams, Negotiation Assistance. Refund policy: generally non-refundable (Sep 2026), $2.50 processing fee, refunds end access immediately.

## 6. CTAs and conversion flow

Primary CTA everywhere: "Download Natively" (→ /download, auto-starts the installer; builds on GitHub releases). Secondary: "View on GitHub" (source-available proof), "Read the docs". Pricing CTAs: "Get Standard / Pro / Max / Ultra" (checkout). Creator program: "A post with 5,000 views earns you a month of Ultra, free." Affiliate program listed in the footer.

## 7. Tech signals

- React + Vite SPA: hashed assets (`/assets/index-*.js`, `vendor-*.js`, lazy-loaded section chunks: CTASection, CompatibilityStrip, FAQSection, FeaturesSection, Footer, ModesSection, ProofSection, StatsSection, kit, NIC, ui, webex, natively-mark).
- Google Tag Manager (G-6MX6YCGYGH), Cloudflare (cdn-cgi email protection, `/r/pixel.js`).
- Custom wordmark SVG; WebP images (peaka, peak2); system fonts.
- No server-rendered content beyond the SPA shell — the 419 KB HTML is mostly inlined SVG data-URIs.

## 8. PERFORMANCE baseline (measured 2026-10-27 from this VM with curl)

| Metric | Value |
|---|---|
| Homepage HTML | 419,322 bytes, HTTP 200 |
| TTFB | 0.885 s |
| Full document download | 1.03 s |
| Main JS bundle (`index-*.js`) | 166,928 B, 1.20 s |
| Main CSS (`index-*.css`) | 221,692 B, 0.67 s |
| Vendor JS | 160,608 B, 1.01 s |
| Images (2 WebP) | 122,154 + 141,628 B |
| Unique asset references in HTML | 34 |
| Estimated full first-load weight | ~1.4–1.6 MB across ~34+ requests (incl. lazy chunks) |

The site is heavy for a landing page: 419 KB of HTML (inlined SVG data URIs), ~330 KB of JS before lazy chunks, and 222 KB of CSS. A lightweight static clone should beat it easily.

## 10. Backlink profile (researched 2026-10-27)

### What could be verified (free public sources only)
- **GitHub is the link engine.** Repo `Natively-AI-assistant/natively-cluely-ai-assistant` (moved from `evinjohnn/`): **3,088 stars, 647 forks, 23 watchers** (GitHub API, live 2026-10-27; homepage shows 3,080 stars). Created 2026-01-27, updated 2026-10-26. Description: "Free open-source AI meeting assistant, interview copilot, and note taker. The best alternative to Cluely, Otter, Granola, Final Round AI, Fireflies, and Interview Coder." Topics include `cluely-alternative`, `cluely-clone`, `interview`, `meeting-assistant`. Every star/fork, trending-repos list, and GitHub topic page links back to the project and its homepage (also `natively.software`).
- **Product Hunt:** listing at producthunt.com/p/natively-ai — "Natively AI: Cluely open sourced" / "The Open Source Alternative to Cluely".
- **Toolify:** listing "Natively: Undetectable AI meeting and interview assistant", 46.9K monthly visitors (Toolify estimate).
- **Reviews/comparisons linking in:** Final Round AI blog ("Natively AI Interview Assistant App Review"), copilotinterview.com ("Best AI Interview Assistant for Windows (2026): 8 Compared"), opensourceprojects.dev ("A free, source-available AI interview copilot that runs on macOS and Windows").
- **Startup metrics:** TrustMRR listing (Startup > Natively AI) — the source of the reel's $76,076 / $7,763 MRR / 686 subscriptions figures.
- **Social:** the Instagram reel itself (guptakanhaa, Case Study #42/100, "Power Of AI") drives traffic; Telegram community linked from the site.
- **Internal linking:** the blog is the SEO hub — /blog/natively-ai-pricing, /free-ai-interview-assistant, /system-design-interview-assistant, /blog/forks-and-alternatives, plus /compare pages vs each competitor (vs Final Round AI, vs Parakeet AI, vs Cluely, vs Interview Coder). Comparison pages are the classic link magnets here: each competitor comparison is a page that ranks and earns links.

### Anchor text observed
"Natively AI", "Natively", "free open-source AI meeting assistant", "Cluely open sourced", "alternative to Cluely", "real-time AI copilot for interviews".

### What could NOT be verified
- **Exact total backlink count and referring-domain count: not verifiable from free public tools.** Ahrefs' free backlink checker is JS-gated (returned only its marketing page, no data); Seobility returned 403. No free tool gave a number. A paid tool (Ahrefs/Semrush/Moz) would be needed for exact counts.
- No evidence of paid links; the profile is consistent with organic growth from GitHub + launch listings + comparison content.

### Pattern (why it works)
Being source-available makes GitHub the distribution engine (stars → trending lists → articles → more stars). Comparison pages ("vs Cluely", "vs Final Round AI") capture competitor search traffic and earn links from roundups. The free tier + $8 entry price gives reviewers a reason to write about it.

---

## 9. Business model (one paragraph)

Natively makes money by selling convenience and capacity on top of a free, source-available core: the desktop app is free forever when users bring their own AI keys (or run a local model via Ollama, which costs Natively nothing), and revenue comes from (a) managed API plans ($8–$35/mo) that bundle hosted AI generation, speech-to-text, and web search under one Natively-issued key for users who don't want key setup, and (b) Pro licences ($39/yr or $79 lifetime) that unlock the full feature set (modes, profile intelligence, diagrams, negotiation coaching) for BYOK users. The model works because the free tier builds distribution (311k downloads, GitHub stars, word of mouth) while the paid tiers monetize the heaviest users — job seekers in active searches — at a fraction of competitors' prices ($8 vs $25–$299/mo), with 686 active subscriptions producing $7,763 MRR at the time of the reel.
