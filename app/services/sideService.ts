import { Side } from '@/app/types/menu.types';
import { supabase } from '@/lib/supabase';

export const sideService = {
  async getSides(): Promise<Side[]> {
    const { data, error } = await supabase
      .from('sides')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('name');

    if (error) throw new Error(`Error fetching sides: ${error.message}`);
    return data || [];
  },

  async addSide(side: Omit<Side, 'id'>): Promise<string> {
    const { data, error } = await supabase
      .from('sides')
      .insert([side])
      .select()
      .single();

    if (error) throw new Error(`Error adding side: ${error.message}`);
    return data.id;
  },

  async updateSide(id: string, updates: Partial<Side>): Promise<void> {
    const { error } = await supabase.from('sides').update(updates).eq('id', id);

    if (error) throw new Error(`Error updating side: ${error.message}`);
  },

  async deleteSide(id: string): Promise<void> {
    const { error } = await supabase.from('sides').delete().eq('id', id);

    if (error) throw new Error(`Error deleting side: ${error.message}`);
  },
};
