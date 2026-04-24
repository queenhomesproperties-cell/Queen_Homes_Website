/*
  # Queen Homes & Properties — Full Schema

  Creates admin_users first (referenced by other policies), then properties and enquiries.

  1. Tables: admin_users, properties, enquiries
  2. RLS on all tables with appropriate policies
  3. Seed data for initial properties
*/

-- ADMIN USERS TABLE (must exist before property/enquiry policies reference it)
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view own record"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'land',
  location text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  size text NOT NULL DEFAULT '',
  title_type text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  image_url text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'available',
  badge text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view all properties"
  ON properties FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can insert properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Admin can update properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admin can delete properties"
  ON properties FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  interest text NOT NULL DEFAULT '',
  preferred_date date,
  preferred_time text NOT NULL DEFAULT '',
  session_type text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  ref_code text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an enquiry"
  ON enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view all enquiries"
  ON enquiries FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admin can update enquiry status"
  ON enquiries FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admin can delete enquiries"
  ON enquiries FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- SEED DEFAULT PROPERTIES
INSERT INTO properties (name, category, location, price, size, title_type, features, image_url, status, badge, description)
VALUES
  ('Queen Gardens Phase I', 'land', 'Akala Express Area, Ibadan', '₦4,500,000', '500 sqm', 'C of O', ARRAY['Fenced Estate', 'Good Road', 'Drainage'], 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', 'available', 'hot', 'Premium estate land in a fenced and well-planned layout along Akala Express. Clean C of O title, all infrastructure in place.'),
  ('Royal Crest Plots', 'land', 'Tipper Garage Way, Ibadan', '₦2,800,000', '300 sqm', 'Survey Plan', ARRAY['Water Supply', 'Accessible Road', 'Near Market'], 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'available', 'new', 'Affordable serviced plots with water supply and all-season road access. Perfect for residential development.'),
  ('Queen Villa — 4 Bed Duplex', 'residential', 'Oluyole Extension, Ibadan', '₦45,000,000', '4 Bedrooms', 'C of O', ARRAY['4 Bedrooms', '3 Bathrooms', 'Parking', 'BQ', 'Solar Backup'], 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', 'available', 'new', 'Stunning 4-bedroom duplex in the heart of Oluyole Extension. Premium finishes, solar backup, and spacious living areas.'),
  ('Sovereign Court — 3 Bed Flat', 'residential', 'Ring Road, Ibadan', '₦28,000,000', '3 Bedrooms', 'C of O', ARRAY['3 Bedrooms', '2 Bathrooms', 'Gated', 'Borehole', '24hr Security'], 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', 'available', 'hot', 'Secure gated flat in a premium Ring Road location. 24-hour security, borehole water supply, and excellent road access.'),
  ('Queen Commercial Hub', 'commercial', 'Challenge Area, Ibadan', '₦85,000,000', '1,000 sqm', 'C of O', ARRAY['Main Road Access', 'C of O Title', 'High Traffic Zone', 'Water & Power'], 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', 'available', 'new', 'Premium commercial land on a high-traffic main road at Challenge. Ideal for retail, office, or mixed-use development.');
