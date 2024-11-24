import { MenuCategory } from '@/app/types/menu.types';

export interface CategoryImages {
  id: string;
  category: MenuCategory;
  images: string[];
}

export const categoryImages: CategoryImages[] = [
  {
    id: '1',
    category: 'Appetizers',
    images: [
      '/images/menu-categories/appetizers/1.jpg',
      '/images/menu-categories/appetizers/2.jpg',
      '/images/menu-categories/appetizers/3.jpg',
    ],
  },
  {
    id: '2',
    category: 'Homemade Soups & Salads',
    images: [
      '/images/menu-categories/homemade-soups-and-salads/1.jpg',
      '/images/menu-categories/homemade-soups-and-salads/2.jpg',
      '/images/menu-categories/homemade-soups-and-salads/3.jpg',
    ],
  },
  {
    id: '3',
    category: 'Entrees',
    images: [
      '/images/menu-categories/entrees/1.jpg',
      '/images/menu-categories/entrees/2.jpg',
      '/images/menu-categories/entrees/3.jpg',
    ],
  },
  {
    id: '4',
    category: 'Sandwiches, Wraps & Burgers',
    images: [
      '/images/menu-categories/sandwiches-wraps-burgers/1.jpg',
      '/images/menu-categories/sandwiches-wraps-burgers/2.jpg',
      '/images/menu-categories/sandwiches-wraps-burgers/3.jpg',
    ],
  },
  {
    id: '5',
    category: 'Kids Corner',
    images: [
      '/images/menu-categories/kids-corner/1.jpg',
      '/images/menu-categories/kids-corner/2.jpg',
      '/images/menu-categories/kids-corner/3.jpg',
    ],
  },
  {
    id: '6',
    category: 'Desserts',
    images: [
      '/images/menu-categories/desserts/1.jpg',
      '/images/menu-categories/desserts/2.jpg',
      '/images/menu-categories/desserts/3.jpg',
    ],
  },
];
