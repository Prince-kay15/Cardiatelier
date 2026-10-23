import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { ProductCard } from "@/components/product-card";
import { productsQuery } from "@/lib/products";

type ShopSearch = {
  type?: "ready_to_wear" | "made_to_order";
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const type = search.type;
    return {
      type: type === "ready_to_wear" || type === "made_to_order" ? type : undefined,
    };
  },
  component: ShopPage,
});

const filters = [
  { label: "All Pieces", value: undefined },
  { label: "Ready-to-Wear", value: "ready_to_wear" as const },
  { label: "Made-to-Order", value: "made_to_order" as const },
];

function ShopPage() {
  const { type } = Route.useSearch();
  const { data: products, isPending } = useQuery(productsQuery(type ?? null));

  const heading = type === "ready_to_wear"
    ? "Ready-to-Wear"
    : type === "made_to_order"
      ? "Made-to-Order"
      : "The Collection";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="text-center">
          <p className="eyebrow text-gold-deep">Shop</p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl">{heading}</h1>
          <div className="gold-rule mx-auto mt-6 w-32" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {filters.map((f) => {
            const active = (type ?? undefined) === f.value;
            return (
              <Link
                key={f.label}
                to="/shop"
                search={f.value ? { type: f.value } : {}}
                className={`border px-5 py-2 text-[0.7rem] tracking-[0.2em] uppercase transition-colors ${
                  active
                    ? "border-gold bg-primary text-primary-foreground"
                    : "border-border text-foreground/70 hover:border-gold hover:text-gold-deep"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {isPending ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">Loading pieces…</p>
        ) : products && products.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="font-display text-xl text-foreground/70">No pieces here yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              New pieces are added regularly — follow us on Instagram for updates.
            </p>
          </div>
        )}
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
