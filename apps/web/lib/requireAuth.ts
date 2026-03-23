import { getSupabase } from "./supabaseClient";

export const requireAuth = async () => {
  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }
  const { data } = await supabase.auth.getSession();
  return data.session;
};
