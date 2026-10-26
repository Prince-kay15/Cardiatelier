import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import caMonogram from "@/assets/ca-monogram-mark.png";
import { OrdersPanel } from "@/components/admin/orders-panel";
import { ProductsPanel } from "@/components/admin/products-panel";
import { SettingsPanel } from "@/components/admin/settings-panel";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw (await import("@tanstack/react-router")).redirect({ to: "/auth" });
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: data.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      const { redirect } = await import("@tanstack/react-router");
      throw redirect({ to: "/" });
    }
  },
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Studio Dashboard — Cardiatelier Studio" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const tabs = [
  { key: "orders", label: "Orders" },
  { key: "products", label: "Collection" },
  { key: "settings", label: "Settings" },
] as const;

function AdminDashboard() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("orders");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <img src={caMonogram} alt="Cardiatelier monogram" className="h-8 w-8 object-contain" />
            <span className="font-display text-base tracking-[0.28em] uppercase">Studio Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-xs tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-gold-deep"
            >
              View Store
            </a>
            <button
              onClick={handleSignOut}
              className="border border-border px-4 py-2 text-xs tracking-[0.2em] uppercase transition-colors hover:border-gold hover:text-gold-deep"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="flex gap-6 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px border-b-2 px-1 pb-3 text-xs font-medium tracking-[0.2em] uppercase transition-colors ${
                tab === t.key
                  ? "border-gold text-gold-deep"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "orders" && <OrdersPanel />}
          {tab === "products" && <ProductsPanel />}
          {tab === "settings" && <SettingsPanel />}
        </div>
      </main>
    </div>
  );
}
