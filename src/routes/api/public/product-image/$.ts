import { createFileRoute } from "@tanstack/react-router";

// Serves product photos from the product-images bucket. The workspace blocks
// public buckets, so the storefront fetches images through this route on any
// host (Lovable, Vercel, ...). It reads with the publishable key, gated by a
// storage.objects SELECT policy scoped to the product-images bucket, and only
// reads from the "products/" folder — nothing else is exposed.
export const Route = createFileRoute("/api/public/product-image/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const objectPath = params._splat ?? "";
        if (!objectPath.startsWith("products/") || objectPath.includes("..")) {
          return new Response("Not found", { status: 404 });
        }
        // Try the publishable key first (works on any host where the narrow
        // owner-bound storage policy applies); on hosts with the admin key
        // available (Lovable), fall back so uploaded photos still display.
        try {
          const { getPublicStorageClient } = await import("@/lib/product-image.server");
          const { data, error } = await getPublicStorageClient()
            .storage.from("product-images")
            .download(objectPath);
          if (error || !data) return new Response("Not found", { status: 404 });
          return new Response(data, {
            headers: {
              "Content-Type": data.type || "image/jpeg",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch {
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { data, error } = await supabaseAdmin.storage
              .from("product-images")
              .download(objectPath);
            if (error || !data) return new Response("Not found", { status: 404 });
            return new Response(data, {
              headers: {
                "Content-Type": data.type || "image/jpeg",
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            });
          } catch {
            return new Response("Not found", { status: 404 });
          }
        }
      },
    },
  },
});
