import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  bank_name: string;
  account_number: string;
  account_name: string;
  whatsapp_number: string;
  owner_email: string;
  delivery_fee: number | null;
  delivery_note: string;
};

export const defaultSettings: SiteSettings = {
  bank_name: "",
  account_number: "",
  account_name: "",
  whatsapp_number: "2348160718606",
  owner_email: "",
  delivery_fee: null,
  delivery_note: "Delivery is available nationwide. We confirm your delivery fee once your order is received.",
};

export function settingsQuery() {
  return queryOptions({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("key, value");
      if (error) throw error;
      const merged: SiteSettings = { ...defaultSettings };
      for (const row of data ?? []) {
        if (row.key in merged) {
          // Settings are stored as JSON, so text fields can come back typed as
          // numbers (e.g. a phone number saved without quotes). Coerce each
          // field back to the type the app expects.
          (merged as unknown as Record<string, unknown>)[row.key] =
            row.key === "delivery_fee"
              ? row.value === null || row.value === ""
                ? null
                : Number(row.value)
              : String(row.value ?? "");
        }
      }
      return merged;
    },
  });
}

export async function saveSettings(values: Partial<SiteSettings>) {
  const rows = Object.entries(values).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from("settings").upsert(rows, { onConflict: "key" });
  if (error) throw error;
}
