import { createFileRoute } from "@tanstack/react-router";

// Serves product photos from the private product-images bucket. The workspace
// blocks public buckets, so the storefront fetches images through this route.
// Only reads from the "products/" folder — nothing else is exposed.
export const Route = createFileRoute("/api/public/product-image/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const objectPath = params._splat ?? "";
        if (!objectPath.startsWith("products/") || objectPath.includes("..")) {
          return new Response("Not found", { status: 404 });
        }
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.storage
            .from("product-images")
            .download(objectPath);
          if (error || !data) return new Response("Not found", { status: 404 });
          const contentType = data.type || "image/jpeg";
          return new Response(data, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});
