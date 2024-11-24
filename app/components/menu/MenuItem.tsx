'use client';

import {
  MenuItemExtra,
  MenuItemSide,
  MenuItemSize,
  MenuItemWithRelations,
  Side,
} from '@/app/types/menu.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { ExtraOptions } from './ExtraOptions';
import { SideOptions } from './SideOptions';
import { SizeOptions } from './SizeOptions';

interface MenuItemProps {
  item: MenuItemWithRelations;
  onEditAction: (id: string) => void;
  onDeleteAction: (id: string) => void;
  availableSides: Side[];
}

// Update the transformation logic
const transformSides = (item: MenuItemWithRelations): MenuItemSide[] => {
  return item.sides.map((side) => ({
    id: `${item.id}-${side.id}`,
    menu_item_id: item.id,
    side_id: side.id,
    is_default: false,
    side: side,
  }));
};

export function MenuItem({
  item,
  onEditAction,
  onDeleteAction,
  availableSides,
}: MenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const transformedSides = React.useMemo(() => transformSides(item), [item]);

  const transformedSizes: MenuItemSize[] = React.useMemo(
    () =>
      item.sizes?.map((size) => ({
        id: `${item.id}-${size.size_name}`,
        menu_item_id: item.id,
        size_name: size.size_name,
        price: size.price,
        created_at: new Date().toISOString(),
      })) ?? [],
    [item.sizes, item.id]
  );

  const transformedExtras: MenuItemExtra[] = React.useMemo(
    () =>
      item.extras?.map((extra) => ({
        id: `${item.id}-${extra.extra_name}`,
        menu_item_id: item.id,
        extra_name: extra.extra_name,
        price: extra.price,
        created_at: new Date().toISOString(),
      })) ?? [],
    [item.extras, item.id]
  );

  // Format price helper
  const formatPrice = (price: string | number | null): string => {
    if (price === null) return 'N/A';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? 'N/A' : `$${numPrice.toFixed(2)}`;
  };

  return (
    <Card className="bg-white/80 hover:bg-white transition-colors duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#2A4E45]">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            )}
            <p className="text-base font-medium text-[#2A4E45] mt-2">
              {formatPrice(item.price)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditAction(item.id)}
              className="text-[#2A4E45] hover:text-[#2A4E45]/80"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteAction(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-[#2A4E45]"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>

        {isExpanded && (
          <div className="mt-4 space-y-6">
            {transformedSizes.length > 0 && (
              <SizeOptions sizes={transformedSizes} />
            )}
            {transformedExtras.length > 0 && (
              <ExtraOptions extras={transformedExtras} />
            )}
            {transformedSides.length > 0 && (
              <SideOptions
                sides={availableSides}
                menuItemSides={transformedSides}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
