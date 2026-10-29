// Server-side publishable Supabase client used by the product-image route.
// It needs only the public URL and publishable key, so it works on any host
// (Lovable, Vercel, ...). Access to files is governed by the narrow
// storage.objects SELECT policy scoped to the product-images bucket.
// New Supabase keys are opaque strings, so the Authorization header is
// stripped and the key is sent as apikey (the same rule the generated
// clients follow).
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

function createPublishableClient() {
  const url =
    process.env['SUPABASE_URL'] ?? import.meta.env['VITE_SUPABASE_URL'];
  const key =
    process.env['SUPABASE_PUBLISHABLE_KEY'] ??
    import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables for product image serving');
  }
  return createClient<Database>(url, key, {
    global: {
      fetch: (input, init) => {
        const headers = new Headers(
          typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
        );
        if (init?.headers) {
          new Headers(init.headers).forEach((value, k) => headers.set(k, value));
        }
        headers.set('apikey', key);
        if (headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
        return fetch(input, { ...init, headers });
      },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

let _client: ReturnType<typeof createPublishableClient> | undefined;

export function getPublicStorageClient() {
  if (!_client) _client = createPublishableClient();
  return _client;
}
