import { createClient } from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = "https://mvkgemlgekzvqztmnisv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12a2dlbWxnZWt6dnF6dG1uaXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMTA0NzAsImV4cCI6MjA1NDY4NjQ3MH0.5wCQ36IbPi3E9AeGWy7G4771N5tS_rjBUDZnu7-gT-U";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }
});