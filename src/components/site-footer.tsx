import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import wordmarkFooter from "@/assets/wordmark-footer.png.asset.json";

const address = "No. 9 Akinola Dosunmu Street, Basin";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function SnapchatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.015.659-.12 1.033-.301.165-.088.344-.104.464-.104.181 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.168 1.168-.084.044-.194.089-.318.148-.419.134-.868.375-.988.838-.084.209-.065.434.059.663l.006.015c.043.099 1.385 3.155 4.35 3.66a.412.412 0 0 1 .348.431.537.537 0 0 1-.109.317c-.224.256-.738.436-1.537.562-.09.015-.194.045-.3.074-.27.076-.553.15-.828.15-.133 0-.553-.014-.9-.239-.434-.285-.9-.434-1.379-.434-.209 0-.418.029-.637.074-.435.091-.875.607-1.03 1.24-.045.194-.076.387-.11.593-.104.637-.226 1.324-.617 1.61-.035.025-.073.049-.116.069-.48.24-.99.285-1.513.285h-.06c-1.319 0-2.722-.45-3.672-.869-1.24-.537-2.44-1.279-3.318-1.902-.449-.318-.84-.592-1.17-.802-.39-.24-.9-.39-1.477-.525-.166-.037-.342-.068-.512-.098-.598-.105-1.21-.215-1.524-.738-.227-.383-.194-.898.105-1.58.016-.036.035-.07.055-.107.548-.98 1.51-1.86 2.63-2.274a7.36 7.36 0 0 0-1.34-.136l-1.184.001c-1.09 0-2.118-.075-2.855-.631-.348-.264-.554-.613-.554-.957 0-.631.449-1.286 1.264-1.848.216-.149.475-.294.733-.434.552-.301 1.178-.639 1.517-1.09.26-.345.375-.779.31-1.28 0-.002-.001-.006-.002-.008-.114-.53-.432-1.09-.615-1.413l-.005-.01c-.39-.675-.827-1.44-.873-2.31-.046-.889.284-1.662.98-2.296.577-.53 1.353-.9 2.254-1.075.35-.068.716-.1 1.09-.1.33 0 .66.025.975.074 1.28.194 2.22.673 2.895 1.088.666-.415 1.605-.894 2.885-1.088a6.15 6.15 0 0 1 .976-.074z" />
    </svg>
  );
}

const socials = [
  { name: "Instagram", href: "https://www.instagram.com/cardiatelier", Icon: InstagramIcon },
  { name: "TikTok", href: "https://www.tiktok.com/@officialkhadee", Icon: TikTokIcon },
  { name: "Snapchat", href: "https://snapchat.com/t/LFLp2IvK", Icon: SnapchatIcon },
];

export function SiteFooter() {
  return (
    <footer className="bg-night text-white/85">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="flex flex-col items-center gap-10 text-center">
          <img src={wordmarkFooter.url} alt="Cardiatelier" className="h-32 w-auto object-contain md:h-44" />

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
                <Link to="/delivery" className="transition-colors hover:text-gold">Delivery &amp; Payments</Link>
                <Link to="/contact" className="transition-colors hover:text-gold">Contact</Link>
                <Link to="/auth" className="text-xs tracking-widest text-white/50 uppercase transition-colors hover:text-gold">
                  Studio Login
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              <p className="eyebrow text-gold">Follow Us</p>
              <div className="flex flex-col items-center gap-2.5 md:items-start">
                {socials.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 border border-white/20 px-4 py-2 text-xs tracking-widest uppercase transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon className="h-4 w-4" />
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full space-y-3 border-t border-white/15 pt-8">
            <p className="font-display text-lg text-gold italic">Timeless Pieces. Endless Possibilities.</p>
            <p className="text-xs tracking-widest text-white/55 uppercase">
              © {new Date().getFullYear()} Cardiatelier Studio
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
