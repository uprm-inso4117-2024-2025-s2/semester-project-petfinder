import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Use expoConfig if manifest is null
const appConfig = Constants.expoConfig || Constants.manifest;

if (!appConfig?.extra?.supabaseUrl || !appConfig?.extra?.supabaseAnonKey) {
  console.error('Supabase URL or anon key not found in config.');
}

const supabaseUrl = appConfig.extra.supabaseUrl;
const supabaseAnonKey = appConfig.extra.supabaseAnonKey;

console.log('supabaseUrl:', supabaseUrl);
console.log('supabaseAnonKey:', supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


/* 
IMPORTANT

Make sure to add this in app.json inside "expo": { }

    "extra": {
      "supabaseUrl": "replace_with_url",
      "supabaseAnonKey": "replace_with_key"
    },

*/