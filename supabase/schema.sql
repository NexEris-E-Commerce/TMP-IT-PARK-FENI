-- ============================================================================
-- IT PARK FENI — e-commerce schema (Supabase / Postgres)
-- Run this once in Supabase SQL editor (Project → SQL Editor → New query).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- ============================================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ---------- Profiles (extends Supabase auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
-- (covers email/password AND Google OAuth sign-ups).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- Addresses ----------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home',
  full_name text not null,
  phone text not null,
  zone_id text not null,              -- matches DELIVERY_ZONES ids in src/lib/commerce.ts
  address_line text not null,
  city text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Products (mirrors src/lib/types.ts Product shape) ----------
-- Seed this from src/lib/data/products.ts once, then treat this table as
-- the source of truth and delete the static file.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  brand text not null,
  category text not null,
  image text,
  price integer not null,             -- whole BDT, no minor unit
  regular_price integer,
  rating numeric(2,1),
  review_count integer default 0,
  stock integer not null default 0,
  low_stock_threshold integer default 3,
  key_spec text,
  specs jsonb default '[]'::jsonb,     -- [{label, value}, ...]
  warranty text,
  is_featured boolean default false,
  is_best_seller boolean default false,
  is_deal boolean default false,
  deal_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_brand_idx on public.products (brand);

-- ---------- Orders ----------
create type public.order_status as enum (
  'pending',        -- created, awaiting payment (or COD confirmation call)
  'confirmed',       -- payment verified / COD confirmed by phone
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

create type public.payment_method as enum ('cod', 'sslcommerz');
create type public.payment_status as enum ('unpaid', 'paid', 'failed', 'refunded');

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default
    ('IPF-' || to_char(now(), 'YYMMDD') || '-' || lpad((floor(random() * 10000))::text, 4, '0')),
  user_id uuid references auth.users(id) on delete set null,  -- nullable: guest checkout
  guest_email text,
  guest_phone text,

  full_name text not null,
  phone text not null,
  zone_id text not null,
  address_line text not null,
  city text,

  subtotal integer not null,
  delivery_fee integer not null default 0,
  total integer not null,

  payment_method public.payment_method not null default 'cod',
  payment_status public.payment_status not null default 'unpaid',
  status public.order_status not null default 'pending',

  sslcommerz_val_id text,   -- validation id returned by SSLCommerz after payment
  sslcommerz_tran_id text,  -- our tran_id sent to SSLCommerz (usually = order_number)

  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,   -- snapshot at time of order
  product_slug text not null,
  unit_price integer not null,  -- snapshot at time of order
  quantity integer not null check (quantity > 0),
  line_total integer not null
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- ---------- updated_at helper ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute procedure public.touch_updated_at();

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute procedure public.touch_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles: a user can read/update only their own row.
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- Addresses: fully scoped to the owning user.
create policy "addresses: owner full access" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Products: public read. Writes go through the service-role key from the
-- admin panel only (no client-side write policy defined on purpose).
create policy "products: public read" on public.products
  for select using (true);

-- Orders: owner can read their own orders; anyone can INSERT (guest
-- checkout creates orders via the anon key through /api/checkout, which
-- validates the payload server-side before insert).
create policy "orders: owner read" on public.orders
  for select using (auth.uid() = user_id);
create policy "orders: authenticated insert own" on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);

-- Order items follow the parent order's visibility.
create policy "order_items: read via order" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "order_items: insert via order" on public.order_items
  for insert with check (
    exists (select 1 from public.orders o where o.id = order_id)
  );

-- NOTE: Admin dashboard operations (updating order status, editing
-- products/stock, viewing all orders) should use the Supabase
-- service_role key server-side (src/lib/supabase/admin.ts), which bypasses
-- RLS. Never expose the service_role key to the browser.

-- ============================================================================
-- Contact messages (from the public Contact Us form)
-- ============================================================================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Anyone can submit a message (validated server-side in /api/contact);
-- no one can read them back via the anon key — only the admin (service role).
create policy "contact_messages: public insert" on public.contact_messages
  for insert with check (true);

-- ============================================================================
-- Storage: product images
-- ============================================================================
-- A public bucket so product photos display on the storefront without
-- authentication, but only admins can upload/replace/delete files.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product-images: public read" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "product-images: admin upload" on storage.objects
  for insert with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "product-images: admin update" on storage.objects
  for update using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "product-images: admin delete" on storage.objects
  for delete using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================================================
-- Payment settings (SSLCommerz credentials, managed from /admin)
-- ============================================================================
-- A single row holding the store's SSLCommerz merchant credentials, so an
-- admin can configure/switch sandbox <-> live payments from the admin panel
-- instead of editing environment variables and redeploying.
--
-- Deliberately has NO RLS policies at all (RLS is enabled with zero grants),
-- so neither the anon key nor a logged-in user's key can read or write this
-- table under any circumstance — only the service_role key
-- (src/lib/supabase/admin.ts) can touch it. This keeps the store password
-- from ever being reachable from the browser.
create table if not exists public.payment_settings (
  id text primary key default 'sslcommerz',
  store_id text,
  store_password text,
  sandbox boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.payment_settings enable row level security;

insert into public.payment_settings (id) values ('sslcommerz')
on conflict (id) do nothing;

-- ============================================================================
-- Stock reservation (atomic, race-condition-safe)
-- ============================================================================
-- Products have no client-writable RLS policy on purpose (see "products:
-- public read" above) — the anon/authenticated keys used by the storefront
-- can't UPDATE stock directly. These SECURITY DEFINER functions are the one
-- narrow, validated way checkout is allowed to touch stock: they only ever
-- move stock by the caller-specified amount for caller-specified products,
-- nothing else.
--
-- `reserve_stock_for_order` locks each product row (FOR UPDATE) inside a
-- single transaction, so two customers checking out the last unit of the
-- same product at the same time can't both succeed — the second call waits
-- for the first to finish, then correctly sees the reduced stock and fails
-- if there's not enough left. On any shortfall the whole function raises an
-- exception, which rolls back every decrement it already made in this call.
create or replace function public.reserve_stock_for_order(items jsonb)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  item jsonb;
  v_product_id uuid;
  v_quantity integer;
  v_current_stock integer;
  v_name text;
begin
  for item in select * from jsonb_array_elements(items)
  loop
    v_product_id := (item->>'product_id')::uuid;
    v_quantity := (item->>'quantity')::integer;

    if v_quantity is null or v_quantity <= 0 then
      raise exception 'Invalid quantity for product %', v_product_id;
    end if;

    select stock, name into v_current_stock, v_name
    from public.products
    where id = v_product_id
    for update;

    if v_current_stock is null then
      raise exception 'Product % not found', v_product_id;
    end if;

    if v_current_stock < v_quantity then
      raise exception 'Sorry, "%" only has % left in stock (you requested %)', v_name, v_current_stock, v_quantity;
    end if;

    update public.products set stock = stock - v_quantity where id = v_product_id;
  end loop;
end;
$$;

-- Compensating action: gives stock back. Used when (a) an order insert fails
-- right after a successful reservation, so the reserved units aren't lost,
-- and (b) an admin cancels an order, so its reserved units return to sale.
create or replace function public.restore_stock_for_order(items jsonb)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  item jsonb;
  v_product_id uuid;
  v_quantity integer;
begin
  for item in select * from jsonb_array_elements(items)
  loop
    v_product_id := (item->>'product_id')::uuid;
    v_quantity := (item->>'quantity')::integer;
    if v_product_id is null or v_quantity is null or v_quantity <= 0 then
      continue;
    end if;
    update public.products set stock = stock + v_quantity where id = v_product_id;
  end loop;
end;
$$;

grant execute on function public.reserve_stock_for_order(jsonb) to anon, authenticated, service_role;
grant execute on function public.restore_stock_for_order(jsonb) to anon, authenticated, service_role;

-- ============================================================================
-- Making someone an admin
-- ============================================================================
-- There's no self-serve admin signup on purpose. After a person registers a
-- normal account, promote them by running (in the SQL Editor):
--
--   update public.profiles set is_admin = true where id =
--     (select id from auth.users where email = 'owner@example.com');
--
-- The /admin panel checks this flag server-side on every request.
