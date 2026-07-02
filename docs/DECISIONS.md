# Skinature v1 — Decisions, Flow & Execution

> **Single source of truth.** This document holds the current plan, flow, execution
> order, and every locked business/product decision for the Skinature v1 build.
> If anything here conflicts with `CLAUDE.md`, older notes, or memory, **this file wins.**
> Keep it updated whenever a decision changes.
>
> _Last updated: 2026-07-02 (frontend milestone complete)._

---

## 1. What Skinature Is

Skinature ("Nurtured by Nature") — a premium, 100% chemical-free natural **skincare &
haircare** brand based in India (Telangana / Hyderabad). Co-founders: **Adnan Touseef**
& **Hina Mushfiq** (husband & wife). Positioning: honest, effective, rooted in nature,
"proudly desi." **Not** marketed as Ayurvedic. Six pillars: Chemical-Free · Lab-Tested ·
Cruelty-Free · Safe for Kids · Gender-Neutral · Result-Oriented.

This repo is a **complete rebuild** replacing the slow WordPress/WooCommerce site
with a modern, fast Next.js store, launching at **skinature.org** _(decided
2026-07-02: the new site replaces the old WordPress site on the existing .org
domain; all canonicals/OG/sitemap use skinature.org)_.

## 2. People & Commercial Terms

_(Captured from the signed quotation; the original PDF + `QUOTATION.md` were removed
after this capture — the terms below are the record.)_

- **Client:** Adnan Touseef (Co-Founder, Skinature).
- **Developer:** Mohammed Shoaib Choudry (Co-Founder, Onething Studio).
- **Total:** ₹25,000 — **₹10,000 upfront** + **₹15,000 on completion & final delivery**.
- **Support:** 1 month post-delivery (critical bugs). Further work billed separately
  (~₹2,000–5,000+ depending on scope).
- **Ownership:** full source transfers to client on final payment.
- **Scope (two milestones in the quote — but we build all-in at once):**
  - _M1 — UI & core ordering:_ responsive brand UI; home/shop/product pages; basic
    product backend; Razorpay; order placement; checkout; order-confirmation email with
    invoice.
  - _M2 — Backend & advanced:_ full DB & API; admin dashboard; invoice generation
    (admin + customer copies); Excel export; WhatsApp notifications; SEO/perf;
    deployment; documentation.
- **Explicitly out of scope (future):** third-party courier API (Shiprocket/Delhivery);
  Beauty Brigade loyalty/exclusivity program.

## 3. Working Approach

- **All-in build** — not gated by milestones; we build the whole store through to launch.
- **Vibe coding** — developer (Shoaib) drives step-by-step; Claude implements focused
  changes and asks before assuming business logic.
- **Frontend-first with mock data** — refine the UI against typed mock data that
  **mirrors the future Supabase schema**, so swapping to real data later is a drop-in
  with no UI changes. Adnan & Hina review the UI before the backend exists.
- **Correctness & polish are the bar** — important client; nothing ships broken or ugly.

## 4. Tech Stack (final)

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Framer Motion, Lenis.
- **Backend / DB / Auth / Storage:** **Supabase** (Postgres + Auth + Storage). Project is
  **live**: `skinature` (ref `bvkzurzutwuxebrnrjqz`), region **ap-south-1 (Mumbai)**.
  Credentials in `.env.local` (gitignored); documented in `.env.example`.
- **Payments:** **Razorpay** — prepaid only.
- **Email + Invoice:** **Resend** + **@react-pdf/renderer** (PDF invoices).
- **Cart state:** **zustand** (persistent via localStorage).
- **Hosting:** **Vercel** (final call at deploy). **Domain:** skinature.org.

## 5. Products (current catalog — 5)

Prices stored as **integer paise**, displayed as ₹. Single price now; an optional sale
price triggers the strikethrough treatment.

