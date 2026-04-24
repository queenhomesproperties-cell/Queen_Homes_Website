/*
  # Admin Setup Helper Function

  Creates a function that can be called to promote a user to admin by their email.
  This is used during initial setup — the site owner registers via Supabase Auth
  then runs: SELECT make_admin('their@email.com');

  Also creates a trigger to auto-update the `updated_at` column on properties.
*/

-- Function to promote a user to admin
CREATE OR REPLACE FUNCTION make_admin(admin_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = admin_email;
  IF target_user_id IS NULL THEN
    RETURN 'User not found. Please sign up first.';
  END IF;
  INSERT INTO admin_users (id, email)
  VALUES (target_user_id, admin_email)
  ON CONFLICT (id) DO UPDATE SET email = admin_email;
  RETURN 'Admin access granted to: ' || admin_email;
END;
$$;

-- Auto-update updated_at on properties
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'set_updated_at' AND event_object_table = 'properties'
  ) THEN
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;
