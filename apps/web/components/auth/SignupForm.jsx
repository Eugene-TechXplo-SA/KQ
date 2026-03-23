function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export default function SignupForm({
  isAgreed,
  onToggleAgree,
  onSubmit,
  onGoLogin,
  emailValue,
  passwordValue,
  confirmPasswordValue,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  emailPlaceholder = "mail@example.com",
  passwordPlaceholder = "••••••••",
  confirmPasswordPlaceholder = "••••••••",
  submitLabel = "アカウントを作成",
  loginLabel = "既にアカウントをお持ちの方はこちら",
  rootClassName,
  labelClassName,
  inputClassName,
  submitButtonClassName,
  secondaryButtonClassName,
  checkboxButtonClassName,
  checkboxTextClassName,
}) {
  const emailProps = {};
  const passwordProps = {};
  const confirmPasswordProps = {};

  if (emailValue !== undefined) {
    emailProps.value = emailValue;
  }
  if (passwordValue !== undefined) {
    passwordProps.value = passwordValue;
  }
  if (confirmPasswordValue !== undefined) {
    confirmPasswordProps.value = confirmPasswordValue;
  }
  if (onEmailChange) {
    emailProps.onChange = (event) => onEmailChange(event.target.value, event);
  }
  if (onPasswordChange) {
    passwordProps.onChange = (event) =>
      onPasswordChange(event.target.value, event);
  }
  if (onConfirmPasswordChange) {
    confirmPasswordProps.onChange = (event) =>
      onConfirmPasswordChange(event.target.value, event);
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
      <label
        className={joinClasses(
          "mb-1.5 mt-3.5 block text-xs font-bold text-[#666]",
          labelClassName,
        )}
      >
        パスワード（確認）
      </label>
      <input
        type="password"
        placeholder={confirmPasswordPlaceholder}
        className={joinClasses(
          "w-full rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] px-3.5 py-3 text-sm outline-none transition focus:border-[#CC151A]",
          inputClassName,
        )}
        {...confirmPasswordProps}
      />

      <button
        type="button"
        onClick={onToggleAgree}
        className={joinClasses(
          "mt-4 flex items-center gap-2.5 text-left",
          checkboxButtonClassName,
        )}
      >
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded border-2 text-[12px] ${isAgreed ? "border-[#CC151A] bg-[#CC151A] text-white" : "border-[#CCC] text-transparent"}`}
        >
          <i className="fas fa-check" />
        </span>
        <span
          className={joinClasses(
            "text-[13px] font-bold text-[#555]",
            checkboxTextClassName,
          )}
        >
          <span className="text-[#CC151A]">利用規約</span>・
          <span className="text-[#CC151A]">プライバシーポリシー</span>
          に同意する
        </span>
      </button>

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

      <button
        type="button"
        onClick={onGoLogin}
        className={joinClasses(
          "mt-3.5 block w-full text-center text-[13px] font-bold text-[#CC151A] hover:underline",
          secondaryButtonClassName,
        )}
      >
        {loginLabel}
      </button>
    </div>
  );
}