| id | Name | Price | Sale price | Category |
|----|------|-------|-----------|----------|
| 1 | Brightening & Cleansing Mask | ₹499 | — | Skin Care |
| 2 | Root Revival Hair Mask & Cocktail | ₹600 | — | Hair Care |
| 3 | Root Revival Hair Oil | ₹550 | — | Hair Care |
| 4 | Hair Care Kit | ₹1100 | — | Hair Care |
| 5 | Bridal Kit | ₹1550 | — | Hair + Skin |

## 6. Locked Decisions

1. **Pricing model** — each product has a regular price + optional sale price (paise).
   Show the single price by default; when admin sets a sale price, show ~~regular~~ + sale.
   Admin controls all pricing/discounts from the dashboard.
2. **Checkout** — **guest only, no signup/accounts** (for now). **Prepaid Razorpay only**
   (UPI, cards, netbanking, wallets). **No COD.**
3. **Shipping (India)** — flat **per order** (single package), by delivery state:
   **₹60 within Telangana**, **₹100 for the rest of India**. Not charged per product.
   Stored as config so it's trivial to change later. _(International shipping is open —
   see §8 Regional Pricing.)_
4. **Order flow** — cart → checkout (contact: email + phone; shipping address incl.
   **state**) → server creates Razorpay order → customer pays → server verifies signature
   → persist paid order → send confirmation + PDF invoice email → order appears in admin.
5. **Invoice** — PDF (react-pdf) emailed via Resend to the customer + an admin
   copy/notification; stored in Supabase Storage for re-download. **Business legal
   details (provided by Adnan, 2026-07-02, wired into the admin settings defaults):**
   - Company: **Nurtured by Nature Products**
   - GSTIN: **36AAZFN8373Q1ZU**
   - Address: Plot No. 509-J-III, Road No. 86, Near Lotus Pond, Jubilee Hills,
     Hyderabad - 500096, Telangana, India
6. **WhatsApp (manual, no API)** — from the admin order view, a WhatsApp button opens
   click-to-chat (`wa.me`) to the customer's number, **pre-filled with a text message**
   built from their order (greeting + itemised products + total + tappable invoice-PDF
   link + a warm one-liner). Admin hits send. _Click-to-chat cannot auto-attach the PDF —
   the message carries a link; the PDF itself goes by email._
7. **Reviews (magic-link, verified buyer)** — after purchase, a unique tokenised link per
   product (`/review/<token>`, encoding order + product) lets the buyer submit a rating +
   title + text **without logging in**. **Auto-sent 21 days after the order** (admin can
   also send/resend manually). **Reviews require admin approval before they appear**
   (per Adnan — this supersedes the earlier "raw/unmoderated" idea). Approved reviews
   drive each product's shown reviews and its aggregate rating/count. _Auto-send needs a
   scheduler — Supabase pg_cron or Vercel Cron._
8. **Admin dashboard (`/admin`)** — Supabase-auth login. Capabilities: view orders + full
   detail + history; edit product price, sale price, and other fields; content management;
   **on-demand Excel export** (always latest data); a WhatsApp send button per order;
   **review moderation** (approve/hide); send/resend review link. Full capability list to
   be finalised with the client.
9. **Beauty Brigade** — keep the landing section + Founder's Note. **"Join The
   Brigade" → `/beauty-brigade` page showing "We'll announce soon"** _(✅ built, noindex
   until the program is real)_. The actual membership/loyalty program is future scope
   (Adnan to define).
10. **SEO & AEO & responsiveness** — strong on-page + technical SEO; excellent
    responsiveness on mobile / tablet / desktop. ₹-vs-USD structured-data bug fixed.
    **AEO (Answer Engine Optimization) is in scope alongside SEO** (per Shoaib,
    2026-07-02): optimize for AI answer engines (Google AI Overviews, ChatGPT,
    Perplexity). Already in place: FAQPage/Product/Organization/Breadcrumb schema,
    answer-shaped FAQ copy, semantic HTML. Still to do before launch: `llms.txt`,
    consistent business NAP across pages, question-styled headings where natural,
    and a post-launch check of how AI engines answer "Skinature" queries.

## 7. Execution Order (all-in, but sensible sequence)

