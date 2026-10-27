# EARNINGS.md — How the Natively clone can make money

*Honest version. A clone earns nothing on day one. This page is the plan, not a promise.*

## 1. How the original makes money

Natively (heynatively.com) sells a desktop AI copilot for interviews, meetings,
and calls. Revenue comes from two streams (prices verified live on its pricing
page, October 2026):

- **Managed monthly plans** — the user pays Natively for AI + transcription
  instead of bringing their own keys: Standard **$8/mo** (500 AI requests,
  200 min speech-to-text), Pro **$15/mo** (was $20; 1,000 requests, 500 min),
  Max **$25/mo** (2,000 requests, 1,000 min), Ultra **$35/mo** (3,000 requests,
  2,000 min). Coupon INSIDER20 = 20% off Pro/Max/Ultra.
- **One-time Pro licence** — **$39/year** or **$79 lifetime** for the desktop
  app with all Pro features; the user still supplies their own API keys.

The **free tier** (bring your own keys, or a local Ollama model) is the funnel:
it costs Natively nothing to serve, builds trust and GitHub stars (3,088),
and converts a fraction of users to paid. Reported traction from the reel's
TrustMRR screenshot: **$76,076 all-time revenue in 6 months, $7,763 MRR,
686 active subscriptions**. At ~$11 average per paying user, the paid tier is
what pays — the free tier is marketing.

## 2. How THIS clone can make money (same model, adapted)

The clone is a browser demo today, so the earning version of it is:

| What to charge for | How | Why it can work |
|---|---|---|
| **Hosted AI plan** | User pays a monthly fee; the clone calls Gemini/OpenAI with *our* key and bills per use | This is the original's Standard–Ultra model. Only worth building once real users exist — every answer costs us money, so price must cover the API cost plus margin. |
| **Pro one-time licence** | $39/yr or $79 lifetime for a future desktop app (or a "Pro" browser tier: more modes, saved contexts, longer sessions) | The original proves people pay once for this tool. A browser-only Pro tier is the cheapest first step — no desktop build needed. |
| **Keep free forever** | BYOK demo exactly as it is now | Free users are the funnel: GitHub stars, Product Hunt, word of mouth. Never paywall the demo that proves the product works. |

What stays free: the demo, the landing page, the BYOK model. Charging for
something that costs the clone nothing (the user's own key) would kill trust.

## 3. What's missing before it can earn a single rupee

- **Accounts + usage limits.** Today there is no sign-up, no login, no way to
  know who used how much. A hosted plan needs accounts and per-user request
  counters, or one user can burn the whole API budget.
- **Payments.** No payment provider is connected. For Pakistan, realistic
  options are **Stripe** (needs a supported-country entity — Pakistan is not
  directly supported) or **Paddle** (merchant of record, handles tax; works
  with Pakistani founders) or **Lemon Squeezy**. Picking one is a real
  decision with paperwork — it is not a five-minute setup.
- **A hosted backend.** The demo calls Google/OpenAI straight from the
  browser with the *user's* key. A paid plan needs a server (e.g. a Cloudflare
  Worker) that holds *our* key, counts usage, and refuses over-limit calls.
  That is a separate build.
- **Terms, privacy, refunds.** A paid product needs terms of service, a
  privacy policy, and a refund policy — and honest claims about what the tool
  does (it is an interview aid; users must follow their employer's rules).
- **Users.** Zero today. No one pays for a product nobody has heard of.

## 4. Realistic path & timeline (no income promises)

1. **Weeks 1–4 — users first.** Ship the demo, list it (Product Hunt,
   AlternativeTo, SaaSHub, Toolify — see BACKLINKS.md), post the build log.
   Goal: real users trying the demo, not revenue.
2. **Month 2 — measure.** If the demo gets steady daily users, add the
   cheapest paid thing: a browser "Pro" tier (saved contexts, more modes)
   via Paddle/Lemon Squeezy. If usage is near zero, fix the product first —
   charging a dead product earns nothing.
3. **Month 3+ — hosted plan.** Only after the Pro tier sells: build the
   backend, launch a $8/mo hosted plan mirroring the original's Standard,
   price it above API cost, and cap free usage.
4. **Desktop app (later, separate build).** The original's $79 lifetime
   licence is a desktop product. The clone's desktop version — with a truly
   invisible overlay and system audio — is a separate job, not this one.

**Bottom line:** the original took 6 months to reach $7,763 MRR with a
desktop app, a free tier, and open-source distribution. A browser-only clone
starts further back. The honest expectation is $0 for the first weeks, and
the first paid rupee only after real users, accounts, payments, and a hosted
backend exist. Build the audience first; the money follows the audience.
