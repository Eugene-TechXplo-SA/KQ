import { supabase } from "./supabaseClient";

export const requireAuth = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};
