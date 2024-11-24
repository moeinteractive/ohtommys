import { Side } from '@/app/types/menu.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Menu, Trash2 } from 'lucide-react';

// Helper function for price formatting
const formatPrice = (price: number | undefined | null): string => {
  if (price === null || price === undefined) return 'N/A';
  return `$${price.toFixed(2)}`;
};

interface SidesListProps {
  sides: Side[];
  onDelete: (id: string) => void;
}

export function SidesList({ sides, onDelete }: SidesListProps) {
  return (
    <Card className="mt-8 border-2 border-[#2C5530] bg-[#F5F5F5] shadow-lg overflow-hidden">
      <CardHeader className="bg-[#2C5530] py-4">
        <CardTitle className="text-2xl font-serif text-[#E4A853] flex items-center gap-3">
          <Menu className="h-5 w-5" />
          Sides Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4">
          {sides.map((side) => (
            <div
              key={side.id}
              className="bg-white rounded-lg p-4 shadow-md border border-[#2C5530]/20 hover:border-[#2C5530] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-serif font-bold text-[#2C5530]">
                  {side.name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(side.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                {side.description || 'No description available'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-[#2C5530]">
                  {formatPrice(side.price)}
                </span>
                <span className="text-sm bg-[#F5F5F5] px-3 py-1 rounded-full border border-[#2C5530]/20">
                  {side.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
