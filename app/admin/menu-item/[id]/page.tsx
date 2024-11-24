'use client';

import { MenuCategory, MenuItem } from '@/app/types/menu.types';
import ItemSidesManager from '@/components/menu/item-sides-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface ExtendedMenuItem extends MenuItem {
  is_active: boolean;
}

export default function MenuItemPage({
  params,
}: {
  params: { id: string };
} & { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const router = useRouter();
  const [menuItem, setMenuItem] = useState<ExtendedMenuItem | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);

  const loadData = useCallback(async () => {
    // Load menu item
    const { data: menuItemData, error: menuItemError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', params.id)
      .single();

    if (menuItemError) {
      console.error('Error loading menu item:', menuItemError);
      return;
    }

    if (menuItemData) setMenuItem(menuItemData);

    // Load categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('menu_items')
      .select('category')
      .not('category', 'is', null)
      .order('category');

    if (categoriesError) {
      console.error('Error loading categories:', categoriesError);
      return;
    }

    if (categoriesData) {
      const uniqueCategories = Array.from(
        new Set(categoriesData.map((item) => item.category))
      );
      setCategories(uniqueCategories);
    }
  }, [params.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateMenuItem = async () => {
    if (!menuItem) return;

    const { error } = await supabase
      .from('menu_items')
      .update(menuItem)
      .eq('id', params.id);

    if (error) {
      console.error('Error updating menu item:', error);
      return;
    }

    router.push('/admin/full-menu');
  };

  const handleCategoryChange = (value: string) => {
    if (menuItem) {
      setMenuItem({
        ...menuItem,
        category: value as MenuCategory,
      });
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (menuItem) {
      setMenuItem({
        ...menuItem,
        price: e.target.value ? parseFloat(e.target.value) : null,
      });
    }
  };

  if (!menuItem) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <nav className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/full-menu')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>
          <Button onClick={updateMenuItem}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </nav>

        <Card>
          <CardHeader className="text-center border-b border-[#E4A853]/20 pb-4">
            <CardTitle className="font-playfair text-4xl font-bold text-[#E4A853] tracking-wide">
              Edit Menu Item
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={menuItem.name}
                    onChange={(e) =>
                      setMenuItem({ ...menuItem, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={menuItem.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={menuItem.description || ''}
                  onChange={(e) =>
                    setMenuItem({ ...menuItem, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={menuItem.price?.toString() || ''}
                  onChange={handlePriceChange}
                  className="border-[#2C5530]"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-active"
                  checked={menuItem.is_active}
                  onChange={(e) =>
                    setMenuItem({ ...menuItem, is_active: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="is-active">Item is active</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <ItemSidesManager menuItemId={params.id} type="item" />
      </div>
    </div>
  );
}
