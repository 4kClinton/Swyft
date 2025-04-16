import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // Accessing the environment variable correctly
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY; // Accessing the environment variable correctly

export const supabase = createClient(supabaseUrl, supabaseKey);
