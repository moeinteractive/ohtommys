-- Create enum for side categories
create type side_category as enum ('Default', 'Premium', 'Special');

-- Create sides table
create table if not exists sides (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category side_category not null,
  price decimal(10,2) default 0.00,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create menu_item_sides table for associations
create table if not exists menu_item_sides (
  id uuid default uuid_generate_v4() primary key,
  menu_item_id uuid references menu_items(id) on delete cascade,
  side_id uuid references sides(id) on delete cascade,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(menu_item_id, side_id)
);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_sides_updated_at
  before update on sides
  for each row
  execute function update_updated_at_column();

create trigger update_menu_item_sides_updated_at
  before update on menu_item_sides
  for each row
  execute function update_updated_at_column();

-- Insert default sides
insert into sides (name, category, price, description) values
  ('Potato Chips', 'Default', 0.00, 'Classic crispy potato chips'),
  ('French Fries', 'Default', 0.00, 'Golden crispy french fries'),
  ('Irish Chips', 'Default', 0.00, 'Traditional thick-cut Irish style chips'),
  ('Sweet Potato Fries', 'Premium', 2.50, 'Crispy sweet potato fries'),
  ('Tater Tots', 'Premium', 2.50, 'Crispy potato tots'),
  ('Onion Rings', 'Premium', 2.50, 'Beer-battered onion rings'),
  ('Side House Salad', 'Premium', 2.50, 'Fresh mixed greens with house dressing'),
  ('Caesar Side Salad', 'Premium', 2.50, 'Classic caesar salad with croutons'),
  ('Seasonal Sides', 'Premium', 2.50, 'Ask your server about our seasonal sides'),
  ('Cottage Cheese', 'Special', 2.00, 'Creamy cottage cheese'),
  ('Coleslaw', 'Special', 2.00, 'House-made creamy coleslaw'),
  ('Wild Grain Rice', 'Special', 2.00, 'Seasoned wild grain rice blend')
on conflict (id) do nothing;
