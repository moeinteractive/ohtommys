// Database enums
export type DayOfWeek =
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
export type MenuCategory =
  | 'Appetizers'
  | 'Homemade Soups & Salads'
  | 'Entrees'
  | 'Sandwiches, Wraps & Burgers'
  | 'Kids Corner'
  | 'Desserts';
export type SideCategory = 'Default' | 'Premium' | 'Special';

// Constants
export const DAYS_OF_WEEK = {
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
} as const;

export const MENU_CATEGORIES = {
  APPETIZERS: 'Appetizers',
  SOUPS_AND_SALADS: 'Homemade Soups & Salads',
  ENTREES: 'Entrees',
  SANDWICHES: 'Sandwiches, Wraps & Burgers',
  KIDS: 'Kids Corner',
  DESSERTS: 'Desserts',
} as const;

export const SIDE_CATEGORIES = {
  DEFAULT: 'Default',
  PREMIUM: 'Premium',
  SPECIAL: 'Special',
} as const;

// Base interfaces
export interface Side {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: SideCategory;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MenuItemSize {
  id: string;
  menu_item_id: string;
  size_name: string;
  price: string;
  created_at: string;
}

export interface MenuItemExtra {
  id: string;
  menu_item_id: string;
  extra_name: string;
  price: string;
  created_at: string;
}

export interface MenuItemSide {
  id: string;
  menu_item_id: string;
  side_id: string;
  is_default: boolean;
  side: Side;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: string | number | null;
  image_url: string | null;
  is_special: boolean;
  created_at: string;
  updated_at: string;
  day?: DayOfWeek | null;
  menu_item_sides?: Array<{
    side_id: string;
    is_default: boolean;
    side: Side;
  }>;
  menu_sizes?: Array<{
    size_name: string;
    price: string;
  }>;
  menu_extras?: Array<{
    extra_name: string;
    price: string;
  }>;
}

export interface MenuSpecial {
  id: string;
  menu_item_id: string;
  day: DayOfWeek;
  special_price: number;
  special_description: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  name?: string;
  description?: string | null;
  price?: number | null;
  image_url?: string | null;
  menu_items?: {
    id: string;
    name: string;
    price: number | null;
    description: string | null;
    category: MenuCategory;
    is_special: boolean | null;
    image_url?: string | null;
  };
}

export interface MenuContent {
  id: string;
  content_key: string;
  content_value: string | null;
  dressings_list?: string;
  food_safety_disclaimer?: string;
  payment_notice?: string;
}

export interface MenuItemFormData {
  name: string;
  description: string | null;
  price: string | null;
  category: MenuCategory;
  is_special: boolean;
  day: DayOfWeek | null;
  menu_item_sides?: Array<{
    side_id: string;
    is_default: boolean;
  }>;
  menu_sizes?: Array<{
    size_name: string;
    price: string;
  }>;
  menu_extras?: Array<{
    extra_name: string;
    price: string;
  }>;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
// Additional types needed by services
export type SizeOption = {
  menu_item_id: string;
  size_name: string;
  price: number;
  created_at: string;
};

export type ExtraOption = {
  menu_item_id: string;
  extra_name: string;
  price: number;
  created_at: string;
};

export type NewMenuItem = Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>;

// Update MenuItemWithRelations to include proper typing for specials
export interface MenuItemWithRelations extends Omit<MenuItem, 'price'> {
  price: string | null;
  sizes: Array<{ size_name: string; price: string }>;
  extras: Array<{ extra_name: string; price: string }>;
  sides: Side[];
  specials: MenuSpecial[];
}

// Add this interface
export interface SpecialWithMenuItem {
  id: string;
  menu_item_id: string;
  day: DayOfWeek;
  special_price: number;
  special_description: string | null;
  created_at: string | null;
  updated_at: string | null;
  menu_items: {
    id: string;
    name: string;
    price: number | null;
    description: string | null;
    category: MenuCategory;
    is_special: boolean | null;
    image_url: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
}

// Consolidate these into one interface
export interface CategoryImage {
  id: string;
  category: string;
  images: string[];
  folder_name?: string;
  display_order?: number;
  created_at?: string;
}

export interface CategoryInfo {
  id: string;
  category: string;
  description?: string;
  sides_note?: string;
  category_sides: {
    id: string;
    category: string;
    side: Side;
    is_default?: boolean;
  }[];
  created_at?: string;
}
export type CategoryPhrase = Record<MenuCategory, string[]>;

export interface CategorySide {
  id: string;
  category: string;
  side_id: string;
  is_default?: boolean;
}

export interface SideFormData {
  name: string;
  description: string | null;
  price: number | null;
  category: SideCategory;
  is_active: boolean;
}

// Raw types (from database)
export type RawMenuItemSide = {
  id: string;
  is_default: boolean;
  sides: {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    category: string;
    is_active: boolean;
  };
};

export type RawMenuSize = {
  id: string;
  size_name: string;
  price: number;
};

export type RawMenuExtra = {
  id: string;
  extra_name: string;
  price: number;
};

export interface RawMenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number | null;
  image_url: string | null;
  menu_item_sides: {
    id: string;
    is_default: boolean;
    sides: {
      id: string;
      name: string;
      description: string | null;
      price: number | null;
      category: string;
      is_active: boolean;
    };
  }[];
  menu_sizes: {
    id: string;
    size_name: string;
    price: number;
  }[];
  menu_extras: {
    id: string;
    extra_name: string;
    price: number;
  }[];
}

// Transformed types (for application use)
export type TransformedMenuItemSide = {
  id: string;
  menu_item_id: string;
  side_id: string;
  is_default: boolean;
  side: {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    category: SideCategory;
    is_active: boolean;
  };
};

export type TransformedMenuSize = {
  id: string;
  menu_item_id: string;
  size_name: string;
  price: string;
  created_at: string;
};

export type TransformedMenuExtra = {
  id: string;
  menu_item_id: string;
  extra_name: string;
  price: string;
  created_at: string;
};
