export default function ResetSentNotice({ onGoLogin }) {
  return (
    <div>
      <div className="pb-2.5 pt-5 text-center text-5xl text-[#CC151A]">
        <i className="fas fa-envelope-open-text" />
      </div>
      <div className="mt-4 text-center text-base font-black text-[#1A1A1A]">
        リセットメールを送信しました
      </div>
      <div className="mt-2.5 text-center text-[13px] font-bold leading-[1.8] text-[#888]">
        メールをご確認ください。
        <br />
        メール内のリンクからパスワードを再設定してください。
      </div>
      <button
        type="button"
        onClick={onGoLogin}
        className="mt-5 flex w-full items-center justify-center rounded-lg bg-[#CC151A] px-3 py-3.5 text-[15px] font-bold text-white transition hover:bg-[#A01115]"
      >
        ログインへ
      </button>
    </div>
  );
}
