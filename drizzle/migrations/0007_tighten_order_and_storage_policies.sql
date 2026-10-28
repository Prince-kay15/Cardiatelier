-- Orders and order items are created only through the validated
-- place_order() security-definer function, so the open guest INSERT
-- policies on these tables are unused and can be removed.
DROP POLICY IF EXISTS "Guests can place orders" ON public.orders;
DROP POLICY IF EXISTS "Guests can add order items" ON public.order_items;

-- Product images are served to visitors through the product-image
-- server route (service role), so direct public reads of storage
-- objects are not needed and can be removed.
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;