'use client';

import {
  MenuCategory,
  MenuItemWithRelations,
  Side,
} from '@/app/types/menu.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { X } from 'lucide-react';
import { useState } from 'react';

interface MenuItemFormProps {
  item?: MenuItemWithRelations;
  availableSides: Side[];
  onClose: () => void;
  onSave: (updatedItem: MenuItemWithRelations) => void;
  categories: MenuCategory[];
}

export function MenuItemForm({
  item,
  availableSides,
  onClose,
  onSave,
  categories,
}: MenuItemFormProps) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    category: item?.category || categories[0],
    price: item?.price?.toString() || '',
    sizes: item?.sizes || [],
    extras: item?.extras || [],
    selectedSides: item?.sides.map((side) => side.id) || [],
  });

  const [newSize, setNewSize] = useState({ size_name: '', price: '' });
  const [newExtra, setNewExtra] = useState({ extra_name: '', price: '' });

  const handleAddSize = () => {
    if (newSize.size_name && newSize.price) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, { ...newSize }],
      });
      setNewSize({ size_name: '', price: '' });
    }
  };

  const handleAddExtra = () => {
    if (newExtra.extra_name && newExtra.price) {
      setFormData({
        ...formData,
        extras: [...formData.extras, { ...newExtra }],
      });
      setNewExtra({ extra_name: '', price: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const menuItemData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: formData.price ? parseFloat(formData.price.toString()) : null,
        is_special: false,
      };

      let result;
      if (item) {
        // Update existing item
        const { data, error } = await supabase
          .from('menu_items')
          .update(menuItemData)
          .eq('id', item.id)
          .select()
          .single();

        if (error) throw error;
        result = data;

        // Always delete existing relationships first
        await Promise.all([
          // Delete all existing sides relationships
          supabase.from('menu_item_sides').delete().eq('menu_item_id', item.id),
          // Delete all existing sizes
          supabase.from('menu_sizes').delete().eq('menu_item_id', item.id),
          // Delete all existing extras
          supabase.from('menu_extras').delete().eq('menu_item_id', item.id),
        ]);
      } else {
        // Create new item
        const { data, error } = await supabase
          .from('menu_items')
          .insert(menuItemData)
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      // Only create new relationships if there are any to create
      const promises = [];

      // Handle sides relationships
      if (formData.selectedSides.length > 0) {
        const sideRelations = formData.selectedSides.map((sideId) => ({
          menu_item_id: result.id,
          side_id: sideId,
          is_default: true,
        }));

        promises.push(supabase.from('menu_item_sides').insert(sideRelations));
      }

      // Handle sizes
      if (formData.sizes.length > 0) {
        const sizeRecords = formData.sizes.map((size) => ({
          menu_item_id: result.id,
          size_name: size.size_name,
          price: parseFloat(size.price),
        }));

        promises.push(supabase.from('menu_sizes').insert(sizeRecords));
      }

      // Handle extras
      if (formData.extras.length > 0) {
        const extraRecords = formData.extras.map((extra) => ({
          menu_item_id: result.id,
          extra_name: extra.extra_name,
          price: parseFloat(extra.price),
        }));

        promises.push(supabase.from('menu_extras').insert(extraRecords));
      }

      // Wait for all relationship creations to complete
      if (promises.length > 0) {
        const results = await Promise.all(promises);
        // Check for errors in results
        results.forEach((res) => {
          if (res.error) throw res.error;
        });
      }

      // Transform the result to match MenuItemWithRelations
      const transformedResult: MenuItemWithRelations = {
        id: result.id,
        name: result.name,
        description: result.description,
        category: result.category as MenuCategory,
        price: result.price?.toString() || null,
        image_url: result.image_url,
        is_special: result.is_special || false,
        sides: formData.selectedSides
          .map((sideId) => availableSides.find((side) => side.id === sideId))
          .filter((side): side is Side => side !== undefined),
        sizes: formData.sizes.map((size) => ({
          size_name: size.size_name,
          price: size.price.toString(),
        })),
        extras: formData.extras.map((extra) => ({
          extra_name: extra.extra_name,
          price: extra.price.toString(),
        })),
        specials: [],
        created_at: result.created_at || new Date().toISOString(),
        updated_at: result.updated_at || new Date().toISOString(),
      };

      toast({
        title: 'Success',
        description: `Menu item ${item ? 'updated' : 'created'} successfully`,
      });

      onSave(transformedResult);
      onClose();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({
        title: 'Error',
        description: `Failed to ${item ? 'update' : 'create'} menu item`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="border-2 border-[#2C5530] bg-[#F5F5F5] shadow-lg">
      <CardHeader className="border-b border-[#2C5530]/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-serif text-[#2C5530]">
            {item ? 'Edit Menu Item' : 'New Menu Item'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-[#2C5530]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border-[#2C5530]"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="border-[#2C5530]"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value: MenuCategory) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="border-[#2C5530]">
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

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="border-[#2C5530]"
            />
          </div>

          {/* Sizes Section */}
          <div className="space-y-2">
            <Label>Sizes</Label>
            <div className="space-y-2">
              {formData.sizes.map((size, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={size.size_name} disabled className="flex-1" />
                  <Input value={size.price} disabled className="w-24" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        sizes: formData.sizes.filter((_, i) => i !== index),
                      });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Size name"
                  value={newSize.size_name}
                  onChange={(e) =>
                    setNewSize({ ...newSize, size_name: e.target.value })
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={newSize.price}
                  onChange={(e) =>
                    setNewSize({ ...newSize, price: e.target.value })
                  }
                  className="w-24"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSize();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSize}
                  className="text-[#2C5530] border-[#2C5530] hover:bg-[#2C5530]/10"
                  disabled={!newSize.size_name || !newSize.price}
                >
                  Add Size
                </Button>
              </div>
            </div>
          </div>

          {/* Extras Section */}
          <div className="space-y-2">
            <Label>Extras</Label>
            <div className="space-y-2">
              {formData.extras.map((extra, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={extra.extra_name} disabled className="flex-1" />
                  <Input value={extra.price} disabled className="w-24" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        extras: formData.extras.filter((_, i) => i !== index),
                      });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Extra name"
                  value={newExtra.extra_name}
                  onChange={(e) =>
                    setNewExtra({ ...newExtra, extra_name: e.target.value })
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={newExtra.price}
                  onChange={(e) =>
                    setNewExtra({ ...newExtra, price: e.target.value })
                  }
                  className="w-24"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddExtra();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddExtra}
                  className="text-[#2C5530] border-[#2C5530] hover:bg-[#2C5530]/10"
                  disabled={!newExtra.extra_name || !newExtra.price}
                >
                  Add Extra
                </Button>
              </div>
            </div>
          </div>

          {/* Sides Section */}
          <div className="space-y-2">
            <Label>Available Sides</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableSides.map((side) => (
                <div key={side.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={side.id}
                    checked={formData.selectedSides.includes(side.id)}
                    onCheckedChange={(checked) => {
                      setFormData({
                        ...formData,
                        selectedSides: checked
                          ? [...formData.selectedSides, side.id]
                          : formData.selectedSides.filter(
                              (id) => id !== side.id
                            ),
                      });
                    }}
                  />
                  <Label htmlFor={side.id} className="text-sm">
                    {side.name}
                    {side.price && ` (+$${side.price})`}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#2C5530] text-[#2C5530]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#2C5530] text-white hover:bg-[#2C5530]/90"
            >
              {item ? 'Update' : 'Create'} Menu Item
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
