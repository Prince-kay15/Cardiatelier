import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminProductsQuery,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
  type ProductInput,
} from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { formatNaira, slugify } from "@/lib/format";

type FormState = {
  id: string | null;
  name: string;
  slug: string;
  description: string;
  price: string;
  product_type: "ready_to_wear" | "made_to_order";
  category: string;
  sizes: string;
  colors: string;
  image_urls: string[];
  is_active: boolean;
  is_featured: boolean;
};

const emptyForm: FormState = {
  id: null,
  name: "",
  slug: "",
  description: "",
  price: "",
  product_type: "ready_to_wear",
  category: "general",
  sizes: "",
  colors: "",
  image_urls: [],
  is_active: true,
  is_featured: false,
};

function toForm(product: Product): FormState {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    price: String(product.price),
    product_type: product.product_type,
    category: product.category,
    sizes: product.sizes.join(", "),
    colors: product.colors.join(", "),
    image_urls: [...product.image_urls],
    is_active: product.is_active,
    is_featured: product.is_featured,
  };
}

const inputClass =
  "w-full border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold";
const labelClass = "mb-1.5 block text-xs tracking-widest text-muted-foreground uppercase";

export function ProductsPanel() {
  const { data: products, isPending } = useQuery(adminProductsQuery());
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    for (const file of Array.from(files)) {
      const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, {
        contentType: file.type || "image/jpeg",
      });
      if (error) {
        setError(`Image upload failed: ${error.message}`);
      } else {
        setForm((f) => ({ ...f, image_urls: [...f.image_urls, `/api/public/product-image/${path}`] }));
      }
    }
    setUploading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const price = parseInt(form.price.replace(/[^0-9]/g, ""), 10);
    if (!form.name.trim() || Number.isNaN(price) || price <= 0) {
      setError("A name and a valid price are required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const input: ProductInput = {
        name: form.name.trim(),
        slug: slugify(form.slug.trim() || form.name),
        description: form.description.trim() || null,
        price,
        product_type: form.product_type,
        category: form.category.trim() || "general",
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
        image_urls: form.image_urls,
        is_active: form.is_active,
        is_featured: form.is_featured,
      };
      if (form.id) {
        await updateProduct(form.id, input);
      } else {
        await createProduct(input);
      }
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setForm(emptyForm);
      setMessage(form.id ? "Piece updated." : "Piece added to the collection.");
      window.setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this piece. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Remove "${product.name}" from the collection permanently?`)) return;
    await deleteProduct(product.id);
    await queryClient.invalidateQueries({ queryKey: ["products"] });
    if (form.id === product.id) setForm(emptyForm);
  }

  const editing = form.id !== null;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Form */}
      <form onSubmit={handleSave} className="space-y-4 lg:col-span-2">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-foreground/70">{editing ? "Edit Piece" : "Add a New Piece"}</p>
          {editing && (
            <button
              type="button"
              onClick={() => setForm(emptyForm)}
              className="text-xs tracking-widest text-muted-foreground uppercase transition-colors hover:text-gold-deep"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <label className="block">
          <span className={labelClass}>Name *</span>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="e.g. Amara Silk Gown"
            required
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>Price (₦) *</span>
            <input
              className={inputClass}
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              placeholder="45000"
              inputMode="numeric"
              required
            />
          </label>
          <label className="block">
            <span className={labelClass}>Collection</span>
            <select
              className={inputClass}
              value={form.product_type}
              onChange={(e) => setField("product_type", e.target.value as FormState["product_type"])}
            >
              <option value="ready_to_wear">Ready to Wear</option>
              <option value="made_to_order">Made to Order</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className={labelClass}>Description</span>
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Fabric, fit, styling notes…"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>Sizes (comma separated)</span>
            <input
              className={inputClass}
              value={form.sizes}
              onChange={(e) => setField("sizes", e.target.value)}
              placeholder="S, M, L, XL"
            />
          </label>
          <label className="block">
            <span className={labelClass}>Colours (comma separated)</span>
            <input
              className={inputClass}
              value={form.colors}
              onChange={(e) => setField("colors", e.target.value)}
              placeholder="Gold, Black"
            />
          </label>
        </div>

        <label className="block">
          <span className={labelClass}>Category</span>
          <input
            className={inputClass}
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            placeholder="e.g. gowns"
          />
        </label>

        <div>
          <span className={labelClass}>Photos</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            className="block w-full text-xs text-muted-foreground file:mr-3 file:border file:border-border file:bg-background file:px-3 file:py-2 file:text-xs file:tracking-widest file:uppercase"
          />
          {uploading && <p className="mt-2 text-xs text-muted-foreground">Uploading…</p>}
          <div className="mt-2 flex gap-2">
            <input
              className={inputClass}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="…or paste an image link"
            />
            <button
              type="button"
              onClick={() => {
                if (urlInput.trim()) {
                  setForm((f) => ({ ...f, image_urls: [...f.image_urls, urlInput.trim()] }));
                  setUrlInput("");
                }
              }}
              className="shrink-0 border border-border px-3 text-xs tracking-widest uppercase transition-colors hover:border-gold"
            >
              Add
            </button>
          </div>
          {form.image_urls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.image_urls.map((url, i) => (
                <div key={`${url}-${i}`} className="group relative h-16 w-14 overflow-hidden rounded-sm border border-border">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, image_urls: f.image_urls.filter((_, j) => j !== i) }))
                    }
                    aria-label="Remove photo"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setField("is_active", e.target.checked)}
            />
            Visible in shop
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setField("is_featured", e.target.checked)}
            />
            Featured on home page
          </label>
        </div>

        {message && <p className="text-xs text-gold-deep">{message}</p>}
        {error && (
          <p className="border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy || uploading}
          className="w-full bg-primary px-8 py-3.5 text-xs font-medium tracking-[0.25em] text-primary-foreground uppercase transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Saving…" : editing ? "Save Changes" : "Add to Collection"}
        </button>
      </form>

      {/* List */}
      <div className="lg:col-span-3">
        <p className="eyebrow text-foreground/70">Collection ({products?.length ?? 0})</p>
        {isPending ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Loading pieces…</p>
        ) : !products?.length ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No pieces yet — add your first one on the left.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 border border-border bg-secondary/40 p-3"
              >
                <div className="h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-secondary">
                  {product.image_urls[0] ? (
                    <img src={product.image_urls[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-lg text-gold/40">
                      CA
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg">{product.name}</p>
                  <p className="text-xs tracking-widest text-muted-foreground uppercase">
                    {formatNaira(product.price)} ·{" "}
                    {product.product_type === "made_to_order" ? "Made to Order" : "Ready to Wear"}
                    {!product.is_active && " · Hidden"}
                    {product.is_featured && " · Featured"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => {
                      setForm(toForm(product));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="border border-border px-3 py-1.5 text-xs tracking-widest uppercase transition-colors hover:border-gold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="border border-border px-3 py-1.5 text-xs tracking-widest uppercase transition-colors hover:border-destructive hover:text-destructive"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
