import { MenuCategory } from '@/app/types/menu.types';

export const categoryPhrases: Record<MenuCategory, string[]> = {
  Appetizers: [
    'Share the flavor',
    'Perfect for sharing',
    'Small bites, big taste',
    'Savor the moment',
    'Crowd favorites',
  ],
  'Homemade Soups & Salads': [
    'Fresh & crisp',
    'Garden fresh',
    'Light & healthy',
    'Farm to table',
    'Homemade goodness',
  ],
  Entrees: [
    'Main attraction',
    "Chef's pride",
    'House specialty',
    'Signature dishes',
    'Perfect plates',
  ],
  'Sandwiches, Wraps & Burgers': [
    'Handcrafted classics',
    'Stacked with care',
    'Fresh & filling',
    'Handheld favorites',
    'Made to order',
  ],
  'Kids Corner': [
    'Fun favorites',
    'Little bites',
    'Kid approved',
    'Mini meals',
    'Young foodies',
  ],
  Desserts: [
    'Sweet endings',
    'Decadent treats',
    'Pure indulgence',
    'Sweet temptations',
    'Heavenly delights',
  ],
} as const;

export const getRandomPhrase = (category: MenuCategory): string => {
  const phrases = categoryPhrases[category] || [
    'Tasty dish',
    'Fresh flavor',
    'House special',
    "Chef's choice",
    'Daily special',
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
};
