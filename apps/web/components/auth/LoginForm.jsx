function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export default function LoginForm({
  onSubmit,
  onForgot,
  emailValue,
  passwordValue,
  onEmailChange,
  onPasswordChange,
  emailPlaceholder = "mail@example.com",
  passwordPlaceholder = "••••••••",
  submitLabel = "ログイン",
  forgotLabel = "パスワードをお忘れの方",
  showForgot = true,
  rootClassName,
  labelClassName,
  inputClassName,
  submitButtonClassName,
  forgotButtonClassName,
}) {
  const emailProps = {};
  const passwordProps = {};

  if (emailValue !== undefined) {
    emailProps.value = emailValue;
  }
  if (passwordValue !== undefined) {
    passwordProps.value = passwordValue;
  }
  if (onEmailChange) {
    emailProps.onChange = (event) => onEmailChange(event.target.value, event);
  }
  if (onPasswordChange) {
    passwordProps.onChange = (event) =>
      onPasswordChange(event.target.value, event);
  }

  return (
    <div className={rootClassName}>
      <label
        className={joinClasses(
          "mb-1.5 mt-0 block text-xs font-bold text-[#666]",
          labelClassName,
        )}
      >
        メールアドレス
      </label>
      <input
        type="email"
        placeholder={emailPlaceholder}
        className={joinClasses(
          "w-full rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] px-3.5 py-3 text-sm outline-none transition focus:border-[#CC151A]",
          inputClassName,
        )}
        {...emailProps}
      />
      <label
        className={joinClasses(
          "mb-1.5 mt-3.5 block text-xs font-bold text-[#666]",
          labelClassName,
        )}
      >
        パスワード
      </label>
      <input
        type="password"
        placeholder={passwordPlaceholder}
        className={joinClasses(
          "w-full rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] px-3.5 py-3 text-sm outline-none transition focus:border-[#CC151A]",
          inputClassName,
        )}
        {...passwordProps}
      />
      <button
        type="button"
        onClick={onSubmit}
        className={joinClasses(
          "mt-5 flex w-full items-center justify-center rounded-lg bg-[#CC151A] px-3 py-3.5 text-[15px] font-bold text-white transition hover:bg-[#A01115]",
          submitButtonClassName,
        )}
      >
        {submitLabel}
      </button>
      {showForgot ? (
        <button
          type="button"
          onClick={onForgot}
          className={joinClasses(
            "mt-3.5 block w-full text-center text-[13px] font-bold text-[#CC151A] hover:underline",
            forgotButtonClassName,
          )}
        >
          {forgotLabel}
        </button>
      ) : null}
    </div>
  );
}
