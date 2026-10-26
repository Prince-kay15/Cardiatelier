create or replace function public.place_order(
  p_order_ref text,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_delivery_address text,
  p_city text default null,
  p_state text default null,
  p_notes text default null,
  p_items jsonb default null,
  p_delivery_fee numeric default 0
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_subtotal numeric;
  v_total numeric;
  v_item jsonb;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  if nullif(p_customer_name, '') is null or nullif(p_customer_email, '') is null
     or nullif(p_customer_phone, '') is null or nullif(p_delivery_address, '') is null then
    raise exception 'Name, email, phone and delivery address are required';
  end if;

  v_subtotal := 0;
  for v_item in select * from jsonb_array_elements(p_items) loop
    if coalesce((v_item->>'quantity')::int, 0) <= 0
       or coalesce((v_item->>'unit_price')::numeric, -1) < 0
       or nullif(v_item->>'product_name', '') is null then
      raise exception 'Invalid order item';
    end if;
    v_subtotal := v_subtotal + (v_item->>'quantity')::int * (v_item->>'unit_price')::numeric;
  end loop;

  v_total := v_subtotal + coalesce(p_delivery_fee, 0);

  insert into public.orders (
    order_ref, customer_name, customer_email, customer_phone, delivery_address,
    city, state, notes, subtotal, delivery_fee, total, status
  ) values (
    p_order_ref, p_customer_name, p_customer_email, p_customer_phone, p_delivery_address,
    nullif(p_city, ''), nullif(p_state, ''), nullif(p_notes, ''),
    v_subtotal, coalesce(p_delivery_fee, 0), v_total, 'payment_pending'
  ) returning id into v_id;

  insert into public.order_items (order_id, product_name, quantity, size, color, unit_price)
  select
    v_id,
    v_item->>'product_name',
    (v_item->>'quantity')::int,
    nullif(v_item->>'size', ''),
    nullif(v_item->>'color', ''),
    (v_item->>'unit_price')::numeric
  from jsonb_array_elements(p_items) v_item;

  return p_order_ref;
end;
$$;

revoke all on function public.place_order(text,text,text,text,text,text,text,text,jsonb,numeric) from public, anon, authenticated;
grant execute on function public.place_order(text,text,text,text,text,text,text,text,jsonb,numeric) to anon, authenticated;