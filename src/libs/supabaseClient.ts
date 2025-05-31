import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client untuk server-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client untuk client-side operations dengan NextAuth integration
export const supabaseClient = createClientComponentClient();

// Helper untuk generate secure URLs untuk file uploads
export const getPublicUrl = (bucket: string, filePath: string) => {
  return supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
};

// Helper untuk upload file ke Supabase Storage
export const uploadFile = async (
  bucket: string, 
  path: string, 
  file: File | Blob,
  options?: { contentType?: string; upsert?: boolean }
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: options?.contentType || 'image/jpeg',
        upsert: options?.upsert || true
      });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Upload error:', error);
    return { data: null, error };
  }
};
