import { MENU_CATEGORIES, MenuCategory } from '@/app/types/menu.types';

export interface IconDefinition {
  category: MenuCategory;
  icons: Array<{
    path: string;
    viewBox: string;
  }>;
}

interface CategoryIconsProps {
  category: MenuCategory;
  className?: string;
}

export const categorySvgIcons: IconDefinition[] = [
  {
    category: MENU_CATEGORIES.APPETIZERS,
    icons: [
      {
        viewBox: '0 0 24 24',
        path: 'M15 11V5l-3-3-3 3v6H3v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8h-6z',
      },
    ],
  },
  {
    category: MENU_CATEGORIES.SOUPS_AND_SALADS,
    icons: [
      {
        viewBox: '0 0 24 24',
        path: 'M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V5h16v14z',
      },
    ],
  },
  {
    category: MENU_CATEGORIES.ENTREES,
    icons: [
      {
        viewBox: '0 0 24 24',
        path: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z',
      },
    ],
  },
  {
    category: MENU_CATEGORIES.SANDWICHES,
    icons: [
      {
        viewBox: '0 0 24 24',
        path: 'M3 3h18v2H3V3zm0 16h18v2H3v-2zm0-8h18v2H3v-2z',
      },
    ],
  },
  {
    category: MENU_CATEGORIES.KIDS,
    icons: [
      {
        viewBox: '0 0 24 24',
        path: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9z',
      },
    ],
  },
  {
    category: MENU_CATEGORIES.DESSERTS,
    icons: [
      {
        viewBox: '0 0 24 24',
        path: 'M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm4.6 9.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 16.64 5.88 17 4.96 17c-.73 0-1.4-.23-1.96-.61V21c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01zM18 9h-5V7h-2v2H6c-1.66 0-3 1.34-3 3v1.54c0 1.08.88 1.96 1.96 1.96.52 0 1.02-.2 1.38-.57l2.14-2.13 2.13 2.13c.74.74 2.03.74 2.77 0l2.14-2.13 2.13 2.13c.37.37.86.57 1.38.57 1.08 0 1.96-.88 1.96-1.96V12C21 10.34 19.66 9 18 9z',
      },
    ],
  },
];

export function CategoryIcons({ category, className }: CategoryIconsProps) {
  const categoryIcons = categorySvgIcons.find(
    (icon) => icon.category === category
  );

  if (!categoryIcons) return null;

  return (
    <div className="flex gap-2">
      {categoryIcons.icons.map((icon, index) => (
        <svg
          key={index}
          viewBox={icon.viewBox}
          className={`h-5 w-5 text-[#2A4E45] ${className || ''}`}
          fill="currentColor"
        >
          <path d={icon.path} />
        </svg>
      ))}
    </div>
  );
}
