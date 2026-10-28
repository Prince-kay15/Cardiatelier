-- Product images are public catalog content served through the
-- product-image server route with the publishable key. This policy lets the
-- route (and the storage API with the publishable key) read files from the
-- product-images bucket only; uploads and deletes stay admin-only.
CREATE POLICY "Anyone can view product catalog images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-images');