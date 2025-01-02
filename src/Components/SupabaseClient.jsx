import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = "https://gtevlsbundbddlqqslbf.supabase.co"; // Replace with your Supabase URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZXZsc2J1bmRiZGRscXFzbGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MDE3MTEsImV4cCI6MjA1MTM3NzcxMX0.K0j3QjXqb-WZ3bOf8jlSDcmjV68OMYKet4_xf52kNXM"; // Replace with your Supabase anonymous key
export const supabase = createClient(supabaseUrl, supabaseKey);
