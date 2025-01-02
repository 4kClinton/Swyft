import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // Accessing the environment variable correctly
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY; // Accessing the environment variable correctly

console.log(supabaseUrl); // Check if the URL is being printed correctly
console.log(supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey);
