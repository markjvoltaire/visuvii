import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://kxctkoaalmhxrbabwkto.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4Y3Rrb2FhbG1oeHJiYWJ3a3RvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODY4ODU4NiwiZXhwIjoyMDQ0MjY0NTg2fQ.IGq9wCblGWzb902gwks49lyVvxQswPVnKXz9Ea2gJKA";
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
});
