'use client';

import { AdminNav } from '@/app/components/admin/AdminNav';
import { Side, SIDE_CATEGORIES, SideCategory } from '@/app/types/menu.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteAlert } from '@/components/ui/delete-alert';
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
import { Edit2, Plus, Utensils, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SidesPage() {
  const [sides, setSides] = useState<Side[]>([]);
  const [editingSide, setEditingSide] = useState<string | null>(null);
  const [showNewSideForm, setShowNewSideForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<SideCategory>('Default');

  useEffect(() => {
    loadSides();
  }, []);

  const loadSides = async () => {
    const { data, error } = await supabase
      .from('sides')
      .select('*')
      .order('name');

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load sides',
        variant: 'destructive',
      });
      return;
    }

    setSides(data || []);
  };

  const handleDelete = async (sideId: string) => {
    try {
      // First check if the side is being used
      const { data: usedSides, error: checkError } = await supabase
        .from('menu_item_sides')
        .select('id')
        .eq('side_id', sideId);

      if (checkError) throw checkError;

      if (usedSides && usedSides.length > 0) {
        toast({
          title: 'Cannot Delete',
          description: 'This side is currently being used by menu items',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase.from('sides').delete().eq('id', sideId);

      if (error) throw error;

      setSides(sides.filter((side) => side.id !== sideId));
      toast({
        title: 'Success',
        description: 'Side deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting side:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete side',
        variant: 'destructive',
      });
    }
  };

  const SideForm = ({ side }: { side?: Side }) => {
    const [formData, setFormData] = useState({
      name: side?.name || '',
      description: side?.description || '',
      price: side?.price?.toString() || '',
      category: side?.category || ('Default' as SideCategory),
      is_active: side?.is_active ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const sideData = {
          name: formData.name,
          description: formData.description,
          price: formData.price ? parseFloat(formData.price) : null,
          category: formData.category,
          is_active: formData.is_active,
        };

        if (side) {
          // Update
          const { error } = await supabase
            .from('sides')
            .update(sideData)
            .eq('id', side.id);

          if (error) throw error;
        } else {
          // Create
          const { error } = await supabase.from('sides').insert(sideData);

          if (error) throw error;
        }

        loadSides();
        setEditingSide(null);
        setShowNewSideForm(false);
        toast({
          title: 'Success',
          description: `Side ${side ? 'updated' : 'created'} successfully`,
        });
      } catch (error) {
        console.error('Error saving side:', error);
        toast({
          title: 'Error',
          description: `Failed to ${side ? 'update' : 'create'} side`,
          variant: 'destructive',
        });
      }
    };

    return (
      <Card className="border-2 border-[#2C5530] bg-[#F5F5F5] shadow-lg">
        <CardHeader className="border-b border-[#2C5530]/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-serif text-[#2C5530]">
              {side ? 'Edit Side' : 'New Side'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingSide(null);
                setShowNewSideForm(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border-[#2C5530]"
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border-[#2C5530]"
              />
            </div>

            <div>
              <Label>Price</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="border-[#2C5530]"
              />
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: SideCategory) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="border-[#2C5530]">
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
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingSide(null);
                  setShowNewSideForm(false);
                }}
                className="border-[#2C5530] text-[#2C5530]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#2C5530] text-white hover:bg-[#2C5530]/90"
              >
                {side ? 'Update' : 'Create'} Side
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-[#2C5530] mb-3 tracking-tight drop-shadow-lg">
            Sides Management
          </h1>
          <p className="text-xl text-[#2C5530]/80 font-sans uppercase tracking-[0.2em] mb-4">
            Manage Side Options & Pricing
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-24 h-px bg-[#E4A853]"></div>
            <Utensils className="h-8 w-8 text-[#E4A853]" aria-hidden="true" />
            <div className="w-24 h-px bg-[#E4A853]"></div>
          </div>
          <AdminNav />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Category Selection and Add New Button */}
          <Card className="border-2 border-[#2C5530] bg-[#F5F5F5] shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {Object.values(SIDE_CATEGORIES).map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? 'default' : 'outline'
                    }
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
                onClick={() => setShowNewSideForm(true)}
                className="w-full mt-4 bg-[#2C5530] text-white hover:bg-[#2C5530]/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Side
              </Button>
            </CardContent>
          </Card>

          {/* Sides List */}
          <Card className="border-2 border-[#2C5530] bg-[#F5F5F5] shadow-lg">
            <CardHeader className="border-b border-[#2C5530]/10">
              <CardTitle className="text-2xl font-serif text-[#2C5530]">
                {selectedCategory} Sides
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {sides
                  .filter((side) => side.category === selectedCategory)
                  .map((side) => (
                    <div
                      key={side.id}
                      className="flex items-center gap-4 p-3 bg-white border-2 border-[#2C5530] rounded-lg shadow-md"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{side.name}</h3>
                            {side.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {side.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#2C5530]">
                              {side.price
                                ? `$${Number(side.price).toFixed(2)}`
                                : 'Free'}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingSide(side.id)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteId(side.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Form Modal */}
          {(showNewSideForm || editingSide) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="max-w-2xl w-full">
                <SideForm
                  side={sides.find((side) => side.id === editingSide)}
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
            title="Delete Side"
            description="Are you sure you want to delete this side? This action cannot be undone."
          />
        </div>
      </div>
    </div>
  );
}
