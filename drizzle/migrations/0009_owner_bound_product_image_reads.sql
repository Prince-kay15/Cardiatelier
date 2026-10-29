-- The catalog's public photos are now shipped inside the app build, so no
-- guest-readable storage rule is needed. Reading bucket files is bound to
-- the uploader: only the owner of an object (the admin who uploaded it) can
-- download it. Uploads and deletes remain admin-only.
DROP POLICY IF EXISTS "Anyone can view product catalog images" ON storage.objects;
CREATE POLICY "Owners can view their uploaded product images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'product-images' AND owner_id = (select auth.uid()::text));