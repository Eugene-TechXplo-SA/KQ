import { getSupabase } from "./supabaseClient";

export type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  userId: string | null;
  email: string | null;
};

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<AuthPayload> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "ログインに失敗しました。");
  }

  return {
    accessToken: data.session?.access_token ?? "",
    refreshToken: data.session?.refresh_token ?? "",
    userId: data.user?.id ?? null,
    email: data.user?.email ?? null,
  };
}

export async function signupWithEmail(
  email: string,
  password: string,
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new Error(error.message || "アカウント作成に失敗しました。");
  }
}

export function persistAuthSession(payload: AuthPayload): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("kq_auth", JSON.stringify(payload));
}

export function resolvePostLoginRoute(email: string): string {
  if (email.toLowerCase().includes("admin")) {
    return "/dashboard";
  }

  return "/user";
}
