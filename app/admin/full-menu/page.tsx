import { AdminNav } from '@/app/components/admin/AdminNav';
import { MenuCategory, MenuItemWithRelations } from '@/app/types/menu.types';
import { SideCategory } from '@/app/types/side.types';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { Menu } from 'lucide-react';
import { Suspense } from 'react';
import { MenuClient } from './MenuClient';

type MenuItemResponse = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number | null;
  image_url: string | null;
  is_special: boolean;
  created_at: string;
  updated_at: string;
  menu_item_sides: Array<{
    id: string;
    is_default: boolean;
    side: {
      id: string;
      name: string;
      description: string | null;
      price: number | null;
      category: string;
      is_active: boolean;
    };
  }>;
  menu_sizes: Array<{
    id: string;
    size_name: string;
    price: number;
  }>;
  menu_extras: Array<{
    id: string;
    extra_name: string;
    price: number;
  }>;
};

async function getMenuItems() {
  console.log('Starting to fetch menu items...');
  try {
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select(
        `
        id,
        name,
        description,
        category,
        price,
        image_url,
        is_special,
        created_at,
        updated_at,
        menu_item_sides!menu_item_sides_menu_item_id_fkey (
          id,
          is_default,
          side:sides!menu_item_sides_side_id_fkey (
            id,
            name,
            description,
            price,
            category,
            is_active
          )
        ),
        menu_sizes (
          id,
          size_name,
          price
        ),
        menu_extras (
          id,
          extra_name,
          price
        )
      `
      )
      .order('category')
      .order('name');

    if (menuError) {
      console.error('Error fetching menu items:', menuError);
      return [];
    }

    if (!menuItems) {
      console.log('No menu items found');
      return [];
    }

    const typedMenuItems = menuItems as unknown as MenuItemResponse[];

    const transformedMenuItems = typedMenuItems.map(
      (item): MenuItemWithRelations => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category as MenuCategory,
        price: item.price?.toString() || null,
        image_url: item.image_url,
        is_special: item.is_special || false,
        sides: item.menu_item_sides.map((menuItemSide) => ({
          id: menuItemSide.side.id,
          name: menuItemSide.side.name,
          description: menuItemSide.side.description,
          price: menuItemSide.side.price,
          category: menuItemSide.side.category as SideCategory,
          is_active: menuItemSide.side.is_active,
        })),
        sizes: item.menu_sizes.map((size) => ({
          size_name: size.size_name,
          price: size.price.toString(),
        })),
        extras: item.menu_extras.map((extra) => ({
          extra_name: extra.extra_name,
          price: extra.price.toString(),
        })),
        specials: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    );

    return transformedMenuItems;
  } catch (error) {
    console.error('Detailed error in getMenuItems:', error);
    return [];
  }
}

async function getSides() {
  console.log('Starting to fetch sides...');
  try {
    const { data: sides, error } = await supabase
      .from('sides')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching sides:', error);
      return [];
    }

    console.log('Fetched sides:', sides);
    return sides || [];
  } catch (error) {
    console.error('Detailed error in getSides:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return [];
  }
}

export default async function FullMenuPage() {
  console.log('Rendering FullMenuPage...');

  try {
    const [menuItems, sides] = await Promise.all([getMenuItems(), getSides()]);

    console.log('Data fetched successfully:', {
      menuItemsCount: menuItems.length,
      sidesCount: sides.length,
    });

    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="container mx-auto py-12 px-4">
          <div className="text-center mb-8">
            <h1 className="text-6xl md:text-7xl font-serif font-bold text-[#2C5530] mb-3 tracking-tight drop-shadow-lg">
              Full Menu
            </h1>
            <p className="text-xl text-[#2C5530]/80 font-sans uppercase tracking-[0.2em] mb-4">
              Manage Pub Grub & Drink Selections
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-24 h-px bg-[#E4A853]"></div>
              <Menu className="h-8 w-8 text-[#E4A853]" aria-hidden="true" />
              <div className="w-24 h-px bg-[#E4A853]"></div>
            </div>
            <AdminNav />
          </div>

          <div className="max-w-4xl mx-auto">
            <Suspense fallback={<MenuSkeleton />}>
              <MenuClient initialMenuItems={menuItems} initialSides={sides} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in FullMenuPage:', error);
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }
}

function MenuSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
