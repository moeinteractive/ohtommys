-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for menu categories
CREATE TYPE menu_category AS ENUM (
  'Appetizers',
  'Homemade Soups & Salads',
  'Entrees',
  'Sandwiches, Wraps & Burgers',
  'Kids Corner',
  'Desserts'
);

-- Create enum for days of week
CREATE TYPE day_of_week AS ENUM (
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
);

-- Create menu_items table FIRST
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price decimal(10,2),
  day day_of_week NOT NULL,
  category menu_category NOT NULL,
  is_special boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create sides table SECOND
CREATE TABLE IF NOT EXISTS sides (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  price decimal(10,2),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create menu_item_sides table LAST (after both referenced tables exist)
CREATE TABLE IF NOT EXISTS menu_item_sides (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  side_id uuid REFERENCES sides(id) ON DELETE CASCADE,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(menu_item_id, side_id)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sides_updated_at
  BEFORE UPDATE ON sides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_item_sides_updated_at
  BEFORE UPDATE ON menu_item_sides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
