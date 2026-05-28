-- ============================================================
-- KicksFly Supabase Schema
-- Run this entire file in the Supabase SQL Editor.
-- If tables already exist, only the new policies at the bottom
-- need to be added — see "STEP 2: RLS Policies" section.
-- ============================================================

-- ============================================================
-- STEP 1: Types, Tables, and Constraints
-- ============================================================

create type if not exists public.app_role as enum ('customer', 'storekeeper', 'admin');
create type if not exists public.order_status as enum ('Pending', 'Packed', 'Ready for Delivery', 'Delivered');

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'customer',
  assigned_store_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  area text,
  pincode text,
  created_at timestamptz not null default now()
);

alter table public.users
  add constraint if not exists users_assigned_store_fk
  foreign key (assigned_store_id) references public.stores(id) on delete set null;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  price numeric(10,2) not null check (price >= 0),
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete cascade,
  size text not null,
  stock_count integer not null default 0 check (stock_count >= 0),
  unique (product_id, store_id, size)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  status public.order_status not null default 'Pending',
  payment_method text not null,
  subtotal numeric(10,2) not null,
  delivery_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  delivery_label text,
  delivery_line1 text not null,
  delivery_area text not null,
  delivery_city text not null,
  delivery_pincode text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  size text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0)
);

-- ============================================================
-- STEP 2: Enable RLS on all tables
-- ============================================================

alter table public.users enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- ============================================================
-- STEP 3: RLS Policies
-- Drop existing policies first to avoid conflicts on re-run.
-- ============================================================

-- Users
drop policy if exists "Users can read own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;

create policy "Users can read own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Stores (public read)
drop policy if exists "Public can read stores" on public.stores;

create policy "Public can read stores" on public.stores
  for select using (true);

-- Products (public read)
drop policy if exists "Public can read products" on public.products;

create policy "Public can read products" on public.products
  for select using (true);

-- Inventory (public read)
drop policy if exists "Public can read inventory" on public.inventory;

create policy "Public can read inventory" on public.inventory
  for select using (true);

-- ============================================================
-- Orders policies
-- NOTE: The app currently uses mock/demo auth (no real Supabase
-- auth session). The "allow_demo" policies below let the app
-- work without a session. Remove them once you wire up real
-- Supabase Auth (supabase.auth.signInWithPassword etc).
-- ============================================================

drop policy if exists "Users can read own orders" on public.orders;
drop policy if exists "Users can create own orders" on public.orders;
drop policy if exists "Storekeepers/admin can read store orders" on public.orders;
drop policy if exists "Storekeepers/admin can update store orders" on public.orders;
drop policy if exists "Demo: allow anon insert orders" on public.orders;
drop policy if exists "Demo: allow anon read orders" on public.orders;

-- Authenticated user can read their own orders
create policy "Users can read own orders" on public.orders
  for select using (auth.uid() = user_id);

-- Authenticated user can create orders tied to themselves
create policy "Users can create own orders" on public.orders
  for insert with check (auth.uid() = user_id);

-- Storekeepers and admins can read orders for their store
create policy "Storekeepers/admin can read store orders" on public.orders
  for select using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.role in ('storekeeper', 'admin')
        and (u.role = 'admin' or u.assigned_store_id = store_id)
    )
  );

-- Storekeepers and admins can update order status
create policy "Storekeepers/admin can update store orders" on public.orders
  for update using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.role in ('storekeeper', 'admin')
        and (u.role = 'admin' or u.assigned_store_id = store_id)
    )
  );

-- DEMO ONLY: Allow anonymous (unauthenticated) inserts and reads
-- This is needed because the app currently uses mock auth, not real Supabase Auth.
-- ⚠️  Remove these two policies once you implement real Supabase Auth login.
create policy "Demo: allow anon insert orders" on public.orders
  for insert with check (auth.uid() is null);

create policy "Demo: allow anon read orders" on public.orders
  for select using (auth.uid() is null);

-- ============================================================
-- Order Items policies
-- ============================================================

drop policy if exists "Users can read own order items" on public.order_items;
drop policy if exists "Users can create own order items" on public.order_items;
drop policy if exists "Storekeepers/admin can read store order items" on public.order_items;
drop policy if exists "Demo: allow anon insert order items" on public.order_items;
drop policy if exists "Demo: allow anon read order items" on public.order_items;

create policy "Users can read own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "Users can create own order items" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "Storekeepers/admin can read store order items" on public.order_items
  for select using (
    exists (
      select 1
      from public.orders o
      join public.users u on u.id = auth.uid()
      where o.id = order_id
        and u.role in ('storekeeper', 'admin')
        and (u.role = 'admin' or u.assigned_store_id = o.store_id)
    )
  );

-- DEMO ONLY: Allow anonymous inserts and reads on order_items
-- ⚠️  Remove once real Supabase Auth is implemented.
create policy "Demo: allow anon insert order items" on public.order_items
  for insert with check (auth.uid() is null);

create policy "Demo: allow anon read order items" on public.order_items
  for select using (auth.uid() is null);

-- ============================================================
-- STEP 4: Seed the demo store row
-- The app hardcodes store_id = '11111111-1111-4111-a111-111111111111'
-- when inserting orders. This row satisfies that FK constraint.
-- ============================================================

insert into public.stores (id, name, address, city, area, pincode)
values (
  '11111111-1111-4111-a111-111111111111',
  'KicksFly Indiranagar',
  '12th Main Road, Indiranagar',
  'Bangalore',
  'Indiranagar',
  '560038'
)
on conflict (id) do nothing;
