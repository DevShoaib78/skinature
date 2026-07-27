# Skinature v1 — Decisions, Flow & Execution

> **Single source of truth.** This document holds the current plan, flow, execution
> order, and every locked business/product decision for the Skinature v1 build.
> If anything here conflicts with `CLAUDE.md`, older notes, or memory, **this file wins.**
> Keep it updated whenever a decision changes.
>
> _Last updated: 2026-07-23 (**skinature.org is LIVE on Vercel** with the 2026 rebrand;
> Razorpay verified in test mode; all work committed + dual-pushed)._

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
- **Hosting:** **Vercel**. A password-gated **preview is LIVE** for the client at
  **https://skinaturesite.vercel.app** (2026-07-06), deployed from the **Skinature**
  account/repo (Vercel Hobby can't deploy the org repo from a collaborator, so the
  Skinature account owns the Vercel project). Locked via `PREVIEW_BASIC_AUTH`
  (`src/middleware.ts`) — creds `skinature` / `Skinature@2026`. **Domain:** skinature.org
  (production, later — remove the gate then).

## 5. Products (current catalog — 5)

Prices stored as **integer paise**, displayed as ₹. Single price now; an optional sale
price triggers the strikethrough treatment.

_(Prices REVISED by the client 2026-07-22 alongside the full packaging/branding refresh;
applied to the live DB + `data.ts` fallback the same day.)_

| id | Name | Price | Sale price | Category |
|----|------|-------|-----------|----------|
| 1 | Brightening & Cleansing Mask | ₹499 | — | Skin Care |
| 2 | Root Revival Hair Mask & Cocktail | ₹649 | — | Hair Care |
| 3 | Root Revival Hair Oil | ₹599 | — | Hair Care |
| 4 | Hair Care Kit | ₹1299 | — | Hair Care |
| 5 | Bridal Kit | ₹2999 | — | Hair + Skin |

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
7a. **Review-invite admin controls (locked 2026-07-18, ✅ built + shipped).** On
   `/admin/orders/<no>` → "Review Links", per product: the 21-day clock starts at
   **payment**; **"Send email now / Resend"** emails the magic link immediately and marks
   it sent, which **stops** the auto-send (when email isn't configured it says so and does
   NOT mark sent); **"Copy link"** (for WhatsApp) **never** touches the timer;
   **"Restart timer"** clears sent and re-arms auto-send **+21 days** (same token).
   Server route: `POST /api/admin/review-invites/[id]/send` (admin cookie-authed).
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
    **AEO shipped (2026-07-02):** `/llms.txt` (live catalog + brand facts for AI answer
    engines), `Organization`/`Brand` JSON-LD with full NAP + GSTIN + founders, plus the
    existing FAQPage/Product/Breadcrumb schema. Business constants in `src/lib/data.ts`.
    **Mobile verified (2026-07-02):** audited at 390px (iPhone) with headless Chrome —
    **zero horizontal overflow on any page** (`scrollWidth == innerWidth` across home,
    shop, product, cart, FAQ, our-story, contact, admin login), screenshots reviewed.
    The only wide elements are admin data tables (inside `overflow-x-auto` wrappers) and
    the shop filter chips (a scroll strip) — both intentional.
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
3. ✅ **Razorpay (test mode) — COMPLETE + VERIFIED (2026-07-17/18).** Built exactly to the
   earlier plan and proven end-to-end; **committed + dual-pushed + LIVE on skinature.org
   (2026-07-23)**. What exists:
   - `src/lib/razorpay.ts` — server SDK; `razorpayEnabled()` = both keys present.
   - `src/lib/checkout/finalize.ts` — shared idempotent `finalizePaidOrder()` (atomic
     pending→paid guarded by `status='pending'`, invoice_no, stock decrement, 21-day
     review invites, gated emails). Called by mock confirm, verify, and webhook.
   - `/api/checkout` — creates the Razorpay order (amount=`total_paise`, receipt=
     `order_no`), stores `razorpay_order_id`, returns `{razorpay:{keyId,orderId,amount}}`;
     plain mock response when keys absent.
   - `/api/checkout/verify` — HMAC-SHA256(`order_id|payment_id`) with timing-safe compare;
     `razorpay_order_id` is read from OUR order row (a foreign signature can't finalize).
   - `/api/webhooks/razorpay` — raw-body verify vs `RAZORPAY_WEBHOOK_SECRET`, handles
     `payment.captured`, idempotent, 200-no-op until the secret is set (deploy-time).
   - `CheckoutClient.tsx` — loads checkout.js, opens the real modal (prefill + brand
     theme), verify → success page; mock sheet fallback. **EMI + Pay Later + cardless EMI
     hidden** via `config.display.hide` (client decision 2026-07-18; kept: UPI, Cards,
     Netbanking, Wallet).
   - **Verification done:** real Razorpay order ids created (proves keys); valid-signature
     path lands `paid` + stock decrement + invoice + review invite; tampered signature →
     400 and stays pending; idempotent re-verify; a REAL browser payment via
     **Netbanking → test simulator → Success** produced a genuine Razorpay signature and a
     `paid` order; Shoaib also completed a manual test payment.
   - **Testing how-to:** the generic intl test card `4111…` is REJECTED (account is
     domestic-only — correct for India). Use **Netbanking → any bank → Success**. The
     modal's UPI section is QR-only in test mode (scanning a test QR with a real UPI app
     does nothing — sandboxed).
   - **DECISION (2026-07-18): keep TEST keys while Adnan & Hina test** — identical flow to
     live with zero real money. Live keys are a launch-day step only.
   - ✅ **WENT LIVE 2026-07-28.** Live key generated on Adnan's account (Merchant ID
     `Qy6dDl6kq6bv7g`, KYC active, `skinature.org` approved). The old WordPress key
     `rzp_live_R5FEh4HnENzB2Z` was **deactivated immediately** (safe — the domain now
     points at Vercel, so the old WooCommerce checkout was already unreachable). Live
     **webhook** registered at `https://www.skinature.org/api/webhooks/razorpay` for
     `payment.captured` + `payment.failed`; the old WooCommerce webhook was removed.
     ⚠️ **Live keys live ONLY in the Vercel env. `.env.local` deliberately keeps the TEST
     keys** so local development can never charge a real card. Do not "fix" that.
   - 🔒 **CRITICAL SECURITY FIX (2026-07-28), found in the pre-launch audit:**
     `/api/checkout/confirm` — the mock-payment route — was PUBLIC and marked an order
     `paid` with **no payment verification whatsoever**. Harmless in test mode, but with
     live keys anyone could read the `orderId` from the `/api/checkout` response in
     DevTools, POST it to `/confirm`, and receive goods free. It now returns **404
     whenever `razorpayEnabled()` is true**, so it survives only for local dev without
     keys. Re-ran the exploit after the fix: 404 returned, order stayed `pending`.
     **Never remove that guard.**
   **Account context (2026-07-02):** Adnan has two Razorpay accounts — his **personal**
   one (currently powering the live WordPress site on skinature.org) and a **company**
   one (switch to later). We use the personal account first. Notes:
   - Switching personal → company later = swap Key ID/Secret + re-register webhook.
     **No code change.**
   - Test mode is isolated from the live WordPress payments; building/testing does NOT
     affect the running WP store. **Do NOT regenerate the LIVE key** pre-launch — it would
     break WordPress's live payments. Only the TEST key is needed now.
   - **Launch is a domain cutover:** our deploy replaces WordPress at skinature.org (can't
     run both). At cutover: point DNS to our host, verify a real ₹1 live payment, then
     disable the old WooCommerce Razorpay webhook. Keep WP live until that moment.
