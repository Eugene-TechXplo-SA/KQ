import { createClient } from "@supabase/supabase-js";
import { getEnv } from "../utils/env";

const supabaseUrl = getEnv("SUPABASE_URL");
const supabaseServiceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
