'use client';

import { AdminNav } from '@/app/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

type MenuContent = {
  id: string;
  content_key: string;
  content_text: string;
  last_updated: string;
};

const CONTENT_LABELS: Record<string, string> = {
  dressings_list: 'Dressings List',
  food_safety_disclaimer: 'Food Safety Disclaimer',
  payment_notice: 'Payment Notice',
};

export default function MenuContentPage() {
  const [content, setContent] = useState<MenuContent[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data, error } = await supabase
      .from('menu_content')
      .select('*')
      .order('content_key');

    if (error) {
      console.error('Error loading menu content:', error);
      return;
    }

    if (data) setContent(data);
  };

  const startEdit = (item: MenuContent) => {
    setEditing(item.id);
    setEditText(item.content_text);
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from('menu_content')
      .update({ content_text: editText })
      .eq('id', id);

    if (error) {
      console.error('Error updating menu content:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save menu content. Please try again.',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Menu content has been updated.',
    });

    setEditing(null);
    loadContent();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-[#2C5530] mb-3 tracking-tight drop-shadow-lg">
            Menu Text & Disclaimers
          </h1>
          <p className="text-xl text-[#2C5530]/80 font-sans uppercase tracking-[0.2em] mb-4">
            Manage Menu Content & Information
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-24 h-px bg-[#E4A853]"></div>
            <Calendar className="h-8 w-8 text-[#E4A853]" aria-hidden="true" />
            <div className="w-24 h-px bg-[#E4A853]"></div>
          </div>
          <AdminNav />
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {content.map((item) => (
              <Card
                key={item.id}
                className="border-2 border-[#2C5530] bg-[#F5F5F5] shadow-lg"
              >
                <CardHeader className="border-b border-[#2C5530]/10">
                  <CardTitle className="text-2xl font-serif text-[#2C5530] flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    {CONTENT_LABELS[item.content_key]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {editing === item.id ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={5}
                        className="border-[#2C5530] focus:ring-[#E4A853] text-[#2C5530]"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => setEditing(null)}
                          className="border-[#2C5530] text-[#2C5530] hover:bg-[#2C5530]/5"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => saveEdit(item.id)}
                          className="bg-[#2C5530] text-white hover:bg-[#2C5530]/90"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="whitespace-pre-wrap text-lg text-[#2C5530]/80">
                        {item.content_text}
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          onClick={() => startEdit(item)}
                          className="border-[#2C5530] text-[#2C5530] hover:bg-[#2C5530]/5"
                        >
                          Edit Text
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
