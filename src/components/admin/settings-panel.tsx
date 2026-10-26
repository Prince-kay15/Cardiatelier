import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsQuery, saveSettings, defaultSettings } from "@/lib/settings";

const inputClass =
  "w-full border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold";
const labelClass = "mb-1.5 block text-xs tracking-widest text-muted-foreground uppercase";

export function SettingsPanel() {
  const { data: settings } = useQuery(settingsQuery());
  const queryClient = useQueryClient();
  const [form, setForm] = useState(defaultSettings);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) setForm({ ...defaultSettings, ...settings });
  }, [settings]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const feeRaw = form.delivery_fee;
      await saveSettings({
        bank_name: form.bank_name.trim(),
        account_number: form.account_number.trim(),
        account_name: form.account_name.trim(),
        whatsapp_number: form.whatsapp_number.trim(),
        delivery_fee: feeRaw === null ? null : Number(feeRaw) || 0,
        delivery_note: form.delivery_note.trim(),
      });
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      setMessage("Settings saved.");
      window.setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="max-w-xl space-y-5">
      <div>
        <p className="eyebrow text-foreground/70">Bank Transfer Details</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Shown to customers at checkout after they place an order.
        </p>
        <div className="mt-3 space-y-4">
          <label className="block">
            <span className={labelClass}>Bank Name</span>
            <input
              className={inputClass}
              value={form.bank_name}
              onChange={(e) => setForm((f) => ({ ...f, bank_name: e.target.value }))}
              placeholder="e.g. Guaranty Trust Bank"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Account Number</span>
            <input
              className={inputClass}
              value={form.account_number}
              onChange={(e) => setForm((f) => ({ ...f, account_number: e.target.value }))}
              placeholder="e.g. 0123456789"
              inputMode="numeric"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Account Name</span>
            <input
              className={inputClass}
              value={form.account_name}
              onChange={(e) => setForm((f) => ({ ...f, account_name: e.target.value }))}
              placeholder="e.g. Cardiatelier Studio"
            />
          </label>
        </div>
      </div>

      <div>
        <p className="eyebrow text-foreground/70">WhatsApp Business Number</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Used for the chat buttons around the store (include country code).
        </p>
        <input
          className={`${inputClass} mt-3`}
          value={form.whatsapp_number}
          onChange={(e) => setForm((f) => ({ ...f, whatsapp_number: e.target.value }))}
          placeholder="e.g. 2348012345678"
          inputMode="tel"
        />
      </div>

      <div>
        <p className="eyebrow text-foreground/70">Delivery</p>
        <div className="mt-3 space-y-4">
          <label className="block">
            <span className={labelClass}>Standard Delivery Fee (₦) — leave blank to confirm per order</span>
            <input
              className={inputClass}
              value={form.delivery_fee ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  delivery_fee: e.target.value === "" ? null : parseInt(e.target.value.replace(/[^0-9]/g, ""), 10),
                }))
              }
              placeholder="e.g. 3500"
              inputMode="numeric"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Delivery Note</span>
            <textarea
              className={`${inputClass} min-h-20 resize-y`}
              value={form.delivery_note}
              onChange={(e) => setForm((f) => ({ ...f, delivery_note: e.target.value }))}
            />
          </label>
        </div>
      </div>

      {message && <p className="text-xs text-gold-deep">{message}</p>}
      {error && (
        <p className="border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">{error}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="bg-primary px-8 py-3.5 text-xs font-medium tracking-[0.25em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
