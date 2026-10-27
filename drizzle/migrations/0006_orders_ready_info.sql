ALTER TABLE public.orders ADD COLUMN ready_info text;
ALTER TABLE public.orders ADD COLUMN accepted_at timestamptz;
COMMENT ON COLUMN public.orders.ready_info IS 'Where/when the order will be ready, shown to the customer in the confirmation email';