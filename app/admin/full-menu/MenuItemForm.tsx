'use client';

import { menuService } from '@/app/services/menuService';
import {
  MenuCategory,
  MenuItem,
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
import { X } from 'lucide-react';
import { useState } from 'react';

interface MenuItemFormProps {
  item?: MenuItemWithRelations;
  availableSides: Side[];
  onClose: () => void;
  onSave: (updatedItem: MenuItemWithRelations) => void;
  categories: MenuCategory[];
}

interface MenuItemFormData {
  name: string;
  description: string;
  category: MenuCategory;
  price: string;
  sizes: Array<{ size_name: string; price: string }>;
  extras: Array<{ extra_name: string; price: string }>;
  selectedSides: string[];
}

export function MenuItemForm({
  item,
  availableSides,
  onClose,
  onSave,
  categories,
}: MenuItemFormProps) {
  const [formData, setFormData] = useState<MenuItemFormData>({
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
      if (!formData.name.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Name is required',
          variant: 'destructive',
        });
        return;
      }

      if (formData.price && isNaN(parseFloat(formData.price))) {
        toast({
          title: 'Validation Error',
          description: 'Price must be a valid number',
          variant: 'destructive',
        });
        return;
      }

      const menuItemData: Partial<MenuItem> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : null,
        is_special: false,
        image_url: item?.image_url || null,
      };

      let menuItem: MenuItem;
      const now = new Date().toISOString();

      if (item) {
        await menuService.updateMenuItem(item.id, menuItemData);
        menuItem = {
          ...item,
          ...menuItemData,
          created_at: item.created_at,
          updated_at: now,
        };

        await Promise.all([
          menuService.deleteSideOptions(item.id),
          menuService.deleteSizeOptions(item.id),
          menuService.deleteExtraOptions(item.id),
        ]);
      } else {
        menuItem = await menuService.createMenuItem({
          ...menuItemData,
          created_at: now,
          updated_at: now,
        });
      }

      if (formData.selectedSides.length > 0) {
        await menuService.addSideOptions(
          menuItem.id,
          formData.selectedSides.map((sideId) => ({
            side_id: sideId,
            is_default: true,
          }))
        );
      }

      if (formData.sizes.length > 0) {
        await menuService.addSizeOptions(
          menuItem.id,
          formData.sizes.map((size) => ({
            menu_item_id: menuItem.id,
            size_name: size.size_name,
            price: parseFloat(size.price),
            created_at: now,
          }))
        );
      }

      if (formData.extras.length > 0) {
        await menuService.addExtraOptions(
          menuItem.id,
          formData.extras.map((extra) => ({
            menu_item_id: menuItem.id,
            extra_name: extra.extra_name,
            price: parseFloat(extra.price),
            created_at: now,
          }))
        );
      }

      const transformedResult: MenuItemWithRelations = {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        category: menuItem.category,
        price: menuItem.price?.toString() || null,
        image_url: menuItem.image_url,
        is_special: menuItem.is_special,
        created_at: menuItem.created_at,
        updated_at: menuItem.updated_at,
        sides: formData.selectedSides
          .map((sideId) => availableSides.find((s) => s.id === sideId))
          .filter((side): side is Side => side !== undefined),
        sizes: formData.sizes.map((size) => ({
          size_name: size.size_name,
          price: size.price,
        })),
        extras: formData.extras.map((extra) => ({
          extra_name: extra.extra_name,
          price: extra.price,
        })),
        specials: [],
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
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="border-2 border-[#2C5530] bg-[#F5F5F5] shadow-lg">
      <CardHeader className="border-b border-[#2C5530]/10 sticky top-0 bg-[#F5F5F5] z-10">
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
        <form onSubmit={handleSubmit} className="space-y-6">
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