4. ✅ **Email + PDF invoice + review-invite scheduler — BUILT (2026-07-02), gated.**
   - PDF invoice via **react-pdf** (`src/lib/pdf/`), verified rendering the real GST
     invoice (Nurtured by Nature Products, GSTIN, Rs. amounts). Admin **Download PDF**
     hits `GET /api/admin/invoice/[orderNo]` (cookie-authed, admin-only).
   - **Resend** email pipeline (`src/lib/email/`): customer confirmation + PDF attachment,
     admin notification, and review-invite templates. Gated behind `RESEND_API_KEY` +
     `EMAIL_FROM` — a graceful no-op until set, wired into `/api/checkout/confirm` so an
     unpaid/unsent email never breaks a paid order.
   - **Review-invite auto-send** cron at `GET/POST /api/cron/send-review-invites`
     (protected by `CRON_SECRET`): finds invites past their 21-day `send_after`, emails
     the magic link, marks `sent_at`. Schedule it daily (Vercel Cron) at deploy.
   - ✅ **EMAIL IS LIVE (2026-07-28) — Gmail SMTP, not Resend.** Client chose one inbox:
     everything sends as **official.skinature@gmail.com** via **nodemailer** + a Google
     **App Password** (2SV enabled on the account; backup codes saved by the client).
     `resend` is no longer used. Gated on `GMAIL_USER` + `GMAIL_APP_PASSWORD`; missing =
     graceful no-op so checkout never depends on email. ~500 recipients/day (ample; revisit
     Zoho only if volume demands). **Verified by a real send:** SMTP auth OK, 57KB PDF
     invoice generated and attached, customer + admin emails delivered.
     Re-test any time: `npx tsx scripts/test-email.mts <address>`.
     NOTE: you can NOT send "from" a gmail address via Resend — Gmail's DMARC rejects it,
     so Gmail's own SMTP is the only legitimate route for this sender.
   - The dead **`care@skinature.org`** address (never existed) was being advertised on
     /contact and in the homepage JSON-LD — replaced with official.skinature@gmail.com.
   - Also remaining: register the **Vercel Cron** for review invites (`CRON_SECRET` is
     already set in the Vercel env).
   - **Admin review-invite controls SHIPPED (2026-07-18, live)** — see §6 item 7a.
