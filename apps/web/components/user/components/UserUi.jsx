export function cn(...values) {
  return values.filter(Boolean).join(" ");
}

function badgeTone(tone) {
  return (
    {
      success: "border-[#BBF7D0] bg-[#DCFCE7] text-[#166534]",
      warn: "border-[#FDE68A] bg-[#FEF3C7] text-[#92400E]",
      danger: "border-[#FECACA] bg-[#FEE2E2] text-[#991B1B]",
      info: "border-[#DBEAFE] bg-[#EFF6FF] text-[#1E40AF]",
      neutral: "border-[#E5E7EB] bg-[#F3F4F6] text-[#6B7280]",
    }[tone] || "border-[#E5E7EB] bg-[#F3F4F6] text-[#6B7280]"
  );
}

export function UserCard({ title, children, padded = true }) {
  return (
    <section
      className={cn(
        "rounded-[26px] border border-[#E8E1DB] bg-white/95 shadow-[0_10px_28px_rgba(25,21,19,0.06)]",
        padded && "p-5",
      )}
    >
      <div className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#E53935]">
        <span className="h-[3px] w-7 rounded-full bg-[#E53935]" />
        {title}
      </div>
      {children}
    </section>
  );
}

export function StatusPill({ tone, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black",
        badgeTone(tone),
      )}
    >
      {children}
    </span>
  );
}

export function TokenBadge({ asset, compact = false }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-[14px] font-black",
        compact ? "h-9 w-9 text-[10px]" : "h-11 w-11 text-xs",
      )}
      style={{ backgroundColor: asset.color, color: "#fff" }}
    >
      {asset.icon ? (
        <i
          className={cn(
            "fa-solid",
            asset.icon,
            compact ? "text-sm" : "text-base",
          )}
        />
      ) : (
        <span>{asset.label}</span>
      )}
    </div>
  );
}

export function FormField({ label, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-extrabold text-[#6A615B]">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-[18px] border border-[#E8E1DB] bg-[#FCFAF8] px-4 py-3.5 text-sm text-[#191513] outline-none transition focus:border-[#E53935] focus:bg-white"
      />
    </label>
  );
}

export function AuthBrand({ subtitle }) {
  return (
    <div className="mb-6 text-center">
      <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-[24px] bg-[#FFF1F0] text-[30px] text-[#E53935] shadow-[0_10px_28px_rgba(25,21,19,0.06)]">
        <i className="fa-solid fa-chess-king" />
      </div>
      <h1 className="mt-4 text-[28px] font-black tracking-[0.03em] text-[#191513]">
        KING<span className="text-[#E53935]">&amp;</span>QUEEN
      </h1>
      <p className="mt-1 text-sm font-bold text-[#6A615B]">{subtitle}</p>
    </div>
  );
}

export function PrimaryButton({ children, className, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-full bg-[#E53935] px-4 py-3.5 text-sm font-black text-white shadow-[0_12px_24px_rgba(229,57,53,0.24)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-full border border-[#D9CEC5] bg-white px-4 py-3.5 text-sm font-black text-[#191513] shadow-[0_8px_18px_rgba(25,21,19,0.05)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TextAction({ children, className, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "block w-full text-center text-[13px] font-bold text-[#E53935]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function KeyValueRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-[#F1EBE5] py-3 last:border-b-0 last:pb-0 first:pt-0">
      <span className="text-[13px] font-bold text-[#6A615B]">{label}</span>
      <span className="text-right text-[13px] font-black text-[#191513]">
        {value}
      </span>
    </div>
  );
}

export function ApplicationItem({ title, subtitle, pill, meta }) {
  return (
    <div className="rounded-[18px] border border-[#E8E1DB] bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {meta}
          <div className="text-sm font-black text-[#191513]">{title}</div>
          <div className="mt-1 text-[12px] font-bold text-[#A1958D]">
            {subtitle}
          </div>
        </div>
        {pill}
      </div>
    </div>
  );
}

export function BackButton({ label, onClick }) {
  return (
    <SecondaryButton onClick={onClick}>
      <i className="fa-solid fa-chevron-left text-xs" />
      <span>{label}</span>
    </SecondaryButton>
  );
}
