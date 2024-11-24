import type { Side } from '@/app/types/menu.types';

interface SideOptionsProps {
  sides: Side[];
  menuItemSides?: {
    id: string;
    menu_item_id: string;
    side_id: string;
    is_default: boolean;
    side?: Side;
  }[];
}

export function SideOptions({ sides, menuItemSides }: SideOptionsProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-[#2A4E45]">Available Sides</h4>
      <div className="grid grid-cols-2 gap-2">
        {sides.map((side) => {
          const isDefault = menuItemSides?.some(
            (ms) => ms.side_id === side.id && ms.is_default
          );

          return (
            <div
              key={side.id}
              className="flex flex-col p-2 bg-[#2A4E45]/5 rounded"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#2A4E45]">
                  {side.name}
                </span>
                {side.price && (
                  <span className="text-sm font-mono text-[#2A4E45]">
                    +${side.price}
                  </span>
                )}
              </div>
              {side.description && (
                <span className="text-xs text-[#2A4E45]/60 mt-1">
                  {side.description}
                </span>
              )}
              {isDefault && (
                <span className="text-xs text-[#2A4E45]/80 mt-1 font-medium">
                  Default Side
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
