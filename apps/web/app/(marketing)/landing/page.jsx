"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordForm from "../../../components/auth/ForgotPasswordForm";
import LoginForm from "../../../components/auth/LoginForm";
import ResetSentNotice from "../../../components/auth/ResetSentNotice";
import SignupForm from "../../../components/auth/SignupForm";
import {
  loginWithEmail,
  persistAuthSession,
  resolvePostLoginRoute,
  signupWithEmail,
} from "../../../lib/authApi";

const faqItems = [
  {
    q: "キングクイーンとはなんですか？",
    a: "KING and QUEENは、海外FX取引を行うユーザーに独自のロイヤリティトークンを付与するリワードプラットフォームです。対象のブローカーで取引を行うだけで、自動的にトークンが貯まります。",
  },
  {
    q: "キングアンドクイーントークンとはなんですか？",
    a: "キングアンドクイーントークンは、KING and QUEENプラットフォームで付与される独自のデジタルトークンです。取引量に応じて付与され、将来的に様々な特典やサービスと交換することができます。",
  },
  {
    q: "トークンはいつ受け取ることになりますか？",
    a: "トークンは対象の海外FXブローカーで取引を行った後、取引量に応じて自動的に付与されます。付与のタイミングはブローカーからの取引データ連携後となります。",
  },
  {
    q: "口座開設するのは何ですか？",
    a: "KING and QUEENと提携している海外FXブローカーの取引口座を開設していただきます。この口座での取引がトークン付与の対象となります。既にお持ちの口座を連携することも可能です。",
  },
];

const screenSubtitle = {
  login: "アカウントにサインイン",
  signup: "新規アカウント作成",
  forgot: "パスワードをお忘れの方",
  resetSent: "パスワードをお忘れの方",
};

