import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ShoppingBag } from "lucide-react";
import caMonogram from "@/assets/ca-monogram-mark.png";
import { useCart, cartCount } from "@/lib/cart";

const navItems = [
  { label: "Shop All", to: "/shop" },
  { label: "Ready-to-Wear", to: "/shop", search: { type: "ready_to_wear" } },
  { label: "Made-to-Order", to: "/shop", search: { type: "made_to_order" } },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <button
          className="flex h-9 w-9 items-center justify-center md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="flex items-center gap-3">
          <img src={caMonogram} alt="Cardiatelier CA monogram" className="h-9 w-9 object-contain md:h-11 md:w-11" />
          <span className="font-display text-lg tracking-[0.28em] text-foreground uppercase md:text-xl">
            Cardiatelier
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.to || (item.to === "/shop" && pathname.startsWith("/product"));
            const searchProps = "search" in item ? { search: item.search } : {};
            return (
              <Link
                key={item.label}
                to={item.to}
                {...searchProps}
                className={`text-[0.7rem] tracking-[0.22em] uppercase transition-colors hover:text-gold-deep ${
                  active ? "text-gold-deep" : "text-foreground/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/cart"
          className="relative flex h-9 w-9 items-center justify-center rounded-sm transition-colors hover:bg-accent"
          aria-label="Shopping bag"
        >
          <ShoppingBag className="h-5 w-5 text-foreground" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-semibold text-primary-foreground">
              {cartCount(items)}
            </span>
          )}
        </Link>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => {
              const searchProps = "search" in item ? { search: item.search } : {};
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  {...searchProps}
                  onClick={() => setOpen(false)}
                  className="text-xs tracking-[0.22em] uppercase text-foreground/85"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
