'use client';

import { useSides } from '@/app/hooks/useSides';
import { Side } from '@/app/types/menu.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import SideForm from './SideForm';

// Helper function for price formatting
const formatPrice = (price: number | undefined | null): string => {
  if (price === null || price === undefined) return 'No price set';
  return `$${price.toFixed(2)}`;
};

export type SideManagementSectionProps = {
  onDeleteRequestAction: (id: string) => Promise<void>;
};

interface SidesHookResult {
  sides: Side[];
  refreshSides: () => Promise<void>;
}

export function SideManagementSection({
  onDeleteRequestAction,
}: SideManagementSectionProps) {
  const [isAddingSide, setIsAddingSide] = useState(false);
  const [editingSideId, setEditingSideId] = useState<string | null>(null);
  const { sides, refreshSides } = useSides() as SidesHookResult;

  const handleSideDelete = async (id: string) => {
    try {
      await onDeleteRequestAction(id);
      refreshSides();
    } catch (error) {
      console.error('Error deleting side:', error);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#2A4E45]">Sides Management</h2>
        <Button
          onClick={() => setIsAddingSide(true)}
          className="bg-[#2A4E45] text-white hover:bg-[#2A4E45]/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Side
        </Button>
      </div>

      {isAddingSide && (
        <SideForm
          onSuccess={() => {
            setIsAddingSide(false);
            refreshSides();
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {sides.map((side) => (
          <Card key={side.id} className="bg-white/95">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[#2A4E45]">
                  {side.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#2A4E45] hover:text-[#D64C37] hover:bg-transparent"
                    onClick={() => setEditingSideId(side.id)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#2A4E45] hover:text-[#D64C37] hover:bg-transparent"
                    onClick={() => handleSideDelete(side.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{side.description}</p>
              <p className="text-sm font-mono mt-2">
                {formatPrice(side.price)}
              </p>
              <p className="text-sm mt-1 text-[#2A4E45]">
                Category: {side.category}
              </p>
              <p className="text-sm mt-1 text-[#2A4E45]">
                Status: {side.is_active ? 'Active' : 'Inactive'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingSideId && (
        <SideForm
          side={sides.find((s) => s.id === editingSideId)}
          onSuccess={() => {
            setEditingSideId(null);
            refreshSides();
          }}
        />
      )}
    </div>
  );
}
