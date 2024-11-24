import {
  MenuItem,
  MenuItemFormData,
  MenuItemWithRelations,
} from '@/app/types/menu.types';
import type { Side } from '@/app/types/side.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, Menu, Trash2 } from 'lucide-react';
import MenuItemForm from './MenuItemForm';

interface MenuItemListProps {
  items: MenuItemWithRelations[];
  editingItem: MenuItem | null;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onCancelEdit: () => void;
  onSubmitEdit: (data: MenuItemFormData) => Promise<void>;
  availableSides: Side[];
}

// Update the formatPrice function to handle string prices
const formatPrice = (price: string | number | null | undefined): string => {
  if (price === null || price === undefined) return 'N/A';
  // If price is already a string with a $ prefix, return it as is
  if (typeof price === 'string' && price.startsWith('$')) return price;
  // Convert to number and format
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(numPrice) ? 'N/A' : `$${numPrice.toFixed(2)}`;
};

export function MenuItemList({
  items,
  editingItem,
  onEdit,
  onDelete,
  onCancelEdit,
  onSubmitEdit,
  availableSides,
}: MenuItemListProps) {
  // Group menu items by category
  const itemsByCategory = items.reduce<Record<string, MenuItemWithRelations[]>>(
    (acc, item) => {
      const category = item.category || 'uncategorized';
      return {
        ...acc,
        [category]: [...(acc[category] || []), item],
      };
    },
    {}
  );

  const renderMenuItem = (item: MenuItemWithRelations) => {
    if (editingItem?.id === item.id) {
      return (
        <MenuItemForm
          key={item.id}
          item={item}
          sides={availableSides}
          onSuccessAction={onSubmitEdit}
          onCancelAction={onCancelEdit}
        />
      );
    }

    return (
      <div
        key={item.id}
        className="bg-white rounded-lg p-4 shadow-md border border-[#2C5530]/20 hover:border-[#2C5530] transition-all duration-200"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-serif font-bold text-[#2C5530]">
                {item.name}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(item)}
                  className="text-[#2C5530] hover:bg-[#2C5530]/10"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(item.id)}
                  className="text-[#D64C37] hover:bg-[#D64C37]/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {item.description && (
              <p className="text-sm text-[#2C5530]/60 mt-1">
                {item.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium text-[#2C5530]">
                {formatPrice(item.price)}
              </span>
              <span className="text-sm text-[#2C5530]/60">•</span>
              <span className="text-sm text-[#2C5530]/60">{item.category}</span>
              {item.is_special && (
                <>
                  <span className="text-sm text-[#2C5530]/60">•</span>
                  <span className="text-sm text-[#E4A853] font-medium capitalize">
                    {item.day ? `${item.day} Special` : 'Special'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
        <Card
          key={category}
          className="border-2 border-[#2C5530] bg-[#F5F5F5] shadow-lg overflow-hidden"
        >
          <CardHeader className="bg-[#2C5530] py-4">
            <CardTitle className="text-2xl font-serif text-[#E4A853] flex items-center gap-3">
              <Menu className="h-5 w-5" />
              {category}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {categoryItems.map(renderMenuItem)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
