'use client';

import {
  MenuCategory,
  MenuItemWithRelations,
  Side,
} from '@/app/types/menu.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteAlert } from '@/components/ui/delete-alert';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Edit2, Menu, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { MenuItemForm } from './MenuItemForm';

interface MenuClientProps {
  initialMenuItems: MenuItemWithRelations[];
  initialSides: Side[];
}

export function MenuClient({
  initialMenuItems,
  initialSides,
}: MenuClientProps) {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [selectedCategory, setSelectedCategory] =
    useState<MenuCategory>('Appetizers');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const categories: MenuCategory[] = [
    'Appetizers',
    'Homemade Soups & Salads',
    'Entrees',
    'Sandwiches, Wraps & Burgers',
    'Kids Corner',
    'Desserts',
  ];

  const handleDelete = async (itemId: string) => {
    try {
      // First check if item is used in any specials
      const { data: specialsData } = await supabase
        .from('menu_specials')
        .select('id')
        .eq('menu_item_id', itemId);

      if (specialsData && specialsData.length > 0) {
        toast({
          title: 'Cannot Delete',
          description:
            'This item is used in daily specials. Please remove it from specials first.',
          variant: 'destructive',
        });
        return;
      }

      // Delete related records one by one to ensure they're deleted
      // Delete menu_specials first
      const { error: specialsError } = await supabase
        .from('menu_specials')
        .delete()
        .eq('menu_item_id', itemId);

      if (specialsError) {
        console.error('Error deleting specials:', specialsError);
        throw specialsError;
      }

      // Delete sides relationships
      const { error: sidesError } = await supabase
        .from('menu_item_sides')
        .delete()
        .eq('menu_item_id', itemId);

      if (sidesError) {
        console.error('Error deleting sides:', sidesError);
        throw sidesError;
      }

      // Delete sizes
      const { error: sizesError } = await supabase
        .from('menu_sizes')
        .delete()
        .eq('menu_item_id', itemId);

      if (sizesError) {
        console.error('Error deleting sizes:', sizesError);
        throw sizesError;
      }

      // Delete extras
      const { error: extrasError } = await supabase
        .from('menu_extras')
        .delete()
        .eq('menu_item_id', itemId);

      if (extrasError) {
        console.error('Error deleting extras:', extrasError);
        throw extrasError;
      }

      // Finally delete the menu item itself
      const { error: menuItemError } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);

      if (menuItemError) {
        console.error('Error deleting menu item:', menuItemError);
        throw menuItemError;
      }

      // Update local state
      setMenuItems(menuItems.filter((item) => item.id !== itemId));

      toast({
        title: 'Success',
        description: 'Menu item and all its relationships deleted successfully',
      });
    } catch (error) {
      console.error('Error in delete operation:', error);
      toast({
        title: 'Error',
        description:
          'Failed to delete menu item or its relationships. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSave = (updatedItem: MenuItemWithRelations) => {
    if (editingItem) {
      setMenuItems(
        menuItems.map((item) => (item.id === editingItem ? updatedItem : item))
      );
    } else {
      setMenuItems([...menuItems, updatedItem]);
    }
  };

  const renderMenuItem = (item: MenuItemWithRelations) => (
    <div
      key={item.id}
      className="flex items-center gap-4 p-3 bg-white border-2 border-[#2C5530] rounded-lg shadow-md"
    >
      <div className="flex-1">
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {item.description}
              </p>
            )}
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-[#2C5530]">
              ${Number(item.price).toFixed(2)}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingItem(item.id)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteId(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sizes */}
        {item.sizes && item.sizes.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium text-[#2C5530]">Sizes:</p>
            <div className="flex flex-wrap gap-2">
              {item.sizes.map((size, index) => (
                <span
                  key={index}
                  className="text-sm text-muted-foreground bg-[#2C5530]/5 px-2 py-1 rounded"
                >
                  {size.size_name}: ${size.price}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Extras */}
        {item.extras && item.extras.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium text-[#2C5530]">Extras:</p>
            <div className="flex flex-wrap gap-2">
              {item.extras.map((extra, index) => (
                <span
                  key={index}
                  className="text-sm text-muted-foreground bg-[#2C5530]/5 px-2 py-1 rounded"
                >
                  {extra.extra_name}: ${extra.price}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sides */}
        {item.sides && item.sides.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium text-[#2C5530]">Sides:</p>
            <div className="flex flex-wrap gap-2">
              {item.sides.map((side) => (
                <span
                  key={side.id}
                  className="text-sm text-muted-foreground bg-[#2C5530]/5 px-2 py-1 rounded"
                >
                  {side.name}
                  {side.price && `: $${side.price}`}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Category Selection Card */}
      <Card className="border-2 border-[#2C5530] bg-[#F5F5F5] shadow-lg">
        <CardHeader className="border-b border-[#2C5530]/10">
          <CardTitle className="text-2xl font-serif text-[#2C5530] flex items-center gap-3">
            <Menu className="h-5 w-5" />
            Manage Menu Items
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? 'bg-[#2C5530] text-white hover:bg-[#2C5530]/90'
                    : 'border-[#2C5530] text-[#2C5530] hover:bg-[#2C5530]/5'
                }
              >
                {category}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => setShowNewItemForm(true)}
            className="w-full mt-4 bg-[#2C5530] text-white hover:bg-[#2C5530]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Menu Item
          </Button>
        </CardContent>
      </Card>

      {/* Menu Items by Category */}
      <Card className="border-2 border-[#2C5530] bg-[#F5F5F5] shadow-lg">
        <CardHeader className="border-b border-[#2C5530]/10">
          <CardTitle className="text-2xl font-serif text-[#2C5530]">
            {selectedCategory}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {menuItems
              .filter((item) => item.category === selectedCategory)
              .map(renderMenuItem)}
          </div>
        </CardContent>
      </Card>

      {/* Form Modal */}
      {(showNewItemForm || editingItem) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full">
            <MenuItemForm
              item={
                editingItem
                  ? menuItems.find((item) => item.id === editingItem)
                  : undefined
              }
              availableSides={initialSides}
              categories={categories}
              onClose={() => {
                setShowNewItemForm(false);
                setEditingItem(null);
              }}
              onSave={handleSave}
            />
          </div>
        </div>
      )}

      {/* Delete Alert */}
      <DeleteAlert
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        onConfirm={() => {
          if (deleteId) {
            handleDelete(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Menu Item"
        description="Are you sure you want to delete this menu item? This action cannot be undone."
      />
    </div>
  );
}
