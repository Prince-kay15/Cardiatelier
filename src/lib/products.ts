import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  product_type: "ready_to_wear" | "made_to_order";
  category: string;
  sizes: string[];
  colors: string[];
  image_urls: string[];
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export function productsQuery(type?: "ready_to_wear" | "made_to_order" | null) {
  return queryOptions({
    queryKey: ["products", type ?? "all"],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (type) query = query.eq("product_type", type);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

export function featuredProductsQuery() {
  return queryOptions({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

export function productQuery(slug: string) {
  return queryOptions({
    queryKey: ["products", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Product | null;
    },
  });
}

// Admin variants — RLS grants admins access; inactive products included.
export function adminProductsQuery() {
  return queryOptions({
    queryKey: ["products", "admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

export type ProductInput = Omit<Product, "id" | "created_at" | "updated_at">;

export async function createProduct(input: ProductInput) {
  const { data, error } = await supabase.from("products").insert(input).select("id").single();
  if (error) throw error;
  return data.id as string;
}

export async function updateProduct(id: string, input: ProductInput) {
  const { error } = await supabase
    .from("products")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
