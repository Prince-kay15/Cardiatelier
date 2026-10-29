import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
// Bundled in public/logos so the wordmark loads on any host (Lovable, Vercel, ...).

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Cardiatelier Studio" },
      {
        name: "description",
        content:
          "The story behind Cardiatelier Studio — ready-to-wear and made-to-order pieces crafted with intention in Lagos, Nigeria.",
      },
      { property: "og:title", content: "About — Cardiatelier Studio" },
      {
        property: "og:description",
        content:
          "The story behind Cardiatelier Studio — ready-to-wear and made-to-order pieces crafted with intention.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const values = [
  {
    title: "Crafted, never mass-produced",
    body: "Every piece is cut and finished with care — whether it leaves the studio today or is made especially for you.",
  },
  {
    title: "Made for the woman who dresses with meaning",
    body: "Our silhouettes are designed to be worn again and again — for church, for work, for celebrations, for ordinary Tuesdays.",
  },
  {
    title: "You are part of the process",
    body: "From choosing a fabric to confirming your measurements, we walk with you at every step — on WhatsApp, personally.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-3xl px-4 pt-16 pb-12 text-center md:px-6 md:pt-24">
          <img src={wordmarkLight.url} alt="Cardiatelier" className="mx-auto h-20 w-auto object-contain md:h-24" />
          <p className="eyebrow mt-8 text-gold-deep">Our Story</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Timeless Pieces. Endless Possibilities.</h1>
          <div className="gold-rule mx-auto mt-7 w-40" />
          <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-foreground/80 md:text-base">
            Cardiatelier Studio began with a simple belief: a woman's wardrobe should hold pieces she
            reaches for with joy — garments that carry craft, culture and character. From our studio in
            Lagos, we design and make clothing for women across Nigeria: ready-to-wear pieces available
            now, and made-to-order creations cut to your measurements.
          </p>
        </section>

        <section className="border-t border-border bg-secondary/40 py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <div className="text-center">
              <p className="eyebrow text-gold-deep">What We Stand For</p>
              <h2 className="mt-3 font-display text-3xl">The Cardiatelier way</h2>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {values.map((v) => (
                <div key={v.title} className="rounded-sm border border-border bg-card p-6 text-center">
                  <h3 className="font-display text-xl">{v.title}</h3>
                  <div className="gold-rule mx-auto mt-4 w-16" />
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6 md:py-20">
          <p className="eyebrow text-gold-deep">Two Collections</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Link
              to="/shop"
              search={{ type: "ready_to_wear" }}
              className="group rounded-sm border border-border bg-card p-8 transition-colors hover:border-gold"
            >
              <h3 className="font-display text-2xl">Ready-to-Wear</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Available now in standard sizes — pick yours and order today.
              </p>
              <span className="mt-6 inline-block text-xs tracking-[0.25em] text-gold-deep uppercase transition-colors group-hover:text-gold">
                Browse →
              </span>
            </Link>
            <Link
              to="/shop"
              search={{ type: "made_to_order" }}
              className="group rounded-sm border border-border bg-card p-8 transition-colors hover:border-gold"
            >
              <h3 className="font-display text-2xl">Made-to-Order</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Made especially for you in your measurements — allow crafting time.
              </p>
              <span className="mt-6 inline-block text-xs tracking-[0.25em] text-gold-deep uppercase transition-colors group-hover:text-gold">
                Browse →
              </span>
            </Link>
          </div>
          <div className="mt-12">
            <Link
              to="/contact"
              className="inline-block bg-primary px-8 py-3 text-xs font-medium tracking-[0.25em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep"
            >
              Get In Touch
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
