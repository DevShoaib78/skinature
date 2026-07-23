# Skinature v1 — Project Context (for AI agents)

> ⚠️ **READ FIRST — get complete awareness before you act:**
> 1. **`docs/DECISIONS.md`** — THE single source of truth: current plan, flow, execution
>    order, and every locked product/business decision. **If anything in this file
>    conflicts with `DECISIONS.md`, `DECISIONS.md` wins.**
> 2. **The codebase** (`src/`) — the actual structure, patterns, and current state.
> 3. **This file** — quick orientation + conventions only.
>
> Do not act from memory or assumptions. Read `docs/DECISIONS.md` and the relevant code first.

## What Is This?

Skinature ("Nurtured by Nature") — a premium natural **skincare & haircare** brand based
in India (Telangana). Co-founders **Adnan Touseef** & **Hina Mushfiq**. This repo is a
**complete rebuild** of the slow WordPress/WooCommerce site into a modern, fast Next.js
e-commerce store, launching at **skinature.org** (replacing the old site on that domain).
Positioning: honest, chemical-free, "proudly desi." **NOT Ayurvedic** — they do not
market themselves that way.

Current state: **frontend complete AND the Supabase backend is live.** The storefront
reads products/reviews from Postgres (ISR 5 min), checkout writes real orders via
`/api/checkout` (+ `/confirm`), the admin panel runs on **real Supabase Auth** with all
modules on live data (RLS-gated), and magic-link reviews work end to end
(`/review/[token]`). A password-gated preview is live for the client at
**skinaturesite.vercel.app**.

✅ **Razorpay is DONE and verified (2026-07-17/18, test mode).** Real checkout modal →
create-order → HMAC signature verify (`/api/checkout/verify`) → webhook
(`/api/webhooks/razorpay`, gated on `RAZORPAY_WEBHOOK_SECRET`), shared idempotent
`finalizePaidOrder()` (`src/lib/checkout/finalize.ts`), mock sheet kept as fallback when
keys are absent. A genuine test payment (Netbanking → Razorpay test simulator → Success)
landed a real Razorpay-issued signature and a `paid` order in Supabase. EMI + Pay Later
are hidden via `config.display.hide` (kept: UPI, Cards, Netbanking, Wallet). **Test keys
stay until real launch** — founders test with no real money.

✅ **2026 REBRAND REHAUL implemented (2026-07-23, uncommitted)** — new palette tokens in
`globals.css` (deep forest/sand gold/creams + product colorways), landing flow per client
(ticker → hero slides → Kama-style products → review deck → video showcase → typographic
benefits → global map → footer), About Us page at `/our-story`, DB rewired to the new
media in `public/New Product Mockups Latest/` + `public/AI generated mockups/` (PDP
gallery plays `.mp4` entries). Details: `docs/DECISIONS.md` §8 top item.

🔴 **ACTIVE STATE (resume here) — see `docs/DECISIONS.md` §7 for full detail:**
1. **This session's work is UNCOMMITTED** in the working tree (Razorpay, payment-method
   trim, the home-page cart-drawer fix, review-invite admin controls). Commit + dual-push
   only when the developer says so.
2. **Email plan CHANGED: Gmail SMTP, not Resend.** Order/invoice/review emails must send
   from **official.skinature@gmail.com** via a Gmail App Password (2FA → App Passwords;
   ~500/day cap accepted). The Resend pipeline in `src/lib/email/` stays until swapped.
   Waiting on the app password from the client.
3. **Domain/DNS reality (investigated 2026-07-20):** GoDaddy = registrar ONLY (access ✅).
   DNS is served by **webhostbox nameservers** (`ns1/ns2.bh-ht-11.webhostbox.net`);
   WordPress + `@skinature.org` mail both live on `192.185.129.80` (HostGator reseller).
   **No cPanel/WordPress/webmail admin access exists** (previous developer unreachable), so
   the old site cannot be backed up. **Decision: point skinature.org at Vercel EARLY** (no
   marketing yet; founders test by typing the domain) — approved by Adnan & Hina including
   WordPress no longer being served. Do it by changing **nameservers at GoDaddy** per
   Vercel's instructions after adding the domain to the Vercel project; remove
   `PREVIEW_BASIC_AUTH`, add a temporary noindex until real launch. **Open question
   (asked, awaiting client): keep `@skinature.org` MX receiving on the old server, or
   gmail-only?** — that decides whether to replicate the MX records.