5. ✅ **Deploy + domain — DONE (2026-07-23). skinature.org is LIVE on Vercel** serving the
   2026 rebrand. Cutover done EARLY by design (no marketing yet; Adnan & Hina test by
   typing the domain) — approved by both founders, including WordPress no longer being
   served.
   **Live configuration (do not "fix" these):**
   - Nameservers at the registry = **`ns1/ns2.vercel-dns.com`**. **Vercel manages DNS.**
     Do NOT add manual A/CNAME records in Vercel or GoDaddy, and do NOT switch back to
     GoDaddy-default nameservers — the current setup gives automatic DNS + SSL + the
     apex→www redirect.
   - `skinature.org` 308-redirects to `www.skinature.org`; SSL (Let's Encrypt) issued on
     both; `PREVIEW_BASIC_AUTH` removed (no password); **`SITE_NOINDEX=1`** set in Vercel
     env → `X-Robots-Tag: noindex` + robots.txt disallow-all for the testing phase.
   - Razorpay **test** keys are set in Vercel env, so the live domain opens the real
     Razorpay modal with no real money.
   - Pipeline: push to `origin` (Skinature repo) → Vercel auto-builds → live on the domain
     (verified: deploy landed ~30s after push).
   **How it got there (history worth keeping):** GoDaddy = registrar only; DNS/WordPress/
   mail all sat on **webhostbox** (`192.185.129.80`) with NO cPanel/WordPress/webmail
   access (previous developer unreachable) — so the old WP site could not be backed up.
   The nameserver change jammed in GoDaddy's queue for 3 days (submitted while Domain Lock
   was ON); GoDaddy **phone support** cleared the stuck job and set the Vercel nameservers.
   Registrant contact was also moved off the previous developer to Adnan.
   **Consequence:** the old `@skinature.org` mailboxes no longer receive (their MX was not
   replicated). Nobody had access to them anyway; re-add MX records in Vercel DNS if the
   client ever wants that mail flowing again.
   At REAL launch: Razorpay live keys + live webhook, **remove `SITE_NOINDEX`**, §11.

## 8. Open Items / To Brainstorm

