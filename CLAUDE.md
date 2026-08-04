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

✅ **2026 REBRAND REHAUL — DONE, committed + pushed + LIVE (2026-07-23).** New palette
tokens in `globals.css` (deep forest/sand gold/creams + product colorways), landing flow
per client (ticker → hero slides → Kama-style products → review deck → video showcase →
typographic benefits → global map → footer), About Us page at `/our-story`, DB rewired to
the new media in `public/New Product Mockups Latest/` + `public/AI generated mockups/`
(PDP gallery plays `.mp4` entries). Details: `docs/DECISIONS.md` §8 top item.
⚠️ Client will regenerate the flawed AI **oil-bottle scene** images — swap those specific
files when provided. Internal folders `public/Old Mockups and Videos/` + `public/Reference/`
are gitignored (local only, never deployed).

✅ **skinature.org is LIVE on Vercel (2026-07-23).** GoDaddy phone support cleared a stuck
nameserver job; NS = `ns1/ns2.vercel-dns.com` (registry + all resolvers). **Vercel manages
DNS — do NOT add manual A/CNAME records and do NOT switch back to GoDaddy-default NS.**
apex 308→www, SSL issued on both, `PREVIEW_BASIC_AUTH` removed, `SITE_NOINDEX=1` set in
Vercel (X-Robots-Tag noindex, robots.txt disallow-all) for the founders-testing phase. The
Razorpay TEST keys are set in Vercel env. Dev→push→auto-deploy is wired: pushing `origin`
(Skinature repo) deploys to the domain.

✅ **EMAIL IS LIVE (2026-07-28).** Gmail SMTP via **nodemailer**, sending as
**official.skinature@gmail.com** with a Google **App Password** (2SV enabled on that
account; backup codes saved by the client). Resend is gone. Gated on
`GMAIL_USER`+`GMAIL_APP_PASSWORD` (missing = graceful no-op). Verified by a REAL send:
SMTP auth OK, 57KB PDF invoice attached, customer + admin mails delivered. Test any time:
`npx tsx scripts/test-email.mts <address>`.

✅ **RAZORPAY IS LIVE (2026-07-28).** Live keys generated (old WP key
`rzp_live_R5FEh4HnENzB2Z` deactivated), live webhook registered at
`https://www.skinature.org/api/webhooks/razorpay` (`payment.captured`/`payment.failed`),
old WooCommerce webhook removed. **Live keys live ONLY in Vercel env — `.env.local`
deliberately keeps TEST keys so local dev can never charge a real card.**

🔒 **SECURITY FIX (2026-07-28, critical):** `/api/checkout/confirm` (the mock-payment
route) marked orders paid with NO payment verification — with live keys that was free
goods for anyone who POSTed a pending `orderId`. It now hard-returns **404 whenever
`razorpayEnabled()`**, so it only exists for local dev without keys. Exploit re-run after
the fix: 404, order stayed `pending`. **Never remove that guard.**

🚀 **THE STORE IS LIVE AND SELLING (as of 2026-08-04).** Adnan & Hina are advertising;
real customers are ordering. ~30 genuine paid orders, ~Rs 28,000 revenue, orders arriving
daily. **This is now a production system with real money and real customers — behave
accordingly: no destructive DB operations without explicit confirmation, and verify before
claiming anything is fixed.**

🔴 **POST-LAUNCH ISSUES — DIAGNOSED 2026-08-04, FIXES NOT YET BUILT (start here):**

**A. "Account Suspended / Bluehost" page seen by a customer — NOT our bug.**
`skinature.com` is a **completely separate domain** (Bluehost, `50.87.179.240`, suspended,
403) that nobody on this project controls. Our site is `skinature.org` on Vercel and is
healthy. Customers type `.com` out of habit and land on a dead page. **Fix is commercial,
not technical:** Adnan should acquire/reclaim `skinature.com` and 301 it to `.org`, and
every ad/bio/link must be checked to point at `.org`. Until then some traffic is lost.

**B. Payment "Processing your payment" hang — investigated, NO customer was charged.**
Queried the Razorpay API for all 20 pending orders that had a Razorpay order created:
**every one shows `amount_paid = 0`** (status `created` or `attempted`). Zero customers
charged-but-unfulfilled. This is ordinary UPI abandonment (customer opens the UPI app and
does not complete). The webhook backstop is in place, so a completed payment finalises even
if the browser handler never fires. **No money lost. Improve the UX, don't panic.**

**C. Email bounces — the diagnosis matters, DO NOT let the client buy the wrong fix.**
The bounce codes are conclusive and both are **recipient-side**:
- `452 4.2.2 recipient's inbox is out of storage space` (naaz59591@, zakiahasannashwa@) —
  the CUSTOMER'S Gmail is full. Gmail retries for ~48h.
