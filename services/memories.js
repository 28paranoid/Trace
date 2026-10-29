import { supabase } from '@/lib/supabase';

export const memoriesService = {
  async getAll(userId, { limit = 20, offset = 0 } = {}) {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(memory) {
    const { data, error } = await supabase
      .from('memories')
      .insert(memory)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('memories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getByPlace(placeId) {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('place_id', placeId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};
