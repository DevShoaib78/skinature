-- Skinature initial schema
-- Applied to project bvkzurzutwuxebrnrjqz (ap-south-1).
-- Design notes: prices are integer paise; shipping address is snapshotted onto the
-- order (an order must reflect where it actually shipped, even if the customer moves).

create extension if not exists pgcrypto;

-- ── Admins ────────────────────────────────────────────────────────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ── updated_at helper ─────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ── Products ──────────────────────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (category in ('Skin Care', 'Hair Care', 'Hair + Skin')),
  is_kit boolean not null default false,
  price_paise integer not null check (price_paise >= 0),
  sale_price_paise integer check (sale_price_paise is null or sale_price_paise >= 0),
  benefit text not null default '',
  description text not null default '',
  ingredients text not null default '',
  ritual text not null default '',
  benefits text not null default '',
  badge text,
  rating numeric(2, 1) not null default 5.0,
  review_count integer not null default 0,
  image text not null default '',
  gallery text[] not null default '{}',
  contents text[],
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ── Customers ─────────────────────────────────────────────────────────────
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

-- ── Orders ────────────────────────────────────────────────────────────────
create sequence if not exists public.order_no_seq start 1101;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique default ('SKN-' || nextval('public.order_no_seq')::text),
  customer_id uuid not null references public.customers (id),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  subtotal_paise integer not null check (subtotal_paise >= 0),
  shipping_paise integer not null check (shipping_paise >= 0),
  total_paise integer not null check (total_paise >= 0),
  currency text not null default 'INR',
  ship_name text not null,
  ship_line1 text not null,
  ship_line2 text,
  ship_city text not null,
  ship_state text not null,
  ship_pincode text not null,
  payment_provider text,
  payment_id text,
  razorpay_order_id text,
  razorpay_signature text,
  invoice_no text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_customer_idx on public.orders (customer_id);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id),
  name_snapshot text not null,
  qty integer not null check (qty > 0),
  unit_price_paise integer not null,
  line_total_paise integer not null
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- ── Reviews ───────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  order_id uuid references public.orders (id),
  author text not null,
  rating integer not null check (rating between 1 and 5),
  body text not null,
  verified boolean not null default true,
  status text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_idx on public.reviews (product_id, status);

create table if not exists public.review_invites (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  send_after timestamptz not null,
  sent_at timestamptz,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

-- ── Site settings (single row) ────────────────────────────────────────────
create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  shipping_telangana_paise integer not null default 6000,
  shipping_rest_paise integer not null default 10000,
  business_name text not null default 'Nurtured by Nature Products',
  business_address text not null
    default 'Plot No. 509-J-III, Road No. 86, Near Lotus Pond, Jubilee Hills, Hyderabad - 500096, Telangana, India',
  gstin text not null default '36AAZFN8373Q1ZU',
  notify_email text not null default 'admin@skinature.org',
  updated_at timestamptz not null default now()
);

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (id) values (true) on conflict do nothing;

-- ── Row Level Security ────────────────────────────────────────────────────
alter table public.admins enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.review_invites enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists admins_read on public.admins;
create policy admins_read on public.admins
  for select using (public.is_admin());

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select using (is_active = true or public.is_admin());
drop policy if exists products_admin_write on public.products;
create policy products_admin_write on public.products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists customers_admin_all on public.customers;
create policy customers_admin_all on public.customers
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists orders_admin_all on public.orders;
create policy orders_admin_all on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists order_items_admin_all on public.order_items;
create policy order_items_admin_all on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists reviews_public_read on public.reviews;
create policy reviews_public_read on public.reviews
  for select using (status = 'approved' or public.is_admin());
drop policy if exists reviews_admin_write on public.reviews;
create policy reviews_admin_write on public.reviews
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists review_invites_admin_all on public.review_invites;
create policy review_invites_admin_all on public.review_invites
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists settings_public_read on public.site_settings;
create policy settings_public_read on public.site_settings
  for select using (true);
drop policy if exists settings_admin_write on public.site_settings;
create policy settings_admin_write on public.site_settings
  for update using (public.is_admin()) with check (public.is_admin());

-- ── Grants ("automatically expose new tables" is OFF, so grant explicitly) ─
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant all on all functions in schema public to service_role;
grant select on public.products, public.reviews, public.site_settings to anon;
grant select, insert, update, delete on
  public.products, public.customers, public.orders, public.order_items,
  public.reviews, public.review_invites, public.site_settings
  to authenticated;
grant select on public.admins to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- ── Public review submission via magic-link token ─────────────────────────
create or replace function public.get_review_invite(p_token text)
returns table (product_name text, product_image text, used boolean)
language sql stable security definer
set search_path = public
as $$
  select p.name, p.image, (ri.used_at is not null)
  from public.review_invites ri
  join public.products p on p.id = ri.product_id
  where ri.token = p_token;
$$;

create or replace function public.submit_review(
  p_token text,
  p_rating integer,
  p_author text,
  p_body text
)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  v_invite public.review_invites%rowtype;
begin
  select * into v_invite
  from public.review_invites
  where token = p_token and used_at is null;

  if not found then
    raise exception 'invalid_or_used_token';
  end if;
  if p_rating < 1 or p_rating > 5 then
    raise exception 'invalid_rating';
  end if;
  if length(trim(p_author)) < 2 or length(trim(p_body)) < 10 then
    raise exception 'invalid_content';
  end if;

  insert into public.reviews (product_id, order_id, author, rating, body, verified, status)
  values (v_invite.product_id, v_invite.order_id, trim(p_author), p_rating, trim(p_body), true, 'pending');

  update public.review_invites set used_at = now() where id = v_invite.id;
end $$;

revoke all on function public.get_review_invite(text) from public;
revoke all on function public.submit_review(text, integer, text, text) from public;
grant execute on function public.get_review_invite(text) to anon, authenticated;
grant execute on function public.submit_review(text, integer, text, text) to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
