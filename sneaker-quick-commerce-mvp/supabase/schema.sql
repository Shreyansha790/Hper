create extension if not exists pgcrypto;

create type public.app_role as enum ('customer', 'storekeeper', 'admin');
create type public.order_status as enum ('Pending', 'Packed', 'Ready for Delivery', 'Delivered');

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
  add constraint users_assigned_store_fk
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

alter table public.users enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Users can read own profile" on public.users
for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
for update using (auth.uid() = id);

create policy "Public can read stores" on public.stores
for select using (true);

create policy "Public can read products" on public.products
for select using (true);

create policy "Public can read inventory" on public.inventory
for select using (true);

create policy "Users can read own orders" on public.orders
for select using (auth.uid() = user_id);

create policy "Users can create own orders" on public.orders
for insert with check (auth.uid() = user_id);

create policy "Storekeepers/admin can read store orders" on public.orders
for select using (
  exists (
    select 1 from public.users u
    where u.id = auth.uid()
      and u.role in ('storekeeper', 'admin')
      and (u.role = 'admin' or u.assigned_store_id = store_id)
  )
);

create policy "Storekeepers/admin can update store orders" on public.orders
for update using (
  exists (
    select 1 from public.users u
    where u.id = auth.uid()
      and u.role in ('storekeeper', 'admin')
      and (u.role = 'admin' or u.assigned_store_id = store_id)
  )
);

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
