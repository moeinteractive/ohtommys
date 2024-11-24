import { supabase } from '@/lib/supabase';
import {
  ExtraOption,
  MenuItem,
  MenuItemSide,
  MenuItemWithRelations,
  NewMenuItem,
  Side,
  SizeOption,
} from '../types/menu.types';

export const menuService = {
  async getMenuItems(): Promise<MenuItemWithRelations[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select(
        `
        *,
        sizes:menu_sizes (*),
        extras:menu_extras (*),
        sides:menu_item_sides (
          *,
          side:sides (*)
        ),
        specials:menu_specials (
          id,
          day,
          special_price,
          special_description
        )
      `
      )
      .order('category')
      .order('name');

    if (error) throw new Error(`Error fetching menu items: ${error.message}`);

    return (
      data?.map((item) => ({
        ...item,
        sizes: item.sizes || [],
        extras: item.extras || [],
        sides:
          item.sides?.map((s: MenuItemSide & { side: Side }) => ({
            ...s,
            side: s.side,
            is_default: s.is_default || false,
          })) || [],
        specials: item.specials || [],
      })) || []
    );
  },

  async addMenuItem(newItem: NewMenuItem): Promise<string> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([newItem])
      .select()
      .single();

    if (error) throw new Error(`Error adding menu item: ${error.message}`);
    return data.id;
  },

  async addSizeOptions(menuItemId: string, sizes: SizeOption[]): Promise<void> {
    if (!sizes?.length) return;

    const { error } = await supabase.from('menu_sizes').insert(
      sizes.map((size) => ({
        menu_item_id: menuItemId,
        size_name: size.size_name,
        price: size.price,
      }))
    );

    if (error) throw new Error(`Error adding size options: ${error.message}`);
  },

  async addExtraOptions(
    menuItemId: string,
    extras: ExtraOption[]
  ): Promise<void> {
    if (!extras?.length) return;

    const { error } = await supabase.from('menu_extras').insert(
      extras.map((extra) => ({
        menu_item_id: menuItemId,
        extra_name: extra.extra_name,
        price: extra.price,
      }))
    );

    if (error) throw new Error(`Error adding extra options: ${error.message}`);
  },

  async addSideOptions(
    menuItemId: string,
    sides: { side_id: string; is_default: boolean }[]
  ): Promise<void> {
    if (!sides?.length) return;

    const { error } = await supabase.from('menu_item_sides').insert(
      sides.map((side) => ({
        menu_item_id: menuItemId,
        side_id: side.side_id,
        is_default: side.is_default,
      }))
    );

    if (error) throw new Error(`Error adding side options: ${error.message}`);
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id);

    if (error) throw new Error(`Error updating menu item: ${error.message}`);
  },

  async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase.from('menu_items').delete().eq('id', id);

    if (error) throw new Error(`Error deleting menu item: ${error.message}`);
  },

  async deleteSizeOptions(menuItemId: string): Promise<void> {
    const { error } = await supabase
      .from('menu_sizes')
      .delete()
      .eq('menu_item_id', menuItemId);

    if (error) throw new Error(`Error deleting size options: ${error.message}`);
  },

  async deleteExtraOptions(menuItemId: string): Promise<void> {
    const { error } = await supabase
      .from('menu_extras')
      .delete()
      .eq('menu_item_id', menuItemId);

    if (error)
      throw new Error(`Error deleting extra options: ${error.message}`);
  },

  async deleteSideOptions(menuItemId: string): Promise<void> {
    const { error } = await supabase
      .from('menu_item_sides')
      .delete()
      .eq('menu_item_id', menuItemId);

    if (error) throw new Error(`Error deleting side options: ${error.message}`);
  },

  async createMenuItem(data: Partial<MenuItem>): Promise<MenuItem> {
    const { data: result, error } = await supabase
      .from('menu_items')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Error creating menu item: ${error.message}`);
    return result;
  },
};
