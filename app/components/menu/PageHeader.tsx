import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Menu, Plus } from 'lucide-react';

type PageHeaderProps = {
  onAddItem: () => void;
  showAddButton: boolean;
};

export function PageHeader({ onAddItem, showAddButton }: PageHeaderProps) {
  return (
    <>
      <div className="text-center mb-12 bg-[#2C5530] p-6 rounded-lg shadow-lg">
        <h1 className="text-5xl font-serif font-bold text-[#E4A853] mb-4 tracking-tight">
          Menu Management
        </h1>
        <p className="text-lg text-[#F5F5F5] font-gaelic uppercase tracking-widest">
          Manage Your Menu Items & Sides
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Separator className="w-16 bg-[#E4A853]" />
          <Menu className="w-6 h-6 text-[#E4A853]" aria-hidden="true" />
          <Separator className="w-16 bg-[#E4A853]" />
        </div>
      </div>

      {showAddButton && (
        <Button
          onClick={onAddItem}
          className="w-full mb-8 bg-[#2C5530] text-[#F5F5F5] hover:bg-[#2C5530]/90 border-2 border-[#E4A853] shadow-md"
        >
          <Plus className="mr-2 h-5 w-5" /> Add New Menu Item
        </Button>
      )}
    </>
  );
}
