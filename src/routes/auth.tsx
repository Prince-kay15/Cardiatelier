import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import caMonogram from "@/assets/ca-monogram-mark.png";
import { Link } from "@tanstack/react-router";

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
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (data.session) {
          navigate({ to: "/admin", replace: true });
        } else {
          setAwaitingConfirm(true);
        }
      }
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

          {awaitingConfirm ? (
            <div className="mt-10 border border-border bg-secondary/60 p-6 text-center">
              <h2 className="font-display text-xl">Confirm your email</h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                We sent a confirmation link to <span className="font-medium">{email}</span>. Open it on this
                device, then sign in below to reach your dashboard.
              </p>
              <button
                onClick={() => {
                  setAwaitingConfirm(false);
                  setMode("signin");
                }}
                className="mt-6 bg-primary px-8 py-3 text-xs font-medium tracking-[0.25em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                  }}
                  className={`px-5 py-2 text-xs tracking-[0.2em] uppercase transition-colors ${
                    mode === "signin" ? "border-b-2 border-gold text-gold-deep" : "text-muted-foreground"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                  className={`px-5 py-2 text-xs tracking-[0.2em] uppercase transition-colors ${
                    mode === "signup" ? "border-b-2 border-gold text-gold-deep" : "text-muted-foreground"
                  }`}
                >
                  First-Time Setup
                </button>
              </div>

              {mode === "signup" && (
                <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
                  Create the studio owner account. The first account set up here automatically becomes the
                  store admin.
                </p>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs tracking-widest text-muted-foreground uppercase">
                    Email
                  </span>
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
                    placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
                    minLength={6}
                    required
                  />
                </label>

                {error && (
                  <p className="border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-primary px-8 py-3.5 text-xs font-medium tracking-[0.25em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Owner Account"}
                </button>
              </form>
            </>
          )}

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
