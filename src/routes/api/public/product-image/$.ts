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
        // owner-bound storage policy applies); if that is denied — which the
        // client reports as an error result rather than a thrown error — fall
        // back to the admin client where it is available (Lovable hosts).
        let body: Blob | undefined;
        let contentType = "image/jpeg";
        const notFound = () => new Response("Not found", { status: 404 });
        try {
          const { getPublicStorageClient } = await import("@/lib/product-image.server");
          const { data, error } = await getPublicStorageClient()
            .storage.from("product-images")
            .download(objectPath);
          if (!error && data) {
            body = data;
            contentType = data.type || contentType;
          }
        } catch {
          // publishable read unavailable on this host — try the admin client
        }
        if (!body) {
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { data, error } = await supabaseAdmin.storage
              .from("product-images")
              .download(objectPath);
            if (error || !data) return notFound();
            body = data;
            contentType = data.type || contentType;
          } catch {
            return notFound();
          }
        }
        return new Response(body, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
