import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { ProductCard } from "@/components/product-card";
import { productsQuery } from "@/lib/products";
import heroAsset from "@/assets/logo-3d-gold.jpg.asset.json";
import wordmarkLight from "@/assets/wordmark-light.png.asset.json";
import { featuredProductsQuery } from "@/lib/products";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const featured = useQuery(featuredProductsQuery());

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[82vh] items-center justify-center overflow-hidden">
          <img
            src={heroAsset.url}
            alt="Cardiatelier gold logo"
            className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px] md:blur-[3px]"
          />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <p className="eyebrow text-champagne/90">Cardiatelier Studio</p>
            <h1 className="mt-5 font-display text-4xl leading-tight text-white md:text-6xl">
              Timeless Pieces.
              <br />
              <span className="gold-gradient-text">Endless Possibilities.</span>
            </h1>
            <div className="gold-rule mx-auto mt-7 w-40" />
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
              Ready-to-wear and made-to-order pieces, crafted with intention for the woman who
              dresses with meaning.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/shop"
                className="bg-primary px-8 py-3 text-xs font-medium tracking-[0.25em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep"
              >
                Shop the Collection
              </Link>
              <Link
                to="/shop"
                search={{ type: "made_to_order" }}
                className="border border-white/40 px-8 py-3 text-xs font-medium tracking-[0.25em] text-white uppercase transition-colors hover:border-gold hover:text-gold"
              >
                Made to Order
              </Link>
            </div>
          </div>
        </section>

        {/* Collections */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="text-center">
            <p className="eyebrow text-gold-deep">Our Collections</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">Two ways to wear Cardiatelier</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Link
              to="/shop"
              search={{ type: "ready_to_wear" }}
              className="group relative overflow-hidden rounded-sm border border-border bg-card"
            >
              <div className="flex min-h-56 flex-col justify-between p-8">
                <div>
                  <h3 className="font-display text-2xl">Ready-to-Wear</h3>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    Pieces available now — pick your size and order today.
                  </p>
                </div>
                <span className="text-xs tracking-[0.25em] text-gold-deep uppercase transition-colors group-hover:text-gold">
                  Browse →
                </span>
              </div>
            </Link>
            <Link
              to="/shop"
              search={{ type: "made_to_order" }}
              className="group relative overflow-hidden rounded-sm border border-border bg-card"
            >
              <div className="flex min-h-56 flex-col justify-between p-8">
                <div>
                  <h3 className="font-display text-2xl">Made-to-Order</h3>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    Made especially for you in your measurements — allow time for crafting.
                  </p>
                </div>
                <span className="text-xs tracking-[0.25em] text-gold-deep uppercase transition-colors group-hover:text-gold">
                  Browse →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Featured */}
        <section className="border-t border-border bg-secondary/40 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="text-center">
              <p className="eyebrow text-gold-deep">Featured</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">Pieces we love</h2>
            </div>
            {featured.data && featured.data.length > 0 ? (
              <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-8">
                {featured.data.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="mt-10 text-center text-sm text-muted-foreground">
                New pieces are being prepared — check back soon.
              </p>
            )}
            <div className="mt-12 text-center">
              <Link
                to="/shop"
                className="inline-block border border-gold px-8 py-3 text-xs font-medium tracking-[0.25em] text-gold-deep uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                View All Pieces
              </Link>
            </div>
          </div>
        </section>

        {/* Brand strip */}
        <section className="mx-auto max-w-4xl px-4 py-16 text-center md:px-6 md:py-24">
          <img src={wordmarkLight.url} alt="Cardiatelier" className="mx-auto h-28 w-auto object-contain md:h-36" />
          <p className="mx-auto mt-8 max-w-2xl font-display text-xl leading-relaxed italic text-foreground/80 md:text-2xl">
            "Every piece tells a story — of craft, of culture, of the woman wearing it."
          </p>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
