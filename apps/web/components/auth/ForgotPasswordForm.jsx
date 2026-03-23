function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export default function ForgotPasswordForm({
  onSubmit,
  onBackToLogin,
  emailValue,
  onEmailChange,
  rootClassName,
  labelClassName,
  inputClassName,
  submitButtonClassName,
  secondaryButtonClassName,
}) {
  const emailProps = {};

  if (emailValue !== undefined) {
    emailProps.value = emailValue;
  }
  if (onEmailChange) {
    emailProps.onChange = (event) => onEmailChange(event.target.value, event);
  }

  return (
    <div className={rootClassName}>
      <label
        className={joinClasses(
          "mb-1.5 mt-0 block text-xs font-bold text-[#666]",
          labelClassName,
        )}
      >
        登録メールアドレス
      </label>
      <input
        type="email"
        placeholder="mail@example.com"
        className={joinClasses(
          "w-full rounded-lg border border-[#E0E0E0] bg-[#FAFAFA] px-3.5 py-3 text-sm outline-none transition focus:border-[#CC151A]",
          inputClassName,
        )}
        {...emailProps}
      />
      <button
        type="button"
        onClick={onSubmit}
        className={joinClasses(
          "mt-5 flex w-full items-center justify-center rounded-lg bg-[#CC151A] px-3 py-3.5 text-[15px] font-bold text-white transition hover:bg-[#A01115]",
          submitButtonClassName,
        )}
      >
        リセットメールを送信
      </button>
      <button
        type="button"
        onClick={onBackToLogin}
        className={joinClasses(
          "mt-3.5 block w-full text-center text-[13px] font-bold text-[#CC151A] hover:underline",
          secondaryButtonClassName,
        )}
      >
        ログインに戻る
      </button>
    </div>
  );
}
