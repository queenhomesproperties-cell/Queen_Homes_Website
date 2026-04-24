import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Property = {
  id: string;
  name: string;
  category: 'land' | 'residential' | 'commercial';
  location: string;
  price: string;
  size: string;
  title_type: string;
  features: string[];
  image_url: string;
  status: 'available' | 'sold' | 'coming_soon';
  badge: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type Enquiry = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  interest: string;
  preferred_date: string | null;
  preferred_time: string;
  session_type: string;
  notes: string;
  status: 'pending' | 'contacted' | 'closed';
  ref_code: string;
  created_at: string;
};
