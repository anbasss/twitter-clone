import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (
  image: string,
  bucket: 'avatars' | 'covers',
  userId: string
): Promise<string | null> => {
  try {
    // Convert base64 to file
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buf = Buffer.from(base64Data, 'base64');
    const fileExt = image.substring("data:image/".length, image.indexOf(";base64"));
    const fileName = `${userId}-${uuidv4()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buf, {
        contentType: `image/${fileExt}`,
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}