export default function LandingPage() {
  const router = useRouter();
  const canvasRef = useRef(null);

  const [openFaq, setOpenFaq] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authScreen, setAuthScreen] = useState("login");
  const [isAgreed, setIsAgreed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtitle = useMemo(() => screenSubtitle[authScreen], [authScreen]);

  useEffect(() => {
    if (!isAuthOpen) return undefined;

    const onEsc = (e) => {
      if (e.key === "Escape") setIsAuthOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [isAuthOpen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const particles = [];
    const count = 60;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    const resetParticles = () => {
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.5,
          dx: (Math.random() - 0.5) * 0.4,
          dy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
    };

    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      raf = requestAnimationFrame(draw);
    };

    resize();
    resetParticles();
    draw();

    const onResize = () => {
      resize();
      resetParticles();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const openAuth = (screen) => {
    setAuthError("");
    setAuthScreen(screen);
    setIsAuthOpen(true);
  };

  const switchAuthScreen = (screen) => {
    setAuthError("");
    setAuthScreen(screen);
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
    setAuthError("");
  };

  const handleLoginSubmit = async () => {
    if (isSubmitting) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setAuthError("メールアドレスとパスワードを入力してください。");
      return;
    }

    setIsSubmitting(true);
    setAuthError("");

    try {
      const payload = await loginWithEmail(trimmedEmail, password);
      persistAuthSession(payload);
      closeAuth();
      router.push(resolvePostLoginRoute(trimmedEmail));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "ログインに失敗しました。しばらくしてから再度お試しください。";
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async () => {
    if (isSubmitting) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setAuthError("メールアドレスとパスワードを入力してください。");
      return;
    }

    if (!isAgreed) {
      setAuthError("利用規約とプライバシーポリシーへの同意が必要です。");
      return;
    }

    if (password !== confirmPassword) {
      setAuthError("確認用パスワードが一致していません。");
      return;
    }

    setIsSubmitting(true);
    setAuthError("");

    try {
      await signupWithEmail(trimmedEmail, password);
      const payload = await loginWithEmail(trimmedEmail, password);
      persistAuthSession(payload);
      closeAuth();
      router.push("/user");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "アカウント作成に失敗しました。しばらくしてから再度お試しください。";
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] antialiased">
      <header className="sticky top-0 z-50 border-b border-[#E0E0E0] bg-white">
        <div className="mx-auto flex h-[60px] w-full max-w-[740px] items-center justify-between px-5">
          <div className="text-base font-medium tracking-[0.02em]">
            <span className="text-[#CC151A]">KING</span> and{" "}
            <span className="text-[#CC151A]">QUEEN</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="inline-flex items-center justify-center rounded-[24px] border border-[#CC151A] px-5 py-2 text-[13px] font-bold text-[#CC151A] transition hover:bg-[#CC151A] hover:text-white"
            >
              ログイン
            </button>
            <button
              type="button"
              onClick={() => openAuth("signup")}
              className="inline-flex items-center justify-center rounded-[24px] border border-[#CC151A] bg-[#CC151A] px-5 py-2 text-[13px] font-bold text-white transition hover:border-[#A01115] hover:bg-[#A01115]"
            >
              新規登録
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#1A1A1A] px-5 pb-20 pt-[100px] text-center">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 h-full w-full"
        />
        <div className="relative z-10 mx-auto max-w-[740px]">
          <div className="mb-7 inline-block rounded bg-[#CC151A] px-3.5 py-1 text-[11px] font-bold tracking-[0.04em] text-white">
            © Yext認定サービス
          </div>
          <h1 className="text-[24px] font-black leading-[1.5] tracking-[0.02em] text-white sm:text-[32px]">
            まだトークン獲得無しで
            <br />
            FXやってるの？
          </h1>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto w-full max-w-[740px] text-center">
          <h2 className="mb-10 flex items-center justify-center gap-2 text-[22px] font-black">
            <span>
              <span className="text-[#CC151A]">KING</span> and{" "}
              <span className="text-[#CC151A]">QUEEN</span>
            </span>
            って、なに？
          </h2>

          <div className="mb-9 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <div className="relative flex h-[200px] w-[160px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#1A237E] to-[#3949AB] text-5xl text-white">
              <i className="fas fa-crown" />
              <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-3.5 z-10 text-[13px] font-bold tracking-[0.06em]">
                KING
              </div>
            </div>
            <div className="relative flex h-[200px] w-[160px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#B71C1C] to-[#E53935] text-5xl text-white">
              <i className="fas fa-crown" />
              <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-3.5 z-10 text-[13px] font-bold tracking-[0.06em]">
                QUEEN
              </div>
            </div>
          </div>

          <div className="mb-9 space-y-4 text-left text-sm leading-[2] text-[#444]">
            <p>
              KING and
              QUEENは、海外FX取引を行うユーザーに対して独自のロイヤリティトークンを付与する、次世代のリワードプラットフォームです。
            </p>
            <p>
              お客様が対象の海外FXブローカーで取引を行うたびに、取引量に応じたトークンが自動的に付与されます。獲得したトークンは将来的に様々な特典と交換することが可能です。
            </p>
            <p>
              面倒な手続きは一切不要。会員登録と口座連携だけで、いつもの取引がそのままリワードに変わります。
            </p>
          </div>

          <button
            type="button"
            onClick={() => openAuth("signup")}
            className="inline-flex items-center gap-1.5 rounded-[30px] bg-[#CC151A] px-9 py-3.5 text-[15px] font-bold text-white transition hover:bg-[#A01115]"
          >
            登録無料はこちら <span>→</span>
          </button>
        </div>
      </section>

      <section className="bg-[#F5F5F5] px-5 py-20">
        <div className="mx-auto w-full max-w-[740px]">
          <h2 className="mb-12 text-center text-[22px] font-black">
            サービス開始までの流れ
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <article className="rounded-2xl bg-white px-6 py-8 text-center">
              <div className="mx-auto mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#CC151A] text-lg font-medium text-white">
                1
              </div>
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-xl bg-[#FFF3E0] text-4xl text-[#E65100]">
                <i className="fas fa-user-plus" />
              </div>
              <h3 className="mb-3 text-base font-bold">
                King and Queen会員登録
              </h3>
              <p className="mb-5 text-[13px] leading-[1.8] text-[#666]">
                まずはKING and
                QUEENの会員登録を行います。メールアドレスと基本情報を入力するだけで簡単に完了します。
              </p>
              <button
                type="button"
                onClick={() => openAuth("signup")}
                className="inline-flex items-center gap-1.5 rounded-[24px] bg-[#CC151A] px-6 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#A01115]"
              >
                会員登録はこちら <span>→</span>
              </button>
            </article>

            <article className="rounded-2xl bg-white px-6 py-8 text-center">
              <div className="mx-auto mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#CC151A] text-lg font-medium text-white">
                2
              </div>
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-xl bg-[#E3F2FD] text-4xl text-[#1565C0]">
                <i className="fas fa-chart-line" />
              </div>
              <h3 className="mb-3 text-base font-bold">海外FX口座開設</h3>
              <p className="mb-5 text-[13px] leading-[1.8] text-[#666]">
                対象の海外FXブローカーで口座を開設し、KING and
                QUEENと連携します。既にお持ちの口座もご利用いただけます。
              </p>
              <button
                type="button"
                onClick={() => openAuth("login")}
                className="inline-flex items-center gap-1.5 rounded-[24px] bg-[#CC151A] px-6 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#A01115]"
              >
                ログインはこちら <span>→</span>
              </button>
            </article>
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto w-full max-w-[740px]">
          <h2 className="mb-10 text-center text-[22px] font-black">
            よくある質問
          </h2>
          <ul className="list-none">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <li
                  key={item.q}
                  className="border-b border-[#E0E0E0] first:border-t"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-5 text-left text-[15px] font-bold text-[#1A1A1A] transition hover:text-[#CC151A]"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    {item.q}
                    <i
                      className={`fas fa-chevron-down ml-4 shrink-0 text-sm text-[#666] transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid overflow-hidden transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-5 text-sm leading-[2] text-[#666]">
                        {item.a}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-[#F5F5F5] px-5 py-[60px]">
        <div className="mx-auto w-full max-w-[740px]">
          <div className="flex flex-wrap items-center justify-center gap-9">
            {["exness", "Fireblocks", "IZAKA-YA", "H&W Sisters"].map(
              (partner) => (
                <div
                  key={partner}
                  className="text-lg font-medium tracking-[0.02em] text-[#999] opacity-70 transition hover:opacity-100"
                >
                  {partner}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#1A1A1A] px-5 pb-8 pt-12 text-white">
        <div className="mx-auto w-full max-w-[740px] text-center">
          <div className="mb-7 text-lg font-medium tracking-[0.02em]">
            <span className="text-[#CC151A]">KING</span> and{" "}
            <span className="text-[#CC151A]">QUEEN</span>
          </div>

          <div className="mb-7 flex flex-wrap items-center justify-center gap-6">
            {[
              "会社概要",
              "お問い合わせフォーム",
              "プライバシーポリシー",
              "利用規約",
            ].map((linkText) => (
              <button
                key={linkText}
                type="button"
                className="text-[13px] text-[#AAA] transition hover:text-white"
              >
                {linkText}
              </button>
            ))}
          </div>

          <div className="mb-8 flex items-center justify-center gap-5">
            {[
              "fab fa-x-twitter",
              "fab fa-telegram-plane",
              "fab fa-youtube",
            ].map((icon) => (
              <button
                key={icon}
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[15px] text-[#AAA] transition hover:bg-[#CC151A] hover:text-white"
              >
                <i className={icon} />
              </button>
            ))}
          </div>

          <div className="text-xs text-[#666]">
            © KING and QUEEN. All rights reserved.
          </div>
        </div>
      </footer>

      <div
        className={`fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-5 ${isAuthOpen ? "" : "pointer-events-none opacity-0"}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeAuth();
        }}
      >
        <div className="relative w-full max-w-[420px] rounded-2xl bg-white px-8 pb-8 pt-10 shadow-2xl transition">
          <button
            type="button"
            className="absolute right-3.5 top-3.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-lg text-[#999] transition hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
            onClick={closeAuth}
          >
            <i className="fas fa-times" />
          </button>

          <div className="mb-7 text-center">
            <i className="fas fa-chess-king text-4xl text-[#CC151A]" />
            <h2 className="mt-2.5 text-xl font-semibold">
              <span className="text-[#CC151A]">KING</span> and{" "}
              <span className="text-[#CC151A]">QUEEN</span>
            </h2>
            <p className="mt-1 text-[13px] font-bold text-[#888]">{subtitle}</p>
          </div>

          {(authScreen === "login" || authScreen === "signup") && (
            <div className="mb-5 flex border-b-2 border-[#E0E0E0]">
              <button
                type="button"
                onClick={() => switchAuthScreen("login")}
                className={`mb-[-2px] flex-1 border-b-2 px-2 py-2.5 text-sm font-bold transition ${authScreen === "login" ? "border-[#CC151A] text-[#CC151A]" : "border-transparent text-[#999]"}`}
              >
                ログイン
              </button>
              <button
                type="button"
                onClick={() => switchAuthScreen("signup")}
                className={`mb-[-2px] flex-1 border-b-2 px-2 py-2.5 text-sm font-bold transition ${authScreen === "signup" ? "border-[#CC151A] text-[#CC151A]" : "border-transparent text-[#999]"}`}
              >
                アカウントを作成
              </button>
            </div>
          )}

          {authScreen === "login" && (
            <LoginForm
              emailValue={email}
              passwordValue={password}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={handleLoginSubmit}
              submitLabel={isSubmitting ? "ログイン中..." : "ログイン"}
              onForgot={() => switchAuthScreen("forgot")}
            />
          )}

          {authScreen === "signup" && (
            <SignupForm
              isAgreed={isAgreed}
              onToggleAgree={() => setIsAgreed((v) => !v)}
              emailValue={email}
              passwordValue={password}
              confirmPasswordValue={confirmPassword}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onSubmit={handleSignupSubmit}
              submitLabel={isSubmitting ? "作成中..." : "アカウントを作成"}
              onGoLogin={() => switchAuthScreen("login")}
            />
          )}

          {authScreen === "forgot" && (
            <ForgotPasswordForm
              onSubmit={() => switchAuthScreen("resetSent")}
              onBackToLogin={() => switchAuthScreen("login")}
            />
          )}

          {authScreen === "resetSent" && (
            <ResetSentNotice onGoLogin={() => switchAuthScreen("login")} />
          )}

          {authError ? (
            <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] font-bold text-rose-700">
              {authError}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