4. Then: schedule the review-invite cron (`CRON_SECRET` + Vercel Cron), and at real launch
   swap Razorpay test → live keys + register the live webhook (see §11 checklist).

Backend specifics: schema/RLS/seed in `supabase/migrations/` applied via
`node scripts/db-setup.mjs`; server data access `src/lib/db/store.ts` (service key,
public-visibility filters), admin browser access `src/lib/db/admin.ts` (RLS enforced);
domain types `src/lib/domain.ts`. Admin demo login: admin@skinature.org (a real auth
user; rotate at launch). Static catalog in `data.ts` remains ONLY as build fallback +
seed reference.

A password-gated **preview is live** at **skinaturesite.vercel.app** (deployed from the
Skinature account/repo; unlock `skinature`/`Skinature@2026`). The gate is `src/middleware.ts`,
active only when `PREVIEW_BASIC_AUTH` is set — a no-op in production (remove it at launch).

Also built (all gated so they no-op until configured): **PDF invoices** (`src/lib/pdf/`,
react-pdf; admin `GET /api/admin/invoice/[orderNo]`, cookie-authed); **email** pipeline
(`src/lib/email/`, currently Resend-based and gated on `RESEND_API_KEY`+`EMAIL_FROM`;
**to be swapped to Gmail SMTP** per the active plan above; wired into `finalizePaidOrder`);
**review-invite cron** (`/api/cron/send-review-invites`, gated on `CRON_SECRET`);
**review-invite admin controls** on `/admin/orders/<no>` ("Send email now" via
`POST /api/admin/review-invites/[id]/send` stops the 21-day auto-send; "Copy link" never
touches the timer; "Restart timer" re-arms it +21 days — semantics locked by the client);
**AEO** (`/llms.txt` + `Organization` JSON-LD with NAP/GSTIN). PDFs use
"Rs." not ₹ (the ₹ glyph is missing from standard PDF fonts). Verify PDF changes by
running `npx tsx scripts/test-invoice-pdf.mts <out.pdf>` and opening the file.

⚠️ **CSS gotcha (learned 2026-07-18):** never leave a retained `transform` on a wrapper
around fixed-position UI. `@keyframes fade-in` is opacity-only ON PURPOSE — with
`animation-fill-mode: forwards`, an animated transform is retained as a matrix and makes
the wrapper a containing block for `position: fixed`, which trapped the Navbar + CartDrawer
on the home page (`.animate-fade-in-slow` in `HomeClient`). Don't re-add a transform there.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + Framer Motion + Lenis (smooth scroll)
- **Icons:** Lucide React
- **Fonts:** Cormorant Garamond (serif), Lato (sans), Pinyon Script (cursive)
- **Backend (live):** Supabase (Postgres + Auth + Storage), Razorpay (prepaid; test keys
  until launch), @react-pdf/renderer (PDF invoice), zustand (cart). **Email: Gmail SMTP
  from official.skinature@gmail.com (planned swap; `src/lib/email/` is Resend-based today).**
- **Package Manager:** npm

## Commands