1. ✅ **Frontend milestone — COMPLETE (2026-07-02).** The entire frontend runs on a
   realistic mock backend and behaves like a production store:
   - Storefront: landing page (approved), shop (working filters/sort), product pages
     (slug URLs, galleries, reviews, kit contents, related), search (overlay + page),
     cart (drawer + page), checkout (validated Indian address form, ₹60/₹100 shipping
     by state, mock Razorpay sheet with success/failure), order confirmation.
   - Pages: our-story, beauty-brigade (placeholder), FAQ, contact, 4 policy pages,
     custom 404/error/loading states. No dead links.
   - Admin (`/admin`, mock auth; demo creds in `src/store/admin.ts`): dashboard,
     orders (+detail, printable invoice, WhatsApp click-to-chat, CSV/Excel export),
     products (pricing + sale price + stock + visibility), inventory, customers,
     review moderation, analytics (validated chart palette), settings.
   - Mock layer mirrors the Supabase schema (paise, slugs, statuses) for drop-in swap.
2. ✅ **Supabase backend — COMPLETE (2026-07-02).** Live on project `bvkzurzutwuxebrnrjqz`:
   - Schema + RLS + grants applied (`supabase/migrations/001_initial_schema.sql`;
     runner: `node scripts/db-setup.mjs`). Products/reviews/orders seeded.
   - Storefront reads from Postgres (ISR 5 min); search queries via anon key;
     sitemap from DB. Cart snapshots product data at add time.
   - Checkout writes real orders: `POST /api/checkout` (server-computed totals,
     stock checks) + `POST /api/checkout/confirm` (paid, invoice no, stock
     decrement, review invites scheduled +21 days). The mock payment sheet is
     the ONLY remaining stand-in; it flips to Razorpay checkout in step 3.
   - Admin: real Supabase Auth (email/password; demo user admin@skinature.org,
     rotate at launch) with all modules on live data via RLS (is_admin()).
   - Magic-link reviews live: `/review/[token]` → single-use `submit_review` RPC
     → pending review → admin approval. Verified by an end-to-end test.
3. Razorpay (test mode) — create-order, verify signature, webhook; replace the
   mock payment sheet. _(Waiting on account access from Adnan.)_
4. Email + PDF invoice (Resend + react-pdf), stored to Supabase Storage; wire the
   21-day review-invite auto-send (pg_cron or Vercel Cron reading `send_after`).
5. Deploy to Vercel; switch Razorpay to live; DNS; live webhooks.

## 8. Open Items / To Brainstorm

- **Regional pricing (UAE / USA / international).** Adnan wants localized pricing for
  overseas orders. Razorpay settles in INR and needs its **International Payments** feature
  enabled; genuine multi-currency presentment is a further Razorpay capability. Decisions
  needed: which regions/currencies; localized prices vs. pure FX conversion; international
  shipping per region; Razorpay International eligibility; whether a secondary gateway
  (Stripe/PayPal) is acceptable for overseas. **Recommendation:** architect the schema for
  per-region/currency pricing now, launch India/INR first, and enable Razorpay
  International + multi-currency as a fast-follow. _(Questions sent to Adnan 2026-07-02 —
  awaiting his answers on regions/currencies, localized vs. FX, intl shipping, Razorpay
  International eligibility, and duties.)_
- **New product images incoming** — the client has redesigned product packaging and
  will send new photography; swap `public/new mockups/` assets + product galleries
  when received.
- **Adding a NEW product requires a redeploy** — product pages fix their slug list
  at build time (`dynamicParams = false`) so unknown URLs return real 404s. Price,
  stock, and content edits to existing products flow through ISR within 5 minutes.
  Future: on-demand revalidation hook from the admin panel.
- **Beauty Brigade membership** structure — Adnan to define.
- **Founders' real "Our Story" copy** — `/our-story` currently carries a well-written
  placeholder; swap in Hina & Adnan's own words when provided.
- **Policy pages need Adnan's sign-off** — complete drafts are live (privacy, terms,
  refund, shipping) with sensible defaults: 48h damage-claim window, no returns on
  opened products, cancellation before dispatch. Confirm specifics with the client.
