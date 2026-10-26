import { Link } from "@tanstack/react-router";
import { MapPin, Instagram } from "lucide-react";
import wordmarkDark from "@/assets/wordmark-dark.png.asset.json";

const address = "No. 9 Akinola Dosunmu Street, Basin";

export function SiteFooter() {
  return (
    <footer className="bg-night text-foreground/80">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="flex flex-col items-center gap-10 text-center">
          <img src={wordmarkDark.url} alt="Cardiatelier" className="h-24 w-auto object-contain md:h-32" />

          <div className="grid w-full gap-10 text-sm md:grid-cols-3 md:text-left">
            <div className="space-y-3">
              <p className="eyebrow text-gold">Visit Us</p>
              <p className="flex items-start justify-center gap-2 md:justify-start">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{address}</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="eyebrow text-gold">Explore</p>
              <div className="flex flex-col gap-2">
                <Link to="/shop" className="transition-colors hover:text-gold">Shop All</Link>
                <Link to="/delivery" className="transition-colors hover:text-gold">Delivery & Payments</Link>
                <Link to="/contact" className="transition-colors hover:text-gold">Contact</Link>
                <Link to="/auth" className="text-xs tracking-widest uppercase text-foreground/50 transition-colors hover:text-gold">
                  Studio Login
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              <p className="eyebrow text-gold">Follow Us</p>
              <div className="flex items-center justify-center gap-4 md:justify-start">
                <a
                  href="https://www.instagram.com/cardiatelier"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-gold hover:text-gold"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://www.tiktok.com/@officialkhadee"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="flex h-9 items-center justify-center rounded-full border border-white/15 px-3 text-xs tracking-widest uppercase transition-colors hover:border-gold hover:text-gold"
                >
                  TikTok
                </a>
                <a
                  href="https://snapchat.com/t/LFLp2IvK"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Snapchat"
                  className="flex h-9 items-center justify-center rounded-full border border-white/15 px-3 text-xs tracking-widest uppercase transition-colors hover:border-gold hover:text-gold"
                >
                  Snapchat
                </a>
              </div>
            </div>
          </div>

          <div className="w-full space-y-3 border-t border-white/10 pt-8">
            <p className="font-display text-lg italic text-gold">Timeless Pieces. Endless Possibilities.</p>
            <p className="text-xs tracking-widest uppercase text-foreground/50">
              © {new Date().getFullYear()} Cardiatelier Studio
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
