export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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

export interface Database {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: string;
          name: string;
          price: number | null;
          day: DayOfWeek;
          description: string | null;
          is_special: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          category: MenuCategory | null;
        };
      };
      menu_item_sizes: {
        Row: {
          id: string;
          menu_item_id: string;
          size_name: string;
          price: number;
          created_at: string | null;
        };
      };
      menu_item_extras: {
        Row: {
          id: string;
          menu_item_id: string;
          extra_name: string;
          price: number;
          created_at: string | null;
        };
      };
      menu_item_sides: {
        Row: {
          id: string;
          menu_item_id: string;
          side_id: string;
          is_default: boolean | null;
          created_at?: string | null;
        };
      };
      menu_specials: {
        Row: {
          id: string;
          menu_item_id: string;
          day: string;
          special_price: number;
          special_description: string | null;
          created_at: string | null;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          event_date: string | null;
          start_time: string | null;
          end_time: string | null;
          description: string;
          is_recurring: boolean;
          recurring_days: string[] | null;
          created_at: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      day_of_week: DayOfWeek;
      menu_category: MenuCategory;
      side_category: SideCategory;
    };
  };
}
