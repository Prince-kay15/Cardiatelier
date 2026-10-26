import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminOrdersQuery, setOrderStatus, ORDER_STATUSES, type OrderRow, type OrderStatus } from "@/lib/orders";
import { formatNaira, waLink } from "@/lib/format";

const STATUS_LABELS: Record<string, string> = {
  payment_pending: "Payment Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function orderDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrdersPanel() {
  const { data: orders, isPending } = useQuery(adminOrdersQuery());
  const queryClient = useQueryClient();

  async function changeStatus(order: OrderRow, status: string) {
    await setOrderStatus(order.id, status as OrderStatus);
    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
  }

  if (isPending) return <p className="py-12 text-center text-sm text-muted-foreground">Loading orders…</p>;
  if (!orders?.length)
    return (
      <div className="py-12 text-center">
        <p className="font-display text-xl text-foreground/70">No orders yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Customer orders placed on the store will appear here.
        </p>
      </div>
    );

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <div key={order.id} className="border border-border bg-secondary/40 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg">{order.order_ref}</p>
              <p className="mt-0.5 text-xs tracking-widest text-muted-foreground uppercase">
                {orderDate(order.created_at)}
              </p>
            </div>
            <select
              value={order.status}
              onChange={(e) => changeStatus(order, e.target.value)}
              aria-label={`Status for order ${order.order_ref}`}
              className="border border-border bg-background px-3 py-2 text-xs tracking-widest uppercase outline-none focus:border-gold"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s] ?? s}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="text-sm">
              <p className="eyebrow text-foreground/60">Customer</p>
              <p className="mt-1.5 font-medium">{order.customer_name}</p>
              <p className="mt-0.5 text-muted-foreground">{order.customer_email}</p>
              <p className="text-muted-foreground">{order.customer_phone}</p>
              <p className="mt-2 text-muted-foreground">
                {order.delivery_address}
                {order.city ? `, ${order.city}` : ""}
                {order.state ? `, ${order.state}` : ""}
              </p>
              {order.notes && <p className="mt-2 text-xs italic text-muted-foreground">“{order.notes}”</p>}
              <a
                href={waLink(
                  order.customer_phone,
                  `Hello ${order.customer_name}! This is Cardiatelier Studio regarding your order ${order.order_ref} (${formatNaira(order.total)}).`,
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block border border-border px-4 py-2 text-xs tracking-[0.2em] uppercase transition-colors hover:border-gold hover:text-gold-deep"
              >
                Message Customer
              </a>
            </div>
            <div className="text-sm">
              <p className="eyebrow text-foreground/60">Pieces</p>
              <ul className="mt-1.5 space-y-1.5">
                {(order.order_items ?? []).map((item) => (
                  <li key={item.id} className="flex justify-between gap-3">
                    <span>
                      {item.product_name}
                      <span className="text-muted-foreground">
                        {" "}
                        ×{item.quantity}
                        {item.size ? ` · ${item.size}` : ""}
                        {item.color ? ` · ${item.color}` : ""}
                      </span>
                    </span>
                    <span className="whitespace-nowrap">{formatNaira(item.unit_price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatNaira(order.subtotal)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>{order.delivery_fee > 0 ? formatNaira(order.delivery_fee) : "—"}</span>
                </p>
                <p className="flex justify-between pt-1 font-display text-base">
                  <span>Total</span>
                  <span className="text-gold-deep">{formatNaira(order.total)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
