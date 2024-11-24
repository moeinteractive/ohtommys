import {
  ApiResponse,
  MenuItem,
  MenuItemFormData,
} from '@/app/types/menu.types';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: menuItems, error } = await supabase
      .from('menu_items')
      .select(
        `
        *,
        sizes (*),
        extras (*),
        sides (
          *,
          side:sides (*)
        ),
        specials (
          id,
          day,
          special_price,
          special_description
        )
      `
      )
      .order('category')
      .order('name');

    if (error) throw error;

    const response: ApiResponse<MenuItem[]> = {
      data: menuItems,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body: MenuItemFormData = await request.json();

    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        day: body.day,
        is_special: body.is_special,
      })
      .select()
      .single();

    if (error) throw error;

    const response: ApiResponse<MenuItem> = {
      data: data,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
