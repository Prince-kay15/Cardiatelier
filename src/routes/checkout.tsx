import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppIcon } from "@/components/whatsapp-fab";
import { useCart, clearCart, cartSubtotal } from "@/lib/cart";
import { settingsQuery } from "@/lib/settings";
import { supabase } from "@/integrations/supabase/client";
import { formatNaira, generateOrderRef, waLink } from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Checkout — Cardiatelier Studio" },
      {
        name: "description",
        content: "Complete your Cardiatelier order. Pay securely via bank transfer.",
      },
      { property: "og:title", content: "Checkout — Cardiatelier Studio" },
      { property: "og:description", content: "Complete your order and pay via bank transfer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type PlacedOrder = {
  ref: string;
  total: number;
  itemCount: number;
};

function CheckoutPage() {
  const items = useCart();
  const { data: settings } = useQuery(settingsQuery());
  const subtotal = cartSubtotal(items);
  const deliveryFee = settings?.delivery_fee ?? null;
  const deliveryKnown = deliveryFee !== null && deliveryFee > 0;
  const total = subtotal + (deliveryKnown ? (deliveryFee as number) : 0);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    notes: "",
  });

  function setField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const valid =
    form.name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.phone.trim().length >= 7 &&
    form.address.trim().length > 4 &&
    items.length > 0;

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const ref = generateOrderRef();
      const { error: orderError } = await supabase.rpc("place_order", {
        p_order_ref: ref,
        p_customer_name: form.name.trim(),
        p_customer_email: form.email.trim(),
        p_customer_phone: form.phone.trim(),
        p_delivery_address: form.address.trim(),
        p_city: form.city.trim() || null,
        p_state: form.state.trim() || null,
        p_notes: form.notes.trim() || null,
        p_items: items.map((item) => ({
          product_name: item.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          unit_price: item.price,
        })),
        p_delivery_fee: deliveryKnown ? (deliveryFee as number) : 0,
      });
      if (orderError) throw orderError;

      clearCart();
      setPlaced({ ref, total, itemCount: cartSubtotalLength(items) });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong placing your order. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function cartSubtotalLength(list: { quantity: number }[]) {
    return list.reduce((sum, i) => sum + i.quantity, 0);
  }

  if (placed) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center md:px-6 md:py-24">
          <p className="eyebrow text-gold-deep">Order Received</p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl">Thank you, {form.name.split(" ")[0]}!</h1>
          <div className="gold-rule mx-auto mt-6 w-24" />
          <p className="mt-8 text-sm leading-relaxed text-foreground/80">
            Your order <span className="font-semibold tracking-widest text-gold-deep">{placed.ref}</span>{" "}
            ({placed.itemCount} {placed.itemCount === 1 ? "piece" : "pieces"}, {formatNaira(placed.total)}) has
            been received. Please complete payment by bank transfer using the details below, then send the
            payment receipt to us on WhatsApp so we can confirm and dispatch your pieces.
          </p>

          <div className="mt-10 border border-border bg-secondary/60 p-6 text-left">
            <p className="eyebrow text-foreground/70">Bank Transfer Details</p>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Bank:</span>{" "}
                {settings?.bank_name || "To be confirmed"}
              </p>
              <p>
                <span className="text-muted-foreground">Account Number:</span>{" "}
                <span className="tracking-widest">{settings?.account_number || "To be confirmed"}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Account Name:</span>{" "}
                {settings?.account_name || "To be confirmed"}
              </p>
              <p>
                <span className="text-muted-foreground">Amount:</span>{" "}
                <span className="tracking-widest text-gold-deep">{formatNaira(placed.total)}</span>
              </p>
            </div>
            {(!settings?.bank_name || !settings?.account_number) && (
              <p className="mt-4 border-l-2 border-gold pl-3 text-xs text-muted-foreground">
                We'll confirm the exact account details with you before payment.
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={waLink(
                settings?.whatsapp_number,
                `Hello Cardiatelier! I just placed order ${placed.ref} (${formatNaira(placed.total)}). Here is my payment receipt.`,
              )}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-primary px-8 py-3.5 text-xs font-medium tracking-[0.25em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Send Payment Receipt
            </a>
            <Link
              to="/shop"
              className="border border-border px-8 py-3.5 text-xs font-medium tracking-[0.25em] uppercase transition-colors hover:border-gold hover:text-gold-deep"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-24 text-center md:px-6">
          <h1 className="font-display text-3xl">Your bag is empty</h1>
          <p className="mt-3 text-sm text-muted-foreground">Add a piece before checking out.</p>
          <Link
            to="/shop"
            className="mt-8 inline-block bg-primary px-8 py-3 text-xs font-medium tracking-[0.25em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep"
          >
            Shop The Collection
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const inputClass =
    "w-full border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="text-center">
          <p className="eyebrow text-gold-deep">Checkout</p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl">Complete Your Order</h1>
          <div className="gold-rule mx-auto mt-6 w-32" />
        </div>

        <form onSubmit={placeOrder} className="mt-12 grid gap-12 md:grid-cols-5 md:gap-16">
          {/* Delivery details */}
          <div className="md:col-span-3">
            <p className="eyebrow text-foreground/70">Delivery Details</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs tracking-widest text-muted-foreground uppercase">
                  Full Name *
                </span>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs tracking-widest text-muted-foreground uppercase">
                  Email *
                </span>
                <input
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs tracking-widest text-muted-foreground uppercase">
                  Phone / WhatsApp *
                </span>
                <input
                  type="tel"
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="080..."
                  required
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs tracking-widest text-muted-foreground uppercase">
                  Delivery Address *
                </span>
                <input
                  className={inputClass}
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="Street address"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs tracking-widest text-muted-foreground uppercase">
                  City
                </span>
                <input
                  className={inputClass}
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                  placeholder="e.g. Lagos"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs tracking-widest text-muted-foreground uppercase">
                  State
                </span>
                <input
                  className={inputClass}
                  value={form.state}
                  onChange={(e) => setField("state", e.target.value)}
                  placeholder="e.g. Lagos State"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs tracking-widest text-muted-foreground uppercase">
                  Order Notes
                </span>
                <textarea
                  className={`${inputClass} min-h-24 resize-y`}
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  placeholder="Landmark, preferred delivery day, size adjustments…"
                />
              </label>
            </div>

            <p className="mt-6 border-l-2 border-gold bg-secondary/60 p-4 text-xs leading-relaxed text-foreground/80">
              Payment is completed by bank transfer after you place your order. Your order reference and
              our account details will be shown on the next screen — send your payment receipt on WhatsApp
              to confirm.
            </p>
          </div>

          {/* Order summary */}
          <div className="md:col-span-2">
            <p className="eyebrow text-foreground/70">Order Summary</p>
            <div className="mt-5 divide-y divide-border border border-border p-4">
              {items.map((item) => (
                <div key={item.key} className="flex justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.quantity} × {formatNaira(item.price)}
                      {item.size ? ` · ${item.size}` : ""}
                      {item.color ? ` · ${item.color}` : ""}
                    </p>
                  </div>
                  <p className="whitespace-nowrap tracking-widest text-gold-deep">
                    {formatNaira(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tracking-widest">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="tracking-widest">
                  {deliveryKnown ? formatNaira(deliveryFee as number) : "Confirmed after order"}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-display text-lg">
                <span>Total</span>
                <span className="tracking-widest text-gold-deep">{formatNaira(total)}</span>
              </div>
            </div>

            {error && (
              <p className="mt-4 border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!valid || submitting}
              className="mt-6 w-full bg-primary px-8 py-3.5 text-xs font-medium tracking-[0.25em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Placing Order…" : "Place Order"}
            </button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
