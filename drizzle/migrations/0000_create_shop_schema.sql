create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "Users can view own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price integer not null default 0,
  product_type text not null default 'ready_to_wear' check (product_type in ('ready_to_wear', 'made_to_order')),
  category text not null default 'general',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  image_urls text[] not null default '{}',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;

alter table public.products enable row level security;

create policy "Public can view active products"
  on public.products for select
  using (is_active = true or public.has_role(auth.uid(), 'admin'));

create policy "Admins manage products"
  on public.products for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_touch_updated_at
  before update on public.products
  for each row
  execute function public.touch_updated_at();

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_ref text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_address text not null,
  city text,
  state text,
  notes text,
  subtotal integer not null default 0,
  delivery_fee integer not null default 0,
  total integer not null default 0,
  status text not null default 'payment_pending' check (status in ('payment_pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  user_id uuid,
  created_at timestamptz not null default now()
);

grant insert on public.orders to anon;
grant select, insert, update, delete on public.orders to authenticated;
grant all on public.orders to service_role;

alter table public.orders enable row level security;

create policy "Guests can place orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);

create policy "Customers can view own orders"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "Admins manage orders"
  on public.orders for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid,
  product_name text not null,
  size text,
  color text,
  quantity integer not null default 1,
  unit_price integer not null default 0
);

grant insert on public.order_items to anon;
grant select, insert, update, delete on public.order_items to authenticated;
grant all on public.order_items to service_role;

alter table public.order_items enable row level security;

create policy "Guests can add order items"
  on public.order_items for insert
  to anon, authenticated
  with check (true);

create policy "Order members can view items"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
    )
  );

create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

grant select on public.settings to anon;
grant select, insert, update, delete on public.settings to authenticated;
grant all on public.settings to service_role;

alter table public.settings enable row level security;

create policy "Anyone can read settings"
  on public.settings for select
  using (true);

create policy "Admins manage settings"
  on public.settings for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Storage: public read of product images, admins can upload
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "Admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'products' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'products' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'products' and public.has_role(auth.uid(), 'admin'));
