'use client';

import { createSide, updateSide } from '@/app/lib/actions/menu';
import { SIDE_CATEGORIES, Side, SideFormData } from '@/app/types/menu.types';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

interface SideFormProps {
  side?: Side;
  onSuccess?: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable(),
  price: z.number().nullable(),
  category: z.enum(['Default', 'Premium', 'Special']),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

type SideWithoutId = Omit<Side, 'id' | 'created_at' | 'updated_at'>;

const SideForm: React.FC<SideFormProps> = ({ side, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: side?.name || '',
      description: side?.description || '',
      price: side?.price || null,
      category: side?.category || SIDE_CATEGORIES.DEFAULT,
      is_active: side?.is_active ?? true,
    },
  });

  const onSubmit = async (data: SideFormData) => {
    try {
      setIsSubmitting(true);

      const sideData: SideWithoutId = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        is_active: data.is_active,
      };

      if (side?.id) {
        await updateSide(side.id, sideData);
        toast({
          title: 'Success',
          description: 'Side updated successfully',
        });
      } else {
        await createSide(sideData);
        toast({
          title: 'Success',
          description: 'Side created successfully',
        });
        reset();
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'Failed to save side',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white/95 shadow-lg">
      <CardHeader>
        <CardTitle>{side ? 'Edit Side' : 'Add New Side'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="side-name">Name</Label>
              <Input
                id="side-name"
                {...register('name', { required: 'Name is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="side-description">Description</Label>
              <Textarea
                id="side-description"
                {...register('description')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <Label htmlFor="side-price">Price</Label>
              <Input
                id="side-price"
                type="number"
                step="0.01"
                {...register('price')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <Label htmlFor="side-category">Category</Label>
              <Controller
                name="category"
                control={control}
                defaultValue={side?.category || SIDE_CATEGORIES.DEFAULT}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={cn(
                        'border-[#2A4E45] bg-white/50',
                        'focus:border-[#D64C37] focus:ring-[#D64C37]'
                      )}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(SIDE_CATEGORIES).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <Switch
                  id="side-active"
                  {...register('is_active')}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : side
                  ? 'Update Side'
                  : 'Create Side'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SideForm;
