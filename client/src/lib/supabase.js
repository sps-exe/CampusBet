// Supabase client — single instance shared across the whole app.
// Credentials are loaded from .env.local (never hardcode these).
import { createClient } from '@supabase/supabase-js';

const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Flag so components can show "configure Supabase" UI instead of crashing
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️  Supabase env vars missing.\n' +
    'Create a file called .env.local in the client/ folder with:\n' +
    '  VITE_SUPABASE_URL=https://xxxx.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=your-anon-key\n' +
    'Then restart the dev server (npm run dev).'
  );
}

// Use placeholder values so createClient() never throws even without .env.local.
// All API calls will fail with a network error (not a JS crash), which is handled
// gracefully in the stores and hooks below.
export const supabase = createClient(
  supabaseUrl    || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
