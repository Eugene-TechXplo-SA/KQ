"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LoginForm from "./LoginForm";
import { getSupabase } from "../../lib/supabaseClient";

export default function LoginOverlay() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@kingandqueen.io");
  const [password, setPassword] = useState("admin1234");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

 const handleLoginSubmit = async () => {
  if (isSubmitting) return;

  const trimmedEmail = email.trim();
  if (!trimmedEmail || !password) {
    setErrorMessage("メールアドレスとパスワードを入力してください");
    setShowError(true);
    return;
  }

  setIsSubmitting(true);
  setShowError(false);
  setErrorMessage("");

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) throw error;

    try {
      localStorage.setItem("kq_admin_logged_in", "true");
    } catch {}

    router.push("/user");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "ログインに失敗しました";
    setErrorMessage(message);
    setShowError(true);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div
      className="login-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4"
      id="loginOverlay"
    >
      <div className="login-card w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-[0_20px_60px_rgba(15,23,42,0.25)] sm:px-8 sm:py-8">
        <div className="login-brand mb-6 text-center">
          <i
            className="fa-solid fa-chess-king login-brand-icon mb-3 text-3xl text-[#C8A44D]"
            aria-hidden="true"
          ></i>
          <div className="login-brand-title text-[26px] font-black tracking-tight text-slate-900 sm:text-[30px]">
            KING<span className="gold text-[#C8A44D]">and</span>QUEEN
          </div>
          <div className="login-brand-sub mt-1 text-sm font-medium text-slate-500">
            管理コンソール
          </div>
        </div>

        <div className="login-form space-y-4">
          <LoginForm
            emailValue={email}
            passwordValue={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleLoginSubmit}
            showForgot={false}
            submitLabel={isSubmitting ? "ログイン中..." : "ログイン"}
            emailPlaceholder="admin@example.com"
            passwordPlaceholder="パスワード"
            labelClassName="text-sm font-semibold text-slate-700"
            inputClassName="rounded-xl border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#C62828] focus:ring-2 focus:ring-[#C62828]/25"
            submitButtonClassName="rounded-xl bg-[#C62828] px-4 py-3 text-sm font-bold hover:bg-[#A91F1F]"
          />

          <div
            className={`login-error rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 ${showError ? "" : "is-hidden hidden"}`}
            id="loginError"
          >
            {errorMessage || "メールアドレスまたはパスワードが正しくありません"}
          </div>
        </div>
      </div>
    </div>
  );
}
