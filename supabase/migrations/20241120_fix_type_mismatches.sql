-- Create menu_category enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE menu_category AS ENUM (
        'Appetizers',
        'Homemade Soups & Salads',
        'Entrees',
        'Sandwiches, Wraps & Burgers',
        'Kids Corner',
        'Desserts'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create side_category enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE side_category AS ENUM (
        'Default',
        'Premium',
        'Special'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create menu_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS menu_items (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    price text, -- Changed from decimal to text to match TypeScript type
    day day_of_week NOT NULL,
    category menu_category NOT NULL,
    is_special boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create menu_item_sizes table if it doesn't exist
CREATE TABLE IF NOT EXISTS menu_item_sizes (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
    size_name text NOT NULL,
    price text NOT NULL, -- Changed from decimal to text to match TypeScript type
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create menu_item_extras table if it doesn't exist
CREATE TABLE IF NOT EXISTS menu_item_extras (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
    extra_name text NOT NULL,
    price text NOT NULL, -- Changed from decimal to text to match TypeScript type
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create sides table if it doesn't exist
CREATE TABLE IF NOT EXISTS sides (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    category side_category NOT NULL,
    price text, -- Changed from decimal to text to match TypeScript type
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create menu_item_sides table if it doesn't exist
CREATE TABLE IF NOT EXISTS menu_item_sides (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
    side_id uuid REFERENCES sides(id) ON DELETE CASCADE,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(menu_item_id, side_id)
);

-- Create or replace triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language plpgsql;

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_item_sizes_updated_at ON menu_item_sizes;
CREATE TRIGGER update_menu_item_sizes_updated_at
    BEFORE UPDATE ON menu_item_sizes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_item_extras_updated_at ON menu_item_extras;
CREATE TRIGGER update_menu_item_extras_updated_at
    BEFORE UPDATE ON menu_item_extras
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sides_updated_at ON sides;
CREATE TRIGGER update_sides_updated_at
    BEFORE UPDATE ON sides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_item_sides_updated_at ON menu_item_sides;
CREATE TRIGGER update_menu_item_sides_updated_at
    BEFORE UPDATE ON menu_item_sides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
