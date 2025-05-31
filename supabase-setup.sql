-- Supabase Setup Script
-- Jalankan di Supabase Dashboard > SQL Editor

-- 1. Buat Storage Buckets untuk upload gambar
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set Policies untuk Avatars Bucket
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'avatars');

-- 3. Set Policies untuk Covers Bucket
CREATE POLICY "Cover images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'covers');

CREATE POLICY "Anyone can upload a cover" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'covers');

CREATE POLICY "Users can update their own cover" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'covers');

CREATE POLICY "Users can delete their own cover" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'covers');

-- 4. Enable RLS (Row Level Security) untuk keamanan
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
