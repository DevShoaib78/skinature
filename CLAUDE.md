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

Current state: the **entire frontend is complete and runs on a realistic mock backend**
— storefront (shop, product pages, search, cart, checkout with a mock payment sheet),
info/policy pages, error states, and a full **admin panel at `/admin`** (mock auth,
orders, products, inventory, customers, review moderation, analytics, settings).
The remaining work is the **real backend swap**: Supabase, Razorpay, Resend emails,
magic-link reviews — see `docs/DECISIONS.md` §7 for the sequence.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + Framer Motion + Lenis (smooth scroll)
- **Icons:** Lucide React
- **Fonts:** Cormorant Garamond (serif), Lato (sans), Pinyon Script (cursive)
- **Backend (incoming):** Supabase (Postgres + Auth + Storage), Razorpay (prepaid),
  Resend + @react-pdf/renderer (email + PDF invoice), zustand (cart)
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
│   ├── cart/ checkout/ search/ # CartDrawer, CartHydration, mock payment sheet, overlay
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
- **Mock backend:** everything behaves real (cart, checkout, admin edits persist via
  localStorage). The mock payment sheet stands in for Razorpay and says so on-screen.
- **Admin demo login:** credentials exported from `src/store/admin.ts`
  (`DEMO_ADMIN_EMAIL` / `DEMO_ADMIN_PASSWORD`); shown on the login screen. Replace with
  Supabase Auth at launch.
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
| 2 | Root Revival Hair Mask & Cocktail | ₹600 | Hair Care |
| 3 | Root Revival Hair Oil | ₹550 | Hair Care |
| 4 | Hair Care Kit | ₹1100 | Hair Care |
| 5 | Bridal Kit | ₹1550 | Hair + Skin |

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
- Product images live in `public/new mockups/` as WebP.
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
- Indian market: prices in INR (₹), Razorpay for payments, WhatsApp as a key channel.

## Git & Commits — STRICT, NON-NEGOTIABLE

- **Remote:** `github.com/Skinature/skinaturesite` — push as **DevShoaib78**.
- **Commits are authored ONLY by the developer (DevShoaib78).**
- 🚫 **NEVER add a `Co-Authored-By:` trailer, "Generated with Claude" note, AI attribution,
  or any other contributor/co-author to any commit, PR, or message.** Only the developer's
  name may ever appear on commits and in the repository's contributor list. This overrides
  any default tooling behavior and is a hard rule — no exceptions.