- `550 5.1.1 account does not exist` (zulekhabaig270@) — the customer **mistyped their
  email at checkout**.
⚠️ **Our sending is working correctly and is nowhere near any limit** (~30 orders total ≈
a few emails/day against Gmail's ~500/day). **Adnan and Shoaib both proposed buying Zoho /
Google Workspace — that would NOT fix either bounce** and is money spent on the wrong
problem. Say so plainly.
**The genuine problem is real though:** `zulekhabaig270@gmail.com` PAID (SKN-1225, Rs559)
and never received a confirmation or invoice because the address does not exist. Real fixes
worth building: (1) email typo detection/confirmation at checkout, (2) admin visibility of
bounced/failed sends with a resend action, (3) **WhatsApp becomes materially more valuable**
— the phone number is already captured and is a second channel independent of email typos.

═══════════════════════════════════════════════════════════════════════════════
# 🔴 PENDING WORK — START HERE (accurate as of 2026-08-04)
═══════════════════════════════════════════════════════════════════════════════

### ⚡ P0 — do this FIRST, it is costing sales every day
**`SITE_NOINDEX` is STILL SET in Vercel, so Google cannot index the store.** Verified live:
`X-Robots-Tag: noindex, nofollow` and `robots.txt: Disallow: /`. The site has been trading
and advertising for over a week with **zero organic discoverability — customers cannot even
find it by searching "Skinature"**. This was the deliberate pre-launch switch and real
launch happened without removing it.
**Fix:** delete `SITE_NOINDEX` from the Vercel project env → redeploy → confirm the header
is gone. One minute. The client has been told and agrees.

### P1 — the three the client considers "the main things"
1. **Meta Pixel** (their ads person is waiting; he only needs to hand over the Pixel ID).
   Next.js App Router means the stock snippet is NOT enough — it fires `PageView` once and
   then goes silent on client-side navigation. Must wire: route-change `PageView`,
   `ViewContent` (product), `AddToCart`, `InitiateCheckout`, and above all **`Purchase`
   with real value + currency** (that is what optimises spend and reports ROAS).
   Conversions API is a strong follow-up — orders already finalise server-side in
   `finalizePaidOrder`.
2. **WhatsApp automatic order messages** — `src/lib/whatsapp.ts` is BUILT and wired into
   `finalizePaidOrder` (Meta Cloud API direct, NO BSP). Blocked on Adnan: a **dedicated
   number that is NOT on the WhatsApp app** (using the official number strips it off the
   app — recommend a new SIM), Meta Business access (they have one from ads, so business
   verification may already be done), and template approval. Attaching the invoice PDF via
   Meta's media-upload endpoint is still to build.
3. **Custom email on Zoho / Google Workspace.** ⚠️ Record the REAL reason: Adnan wants a
   **different address** because `official.skinature@gmail.com` is already used in many
   other places — it is an operational/branding decision, **NOT** a fix for the bounces.
   Say so plainly if it comes up: the bounces were recipient-side and no email provider
   fixes them. Swapping providers is a small change — `src/lib/email/send.ts` is a single
   nodemailer transport; only the credentials and `EMAIL_FROM` change.

### P2 — real problems, already diagnosed, not yet fixed
4. **`skinature.com` shows a Bluehost "Account Suspended" page** (verified: 302 → suspended).
   Unrelated domain we do not control; customers typing `.com` out of habit hit a dead page
   and are lost. **Commercial fix:** Adnan acquires/reclaims it and 301s to `.org`. Also
   audit every ad, Instagram bio and printed link to be sure they say `.org`.
5. **~₹15,000 of recoverable abandoned carts — hand this to the client.**
   **Run `node scripts/abandoned-carts.mjs`** (read-only; `--days N` to narrow). It prints
   the current list of customers who reached the payment screen and never completed, with
   phone numbers, sorted by basket value, excluding anyone who later bought. As of
   2026-08-04: **13 customers, ~₹14,700**, largest Zoha Majeed ₹3,309. Regenerate rather
   than trusting these figures — it changes daily, and customer phone numbers are
   deliberately NOT committed to the repo. **This is the highest-return action available to
   the client**: a simple WhatsApp follow-up. The systematic fix is an automatic
   abandoned-cart reminder ~1h after checkout, ideally over WhatsApp once that lands.
6. **Email typo detection at checkout.** Zulekha Baig **PAID ₹559 (SKN-1225)** and received
   nothing because she mistyped her address (`550 5.1.1`). Add typo detection / a confirm
   field, plus **admin visibility of failed sends with a resend action**.
7. **Rotate the Supabase DB password** — it was shared in chat during setup (2026-07-02).
8. **The landing review deck still shows INVENTED testimonials** (Ayesha R., Priya S. …).
   The store is now advertising to real customers, so fabricated reviews are a trust and
   advertising-standards risk. Client chose to defer to the UI pass — re-raise it. Note
   the DB now has **0 reviews**, and real ones start arriving after the first cron send
   (see below), so genuine replacements are close.
9. **Policy pages need Adnan's sign-off** — privacy/terms/refund/shipping are live carrying
   sensible DEFAULTS I wrote, not his confirmed terms.
10. **cPanel access for the old webhostbox hosting** — ~70 real March orders with full
    customer details are still trapped there and the hosting could lapse at any time. The
    `info@` mailbox is a partial backup (order emails carry name/phone/address).

### P3 — parked by the client
11. **UI + admin-panel changes** from Adnan & Hina — a batch of inputs the client will
    describe in a later session. Nothing actionable yet.

**Recently completed (do not redo):** targeted test-data cleanup (55 real orders kept,
₹28,473, zero fixtures left); admin login secured (name-based, demo account deleted);
review-invite cron scheduled in `vercel.json`.

═══════════════════════════════════════════════════════════════════════════════
1. **WhatsApp** — `src/lib/whatsapp.ts` has the Meta **Cloud API** integration built and
   wired into `finalizePaidOrder` (direct, NO BSP — client rejected AiSensy/Interakt/WATI).
   Gated on `WHATSAPP_PHONE_NUMBER_ID`+`WHATSAPP_ACCESS_TOKEN`. Blocked on Adnan: a
   **dedicated number NOT on the WhatsApp app** (using the official number would strip it
   off the WhatsApp app — recommend a new SIM), Meta Business access (they have one from
   ads, so verification may already be done), and template approval. Invoice PDF can be
   attached via Meta's media upload endpoint — still to build.
2. ✅ **Test-data cleanup DONE (2026-08-04)** via `scripts/cleanup-test-data.mjs` — the
   blanket `wipe-demo-data.mjs` is obsolete and unsafe now (real orders are interleaved).
   Classification the client set: a row is test only if the customer phone is one of the
   reused placeholders (`9989298408`, `9885421522`, `6000000000`) or the email ends
   `@example.com`. Deliberately NOT keyed on founder emails — Adnan, Hina and Shoaib all
   placed genuine orders once Razorpay was live and those were kept. Result: 52 orders,
   17 customers, 21 seed reviews removed; **55 real orders / ₹28,473 / 31 paid preserved**;
   product rating+review_count recalculated (now 0 reviews, ratings 5.0).
3. **Landing review deck still contains invented testimonials** — client chose to keep them
   for now and revisit during the UI pass. Replace with real Google/Amazon reviews.
4. ✅ **Review-invite cron SCHEDULED (2026-08-04)** — `vercel.json` runs
   `/api/cron/send-review-invites` daily at `0 4 * * *` (09:30 IST). Vercel injects
   `Authorization: Bearer $CRON_SECRET` automatically, which is what the route checks.
   Until this existed the endpoint was never called, so invites would have sat unsent
   forever. **36 real customers have invites queued; the first fell due 2026-08-07.**
   Worth confirming in the next session that sends actually went out (`sent_at` populated).
5. ✅ **Admin login secured (2026-08-04).** The panel was open to anyone — the login page
   printed a shared demo password and offered a one-click fill button, exposing every
   customer's name, address and phone. Now: sign-in takes a **NAME** (`Syed Adnan Touseef`
   or `Hina Mushfiq`, case/space-insensitive) mapped to internal Supabase identities in
   `LoginClient.tsx`; the shared `admin@skinature.org` account was **deleted**; wrong name
   and wrong password return the same message so valid names aren't disclosed. Both
   founders share one password by explicit client choice (they accept the audit-trail
   tradeoff). Provisioning: `scripts/setup-admin-users.mjs` (password via env, never
   committed).

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

⚠️ **Metadata gotcha (learned 2026-07-28):** Next.js **shallow-merges** metadata — a page
that declares its own `openGraph` block **replaces** the one in `layout.tsx` and silently
drops `og:image`, killing link previews on WhatsApp/Facebook/LinkedIn (Twitter survives
separately via the `twitter` block). Any page defining `openGraph` MUST spread in
`OG_IMAGE` from `src/lib/data.ts`. The share card is `public/og-image.png` (1200x630 —
regenerate with sharp if the branding changes); product pages intentionally override it
with their own product photo.

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
- **Backend (live):** Supabase (Postgres + Auth + Storage), Razorpay (prepaid, **LIVE keys
  in Vercel**), @react-pdf/renderer (PDF invoice), zustand (cart), **nodemailer → Gmail SMTP
  as official.skinature@gmail.com**, Meta WhatsApp Cloud API (built, awaiting credentials).
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
