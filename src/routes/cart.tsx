import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { useCart, updateQuantity, removeFromCart, cartSubtotal } from "@/lib/cart";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "Your Bag — Cardiatelier Studio" },
      { name: "description", content: "Review the pieces in your bag and check out with bank transfer." },
      { property: "og:title", content: "Your Bag — Cardiatelier Studio" },
      { property: "og:description", content: "Review your bag and check out with bank transfer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function CartPage() {
  const items = useCart();
  const subtotal = cartSubtotal(items);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
        <div className="text-center">
          <p className="eyebrow text-gold-deep">Shopping Bag</p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl">Your Bag</h1>
          <div className="gold-rule mx-auto mt-6 w-32" />
        </div>

        {items.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="font-display text-xl text-foreground/70">Your bag is empty.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Beautiful pieces are waiting for you in the collection.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-block bg-primary px-8 py-3 text-xs font-medium tracking-[0.25em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep"
            >
              Shop The Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-12 divide-y divide-border border-y border-border">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 py-6">
                  <Link
                    to="/product/$slug"
                    params={{ slug: item.slug }}
                    className="h-28 w-22 shrink-0 overflow-hidden rounded-sm bg-secondary"
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-display text-2xl text-gold/40">CA</span>
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          to="/product/$slug"
                          params={{ slug: item.slug }}
                          className="font-display text-lg transition-colors hover:text-gold-deep"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-xs tracking-widest text-muted-foreground uppercase">
                          {item.productType === "made_to_order" ? "Made to Order" : "Ready to Wear"}
                          {item.size ? ` · Size ${item.size}` : ""}
                          {item.color ? ` · ${item.color}` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        aria-label={`Remove ${item.name} from bag`}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-accent"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-accent"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm tracking-widest text-gold-deep">
                        {formatNaira(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-end gap-2">
              <div className="flex w-full max-w-xs justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tracking-widest">{formatNaira(subtotal)}</span>
              </div>
              <p className="text-right text-xs text-muted-foreground">
                Delivery fee is confirmed at checkout, based on your location.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/shop"
                className="border border-border px-8 py-3 text-xs font-medium tracking-[0.25em] uppercase transition-colors hover:border-gold hover:text-gold-deep"
              >
                Continue Shopping
              </Link>
              <Link
                to="/checkout"
                className="bg-primary px-8 py-3 text-xs font-medium tracking-[0.25em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
