import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import caMonogram from "@/assets/ca-monogram-mark.png";
import { hasAdminAccess } from "@/lib/admin-access";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Studio Access — Cardiatelier Studio" },
      { name: "description", content: "Sign in to the Cardiatelier Studio dashboard." },
      { property: "og:title", content: "Studio Access — Cardiatelier Studio" },
      { property: "og:description", content: "Sign in to the Cardiatelier Studio dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!active || !user) return;
      setSignedIn(true);
      if (userError) {
        setError("We couldn't verify studio access. Please try signing in again.");
        return;
      }
      const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (!active) return;
      if (roleError) {
        setError("We couldn't verify studio access. Please try signing in again.");
      } else if (hasAdminAccess(isAdmin, user.email)) {
        navigate({ to: "/admin", replace: true });
      } else {
        setError("This account doesn't have studio dashboard access. Sign out and use the studio owner account.");
      }
    })();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      setSignedIn(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Your sign-in couldn't be confirmed. Please try again.");
      const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (roleError) throw new Error("We couldn't verify studio access. Please try again.");
      if (!hasAdminAccess(isAdmin, user.email)) {
        setError("This account doesn't have studio dashboard access. Sign out and use an authorized owner account.");
        return;
      }
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(
        message.includes("already registered")
          ? "This email already has an account — use Sign In instead."
          : message.includes("confirm")
            ? message
            : message,
      );
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "w-full border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center">
            <img src={caMonogram} alt="Cardiatelier monogram" className="mx-auto h-14 w-14 object-contain" />
            <p className="eyebrow mt-4 text-gold-deep">Studio Access</p>
            <h1 className="mt-2 font-display text-3xl">Cardiatelier Dashboard</h1>
            <div className="gold-rule mx-auto mt-5 w-20" />
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs tracking-widest text-muted-foreground uppercase">Email</span>
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs tracking-widest text-muted-foreground uppercase">
                Password
              </span>
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </label>

            {error && (
              <div className="border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                <p>{error}</p>
                {signedIn && (
                  <button
                    type="button"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setSignedIn(false);
                      setError(null);
                    }}
                    className="mt-3 underline underline-offset-4"
                  >
                    Sign out to switch accounts
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-primary px-8 py-3.5 text-xs font-medium tracking-[0.25em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Please wait…" : "Sign In"}
            </button>
          </form>

          <p className="mt-10 text-center text-xs text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-gold-deep">
              ← Back to the store
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
