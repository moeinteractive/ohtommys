'use client';

import {
  DAYS_OF_WEEK,
  DayOfWeek,
  MENU_CATEGORIES,
  MenuCategory,
  MenuItem,
  MenuItemFormData,
} from '@/app/types/menu.types';
import { Side } from '@/app/types/side.types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  price: z.string().optional(),
  category: z.nativeEnum(MENU_CATEGORIES),
  is_special: z.boolean().optional().default(false),
  day: z.nativeEnum(DAYS_OF_WEEK).optional().nullable(),
  menu_item_sides: z
    .array(
      z.object({
        side_id: z.string(),
        is_default: z.boolean(),
      })
    )
    .optional(),
  menu_sizes: z
    .array(
      z.object({
        size_name: z.string(),
        price: z.string(),
      })
    )
    .optional(),
  menu_extras: z
    .array(
      z.object({
        extra_name: z.string(),
        price: z.string(),
      })
    )
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MenuItemFormProps {
  item?: MenuItem;
  sides: Side[];
  onSuccessAction: (data: MenuItemFormData) => Promise<void>;
  onCancelAction: VoidFunction;
  defaultCategory?: MenuCategory;
}

export default function MenuItemForm({
  item,
  sides,
  onSuccessAction,
  onCancelAction,
  defaultCategory,
}: MenuItemFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || '',
      description: item?.description || '',
      price: item?.price ? String(item?.price) : '',
      category: item?.category || defaultCategory || undefined,
      is_special: item?.is_special || false,
      day: item?.day || undefined,
      menu_item_sides:
        item?.menu_item_sides?.map((side) => ({
          side_id: side.side_id,
          is_default: side.is_default ?? false,
        })) || [],
      menu_sizes:
        item?.menu_sizes?.map((size) => ({
          size_name: size.size_name,
          price: String(size.price),
        })) || [],
      menu_extras:
        item?.menu_extras?.map((extra) => ({
          extra_name: extra.extra_name,
          price: String(extra.price),
        })) || [],
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = form;

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: 'menu_sizes',
  });

  const {
    fields: extraFields,
    append: appendExtra,
    remove: removeExtra,
  } = useFieldArray({
    control,
    name: 'menu_extras',
  });

  const selectedCategory = watch('category');

  // Filter sides based on category compatibility
  const availableSides = useMemo(() => {
    return sides.filter(
      (side) =>
        side.is_active &&
        (side.category === 'Default' ||
          (selectedCategory === MENU_CATEGORIES.ENTREES &&
            side.category === 'Premium') ||
          (selectedCategory === 'Sandwiches, Wraps & Burgers' &&
            side.category === 'Special'))
    );
  }, [sides, selectedCategory]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const transformedData: MenuItemFormData = {
        name: data.name,
        description: data.description || null,
        price: data.price || null,
        category: data.category,
        is_special: data.is_special || false,
        day: data.day as DayOfWeek | null,
        menu_item_sides: data.menu_item_sides?.map((side) => ({
          side_id: side.side_id,
          is_default: side.is_default ?? false,
        })),
        menu_sizes: data.menu_sizes?.map((size) => ({
          size_name: size.size_name,
          price: size.price,
        })),
        menu_extras: data.menu_extras?.map((extra) => ({
          extra_name: extra.extra_name,
          price: extra.price,
        })),
      };

      await onSuccessAction(transformedData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSideDefaultChange = (sideId: string, isDefault: boolean) => {
    const currentSides = getValues('menu_item_sides') || [];
    const updatedSides = currentSides.map((side) =>
      side.side_id === sideId ? { ...side, is_default: isDefault } : side
    );
    setValue('menu_item_sides', updatedSides);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Input */}
        <div className="col-span-2">
          <Label htmlFor="name" className="text-[#2A4E45] font-medium">
            Name
          </Label>
          <Input
            id="name"
            {...register('name')}
            className="mt-1 bg-white text-[#2A4E45] border-[#2A4E45]/20 focus:border-[#2A4E45] focus:ring-[#2A4E45]"
            placeholder="Enter item name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-[#D64C37]">{errors.name.message}</p>
          )}
        </div>

        {/* Description Input */}
        <div className="col-span-2">
          <Label htmlFor="description" className="text-[#2A4E45] font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            {...register('description')}
            className="mt-1 bg-white text-[#2A4E45] border-[#2A4E45]/20 focus:border-[#2A4E45] focus:ring-[#2A4E45]"
            placeholder="Enter item description"
          />
        </div>

        {/* Price Input */}
        <div>
          <Label htmlFor="price" className="text-[#2A4E45] font-medium">
            Base Price
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price')}
            className="mt-1 bg-white text-[#2A4E45] border-[#2A4E45]/20 focus:border-[#2A4E45] focus:ring-[#2A4E45]"
            placeholder="0.00"
          />
        </div>

        {/* Category Select */}
        <div>
          <Label htmlFor="category" className="text-[#2A4E45] font-medium">
            Category
          </Label>
          <Controller
            name="category"
            control={control}
            defaultValue={
              defaultCategory || (item?.category as MenuCategory) || undefined
            }
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1 bg-white text-[#2A4E45] border-[#2A4E45]/20">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MENU_CATEGORIES).map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-[#2A4E45]"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Is Special Switch */}
        <div className="flex items-center space-x-2">
          <Switch id="is_special" {...register('is_special')} />
          <Label htmlFor="is_special" className="text-[#2A4E45] font-medium">
            Special Item
          </Label>
        </div>

        {watch('is_special') && (
          <div>
            <Label htmlFor="day" className="text-[#2A4E45] font-medium">
              Special Day
            </Label>
            <Controller
              name="day"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="mt-1 bg-white text-[#2A4E45] border-[#2A4E45]/20">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.values(DAYS_OF_WEEK) as DayOfWeek[]).map((day) => (
                      <SelectItem
                        key={day}
                        value={day}
                        className="text-[#2A4E45]"
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}
      </div>

      {/* Size Options */}
      <div className="space-y-4">
        <Label className="text-[#2A4E45] font-medium">Size Options</Label>
        {sizeFields.map((field, index) => (
          <Card key={field.id} className="p-4 border-[#2A4E45]/20 bg-white">
            <div className="space-y-4">
              <div>
                <Label className="text-[#2A4E45]">Size Name</Label>
                <Input
                  {...register(`menu_sizes.${index}.size_name`)}
                  placeholder="Size name"
                  className="bg-white text-[#2A4E45] border-[#2A4E45]/20"
                />
              </div>
              <div>
                <Label className="text-[#2A4E45]">Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register(`menu_sizes.${index}.price`)}
                  placeholder="Price"
                  className="bg-white text-[#2A4E45] border-[#2A4E45]/20"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => removeSize(index)}
                className="border-[#D64C37] text-[#D64C37] hover:bg-[#D64C37]/10 w-full"
              >
                Remove Size
              </Button>
            </div>
          </Card>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => appendSize({ size_name: '', price: '' })}
          className="w-full border-[#2A4E45] text-[#2A4E45] hover:bg-[#2A4E45]/10 font-medium"
        >
          Add Size Option
        </Button>
      </div>

      {/* Extra Options */}
      <div className="space-y-4">
        <Label className="text-[#2A4E45] font-medium">Extra Options</Label>
        {extraFields.map((field, index) => (
          <Card key={field.id} className="p-4 border-[#2A4E45]/20 bg-white">
            <div className="space-y-4">
              <div>
                <Label className="text-[#2A4E45]">Extra Name</Label>
                <Input
                  {...register(`menu_extras.${index}.extra_name`)}
                  placeholder="Extra name"
                  className="bg-white text-[#2A4E45] border-[#2A4E45]/20"
                />
              </div>
              <div>
                <Label className="text-[#2A4E45]">Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register(`menu_extras.${index}.price`)}
                  placeholder="Price"
                  className="bg-white text-[#2A4E45] border-[#2A4E45]/20"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => removeExtra(index)}
                className="border-[#D64C37] text-[#D64C37] hover:bg-[#D64C37]/10 w-full"
              >
                Remove Extra
              </Button>
            </div>
          </Card>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => appendExtra({ extra_name: '', price: '' })}
          className="w-full border-[#2A4E45] text-[#2A4E45] hover:bg-[#2A4E45]/10 font-medium"
        >
          Add Extra Option
        </Button>
      </div>

      {/* Sides Section */}
      <div className="space-y-4">
        <Label className="text-[#2A4E45] font-medium">Available Sides</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableSides.map((side) => {
            const sideConfig = watch('menu_item_sides')?.find(
              (s) => s.side_id === side.id
            );
            return (
              <div
                key={side.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#2A4E45]/20"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`side-${side.id}`}
                    checked={Boolean(sideConfig)}
                    onCheckedChange={(checked) => {
                      const currentSides = getValues('menu_item_sides') || [];
                      if (checked === true) {
                        setValue('menu_item_sides', [
                          ...currentSides,
                          { side_id: side.id, is_default: false },
                        ]);
                      } else {
                        setValue(
                          'menu_item_sides',
                          currentSides.filter((s) => s.side_id !== side.id)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`side-${side.id}`} className="text-[#2A4E45]">
                    {side.name}
                  </Label>
                </div>
                {sideConfig && (
                  <>
                    <Checkbox
                      id={`default-${side.id}`}
                      checked={sideConfig.is_default}
                      onCheckedChange={(checked) =>
                        handleSideDefaultChange(side.id, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`default-${side.id}`}
                      className="text-[#2A4E45]"
                    >
                      Default
                    </Label>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={onCancelAction}
          disabled={isLoading}
          className="border-[#2A4E45] text-[#2A4E45] hover:bg-[#2A4E45]/10"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#2A4E45] text-white hover:bg-[#2A4E45]/90"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {item ? 'Update' : 'Create'} Menu Item
        </Button>
      </div>
    </form>
  );
}
