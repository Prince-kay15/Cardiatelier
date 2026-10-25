import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Instagram, Clock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab, WhatsAppIcon } from "@/components/whatsapp-fab";
import { settingsQuery } from "@/lib/settings";
import { waLink } from "@/lib/format";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Cardiatelier Studio" },
      {
        name: "description",
        content:
          "Reach Cardiatelier Studio on WhatsApp, Instagram, TikTok or Snapchat — or visit us at No. 9 Akinola Dosunmu Street, Lagos.",
      },
      { property: "og:title", content: "Contact — Cardiatelier Studio" },
      {
        property: "og:description",
        content: "Reach Cardiatelier Studio on WhatsApp or visit the studio in Lagos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const address = "No. 9 Akinola Dosunmu Street, Basin";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/cardiatelier" },
  { label: "TikTok", href: "https://www.tiktok.com/@officialkhadee" },
  { label: "Snapchat", href: "https://snapchat.com/t/LFLp2IvK" },
];

function ContactPage() {
  const { data: settings } = useQuery(settingsQuery());

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <div className="text-center">
          <p className="eyebrow text-gold-deep">Contact</p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl">We'd love to hear from you</h1>
          <div className="gold-rule mx-auto mt-6 w-32" />
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Questions about a piece, your size, or your order? WhatsApp is the fastest way to reach the
            studio — we reply personally.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="rounded-sm border border-border bg-card p-8 text-center">
            <p className="eyebrow text-gold-deep">Chat With Us</p>
            <div className="mt-5 flex justify-center">
              <a
                href={waLink(
                  settings?.whatsapp_number,
                  "Hello Cardiatelier! I have an enquiry about your pieces.",
                )}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-primary px-6 py-3 text-xs font-medium tracking-[0.2em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Fastest replies — usually same day.</p>
          </div>

          <div className="rounded-sm border border-border bg-card p-8 text-center">
            <p className="eyebrow text-gold-deep">Follow Us</p>
            <div className="mt-5 flex flex-col gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 border border-border px-4 py-2.5 text-xs tracking-[0.2em] uppercase transition-colors hover:border-gold hover:text-gold-deep"
                >
                  <Instagram className="h-3.5 w-3.5" />
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card p-8 text-center">
            <p className="eyebrow text-gold-deep">Visit The Studio</p>
            <div className="mt-5 space-y-4 text-sm text-foreground/80">
              <p className="flex items-start justify-center gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{address}</span>
              </p>
              <p className="flex items-start justify-center gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>Visits by appointment — message us first.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-sm border border-gold/40 bg-secondary/50 p-6 text-center text-sm text-foreground/80">
          Ready to order? Browse the{" "}
          <a href="/shop" className="font-medium text-gold-deep underline underline-offset-4">
            full collection
          </a>{" "}
          — payment is completed by bank transfer after checkout, and we deliver nationwide.
        </div>
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