- **Support email** — `care@skinature.org` used as a stand-in on /contact and in
  policies; confirm the real address.
- **Review auto-send scheduler** — pg_cron vs. Vercel Cron.
- **Analytics** (Plausible / Umami / GA4) and **newsletter** destination.

## 9. Data Model (✅ implemented in `supabase/migrations/001_initial_schema.sql`;
   note: the shipping address is snapshotted onto `orders` rather than a separate
   `addresses` table, so an order always reflects where it actually shipped)

- `products` — id, slug, name, category, price_paise, sale_price_paise?, description,
  ingredients, ritual, benefits, badge?, image_url, gallery[], is_active, sort_order,
  timestamps. _(Regional pricing adds per-region price rows — see §8.)_
- `customers` — id, email, full_name, phone, timestamps.
- `addresses` — id, customer_id, line1, line2, city, state, postal_code, country, is_default.
- `orders` — id, customer_id, status, subtotal_paise, shipping_paise, discount_paise,
  total_paise, currency, razorpay_order_id, razorpay_payment_id, razorpay_signature,
  invoice_number, invoice_url, created_at.
- `order_items` — id, order_id, product_id, name_snapshot, qty, unit_price_paise,
  line_total_paise.
- `reviews` — id, product_id, order_id, customer_id, rating, title, body,
  status(pending|approved|hidden), created_at.
- `review_invites` — id, order_id, product_id, token, send_after, sent_at, used_at.
- `site_content` — key, value_json, updated_at (homepage/banner/shipping config).
- `admins` — linked to Supabase Auth users.
- **RLS** on all tables.

## 10. External Dependencies

| Need | From | Status |
|------|------|--------|
| Supabase project + keys | Shoaib (client creds) | ✅ done — `bvkzurzutwuxebrnrjqz`, ap-south-1 |
| Razorpay access | Adnan | ask for a team-member invite (Developer role) OR test-mode Key ID + Secret; NEVER his dashboard password |
| Razorpay International enabled | Adnan / Razorpay | questions sent to Adnan |
| Business legal details (invoice) | Adnan | open |
| Resend account + skinature.com DNS | Shoaib + domain owner | later |
| Razorpay live keys | Adnan | before launch |
| Domain DNS access | domain owner | before launch |
| Vercel account | Shoaib / Adnan | before launch |

## 11. Pre-Launch Checklist (⚠️ AI agents: proactively remind Shoaib of these before go-live)

- [ ] **Rotate the Supabase DB password** — it was shared in chat during setup (2026-07-02).
      Reset via Supabase → Project Settings → Database, then update `SUPABASE_DB_PASSWORD`
      and `SUPABASE_DB_URL` in `.env.local`. **Do this before launch.**
- [ ] **Re-issue / rotate all other secrets before production** — Supabase secret key,
      Razorpay keys, Resend key — standard go-live hygiene.
- [ ] Switch **Razorpay from test → live keys**.
- [ ] Move all env vars into the **production host (Vercel)** — never rely on `.env.local` in prod.
- [ ] Final **RLS audit** on every table (nothing sensitive readable/writable by `anon`).
- [ ] Verify production **webhooks** (Razorpay) and **email domain** (Resend SPF/DKIM).
- [ ] Replace the **mock payment sheet** with real Razorpay checkout.
- [ ] Swap **admin demo auth** (`src/store/admin.ts`) for Supabase Auth and remove the
      demo credentials.
- [ ] Get **policy pages + support email** confirmed by Adnan (see §8).

## 12. Doc Set (what lives where)

- **`docs/DECISIONS.md`** (this file) — plan, flow, execution, decisions. **Primary source of truth.**
- **`CLAUDE.md`** — orientation for AI agents; points here + to the codebase.
- **`README.md`** — standard dev readme (what / stack / run).
- _Removed:_ `QUOTATION.md` and the revised-quotation PDF (terms captured in §2);
  `docs/PLAN.md` (superseded by this file).
