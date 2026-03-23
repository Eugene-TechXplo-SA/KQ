import { useState } from "react";

import ForgotPasswordForm from "../../auth/ForgotPasswordForm";
import LoginForm from "../../auth/LoginForm";
import ResetSentNotice from "../../auth/ResetSentNotice";
import SignupForm from "../../auth/SignupForm";
import { AuthBrand, cn } from "./UserUi";

export default function UserAuthScreen({ authMode, setAuthMode, onSubmit }) {
  const [isAgreed, setIsAgreed] = useState(false);

  if (authMode === "forgot") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] rounded-[30px] bg-white/95 p-6 shadow-[0_24px_60px_rgba(25,21,19,0.12)]">
          <AuthBrand subtitle="パスワードをお忘れの方" />
          <ForgotPasswordForm
            inputClassName="rounded-[18px] border-[#E8E1DB] bg-[#FCFAF8] px-4 py-3.5 text-[#191513] focus:border-[#E53935]"
            submitButtonClassName="rounded-full bg-[#E53935] px-4 py-3.5 text-sm font-black shadow-[0_12px_24px_rgba(229,57,53,0.24)] hover:bg-[#C62828]"
            secondaryButtonClassName="text-[#E53935]"
            onSubmit={() => setAuthMode("reset")}
            onBackToLogin={() => setAuthMode("signin")}
          />
        </div>
      </div>
    );
  }

  if (authMode === "reset") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] rounded-[30px] bg-white/95 p-6 text-center shadow-[0_24px_60px_rgba(25,21,19,0.12)]">
          <AuthBrand subtitle="パスワードをお忘れの方" />
          <ResetSentNotice onGoLogin={() => setAuthMode("signin")} />
        </div>
      </div>
    );
  }

  const isSignup = authMode === "signup";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px] rounded-[32px] bg-white/95 p-6 shadow-[0_24px_60px_rgba(25,21,19,0.12)]">
        <AuthBrand
          subtitle={isSignup ? "新規アカウント作成" : "アカウントにサインイン"}
        />

        <div className="mb-5 flex rounded-full bg-[#F4EFE9] p-1">
          <button
            type="button"
            onClick={() => setAuthMode("signin")}
            className={cn(
              "flex-1 rounded-full px-4 py-2.5 text-sm font-extrabold transition",
              !isSignup
                ? "bg-white text-[#E53935] shadow-sm"
                : "text-[#A1958D]",
            )}
          >
            ログイン
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("signup")}
            className={cn(
              "flex-1 rounded-full px-4 py-2.5 text-sm font-extrabold transition",
              isSignup ? "bg-white text-[#E53935] shadow-sm" : "text-[#A1958D]",
            )}
          >
            アカウントを作成
          </button>
        </div>

        {isSignup ? (
          <SignupForm
            isAgreed={isAgreed}
            onToggleAgree={() => setIsAgreed((current) => !current)}
            onSubmit={onSubmit}
            onGoLogin={() => setAuthMode("signin")}
            inputClassName="rounded-[18px] border-[#E8E1DB] bg-[#FCFAF8] px-4 py-3.5 text-[#191513] focus:border-[#E53935]"
            submitButtonClassName="rounded-full bg-[#E53935] px-4 py-3.5 text-sm font-black shadow-[0_12px_24px_rgba(229,57,53,0.24)] hover:bg-[#C62828]"
            secondaryButtonClassName="text-[#E53935]"
            checkboxTextClassName="leading-5 text-[#6A615B]"
          />
        ) : (
          <LoginForm
            onSubmit={onSubmit}
            onForgot={() => setAuthMode("forgot")}
            inputClassName="rounded-[18px] border-[#E8E1DB] bg-[#FCFAF8] px-4 py-3.5 text-[#191513] focus:border-[#E53935]"
            submitButtonClassName="rounded-full bg-[#E53935] px-4 py-3.5 text-sm font-black shadow-[0_12px_24px_rgba(229,57,53,0.24)] hover:bg-[#C62828]"
            forgotButtonClassName="text-[#E53935]"
          />
        )}
      </div>
    </div>
  );
}
