import { createBrowserClient } from '@supabase/ssr'

function getSupabaseClient() {
  if (typeof window === 'undefined') {
    return null as any;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL and key are required');
    return null as any;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}

export const supabase = getSupabaseClient();