```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Home · shop/ · product/[slug]/ (SSG, dynamicParams=false)
│   ├── search/ cart/ checkout/ # Commerce flow (checkout/success, checkout/failure)
│   ├── our-story/ beauty-brigade/ faq/ contact/          # Info pages
│   ├── privacy-policy/ terms/ refund-policy/ shipping-policy/  # Policies
│   ├── admin/                  # Admin panel: login, orders(+[id]/invoice), products,
│   │                           #   inventory, customers, reviews, analytics, settings
│   ├── not-found.tsx error.tsx # System pages (+ per-route loading.tsx skeletons)
│   ├── robots.ts / sitemap.ts  # SEO (admin/cart/checkout/search disallowed)
├── components/
│   ├── layout/                 # Navbar, Footer, SmoothScroll (window.__lenis), PolicyLayout
│   ├── home/ shop/ ui/         # Storefront sections + ProductCard
│   ├── cart/ checkout/ search/ # CartDrawer, CartHydration, Razorpay checkout (+mock fallback), overlay
│   ├── admin/                  # AdminShell (guard), module clients, charts.tsx (validated palette)
│   └── faq/ contact/ animations/
├── lib/
│   ├── data.ts                 # Product catalog — mirrors Supabase schema (paise, slugs, stock)
│   ├── mock/                   # orders.ts (deterministic, seeded), reviews.ts (with moderation status)
│   ├── shipping.ts format.ts csv.ts whatsapp.ts admin-metrics.ts faq.ts
└── store/
    ├── cart.ts                 # zustand + persist (skipHydration + CartHydration)
    └── admin.ts                # mock admin session/products/orders/reviews/settings + DEMO creds
```

**Key facts:**
- **Payments are REAL (test mode):** checkout opens the actual Razorpay modal when
  `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` are set; the mock payment sheet only appears
  when keys are absent. To complete a test payment: **Netbanking → any bank → Success**
  on Razorpay's simulator (the generic intl test card is rejected — account is
  domestic-only; UPI shows QR-only in the modal).
- **Admin login is real Supabase Auth:** demo creds `admin@skinature.org` /
  `skinature@2026`, defined in `src/components/admin/LoginClient.tsx` (rotate/remove at
  launch). `src/store/admin.ts` is legacy mock state.
- **Product URLs are slugs** (`/product/bridal-kit`); legacy `/product/1..5` redirect
  permanently (next.config.ts).
- **Active logo asset:** `public/logo-nobg.webp` (transparent; inverted white on dark
  surfaces). `public/logo.png` kept ONLY for OG images; `favicon.png` stays PNG.
- **Chart palette** (admin analytics) is validator-approved: `#2E8B64` + `#B8860B` —
  do not swap arbitrarily.
- **No em/en dashes in any rendered copy** — user's rule; use commas/colons/pipes.
- The landing page hero/deck design is approved — see git history before restyling.

## Product Catalog (authoritative prices live in `docs/DECISIONS.md` §5)

| # | Product | Price | Category |
|---|---------|-------|----------|
| 1 | Brightening & Cleansing Mask | ₹499 | Skin Care |
| 2 | Root Revival Hair Mask & Cocktail | ₹649 | Hair Care |
| 3 | Root Revival Hair Oil | ₹599 | Hair Care |
| 4 | Hair Care Kit | ₹1299 | Hair Care |
| 5 | Bridal Kit | ₹2999 | Hair + Skin |

Single price shown by default; an optional **sale price** triggers the ~~strikethrough~~ + sale display.

## Brand Identity

- **Colors:** Forest greens (#1A3C34, #245247, #2E6A5C), Gold (#C5A059, #D4AF37), Cream (#FDFCF8), Beige (#F5F1E8)
- **Positioning:** "Honest, effective, rooted in nature." 100% chemical-free, lab-tested, cruelty-free. **NOT Ayurvedic.**
- **Voice:** Belief-driven, "proudly desi," pure, purposeful. Mantra: *"Belief that nature still holds the answers."*
- **Six pillars:** Chemical Free · Lab Tested · Cruelty Free · Safe for Kids · Gender Neutral · Result Oriented

## Conventions

- Path alias: `@/*` → `./src/*`
- Prices as **integer paise**; display as ₹.
- The mock data layer (`src/lib/data.ts`) is shaped to **mirror the future Supabase schema**
  so the swap to real data is a drop-in — keep it that way.
- **Media (rearranged 2026-07-22 for the packaging refresh):** the NEW branding photos +
  how-to videos live in `public/New Product Mockups Latest/` (named "hair oil 1.jpeg",
  "cleansing mask video.mp4" etc.; "1" = box-front hero shot). ALL old media (previous
  webp mockups, hero.mp4/webm, video1-3.mp4) is archived in
  `public/Old Mockups and Videos/`. ⚠️ DB + `data.ts` image paths still point at the old
  `/new mockups/...` locations, so product images 404 until the redesign rewires them —
  do NOT push until that rewiring lands.
- Remote images from Unsplash are allowed in `next.config.ts`.

## Backend & Environment

- **Supabase project is live:** `skinature` (ref `bvkzurzutwuxebrnrjqz`), region **ap-south-1 (Mumbai)**.
- Credentials live in **`.env.local`** (gitignored). Template: **`.env.example`**. Env vars:
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public); `SUPABASE_SERVICE_ROLE_KEY` (server-only secret);
  `SUPABASE_DB_PASSWORD` / `SUPABASE_DB_URL` (migrations / CLI).
