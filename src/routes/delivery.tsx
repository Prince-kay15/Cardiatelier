import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Truck, Banknote, MessageCircle, PackageCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { settingsQuery } from "@/lib/settings";

export const Route = createFileRoute("/delivery")({
  component: DeliveryPage,
  head: () => ({
    meta: [
      { title: "Delivery & Payments — Cardiatelier Studio" },
      {
        name: "description",
        content:
          "Nationwide delivery across Nigeria and simple bank-transfer payment. How ordering from Cardiatelier Studio works.",
      },
      { property: "og:title", content: "Delivery & Payments — Cardiatelier Studio" },
      {
        property: "og:description",
        content: "Nationwide delivery across Nigeria and simple bank-transfer payment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const steps = [
  {
    icon: PackageCheck,
    title: "1. Place your order",
    body: "Add your pieces to the bag and check out with your name, phone number and delivery address.",
  },
  {
    icon: Banknote,
    title: "2. Pay by bank transfer",
    body: "After checkout you'll see our account details. Transfer the order total and keep your receipt.",
  },
  {
    icon: MessageCircle,
    title: "3. Send your receipt",
    body: "Send the payment receipt to us on WhatsApp with your order reference so we can confirm it quickly.",
  },
  {
    icon: Truck,
    title: "4. We deliver to you",
    body: "Once payment is confirmed, your order is prepared and handed to our delivery partner.",
  },
];

function DeliveryPage() {
  const { data: settings } = useQuery(settingsQuery());

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <div className="text-center">
          <p className="eyebrow text-gold-deep">Delivery & Payments</p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl">How ordering works</h1>
          <div className="gold-rule mx-auto mt-6 w-32" />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {steps.map((s) => (
            <div key={s.title} className="rounded-sm border border-border bg-card p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                  <s.icon className="h-5 w-5 text-gold-deep" />
                </span>
                <h2 className="font-display text-xl">{s.title}</h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-4 rounded-sm border border-gold/40 bg-secondary/50 p-7 text-sm leading-relaxed text-foreground/85">
          <p className="eyebrow text-gold-deep">Good To Know</p>
          <p>{settings?.delivery_note ?? "Delivery is available nationwide."}</p>
          <p>
            <span className="font-medium">Delivery fee:</span>{" "}
            {typeof settings?.delivery_fee === "number"
              ? `A flat fee of ₦${settings.delivery_fee.toLocaleString("en-NG")} applies to every order.`
              : "We confirm the exact delivery fee for your location when your order is received — it depends on your state and city."}
          </p>
          <p>
            <span className="font-medium">Payment:</span> Bank transfer only. Account details are shown
            at checkout and confirmed on WhatsApp.
          </p>
          <p>
            <span className="font-medium">Made-to-order pieces:</span> crafting takes extra time — we'll
            confirm your timeline on WhatsApp before work begins.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-block bg-primary px-8 py-3 text-xs font-medium tracking-[0.25em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep"
          >
            Start Shopping
          </Link>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
