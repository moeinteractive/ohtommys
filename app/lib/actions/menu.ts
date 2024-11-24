import { MenuItemFormData, Side } from '@/app/types/menu.types';
import { createClient } from '@/lib/supabase/client';

export async function createMenuItem(data: MenuItemFormData) {
  const supabase = createClient();

  // First, create the menu item
  const { data: menuItem, error: menuItemError } = await supabase
    .from('menu_items')
    .insert({
      name: data.name,
      description: data.description,
      price: data.price ? Number(data.price) : null,
      day: data.day,
      category: data.category,
      is_special: data.is_special,
    })
    .select()
    .single();

  if (menuItemError) throw menuItemError;

  // Then create sizes if any
  if (data.menu_sizes && data.menu_sizes.length > 0) {
    const { error: sizesError } = await supabase.from('menu_sizes').insert(
      data.menu_sizes.map((size) => ({
        menu_item_id: menuItem.id,
        size_name: size.size_name,
        price: Number(size.price),
      }))
    );

    if (sizesError) throw sizesError;
  }

  // Create extras if any
  if (data.menu_extras && data.menu_extras.length > 0) {
    const { error: extrasError } = await supabase.from('menu_extras').insert(
      data.menu_extras.map((extra) => ({
        menu_item_id: menuItem.id,
        extra_name: extra.extra_name,
        price: Number(extra.price),
      }))
    );

    if (extrasError) throw extrasError;
  }

  // Create side associations if any
  if (data.menu_item_sides && data.menu_item_sides.length > 0) {
    const { error: sidesError } = await supabase.from('menu_item_sides').insert(
      data.menu_item_sides.map((side) => ({
        menu_item_id: menuItem.id,
        side_id: side.side_id,
        is_default: side.is_default,
      }))
    );

    if (sidesError) throw sidesError;
  }

  return menuItem;
}

export async function updateMenuItem(id: string, data: MenuItemFormData) {
  const supabase = createClient();

  // Update the menu item
  const { error: menuItemError } = await supabase
    .from('menu_items')
    .update({
      name: data.name,
      description: data.description,
      price: data.price ? Number(data.price) : null,
      day: data.day,
      category: data.category,
      is_special: data.is_special,
    })
    .eq('id', id);

  if (menuItemError) throw menuItemError;

  // Delete existing sizes and create new ones
  await supabase.from('menu_sizes').delete().eq('menu_item_id', id);
  if (data.menu_sizes && data.menu_sizes.length > 0) {
    const { error: sizesError } = await supabase.from('menu_sizes').insert(
      data.menu_sizes.map((size) => ({
        menu_item_id: id,
        size_name: size.size_name,
        price: Number(size.price),
      }))
    );

    if (sizesError) throw sizesError;
  }

  // Delete existing extras and create new ones
  await supabase.from('menu_extras').delete().eq('menu_item_id', id);
  if (data.menu_extras && data.menu_extras.length > 0) {
    const { error: extrasError } = await supabase.from('menu_extras').insert(
      data.menu_extras.map((extra) => ({
        menu_item_id: id,
        extra_name: extra.extra_name,
        price: Number(extra.price),
      }))
    );

    if (extrasError) throw extrasError;
  }

  // Delete existing side associations and create new ones
  await supabase.from('menu_item_sides').delete().eq('menu_item_id', id);
  if (data.menu_item_sides && data.menu_item_sides.length > 0) {
    const { error: sidesError } = await supabase.from('menu_item_sides').insert(
      data.menu_item_sides.map((side) => ({
        menu_item_id: id,
        side_id: side.side_id,
        is_default: side.is_default,
      }))
    );

    if (sidesError) throw sidesError;
  }

  return { id };
}

export async function createSide(
  data: Omit<Side, 'id' | 'created_at' | 'updated_at'>
) {
  const supabase = createClient();

  const { data: side, error } = await supabase
    .from('sides')
    .insert({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      is_active: data.is_active,
    })
    .select()
    .single();

  if (error) throw error;
  return side;
}

export async function updateSide(
  id: string,
  data: Omit<Side, 'id' | 'created_at' | 'updated_at'>
) {
  const supabase = createClient();

  const { error } = await supabase
    .from('sides')
    .update({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      is_active: data.is_active,
    })
    .eq('id', id);

  if (error) throw error;
  return { id };
}
