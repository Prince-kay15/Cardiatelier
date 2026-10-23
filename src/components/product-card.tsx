import { Link } from "@tanstack/react-router";
import { formatNaira } from "@/lib/format";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const image = product.image_urls[0];
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block overflow-hidden rounded-sm"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-4xl text-gold/40">CA</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-night/80 px-2.5 py-1 text-[0.6rem] tracking-[0.18em] text-champagne uppercase">
          {product.product_type === "made_to_order" ? "Made to Order" : "Ready to Wear"}
        </span>
      </div>
      <div className="space-y-1 pt-4 text-center">
        <h3 className="font-display text-lg text-foreground">{product.name}</h3>
        <p className="text-sm tracking-widest text-gold-deep">{formatNaira(product.price)}</p>
      </div>
    </Link>
  );
}
