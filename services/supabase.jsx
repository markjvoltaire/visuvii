import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://kxctkoaalmhxrbabwkto.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4Y3Rrb2FhbG1oeHJiYWJ3a3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg2ODg1ODYsImV4cCI6MjA0NDI2NDU4Nn0.Gp23tHLozt3l0vgiSnTamijsmWjooVvoe5mvsxeNi1k";
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
});
