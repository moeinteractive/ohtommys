'use client';

import { AdminNav } from '@/app/components/admin/AdminNav';
import { DayOfWeek, DAYS_OF_WEEK, MenuCategory } from '@/app/types/menu.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Calendar, Edit2, Plus, Trash2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type MenuItem = {
  id: string;
  name: string;
  price: string | number;
  category: MenuCategory;
  description?: string;
  is_special: boolean;
};

type Special = {
  id: string;
  menu_item_id: string;
  day: DayOfWeek;
  special_price: number;
  special_description?: string;
};

const DAYS = Object.values(DAYS_OF_WEEK);

const formatDay = (day: string) => {
  return day.charAt(0).toUpperCase() + day.slice(1);
};

export default function SpecialsPage() {
  const searchParams = useSearchParams();
  const [editingSpecial, setEditingSpecial] = useState<string | null>(null);
  const [showNewSpecialForm, setShowNewSpecialForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [specialPrice, setSpecialPrice] = useState<string>('');
  const [specialDescription, setSpecialDescription] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [specials, setSpecials] = useState<Special[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('all');

  useEffect(() => {
    loadData();
    // If item ID is provided in URL, select it
    const itemId = searchParams.get('item');
    if (itemId) {
      setSelectedItem(itemId);
    }
  }, [searchParams]);

  const loadData = async () => {
    // Load all menu items
    const { data: menuData } = await supabase
      .from('menu_items')
      .select('*')
      .order('name');

    // Load all specials
    const { data: specialsData } = await supabase
      .from('menu_specials')
      .select('*')
      .order('day');

    if (menuData) setMenuItems(menuData);
    if (specialsData) setSpecials(specialsData);
  };

  const addSpecial = async () => {
    if (!selectedItem || !specialPrice || selectedDays.length === 0) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Add a special for each selected day
    const specialsToAdd = selectedDays.map((day) => ({
      menu_item_id: selectedItem,
      day,
      special_price: parseFloat(specialPrice),
      special_description: specialDescription || undefined,
    }));

    const { error } = await supabase
      .from('menu_specials')
      .insert(specialsToAdd)
      .select();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add specials',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Specials added successfully',
    });

    // Reset form and reload data
    setSelectedDays([]);
    setSpecialPrice('');
    setSpecialDescription('');
    loadData();
  };

  const handleEdit = (special: Special) => {
    setEditingSpecial(special.id);
    // Pre-fill the form with special's data
    const menuItem = menuItems.find((item) => item.id === special.menu_item_id);
    if (menuItem) {
      setSelectedItem(menuItem.id);
      setSpecialPrice(special.special_price.toString());
      setSpecialDescription(special.special_description || '');
      setSelectedDays([special.day]); // Since we're editing a single special
    }
  };

  const updateSpecial = async (special: Special) => {
    if (!selectedItem || !specialPrice) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('menu_specials')
      .update({
        menu_item_id: selectedItem,
        special_price: parseFloat(specialPrice),
        special_description: specialDescription || null,
      })
      .eq('id', special.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update special',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Special updated successfully',
    });

    setEditingSpecial(null);
    loadData();
  };

  const deleteSpecial = async (specialId: string) => {
    const { error } = await supabase
      .from('menu_specials')
      .delete()
      .eq('id', specialId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete special',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Special deleted successfully',
    });

    loadData();
  };

  // Group specials by day for display
  const specialsByDay = DAYS.reduce(
    (acc, day) => {
      acc[day] = specials.filter((special) => special.day === day);
      return acc;
    },
    {} as Record<string, Special[]>
  );

  // Update the renderSpecialCard function to handle inline editing
  const renderSpecialCard = (special: Special) => {
    const menuItem = menuItems.find((item) => item.id === special.menu_item_id);
    if (!menuItem) return null;

    return (
      <div
        key={special.id}
        className="flex items-center gap-4 p-3 bg-white border-2 border-[#2C5530] rounded-lg shadow-md"
      >
        <div className="flex-1">
          {editingSpecial === special.id ? (
            <div className="space-y-4">
              <div>
                <Label className="text-[#2C5530]">Menu Item</Label>
                <Select value={selectedItem} onValueChange={setSelectedItem}>
                  <SelectTrigger className="border-[#2C5530] focus:ring-[#E4A853] text-[#2C5530]">
                    <SelectValue placeholder="Choose a menu item" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {menuItems.map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                        className="text-[#2C5530] hover:bg-[#2C5530]/5 cursor-pointer"
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[#2C5530]">Special Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={specialPrice}
                  onChange={(e) => setSpecialPrice(e.target.value)}
                  className="border-[#2C5530] focus:ring-[#E4A853] text-[#2C5530]"
                />
              </div>

              <div>
                <Label className="text-[#2C5530]">Description (Optional)</Label>
                <Textarea
                  value={specialDescription}
                  onChange={(e) => setSpecialDescription(e.target.value)}
                  className="border-[#2C5530] focus:ring-[#E4A853] text-[#2C5530]"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingSpecial(null)}
                  className="border-[#2C5530] text-[#2C5530] hover:bg-[#2C5530]/5"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateSpecial(special)}
                  className="bg-[#2C5530] text-white hover:bg-[#2C5530]/90"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-[250px_1fr_100px] items-center gap-4">
              <h3 className="font-medium truncate">{menuItem.name}</h3>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-[#2C5530]">
                  ${special.special_price.toFixed(2)}
                </span>
                <span className="text-[#2C5530]/60 ml-2">
                  (Regular: ${Number(menuItem.price).toFixed(2)})
                </span>
              </div>
              <div className="flex gap-1 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(special)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteId(special.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {!editingSpecial && special.special_description && (
            <p className="text-sm text-muted-foreground mt-2">
              {special.special_description}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Update the main return JSX to move "Add New Special" to a top card
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-[#2C5530] mb-3 tracking-tight drop-shadow-lg">
            Daily Specials
          </h1>
          <p className="text-xl text-[#2C5530]/80 font-sans uppercase tracking-[0.2em] mb-4">
            Manage Today&apos;s Deals & Promotions
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-24 h-px bg-[#E4A853]"></div>
            <Calendar className="h-8 w-8 text-[#E4A853]" aria-hidden="true" />
            <div className="w-24 h-px bg-[#E4A853]"></div>
          </div>
          <AdminNav />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Add New Special Card */}
          <Card className="border-2 border-[#2C5530] bg-[#F5F5F5] shadow-lg">
            <CardHeader className="border-b border-[#2C5530]/10">
              <CardTitle className="text-2xl font-serif text-[#2C5530] flex items-center gap-3">
                <Calendar className="h-5 w-5" />
                Manage Specials
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="w-[200px] border-[#2C5530] focus:ring-[#E4A853] text-[#2C5530]">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-[#2C5530]">
                        All Days
                      </SelectItem>
                      {DAYS.map((day) => (
                        <SelectItem
                          key={day}
                          value={day}
                          className="text-[#2C5530] capitalize"
                        >
                          {formatDay(day)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => setShowNewSpecialForm(true)}
                  className="bg-[#2C5530] text-white hover:bg-[#2C5530]/90 w-full sm:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Special
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add New Special Form */}
          {showNewSpecialForm && (
            <Card className="border-2 border-[#2C5530] bg-[#F5F5F5] shadow-lg mt-6">
              <CardHeader className="border-b border-[#2C5530]/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-serif text-[#2C5530]">
                    New Special Details
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewSpecialForm(false)}
                    className="border-[#2C5530] text-[#2C5530] hover:bg-[#2C5530]/5"
                  >
                    Cancel
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Menu Item Selection */}
                  <div>
                    <Label className="text-[#2C5530]">Select Menu Item</Label>
                    <Select
                      value={selectedItem}
                      onValueChange={setSelectedItem}
                    >
                      <SelectTrigger className="border-[#2C5530] focus:ring-[#E4A853] text-[#2C5530]">
                        <SelectValue placeholder="Choose a menu item" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {menuItems.map((item) => (
                          <SelectItem
                            key={item.id}
                            value={item.id}
                            className="text-[#2C5530] hover:bg-[#2C5530]/5 cursor-pointer"
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Days Selection */}
                  <div>
                    <Label className="text-[#2C5530]">Select Days</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                      {DAYS.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={day}
                            checked={selectedDays.includes(day)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedDays([...selectedDays, day]);
                              } else {
                                setSelectedDays(
                                  selectedDays.filter((d) => d !== day)
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={day}
                            className="text-[#2C5530] capitalize"
                          >
                            {day}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Input */}
                  <div>
                    <Label className="text-[#2C5530]">Special Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={specialPrice}
                      onChange={(e) => setSpecialPrice(e.target.value)}
                      placeholder="Enter special price"
                      className="border-[#2C5530] focus:ring-[#E4A853] text-[#2C5530]"
                    />
                  </div>

                  {/* Description Input */}
                  <div>
                    <Label className="text-[#2C5530]">
                      Special Description (Optional)
                    </Label>
                    <Textarea
                      value={specialDescription}
                      onChange={(e) => setSpecialDescription(e.target.value)}
                      placeholder="Enter special description or leave blank to use regular description"
                      className="border-[#2C5530] focus:ring-[#E4A853] text-[#2C5530]"
                    />
                  </div>

                  <Button
                    onClick={addSpecial}
                    className="w-full bg-[#2C5530] hover:bg-[#2C5530]/90 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Special
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Display Specials by Day */}
          <div className="mt-8 space-y-6">
            {DAYS.map((day) => {
              // Skip if filtering and not matching the selected day
              if (selectedDay !== 'all' && selectedDay !== day) return null;

              const daySpecials = specialsByDay[day] || [];
              if (daySpecials.length === 0) return null;

              return (
                <Card
                  key={day}
                  className="border-2 border-[#2C5530] bg-[#F5F5F5] shadow-lg"
                >
                  <CardHeader className="border-b border-[#2C5530]/10">
                    <CardTitle className="text-2xl font-serif text-[#2C5530] capitalize flex items-center gap-3">
                      <Calendar className="h-5 w-5" />
                      {formatDay(day)} Specials
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {daySpecials.map((special) => renderSpecialCard(special))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Delete Alert */}
          <DeleteAlert
            open={deleteId !== null}
            onOpenChange={(open) => {
              if (!open) setDeleteId(null);
            }}
            onConfirm={() => {
              if (deleteId) {
                deleteSpecial(deleteId);
                setDeleteId(null);
              }
            }}
            title="Delete Special"
            description="Are you sure you want to delete this special? This action cannot be undone."
          />
        </div>
      </div>
    </div>
  );
}