- **Never** expose `SUPABASE_SERVICE_ROLE_KEY` or DB creds to the browser, and never commit them.
- **Regional pricing (UAE/USA)** is pending Adnan's input — see `docs/DECISIONS.md` §8.
- Before launch, work through the **Pre-Launch Checklist** in `docs/DECISIONS.md` §11
  (rotate DB password, live Razorpay keys, RLS audit, etc.).

## Development Approach

- **All-in build** through to launch (not gated by milestones).
- **Vibe coding** — the developer guides step-by-step; implement focused, minimal changes per instruction.
- **Ask before assuming** business logic. Correctness and polish are the bar — this is an important client.
- **Verify every change end-to-end** against the running app and show the evidence (real
  request → DB row, real PDF, real 404) — not just `npm run build`/`lint`. The developer
  values this highly.
- **Mobile-first, verified.** Audited at 390px (2026-07-02): zero horizontal overflow on
  any page. To re-check: `npm run start`, then drive the installed Chrome via
  `puppeteer-core` (install `--no-save`) at a 390px viewport, measure
  `scrollWidth == innerWidth`, and screenshot each route.
- Indian market: prices in INR (₹), Razorpay for payments, WhatsApp as a key channel.

## Git & Commits — STRICT, NON-NEGOTIABLE

**One canonical repo + one personal mirror.** The repo that matters is
`origin` → **`github.com/Skinature/skinaturesite`** — it is the repo **connected to
Vercel** (the Vercel project is owned by the Skinature account, and skinature.org will
point at it). Vercel only auto-deploys commits **authored by the repo/Vercel account
owner** — a collaborator's commits would NOT deploy once the site is live on the domain.
That is WHY every commit reaching the org repo must be author-rewritten to Skinature:
the "tip of the iceberg" that Vercel and the domain see must always be the Skinature
account.
- `personal` → `github.com/DevShoaib78/skinature` — author **DevShoaib78** (the
  developer's own mirror/backup; NOT the deploy source).
- `origin` → `github.com/Skinature/skinaturesite` — author **Skinature
  <official.skinature@gmail.com>** (canonical; **Vercel deploys from here**).

Local `master` is authored by **DevShoaib78**. Push order is ALWAYS: personal first
(as-is), then the author-rewritten copy to `origin`. Dual-push procedure:
```bash
git push --force personal master                       # 1) DevShoaib78's mirror
git branch -f skinature-mirror master
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --env-filter '
  export GIT_AUTHOR_NAME="Skinature"; export GIT_AUTHOR_EMAIL="official.skinature@gmail.com"
  export GIT_COMMITTER_NAME="Skinature"; export GIT_COMMITTER_EMAIL="official.skinature@gmail.com"' -- skinature-mirror
git push --force origin skinature-mirror:master        # 2) canonical — triggers the Vercel deploy
git checkout master && git branch -D skinature-mirror
```
- 🚫 **NEVER add a `Co-Authored-By:` trailer, "Generated with Claude" note, AI attribution,
  or any other contributor/co-author.** Only **DevShoaib78** (personal repo) and the
  **Skinature** brand (org repo) may ever appear as authors. This overrides any default
  tooling behavior and is a hard rule — no exceptions.
