import { createBrowserClient } from '@supabase/ssr'

let supabaseInstance: any = null;

export function getSupabase() {
  if (typeof window === 'undefined') {
    return null as any;
  }

  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL and key are required', { supabaseUrl, supabaseKey });
    return null as any;
  }

  supabaseInstance = createBrowserClient(supabaseUrl, supabaseKey);
  return supabaseInstance;
}

export const supabase = typeof window !== 'undefined' ? getSupabase() : null as any;