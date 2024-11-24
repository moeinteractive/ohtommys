'use client';

import { CategorySide, MenuItemSide, Side } from '@/app/types/menu.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type SideRelation = MenuItemSide | CategorySide;

interface ItemSidesManagerProps {
  menuItemId?: string;
  category?: string;
  type: 'item' | 'category';
}

export default function ItemSidesManager({
  menuItemId,
  category,
  type,
}: ItemSidesManagerProps) {
  const [sides, setSides] = useState<Side[]>([]);
  const [menuItemSides, setMenuItemSides] = useState<SideRelation[]>([]);
  const [selectedSide, setSelectedSide] = useState<string>('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load all sides
        const { data: sidesData, error: sidesError } = await supabase
          .from('sides')
          .select('*')
          .order('category')
          .order('name');

        if (sidesError) throw sidesError;
        setSides(sidesData || []);

        // Load relation data based on type
        if (type === 'item' && menuItemId) {
          const { data: menuItemSidesData, error: menuItemSidesError } =
            await supabase
              .from('menu_item_sides')
              .select('*')
              .eq('menu_item_id', menuItemId);

          if (menuItemSidesError) throw menuItemSidesError;
          setMenuItemSides(menuItemSidesData || []);
        } else if (type === 'category' && category) {
          const { data: categorySidesData, error: categorySidesError } =
            await supabase
              .from('category_sides')
              .select('*')
              .eq('category', category);

          if (categorySidesError) throw categorySidesError;
          setMenuItemSides(categorySidesData || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Optionally add toast notification here
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [menuItemId, category, type]);

  const addSide = async () => {
    if (!selectedSide) return;

    if (type === 'item' && menuItemId) {
      const { data, error } = await supabase
        .from('menu_item_sides')
        .insert([
          {
            menu_item_id: menuItemId,
            side_id: selectedSide,
            is_default: isDefault,
          },
        ])
        .select();

      if (error) {
        console.error('Error adding side to menu item:', error);
        return;
      }

      if (data) {
        setMenuItemSides([...menuItemSides, data[0] as MenuItemSide]);
        setSelectedSide('');
        setIsDefault(false);
      }
    } else if (type === 'category' && category) {
      const { data, error } = await supabase
        .from('category_sides')
        .insert([
          {
            category: category,
            side_id: selectedSide,
          },
        ])
        .select();

      if (error) {
        console.error('Error adding side to category:', error);
        return;
      }

      if (data) {
        setMenuItemSides([...menuItemSides, data[0] as CategorySide]);
        setSelectedSide('');
      }
    }
  };

  const removeSide = async (sideId: string) => {
    if (type === 'item' && menuItemId) {
      const { error } = await supabase
        .from('menu_item_sides')
        .delete()
        .eq('menu_item_id', menuItemId)
        .eq('side_id', sideId);

      if (error) {
        console.error('Error removing side from menu item:', error);
        return;
      }
    } else if (type === 'category' && category) {
      const { error } = await supabase
        .from('category_sides')
        .delete()
        .eq('category', category)
        .eq('side_id', sideId);

      if (error) {
        console.error('Error removing side from category:', error);
        return;
      }
    }

    setMenuItemSides(menuItemSides.filter((s) => s.side_id !== sideId));
  };

  return (
    <Card>
      <CardHeader className="text-center border-b border-[#E4A853]/20 pb-4">
        <CardTitle className="font-playfair text-2xl font-bold text-[#E4A853] tracking-wide">
          Manage Sides {isLoading && '(Loading...)'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Add new side */}
          <div className="grid gap-4">
            <div>
              <Label>Add Side</Label>
              <Select value={selectedSide} onValueChange={setSelectedSide}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a side" />
                </SelectTrigger>
                <SelectContent>
                  {sides
                    .filter(
                      (side) =>
                        !menuItemSides.some((ms) => ms.side_id === side.id)
                    )
                    .map((side) => (
                      <SelectItem key={side.id} value={side.id}>
                        {side.name} ({side.category})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {type === 'item' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-default"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="is-default">Set as default side</Label>
              </div>
            )}
            <Button onClick={addSide} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Side
            </Button>
          </div>

          {/* List of current sides */}
          <div className="space-y-4">
            <h3 className="font-medium">Current Sides</h3>
            {menuItemSides.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No sides added yet
              </p>
            ) : (
              menuItemSides.map((menuItemSide) => {
                const side = sides.find((s) => s.id === menuItemSide.side_id);
                if (!side) return null;

                return (
                  <div
                    key={menuItemSide.id}
                    className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{side.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {side.category} •{' '}
                        {type === 'item' &&
                        'is_default' in menuItemSide &&
                        menuItemSide.is_default
                          ? 'Default Side'
                          : side.price
                            ? `+$${side.price.toFixed(2)}`
                            : 'Price not set'}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSide(side.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
