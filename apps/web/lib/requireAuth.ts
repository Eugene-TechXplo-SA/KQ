import { getSupabase } from "./supabaseClient";

export const requireAuth = async () => {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  return data.session;
};
