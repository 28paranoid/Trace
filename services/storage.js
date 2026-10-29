import { supabase } from '@/lib/supabase';
import { config } from '@/constants/config';

export const storageService = {
  async uploadImage(filePath, fileName) {
    const { data, error } = await supabase.storage
      .from(config.storageBucket)
      .upload(fileName, {
        uri: filePath,
        type: 'image/jpeg',
        name: fileName,
      });
    if (error) throw error;
    return data;
  },

  getPublicUrl(path) {
    const { data } = supabase.storage
      .from(config.storageBucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  async deleteImage(path) {
    const { error } = await supabase.storage
      .from(config.storageBucket)
      .remove([path]);
    if (error) throw error;
  },
};
