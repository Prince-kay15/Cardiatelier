import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab, WhatsAppIcon } from "@/components/whatsapp-fab";
import { productQuery, productsQuery, type Product } from "@/lib/products";
import { formatNaira, waLink } from "@/lib/format";
import { addToCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$slug")({
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isPending } = useQuery(productQuery(slug));
  const { data: related } = useQuery(productsQuery(null));

  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <p className="py-32 text-center text-sm text-muted-foreground">Loading piece…</p>
        <SiteFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="py-32 text-center">
          <h1 className="font-display text-3xl">Piece not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">It may have sold out or been renamed.</p>
          <Link
            to="/shop"
            className="mt-8 inline-block bg-primary px-8 py-3 text-xs tracking-[0.25em] text-primary-foreground uppercase hover:bg-gold-deep"
          >
            Back to Shop
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return <ProductDetail product={product} related={(related ?? []).filter((p) => p.slug !== product.slug).slice(0, 3)} />;
}

function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [color, setColor] = useState<string | null>(product.colors.length === 1 ? product.colors[0] : null);
  const [added, setAdded] = useState(false);

  const requiresSize = product.sizes.length > 1;
  const canOrder = !requiresSize || size !== null;

  function handleAdd() {
    if (!canOrder) return;
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size,
      color,
      quantity: 1,
      image: product.image_urls[0] ?? null,
      productType: product.product_type,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
              {product.image_urls.length > 0 ? (
                <img
                  src={product.image_urls[activeImage]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-6xl text-gold/40">CA</span>
                </div>
              )}
            </div>
            {product.image_urls.length > 1 && (
              <div className="flex gap-3">
                {product.image_urls.map((url, i) => (
                  <button
                    key={url}
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-16 overflow-hidden rounded-sm border-2 transition-colors ${
                      i === activeImage ? "border-gold" : "border-transparent opacity-70"
                    }`}
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="eyebrow text-gold-deep">
              {product.product_type === "made_to_order" ? "Made to Order" : "Ready to Wear"}
            </p>
            <h1 className="mt-2 font-display text-3xl md:text-4xl">{product.name}</h1>
            <p className="mt-3 text-xl tracking-widest text-gold-deep">{formatNaira(product.price)}</p>
            <div className="gold-rule mt-6 w-24" />

            {product.description && (
              <p className="mt-6 leading-relaxed whitespace-pre-line text-sm text-foreground/80">
                {product.description}
              </p>
            )}

            {product.product_type === "made_to_order" && (
              <div className="mt-6 border-l-2 border-gold bg-secondary/60 p-4 text-sm text-foreground/80">
                This piece is made especially for you. After you place your order, we'll reach out to
                confirm your measurements and timeline before crafting begins.
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="mt-8">
                <p className="eyebrow text-foreground/70">Size</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-12 border px-3 py-2 text-xs tracking-widest uppercase transition-colors ${
                        size === s
                          ? "border-gold bg-primary text-primary-foreground"
                          : "border-border hover:border-gold"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div className="mt-6">
                <p className="eyebrow text-foreground/70">Colour</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`border px-3 py-2 text-xs tracking-widest uppercase transition-colors ${
                        color === c
                          ? "border-gold bg-primary text-primary-foreground"
                          : "border-border hover:border-gold"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-9 flex flex-col gap-3">
              <button
                onClick={handleAdd}
                disabled={!canOrder}
                className="bg-primary px-8 py-3.5 text-xs font-medium tracking-[0.25em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-50"
              >
                {added ? "Added to Bag ✓" : "Add to Bag"}
              </button>
              <a
                href={waLink(
                  null,
                  `Hello Cardiatelier! I'm interested in "${product.name}" (${formatNaira(product.price)}).`,
                )}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 border border-border px-8 py-3.5 text-xs font-medium tracking-[0.25em] uppercase transition-colors hover:border-gold hover:text-gold-deep"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Ask About This Piece
              </a>
              {!canOrder && (
                <p className="text-center text-xs text-muted-foreground">Please choose a size first.</p>
              )}
            </div>

            <div className="mt-8 space-y-2 text-xs text-muted-foreground">
              <p>Nationwide delivery available.</p>
              <p>Payment is completed via bank transfer after checkout.</p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl">You may also love</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-8">
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}

function RelatedCard({ product }: { product: Product }) {
  return (
    <Link to="/product/$slug" params={{ slug: product.slug }} className="group block">
      <div className="aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
        {product.image_urls[0] ? (
          <img
            src={product.image_urls[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-4xl text-gold/40">CA</span>
          </div>
        )}
      </div>
      <h3 className="mt-3 text-center font-display text-lg">{product.name}</h3>
      <p className="text-center text-sm tracking-widest text-gold-deep">{formatNaira(product.price)}</p>
    </Link>
  );
}
