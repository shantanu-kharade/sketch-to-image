import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase project settings > API
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://jgakomtgmxztyptietmc.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWtvbXRnbXh6dHlwdGlldG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NTQ5MjYsImV4cCI6MjA1ODAzMDkyNn0.jPPEd5DWdye5vrn6bYDjtm8XdPmgbuN_dJDfxnZsUY4';

if (!supabaseUrl) {
  console.error('Missing REACT_APP_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error('Missing REACT_APP_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 