- **✅ IMPLEMENTED + LIVE (2026-07-23): the 2026 REBRAND REHAUL.** New packaging
  palette applied at the token layer (deep forest #2A3E2C, sand gold #E2D2A5, warm
  creams, per-product colorways blush/mauve · peach/terracotta · sage/olive — source:
  `public/Reference/`). Landing rebuilt to Adnan's flow: black/gold marquee **ticker**
  (no promo line) → slim navbar (logo file trimmed → `public/logo-trimmed.webp`) →
  **hero 3+1 slides** (product Banners + Family Lineup, FE-style) → **products** (Kama
  cards, "Loved by Thousands & Counting" / CTA "Explore Our Products") → **review
  shuffle-deck** (curated placeholder set w/ Google+Amazon badges — swap with real
  reviews; live Google rating via Places API pending Adnan's business profile) →
  **video showcase** (3 how-to films, D'you-style autoplay) → **benefits** (D'you
  typographic list, doc content) → **Globally Glowing & Growing** (map kept, beliefs
  sidebar) → footer. **About Us page** rebuilt at `/our-story` (Story/Philosophy/
  Founders' Note + `The Cofounders.jpeg`); Brigade page copy updated. DB products
  rewired: new prices, new image/gallery (scenes → video → pack shots; `.mp4` entries
  render as video in the PDP gallery), docx ingredients + "Why You'll Love It"
  benefits. ⚠️ Client will regenerate the flawed AI oil-bottle scene images later —
  swap the specific files when provided. Original inputs for reference:
  forestessentialsindia.com (ticker + hero), kamaayurveda.in (products + review deck),
  dyou.co (video showcase + benefits design). Raw inputs:
  - Ticker effect (continuous scrolling strip) at the very top.
  - Hero section with slides, 4-5 product showcase mockups (Forest Essentials style).
  - **Landing flow:** ticker → navbar → hero slides → Products (Kama style) → Reviews
    (Google reviews preferred, "one stone two places"; Amazon element; shuffle-deck style
    for written reviews, Kama style) → Video showcase (D'you style) → Benefits of
    Skinature (existing content, redesigned, D'you style) → "Globally Glowing & Growing"
    (keep heading + map, present info uniquely) → footer.
  - **Separate About Us page:** Story, Philosophy, Founders' Note (+ The Cofounders.jpeg,
    at `public/The Cofounders.jpeg`).
  - Also flagged: AEO refining, Google reviews integration, preview-link refining.
  - NOTE: some sections will need ADDITIONAL Gemini product mockups (different angles /
    showcase styles like the reference sites); the first batch of generated scenes covers
    prompts 1-6 (hair oil + cleansing mask sets) so far.

- **Regional pricing (UAE / USA / international) — DEFERRED to the final phase.**
  Decision (Shoaib, 2026-07-02): **launch India/INR first**, tackle regional pricing
  last, after the India store is live. More inputs from Adnan have arrived and are
  parked for that phase. Razorpay settles in INR and needs its **International Payments**
  feature enabled; genuine multi-currency presentment is a further Razorpay capability.
  Open decisions for that phase: which regions/currencies; localized prices vs. pure FX;
  international shipping per region; Razorpay International eligibility; whether a
  secondary gateway (Stripe/PayPal) is acceptable overseas. The schema already leaves
  room for per-region price rows so this stays a fast-follow, not a rebuild.
- **New product images incoming** — the client has redesigned product packaging and
  will send new photography; swap `public/new mockups/` assets + product galleries
  when received.
- **Adding a NEW product requires a redeploy** — product pages fix their slug list
  at build time (`dynamicParams = false`) so unknown URLs return real 404s. Price,
  stock, and content edits to existing products flow through ISR within 5 minutes.
  Future: on-demand revalidation hook from the admin panel.
- **Beauty Brigade membership** structure — Adnan to define.
- ~~**Founders' real "Our Story" copy**~~ ✅ RECEIVED + LIVE (2026-07-23) — the client's
  own Story / Philosophy / Founders' Note copy (from `SKINATURE WEBSITE info.docx`) is on
  `/our-story` with the co-founders' photo.
- **Policy pages need Adnan's sign-off** — complete drafts are live (privacy, terms,
  refund, shipping) with sensible defaults: 48h damage-claim window, no returns on
  opened products, cancellation before dispatch. Confirm specifics with the client.
- **Support email** — `care@skinature.org` used as a stand-in on /contact and in
  policies; confirm the real address.
- **Review auto-send scheduler** — pg_cron vs. Vercel Cron (`CRON_SECRET` is already set
  in the Vercel env; just needs the schedule registered).
- **Analytics** (Plausible / Umami / GA4) and **newsletter** destination.
- **Landing review deck is a curated placeholder set** — replace with the client's real
  Google + Amazon reviews. Live Google rating/count via the **Places API** needs Adnan's
  Google Business Profile (Amazon has no public reviews API — curate those manually).
- **AI oil-bottle scene images** — the client will regenerate the flawed ones; swap those
  specific files in `public/AI generated mockups/` when provided.
- **WhatsApp order notifications** — client wants the order confirmation + invoice sent to
  the customer's WhatsApp automatically. Direction agreed: **Meta WhatsApp Cloud API
  directly, NO BSP middlemen** (AiSensy/Interakt/WATI were explicitly rejected). Cost:
  utility message ≈ **₹0.115 + GST each**, no monthly fee. Needs a dedicated phone number
  (not already on the WhatsApp app), a Meta Business account, and template approval.

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
| Razorpay **Test-mode** Key ID (`rzp_test_…`) + Key Secret | Adnan | ✅ received 2026-07-06, in `.env.local`; integration built + verified. Live keys + webhook at launch. |
| **Gmail App Password** for official.skinature@gmail.com (2FA → App Passwords) | Adnan | 🔴 needed — unblocks all customer emails (Gmail SMTP plan, §7.4) |
| GoDaddy account access (registrar) | Adnan | ✅ obtained 2026-07-20 (registrar only; no hosting/WP/webmail access exists) |
| `@skinature.org` mailbox decision (keep MX vs gmail-only) | Adnan/Hina | 🔴 asked 2026-07-20 — blocks the nameserver flip |
| Razorpay account activated (KYC) + business name = "Nurtured by Nature Products" | Adnan | confirm (needed for LIVE, not for test build) |
| Razorpay International enabled | Adnan / Razorpay | deferred with regional pricing (final phase) |
| Business legal details (invoice) | Adnan | ✅ received 2026-07-02 (§6.5) |
| Email sending setup (Resend from `info@skinature.org`, or Gmail SMTP) | Shoaib | 🔴 next — unblocked now that we control DNS (§7.4) |
| Razorpay live keys | Adnan | before REAL launch (regenerating the live key breaks the old WP checkout — accepted, zero income there) |
| Domain DNS access | Adnan/Shoaib | ✅ done — GoDaddy access obtained; NS now on Vercel (§7.5) |
| Vercel account | Skinature account | ✅ live — project `skinaturesite` serving skinature.org |
| Google Business Profile (for live Google reviews) | Adnan | 🔴 requested |
| Dedicated phone number + Meta Business account (WhatsApp Cloud API) | Adnan | 🔴 requested |

## 11. Pre-Launch Checklist (⚠️ AI agents: proactively remind Shoaib of these before go-live)

> **Note (2026-07-23):** skinature.org is already LIVE, but in a **founders-testing phase**
> — Razorpay is in TEST mode and `SITE_NOINDEX=1` keeps it out of Google. This checklist is
> for the **REAL launch** (real money + indexable).

- [ ] **Rotate the Supabase DB password** — it was shared in chat during setup (2026-07-02).
      Reset via Supabase → Project Settings → Database, then update `SUPABASE_DB_PASSWORD`
      and `SUPABASE_DB_URL` in `.env.local`. **Do this before launch.**
- [ ] **Re-issue / rotate all other secrets before production** — Supabase secret key,
      Razorpay keys, Resend key — standard go-live hygiene.
- [x] Switch **Razorpay from test → live keys**. _(✅ 2026-07-28 — live keys + webhook in
      Vercel; old WP key deactivated. Local .env.local stays on TEST by design.)_
- [x] Move all env vars into the **production host (Vercel)** — never rely on `.env.local`
      in prod. _(✅ done: Supabase keys, Razorpay TEST keys, `CRON_SECRET`, `SITE_NOINDEX`.)_
- [ ] Final **RLS audit** on every table (nothing sensitive readable/writable by `anon`).
- [x] Verify production **webhooks** and **email sending**. _(✅ 2026-07-28 —
      `RAZORPAY_WEBHOOK_SECRET` set + webhook registered; Gmail SMTP proven by a real
      delivery with the PDF invoice attached.)_
- [ ] Set `CRON_SECRET` and register the **Vercel Cron** for
      `/api/cron/send-review-invites` (daily) so 21-day review invites auto-send.
- [ ] **Wipe ALL demo/seed data before real customers arrive** — the seeded orders,
      customers, reviews, and review-invites are synthetic (emails `@example.com`, phones
      are Shoaib's two test numbers `9885421522` / `9989298408`). Delete them so the store
      launches empty. NEVER seed realistic-looking Indian mobile numbers (they collide with
      real subscribers).
- [x] **Remove `PREVIEW_BASIC_AUTH`** from the Vercel project so the production site is
      public. _(✅ done 2026-07-23 at the domain cutover; the middleware is a no-op without
      it and now only applies the `SITE_NOINDEX` header.)_
- [x] Replace the **mock payment sheet** with real Razorpay checkout. _(✅ done 2026-07-17,
      test mode; the sheet remains only as the no-keys fallback.)_
- [ ] Remove the **demo admin credentials** from the login screen
      (`src/components/admin/LoginClient.tsx`) and rotate the admin@skinature.org password.
      _(Auth itself is already real Supabase Auth.)_
- [ ] **Remove `SITE_NOINDEX` from the Vercel env** (added for the early domain cutover,
      see §7 item 5) so Google can index the store at real launch. ⚠️ Easy to forget — the
      site looks perfectly normal to humans while invisible to search engines.
- [ ] Get **policy pages + support email** confirmed by Adnan (see §8).

## 12. Doc Set (what lives where)

- **`docs/DECISIONS.md`** (this file) — plan, flow, execution, decisions. **Primary source of truth.**
- **`CLAUDE.md`** — orientation for AI agents; points here + to the codebase.
- **`README.md`** — standard dev readme (what / stack / run).
- _Removed:_ `QUOTATION.md` and the revised-quotation PDF (terms captured in §2);
  `docs/PLAN.md` (superseded by this file).
