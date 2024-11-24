import { MenuItemExtra } from '@/app/types/menu.types';

interface ExtraOptionsProps {
  extras: MenuItemExtra[];
}

export function ExtraOptions({ extras }: ExtraOptionsProps) {
  // Helper function for price formatting
  const formatPrice = (price: number | string): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numericPrice.toFixed(2)}`;
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-[#2A4E45]">Extra Options</h4>
      <div className="grid grid-cols-2 gap-2">
        {extras.map((extra, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-[#2A4E45]/5 rounded"
          >
            <span className="text-sm text-[#2A4E45]">{extra.extra_name}</span>
            <span className="text-sm font-mono text-[#2A4E45]">
              +{formatPrice(extra.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
