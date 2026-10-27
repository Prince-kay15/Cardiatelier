import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type OrderItemRow = {
  id: string;
  product_name: string;
  quantity: number;
  size: string | null;
  color: string | null;
  unit_price: number;
};

export type OrderRow = {
  id: string;
  order_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  state: string | null;
  city: string | null;
  notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  ready_info: string | null;
  accepted_at: string | null;
  created_at: string;
  order_items: OrderItemRow[];
};

export const ORDER_STATUSES = [
  "payment_pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function adminOrdersQuery() {
  return queryOptions({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as OrderRow[];
    },
  });
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

/** Accept an order: mark it confirmed and record where/when it will be ready. */
export async function acceptOrder(id: string, readyInfo: string) {
  const { error } = await supabase
    .from("orders")
    .update({
      status: "confirmed",
      ready_info: readyInfo.trim() ? readyInfo.trim() : null,
      accepted_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
}
