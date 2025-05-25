import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function uploadImage(
  base64Image: string,
  bucket: 'avatars' | 'covers',
  userId: string
): Promise<string | null> {
  try {
    const base64FileData = base64Image.split('base64,')[1];
    if (!base64FileData) {
      throw new Error('Invalid image format');
    }

    const fileName = `${userId}-${Date.now()}.jpg`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, Buffer.from(base64FileData, 'base64'), {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}
