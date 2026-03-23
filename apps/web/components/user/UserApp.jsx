"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const assets = [
  {
    symbol: "KQ",
    label: "KQ",
    balance: "9,999",
    jpy: "≈ ¥9,999",
    color: "#C62828",
    icon: "fa-coins",
  },
  {
    symbol: "BTC",
    label: "BTC",
    balance: "0.0500",
    jpy: "≈ ¥760,000",
    color: "#F7931A",
    icon: "fa-bitcoin",
  },
  {
    symbol: "ETH",
    label: "ETH",
    balance: "0.8000",
    jpy: "≈ ¥464,000",
    color: "#627EEA",
    icon: "fa-diamond",
  },
  {
    symbol: "USDT",
    label: "USDT",
    balance: "500",
    jpy: "≈ ¥77,500",
    color: "#26A17B",
    icon: "fa-dollar-sign",
  },
  {
    symbol: "XRP",
    label: "XRP",
    balance: "200",
    jpy: "≈ ¥17,000",
    color: "#23292F",
    icon: "fa-bolt",
  },
  {
    symbol: "USDC",
    label: "USDC",
    balance: "300",
    jpy: "≈ ¥46,500",
    color: "#2775CA",
    icon: "fa-circle-dollar-to-slot",
  },
  {
    symbol: "JPYR",
    label: "JPYR",
    balance: "15,000",
    jpy: "≈ ¥15,000",
    color: "#DC2626",
    icon: null,
  },
  {
    symbol: "JPYC",
    label: "JPYC",
    balance: "8,000",
    jpy: "≈ ¥8,000",
    color: "#3B82F6",
    icon: null,
  },
  {
    symbol: "IZAKAYA",
    label: "IZA",
    balance: "1,200",
    jpy: "≈ ¥6,000",
    color: "#8B5CF6",
    icon: null,
  },
];

const assetComposition = [28, 22, 13, 7, 5, 9, 6, 6, 4];

const brokers = [
  {
    code: "XM",
    name: "XM Trading",
    accent: "#111827",
    account: "·· 256558",
    label: "既存の口座A",
  },
  {
    code: "GT",
    name: "FX GT",
    accent: "#7E22CE",
    account: "·· 029384",
    label: "既存の口座B",
  },
  {
    code: "Ex",
    name: "Exness",
    accent: "#FACC15",
    account: "·· 201991",
    label: "既存の口座C",
    darkText: true,
  },
  { code: "IC", name: "IC Markets", accent: "#1D4ED8" },
  { code: "AX", name: "AXIORY", accent: "#0F172A" },
  { code: "HF", name: "HFM (HotForex)", accent: "#DC2626" },
  { code: "VT", name: "Vantage", accent: "#059669" },
  { code: "FP", name: "FxPro", accent: "#7C3AED" },
  { code: "PP", name: "Pepperstone", accent: "#111827" },
  { code: "FM", name: "FP Markets", accent: "#0EA5E9" },
  { code: "TF", name: "Titan FX", accent: "#334155" },
];

const initialAnnouncements = [
  {
    title: "サービス開始のお知らせ",
    date: "2026/2/20",
    body: "KING and QUEENのサービスを正式にリリースしました。海外FXの取引でKQトークンが貯まる新しい体験をお楽しみください。",
    tags: [
      { label: "アップデート", tone: "success" },
      { label: "重要", tone: "danger" },
    ],
    priority: true,
    read: false,
  },
  {
    title: "メンテナンスのお知らせ",
    date: "2026/2/22",
    body: "2月25日 0:00〜6:00 にシステムメンテナンスを実施します。メンテナンス中はサービスをご利用いただけません。",
    tags: [{ label: "メンテナンス", tone: "warn" }],
    read: false,
  },
  {
    title: "KQトークン付与率UPキャンペーン",
    date: "2026/2/23",
    body: "3月1日〜3月31日の期間中、全ブローカーのKQトークン付与率が1.5倍になります。",
    tags: [{ label: "キャンペーン", tone: "info" }],
    read: false,
  },
  {
    title: "ランクシステムについて",
    date: "2026/2/24",
    body: "Member / Silver / Gold の3段階ランクを導入しました。取引量に応じて倍率や手数料優遇が変わります。",
    tags: [{ label: "アップデート", tone: "success" }],
    read: false,
  },
  {
    title: "セキュリティアップデート",
    date: "2026/2/25",
    body: "二段階認証の強化を行いました。より安全にサービスをご利用いただけます。",
    tags: [{ label: "その他", tone: "neutral" }],
    read: false,
  },
];

const rankConfig = {
  bronze: {
    name: "Member",
    short: "Member",
    icon: "fa-shield-alt",
    color: "#92400E",
    bg: "#FEF3C7",
    progress: 42,
    points: "4,200 pt",
    subtitle: "Next: Silver まであと 5,800 pt",
    benefitRate: "x1.00",
    benefitFee: "優遇なし",
    nextLine: "次のランク（Silver）",
    nextValue: "$50,000",
    currentValue: "$0",
  },
  silver: {
    name: "Silver",
    short: "Silver",
    icon: "fa-gem",
    color: "#9CA3AF",
    bg: "#F3F4F6",
    progress: 32,
    points: "16,800 pt",
    subtitle: "Next: Gold まであと 33,200 pt",
    benefitRate: "x1.20",
    benefitFee: "手数料 -25%",
    nextLine: "次のランク（Gold）",
    nextValue: "$200,000",
    currentValue: "$50,000",
  },
  gold: {
    name: "Gold",
    short: "Gold",
    icon: "fa-crown",
    color: "#D97706",
    bg: "#FFFBEB",
    progress: 100,
    points: "73,500 pt",
    subtitle: "MAX RANK",
    benefitRate: "x1.50",
    benefitFee: "手数料 -50%",
    nextLine: "次のランク",
    nextValue: "達成済み",
    currentValue: "$200,000",
  },
};

const payoutAssetDefaults = {
  KQ: "9,999 KQ",
  BTC: "0.0500 BTC",
  ETH: "0.8000 ETH",
  USDT: "500 USDT",
  XRP: "200 XRP",
  USDC: "300 USDC",
  JPYR: "15,000 JPYR",
  JPYC: "8,000 JPYC",
  IZAKAYA: "1,200 IZAKAYA",
};

const rewardItems = [
  {
    date: "2026/3/1",
    type: "付与",
    tone: "success",
    value: "+1,200 KQ / +0.005 BTC / +0.08 ETH",
    ref: "BATCH-2026-03",
  },
  {
    date: "2026/2/1",
    type: "付与",
    tone: "success",
    value: "+800 KQ / +100 USDT / +50 USDC",
    ref: "BATCH-2026-02",
  },
  {
    date: "2026/2/15",
    type: "出金",
    tone: "neutral",
    value: "-200 USDT",
    ref: "WITHDRAW-001",
  },
  {
    date: "2026/1/20",
    type: "調整",
    tone: "info",
    value: "+5,000 JPYR",
    ref: "ADJ-001",
  },
  {
    date: "2026/1/1",
    type: "付与",
    tone: "success",
    value: "+500 KQ / +300 IZAKAYA / +3,000 JPYC",
    ref: "BATCH-2026-01",
  },
];

function cn(...values) {
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

function UserCard({ title, children, padded = true }) {
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

function StatusPill({ tone, children }) {
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

function TokenBadge({ asset, compact = false }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-[14px] font-black",
        compact ? "h-9 w-9 text-[10px]" : "h-11 w-11 text-xs",
      )}
      style={{
        backgroundColor: asset.color,
        color:
          asset.symbol === "IZAKAYA" || asset.symbol === "JPYC"
            ? "#fff"
            : asset.symbol === "JPYR"
              ? "#fff"
              : "#fff",
      }}
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

function FormField({ label, type = "text", placeholder }) {
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

function UserApp() {
  const router = useRouter();
  const [page, setPage] = useState("dashboard");
  const [announcements, setAnnouncements] = useState(
    initialAnnouncements.map((item, index) => ({ ...item, open: index === 0 })),
  );
  const [selectedRank, setSelectedRank] = useState("bronze");
  const [kycState, setKycState] = useState("approved");
  const [selectedPayoutAsset, setSelectedPayoutAsset] = useState("KQ");
  const [showPayoutHistory, setShowPayoutHistory] = useState(false);
  const [payoutHistoryState, setPayoutHistoryState] = useState("pending");

  const unreadCount = useMemo(
    () => announcements.filter((announcement) => !announcement.read).length,
    [announcements],
  );

  const activeRank = rankConfig[selectedRank];

  const donutStyle = useMemo(() => {
    let cursor = 0;
    const stops = assets.map((asset, index) => {
      const start = cursor;
      const end = cursor + assetComposition[index];
      cursor = end;
      return `${asset.color} ${start}% ${end}%`;
    });
    return {
      background: `conic-gradient(${stops.join(", ")})`,
    };
  }, []);

  const menuSubPages = [
    "profile",
    "wallet",
    "payout",
    "rewardHistory",
    "menuRank",
    "accountSettings",
    "kyc",
    "history",
  ];

  const navigateTo = (nextPage) => {
    setPage(nextPage);
    if (nextPage === "payout") {
      setShowPayoutHistory(false);
    }
  };

  const toggleAnnouncement = (index) => {
    setAnnouncements((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, open: !item.open, read: true } : item,
      ),
    );
  };

  const renderDashboard = () => (
    <div className="space-y-4">
      <UserCard title="アセット構成">
        <div className="flex items-center gap-4">
          <div
            className="relative h-36 w-36 shrink-0 rounded-full"
            style={donutStyle}
          >
            <div className="absolute inset-[18px] rounded-full bg-white" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#A1958D]">
                Total
              </span>
              <span className="mt-1 text-[22px] font-black text-[#191513]">
                100%
              </span>
            </div>
          </div>
          <div className="grid flex-1 gap-2">
            {assets.map((asset) => (
              <div
                key={asset.symbol}
                className="flex items-center gap-2 text-[12px] font-bold text-[#6A615B]"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: asset.color }}
                />
                <span className="w-11 text-[#6A615B]">{asset.symbol}</span>
                <span className="text-[#191513]">{asset.balance}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
          {assets.map((asset, index) => (
            <div
              key={asset.symbol}
              className="min-w-[46px] shrink-0 text-center"
            >
              <div className="mx-auto flex h-[118px] w-8 items-end rounded-[18px] bg-[#F4EFE9] p-1">
                <div
                  className="w-full rounded-[14px]"
                  style={{
                    height: `${Math.max(assetComposition[index] * 3, 16)}px`,
                    backgroundColor: asset.color,
                  }}
                />
              </div>
              <div className="mt-2 text-[10px] font-black text-[#191513]">
                {asset.balance}
              </div>
              <div className="mt-1 text-[11px] font-bold text-[#A1958D]">
                {asset.symbol}
              </div>
            </div>
          ))}
        </div>
      </UserCard>

      <UserCard title="保有アセット">
        <div className="space-y-3">
          {assets.map((asset) => (
            <div
              key={asset.symbol}
              className="flex items-center gap-3 border-b border-[#F1EBE5] pb-3 last:border-b-0 last:pb-0"
            >
              <TokenBadge asset={asset} compact />
              <div>
                <div className="text-sm font-black text-[#191513]">
                  {asset.symbol}
                </div>
                <div className="text-[11px] font-bold text-[#A1958D]">
                  {asset.jpy}
                </div>
              </div>
              <div className="ml-auto text-right text-sm font-black text-[#191513]">
                {asset.balance}
              </div>
            </div>
          ))}
        </div>
      </UserCard>

      <UserCard title="ランク">
        <div className="flex items-start justify-between gap-2">
          {Object.entries(rankConfig).map(([key, rank], index) => {
            const active = selectedRank === key;
            return (
              <div key={key} className="flex flex-1 items-center">
                <button
                  type="button"
                  onClick={() => setSelectedRank(key)}
                  className="flex flex-col items-center gap-2"
                >
                  <span
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full border bg-white transition",
                      active ? "scale-110 border-2" : "border-[#D1D5DB]",
                    )}
                    style={{
                      borderColor: active ? rank.color : undefined,
                      backgroundColor: active ? rank.bg : undefined,
                    }}
                  >
                    <i
                      className={cn("fa-solid", rank.icon)}
                      style={{ color: active ? rank.color : "#D1D5DB" }}
                    />
                  </span>
                  <span
                    className="text-[11px] font-extrabold"
                    style={{ color: active ? rank.color : "#A1958D" }}
                  >
                    {rank.short}
                  </span>
                </button>
                {index < 2 ? (
                  <span className="mx-2 mt-5 h-[2px] flex-1 rounded-full bg-[#E5E7EB]" />
                ) : null}
              </div>
            );
          })}
        </div>

        <div
          className="mt-4 rounded-[24px] border p-4 shadow-[0_16px_36px_rgba(25,21,19,0.08)]"
          style={{
            borderColor: `${activeRank.color}55`,
            backgroundColor: activeRank.bg,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: activeRank.color }}
            >
              <i className={cn("fa-solid", activeRank.icon)} />
            </div>
            <div>
              <div
                className="text-[18px] font-black"
                style={{ color: activeRank.color }}
              >
                {activeRank.name}
              </div>
              <div className="text-xs font-bold text-[#6A615B]">
                {activeRank.subtitle}
              </div>
            </div>
          </div>

          <div className="mt-4 h-2.5 rounded-full bg-white/70">
            <div
              className="h-full rounded-full"
              style={{
                width: `${activeRank.progress}%`,
                backgroundColor: activeRank.color,
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-black text-[#6A615B]">
            <span>{activeRank.points}</span>
            <span>{activeRank.progress}%</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div
              className="rounded-[18px] p-3 text-center"
              style={{ backgroundColor: `${activeRank.color}22` }}
            >
              <i
                className="fa-solid fa-bolt text-sm"
                style={{ color: activeRank.color }}
              />
              <div className="mt-2 text-[11px] font-bold text-[#6A615B]">
                付与レート
              </div>
              <div
                className="mt-1 text-sm font-black"
                style={{ color: activeRank.color }}
              >
                {activeRank.benefitRate}
              </div>
            </div>
            <div
              className="rounded-[18px] p-3 text-center"
              style={{ backgroundColor: `${activeRank.color}22` }}
            >
              <i
                className="fa-solid fa-percentage text-sm"
                style={{ color: activeRank.color }}
              />
              <div className="mt-2 text-[11px] font-bold text-[#6A615B]">
                手数料
              </div>
              <div
                className="mt-1 text-sm font-black"
                style={{ color: activeRank.color }}
              >
                {activeRank.benefitFee}
              </div>
            </div>
          </div>
        </div>
      </UserCard>
    </div>
  );

  const renderOnboarding = () => (
    <div className="space-y-4">
      <UserCard title="口座">
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
          {brokers.slice(0, 3).map((broker) => (
            <button
              key={broker.name}
              type="button"
              onClick={() => navigateTo("notifications")}
              className="flex min-h-[160px] w-[220px] shrink-0 flex-col rounded-[24px] border border-[#E8E1DB] bg-[linear-gradient(180deg,#FFFFFF_0%,#FBF7F3_100%)] p-4 text-left shadow-[0_10px_28px_rgba(25,21,19,0.06)]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-[14px] text-sm font-black"
                  style={{
                    backgroundColor: broker.accent,
                    color: broker.darkText ? "#111827" : "#fff",
                  }}
                >
                  {broker.code}
                </div>
                <div className="text-[16px] font-black text-[#374151]">
                  {broker.name}
                </div>
              </div>
              <div className="mt-auto pt-5">
                <div className="flex items-center gap-2 text-[13px] font-bold text-[#A1958D]">
                  <i className="fa-solid fa-building-columns text-[12px]" />
                  {broker.account}
                </div>
                <div className="mt-1 text-[18px] font-black text-[#191513]">
                  {broker.label}
                </div>
              </div>
            </button>
          ))}
          <button
            type="button"
            onClick={() => navigateTo("brokerPicker")}
            className="flex min-h-[160px] w-[220px] shrink-0 flex-col justify-center rounded-[24px] border border-dashed border-[#D9CEC5] bg-white p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-[#D1D5DB] text-[#A1958D]">
                <i className="fa-solid fa-plus" />
              </div>
              <div className="text-[18px] font-black text-[#374151]">New</div>
            </div>
            <p className="mt-4 text-[12px] font-bold leading-5 text-[#A1958D]">
              新しいブローカー口座を追加してKQトークンを獲得しましょう。
            </p>
          </button>
        </div>
      </UserCard>

      <SecondaryButton onClick={() => navigateTo("notifications")}>
        <i className="fa-solid fa-clipboard-check text-sm" />
        <span>申請状況を確認</span>
      </SecondaryButton>
    </div>
  );

  const renderBrokerPicker = () => (
    <UserCard title="口座を追加">
      <input
        className="w-full rounded-[18px] border border-[#E8E1DB] bg-[#FCFAF8] px-4 py-3 text-sm text-[#191513] outline-none"
        placeholder="業者を検索（例: XM）"
      />
      <div className="mt-3 divide-y divide-[#F3F4F6]">
        {brokers.map((broker) => (
          <button
            key={broker.name}
            type="button"
            onClick={() => navigateTo("brokerOpen")}
            className="flex w-full items-center gap-3 py-3 text-left"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[14px] text-xs font-black"
              style={{
                backgroundColor: broker.accent,
                color: broker.darkText ? "#111827" : "#fff",
              }}
            >
              {broker.code}
            </div>
            <div className="flex-1 text-sm font-black text-[#191513]">
              {broker.name}
            </div>
            <i className="fa-solid fa-chevron-right text-xs text-[#A1958D]" />
          </button>
        ))}
      </div>
      <SecondaryButton
        className="mt-3"
        onClick={() => navigateTo("onboarding")}
      >
        戻る
      </SecondaryButton>
    </UserCard>
  );

  const renderBrokerOpen = () => (
    <UserCard title="口座開設">
      <div className="flex items-center gap-3 rounded-[18px] bg-[#FCFAF8] p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#111827] text-sm font-black text-white">
          XM
        </div>
        <div className="text-sm font-black text-[#191513]">XM Trading</div>
      </div>
      <p className="mt-4 text-[12px] font-bold leading-5 text-[#6A615B]">
        最大レバレッジ1000倍。ボーナスが豊富で日本人利用率No.1。
      </p>
      <PrimaryButton className="mt-4">
        <i className="fa-solid fa-arrow-up-right-from-square text-sm" />
        <span>口座開設ページへ</span>
      </PrimaryButton>
      <SecondaryButton
        className="mt-3"
        onClick={() => navigateTo("notifications")}
      >
        申請状況を確認
      </SecondaryButton>
      <SecondaryButton
        className="mt-3"
        onClick={() => navigateTo("brokerPicker")}
      >
        戻る
      </SecondaryButton>
    </UserCard>
  );

  const renderNotifications = () => (
    <UserCard title="申請状況">
      <div className="space-y-3">
        <ApplicationItem
          title="XM Trading"
          subtitle="968774256558"
          pill={<StatusPill tone="success">承認済み</StatusPill>}
        />
        <ApplicationItem
          title="FX GT"
          subtitle="1029384"
          pill={<StatusPill tone="warn">確認中</StatusPill>}
        />
      </div>
      <SecondaryButton
        className="mt-4"
        onClick={() => navigateTo("onboarding")}
      >
        戻る
      </SecondaryButton>
    </UserCard>
  );

  const renderAnnouncements = () => (
    <UserCard title="お知らせ">
      <div className="space-y-3">
        {announcements.map((announcement, index) => (
          <button
            key={announcement.title}
            type="button"
            onClick={() => toggleAnnouncement(index)}
            className={cn(
              "w-full rounded-[22px] border bg-white p-4 text-left shadow-[0_10px_28px_rgba(25,21,19,0.06)]",
              announcement.priority
                ? "border-[#FECACA] bg-[#FEF2F2]"
                : "border-[#E8E1DB]",
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {announcement.tags.map((tag) => (
                    <StatusPill key={tag.label} tone={tag.tone}>
                      {tag.label}
                    </StatusPill>
                  ))}
                  {!announcement.read ? (
                    <span className="inline-flex rounded-full bg-[#191513] px-2 py-1 text-[10px] font-black text-white">
                      未読
                    </span>
                  ) : null}
                </div>
                <div className="text-sm font-black text-[#191513]">
                  {announcement.title}
                </div>
                <div className="mt-1 text-[11px] font-bold text-[#A1958D]">
                  {announcement.date}
                </div>
              </div>
              <i
                className={cn(
                  "fa-solid mt-1 text-xs text-[#A1958D]",
                  announcement.open ? "fa-chevron-up" : "fa-chevron-down",
                )}
              />
            </div>
            {announcement.open ? (
              <div className="mt-4 border-t border-[#E8E1DB] pt-4 text-[13px] font-bold leading-6 text-[#6A615B]">
                {announcement.body}
              </div>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-[#E8E1DB] bg-[#FCFAF8] text-[#D1D5DB]">
          <i className="fa-solid fa-chevron-left text-xs" />
        </div>
        <span className="text-[13px] font-black text-[#191513]">1 / 2</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-[#E8E1DB] bg-[#FCFAF8] text-[#374151]">
          <i className="fa-solid fa-chevron-right text-xs" />
        </div>
      </div>
    </UserCard>
  );

  const renderMenu = () => (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[26px] border border-[#E8E1DB] bg-white/95 shadow-[0_10px_28px_rgba(25,21,19,0.06)]">
        {[
          ["profile", "fa-user", "プロフィール"],
          ["wallet", "fa-wallet", "ウォレット"],
          ["payout", "fa-money-check-dollar", "出金"],
          ["rewardHistory", "fa-gift", "付与履歴"],
          ["menuRank", "fa-crown", "ランク"],
          ["accountSettings", "fa-gear", "設定"],
        ].map(([target, icon, label]) => (
          <button
            key={target}
            type="button"
            onClick={() => navigateTo(target)}
            className="flex w-full items-center gap-3 border-b border-[#F1EBE5] px-5 py-4 text-left last:border-b-0"
          >
            <i
              className={cn("fa-solid w-5 text-center text-[#6A615B]", icon)}
            />
            <span className="flex-1 text-sm font-bold text-[#191513]">
              {label}
            </span>
            <i className="fa-solid fa-chevron-right text-xs text-[#A1958D]" />
          </button>
        ))}
      </section>

      <UserCard title="アカウント">
        <div className="flex items-center justify-between border-b border-[#F1EBE5] pb-3 text-sm">
          <span className="font-bold text-[#6A615B]">ログイン中</span>
          <span className="font-black text-[#191513]">user@example.com</span>
        </div>
        <SecondaryButton
          className="mt-4 border-[#FECACA] text-[#991B1B]"
          onClick={() => router.push("/landing")}
        >
          <i className="fa-solid fa-right-from-bracket" />
          <span>サインアウト</span>
        </SecondaryButton>
      </UserCard>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-4">
      <UserCard title="プロフィール情報">
        <KeyValueRow label="メールアドレス" value="user@example.com" />
        <KeyValueRow
          label="ランク"
          value={
            <span className="flex items-center gap-2 text-[#92400E]">
              <i className="fa-solid fa-shield-alt text-xs" /> Member
            </span>
          }
        />
        <KeyValueRow
          label="アカウント状態"
          value={<StatusPill tone="success">アクティブ</StatusPill>}
        />
        <KeyValueRow
          label="KYC状態"
          value={<StatusPill tone="success">承認済み</StatusPill>}
        />
        <SecondaryButton className="mt-4" onClick={() => navigateTo("kyc")}>
          KYC詳細を確認
        </SecondaryButton>
      </UserCard>
      <BackButton onClick={() => navigateTo("menu")} label="メニューに戻る" />
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-4">
      <UserCard title="ウォレット管理">
        <KeyValueRow
          label="接続状態"
          value={
            <span className="flex items-center gap-2 text-[#16A34A]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" /> Wallet
              Connected
            </span>
          }
        />
        <KeyValueRow
          label="アドレス"
          value={<span className="font-mono text-xs">IZAKA-YA...8f2a</span>}
        />
        <KeyValueRow label="ネットワーク" value="Polygon" />
        <SecondaryButton className="mt-4">切断</SecondaryButton>
      </UserCard>
      <BackButton onClick={() => navigateTo("menu")} label="メニューに戻る" />
    </div>
  );

  const renderRewardHistory = () => (
    <div className="space-y-4">
      <UserCard title="付与履歴">
        <div className="space-y-3">
          {rewardItems.map((item) => (
            <ApplicationItem
              key={`${item.date}-${item.ref}`}
              title={item.value}
              subtitle={`参照: ${item.ref}`}
              meta={
                <div className="mb-1.5 flex items-center gap-2">
                  <StatusPill tone={item.tone}>{item.type}</StatusPill>
                  <span className="text-[11px] font-bold text-[#A1958D]">
                    {item.date}
                  </span>
                </div>
              }
            />
          ))}
        </div>
      </UserCard>
      <BackButton onClick={() => navigateTo("menu")} label="メニューに戻る" />
    </div>
  );

  const renderMenuRank = () => (
    <div className="space-y-4">
      <UserCard title="ランク詳細">
        <div
          className="rounded-[24px] border p-4"
          style={{
            borderColor: `${activeRank.color}55`,
            backgroundColor: activeRank.bg,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: activeRank.color }}
            >
              <i className={cn("fa-solid", activeRank.icon)} />
            </div>
            <div
              className="text-[18px] font-black"
              style={{ color: activeRank.color }}
            >
              {activeRank.name}
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-[18px] p-3 text-center"
                style={{ backgroundColor: `${activeRank.color}22` }}
              >
                <i
                  className="fa-solid fa-bolt text-sm"
                  style={{ color: activeRank.color }}
                />
                <div className="mt-2 text-[11px] font-bold text-[#6A615B]">
                  還元率倍率
                </div>
                <div
                  className="mt-1 text-sm font-black"
                  style={{ color: activeRank.color }}
                >
                  {activeRank.benefitRate}
                </div>
              </div>
              <div
                className="rounded-[18px] p-3 text-center"
                style={{ backgroundColor: `${activeRank.color}22` }}
              >
                <i
                  className="fa-solid fa-percentage text-sm"
                  style={{ color: activeRank.color }}
                />
                <div className="mt-2 text-[11px] font-bold text-[#6A615B]">
                  手数料優遇
                </div>
                <div
                  className="mt-1 text-sm font-black"
                  style={{ color: activeRank.color }}
                >
                  {activeRank.benefitFee}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 text-[12px] font-extrabold text-[#6A615B]">
                昇格条件（LEV_USD）
              </div>
              <KeyValueRow
                label="現在のランク基準"
                value={activeRank.currentValue}
              />
              <KeyValueRow
                label={activeRank.nextLine}
                value={activeRank.nextValue}
              />
              <KeyValueRow label="累計獲得ポイント" value={activeRank.points} />
            </div>

            <div>
              <div className="mb-2 text-[12px] font-extrabold text-[#6A615B]">
                次ランクまでの進捗
              </div>
              <div className="h-2.5 rounded-full bg-white/70">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${activeRank.progress}%`,
                    backgroundColor: activeRank.color,
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] font-black text-[#6A615B]">
                <span>{activeRank.points}</span>
                <span>{activeRank.progress}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-[12px] font-extrabold text-[#6A615B]">
          ランク一覧
        </div>
        <div className="mt-2 space-y-2">
          {Object.entries(rankConfig).map(([key, rank]) => (
            <div
              key={key}
              className={cn(
                "flex items-center gap-3 rounded-[20px] border bg-white p-3",
                selectedRank === key && "border-2",
              )}
              style={{
                borderColor:
                  selectedRank === key ? `${rank.color}88` : "#E8E1DB",
              }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: rank.color }}
              >
                <i className={cn("fa-solid text-sm", rank.icon)} />
              </div>
              <div className="flex-1">
                <div className="font-black" style={{ color: rank.color }}>
                  {rank.name}
                  {selectedRank === key ? " (現在)" : ""}
                </div>
                <div className="mt-1 text-[11px] font-bold text-[#6A615B]">
                  倍率: {rank.benefitRate} | {rank.benefitFee}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-[18px] border border-[#E8E1DB] bg-[#FCFAF8] p-4 text-[12px] font-bold leading-5 text-[#6A615B]">
          <i className="fa-solid fa-circle-info mt-0.5 text-[#6A615B]" />
          ランクは毎月自動で判定されます。条件達成後、翌月に反映されます。
        </div>
      </UserCard>
      <BackButton onClick={() => navigateTo("menu")} label="メニューに戻る" />
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-4">
      <UserCard title="メールアドレスを変更">
        <KeyValueRow label="現在のメール" value="user@example.com" />
        <div className="mt-4">
          <FormField
            label="新しいメールアドレス"
            placeholder="new@example.com"
            type="email"
          />
        </div>
        <PrimaryButton className="mt-4">メールアドレスを変更</PrimaryButton>
      </UserCard>

      <UserCard title="パスワードを変更">
        <div className="space-y-3.5">
          <FormField
            label="現在のパスワード"
            placeholder="••••••••"
            type="password"
          />
          <FormField
            label="新しいパスワード"
            placeholder="••••••••"
            type="password"
          />
          <FormField
            label="新しいパスワード（確認）"
            placeholder="••••••••"
            type="password"
          />
        </div>
        <PrimaryButton className="mt-4">パスワードを変更</PrimaryButton>
      </UserCard>

      <UserCard title="退会">
        <div className="rounded-[18px] border border-[#FECACA] bg-[#FEF2F2] p-4">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-triangle-exclamation mt-0.5 text-[#991B1B]" />
            <div>
              <div className="text-[13px] font-black text-[#991B1B]">
                退会に関する注意
              </div>
              <div className="mt-1 text-[12px] font-bold leading-5 text-[#991B1B]">
                退会すると全てのデータが失われます。残高がある場合は先に出金してください。
              </div>
            </div>
          </div>
        </div>
        <SecondaryButton className="mt-4 border-[#FECACA] text-[#991B1B]">
          <i className="fa-solid fa-trash-can" />
          <span>退会を申請する</span>
        </SecondaryButton>
      </UserCard>

      <BackButton onClick={() => navigateTo("menu")} label="メニューに戻る" />
    </div>
  );

  const renderKyc = () => (
    <div className="space-y-4">
      <UserCard title="本人確認（KYC)">
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            ["none", "未提出"],
            ["pending", "審査中"],
            ["approved", "承認済み"],
            ["rejected", "却下"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setKycState(value)}
              className={cn(
                "rounded-full border px-4 py-2 text-[13px] font-extrabold transition",
                kycState === value
                  ? "border-[#E53935] bg-[#E53935] text-white"
                  : "border-[#E8E1DB] bg-[#FCFAF8] text-[#4B443F]",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <KycPanel state={kycState} onResubmit={() => setKycState("pending")} />
      </UserCard>
      <BackButton onClick={() => navigateTo("menu")} label="メニューに戻る" />
    </div>
  );

  const renderPayout = () => (
    <div className="space-y-4">
      {!showPayoutHistory ? (
        <UserCard title="出金申請">
          <div className="text-[12px] font-extrabold text-[#6A615B]">
            アセット
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.keys(payoutAssetDefaults).map((symbol) => (
              <button
                key={symbol}
                type="button"
                onClick={() => setSelectedPayoutAsset(symbol)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[13px] font-extrabold transition",
                  selectedPayoutAsset === symbol
                    ? "border-[#E53935] bg-[#E53935] text-white"
                    : "border-[#E8E1DB] bg-[#FCFAF8] text-[#4B443F]",
                )}
              >
                {symbol}
              </button>
            ))}
          </div>
          <div className="mt-3 text-[12px] font-bold text-[#6A615B]">
            出金可能残高: {payoutAssetDefaults[selectedPayoutAsset]}
          </div>
          <div className="mt-3 space-y-2">
            <KeyValueRow
              label="KYC状態"
              value={<StatusPill tone="success">承認済み</StatusPill>}
            />
            <KeyValueRow
              label="送金先"
              value={<span className="font-mono text-xs">IZAKA-YA...8f2a</span>}
            />
          </div>
          <div className="mt-4">
            <FormField label="出金額" placeholder="0" />
          </div>
          <button
            type="button"
            className="mt-3 flex items-start gap-3 text-left"
          >
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-[8px] border border-[#E53935] bg-[#E53935] text-xs text-white">
              <i className="fa-solid fa-check" />
            </span>
            <span className="text-[13px] font-bold leading-5 text-[#6A615B]">
              利用規約に同意して申請する
            </span>
          </button>
          <PrimaryButton
            className="mt-4"
            onClick={() => {
              setShowPayoutHistory(true);
              setPayoutHistoryState("pending");
            }}
          >
            <i className="fa-solid fa-paper-plane text-sm" />
            <span>申請を実行する</span>
          </PrimaryButton>
          <SecondaryButton
            className="mt-3"
            onClick={() => navigateTo("history")}
          >
            入出金履歴を見る
          </SecondaryButton>
        </UserCard>
      ) : (
        <UserCard title="出金申請の履歴">
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              ["completed", "完了"],
              ["pending", "申請中"],
              ["approved", "承認済み"],
              ["processing", "処理中"],
              ["rejected", "却下"],
              ["failed", "失敗"],
              ["cancelled", "キャンセル"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setPayoutHistoryState(value)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[13px] font-extrabold transition",
                  payoutHistoryState === value
                    ? "border-[#E53935] bg-[#E53935] text-white"
                    : "border-[#E8E1DB] bg-[#FCFAF8] text-[#4B443F]",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <PayoutStateCard state={payoutHistoryState} />
          <SecondaryButton
            className="mt-4"
            onClick={() => setShowPayoutHistory(false)}
          >
            <i className="fa-solid fa-plus text-xs" />
            <span>新規申請</span>
          </SecondaryButton>
        </UserCard>
      )}
      <BackButton onClick={() => navigateTo("menu")} label="メニューに戻る" />
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      <UserCard title="入出金履歴（デモ)">
        <div className="space-y-3">
          <HistoryItem
            date="2024/11/10"
            tag="入金"
            incoming
            title="10月分 エアドロップ報酬"
            amount="+ 1,000 KQ"
          />
          <HistoryItem
            date="2024/11/05"
            tag="出金"
            title="ウォレット送金申請"
            amount="- 5,000 KQ"
          />
        </div>
      </UserCard>
      <BackButton onClick={() => navigateTo("payout")} label="出金申請に戻る" />
    </div>
  );

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return renderDashboard();
      case "onboarding":
        return renderOnboarding();
      case "brokerPicker":
        return renderBrokerPicker();
      case "brokerOpen":
        return renderBrokerOpen();
      case "notifications":
        return renderNotifications();
      case "announcements":
        return renderAnnouncements();
      case "menu":
        return renderMenu();
      case "profile":
        return renderProfile();
      case "wallet":
        return renderWallet();
      case "rewardHistory":
        return renderRewardHistory();
      case "menuRank":
        return renderMenuRank();
      case "accountSettings":
        return renderAccountSettings();
      case "kyc":
        return renderKyc();
      case "payout":
        return renderPayout();
      case "history":
        return renderHistory();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[linear-gradient(180deg,#F7F4F1_0%,#FFFFFF_26%,#FBFAF8_100%)] text-[#191513]">
        <header className="flex items-center justify-between border-b border-[#D9CEC5]/70 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF1F0] text-[#E53935]">
              <i className="fa-solid fa-chess-king" />
            </div>
            <div className="text-[17px] font-black tracking-[0.02em] text-[#191513]">
              K<span className="text-[#E53935]">&amp;</span>Q
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigateTo("menu")}
              className="flex min-w-[132px] items-center gap-2 rounded-full border border-[#E8E1DB] bg-white px-3 py-2 shadow-[0_10px_28px_rgba(25,21,19,0.06)]"
            >
              <span className="h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_6px_rgba(34,197,94,0.55)]" />
              <span className="text-left leading-none">
                <span className="block text-[9px] font-black uppercase tracking-[0.12em] text-[#A1958D]">
                  Wallet Connected
                </span>
                <span className="mt-1 block text-[12px] font-black text-[#191513]">
                  IZAKA-YA...8f2a
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo("announcements")}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E53935]/15 bg-[#FFF1F0] text-[#E53935] shadow-[0_10px_28px_rgba(25,21,19,0.06)]"
            >
              <i className="fa-solid fa-bell" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#191513] px-1 text-[10px] font-black text-white">
                  {unreadCount}
                </span>
              ) : null}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#F7F4F1_0%,#FFFFFF_180px)] px-4 pb-28 pt-4 md:px-8">
          <div className="mx-auto max-w-2xl">
            {renderPage()}
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#E8E1DB] bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-2 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center gap-2">
            {[
              ["dashboard", "fa-house", "ホーム"],
              ["onboarding", "fa-route", "口座開設"],
              ["menu", "fa-bars", "メニュー"],
            ].map(([target, icon, label]) => {
              const active =
                target === page ||
                (target === "menu" && menuSubPages.includes(page));
              return (
                <button
                  key={target}
                  type="button"
                  onClick={() => navigateTo(target)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 rounded-[18px] px-3 py-2",
                    active ? "bg-[#FFF1F0]" : "bg-transparent",
                  )}
                >
                  <i
                    className={cn("fa-solid text-[18px]", icon)}
                    style={{ color: active ? "#E53935" : "#A1958D" }}
                  />
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: active ? "#E53935" : "#A1958D" }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
    </div>
  );
}

function PrimaryButton({ children, className, onClick }) {
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

function SecondaryButton({ children, className, onClick }) {
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

function TextAction({ children, className, onClick }) {
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

function KeyValueRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-[#F1EBE5] py-3 last:border-b-0 last:pb-0 first:pt-0">
      <span className="text-[13px] font-bold text-[#6A615B]">{label}</span>
      <span className="text-right text-[13px] font-black text-[#191513]">
        {value}
      </span>
    </div>
  );
}

function ApplicationItem({ title, subtitle, pill, meta }) {
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

function BackButton({ label, onClick }) {
  return (
    <SecondaryButton onClick={onClick}>
      <i className="fa-solid fa-chevron-left text-xs" />
      <span>{label}</span>
    </SecondaryButton>
  );
}

function KycPanel({ state, onResubmit }) {
  const states = {
    none: {
      iconWrap: "bg-[#F4EFE9] text-[#9CA3AF]",
      icon: "fa-id-card",
      title: "本人確認が未完了です",
      body: "出金するにはKYC認証が必要です。",
      step: ["off", "off", "off"],
    },
    pending: {
      iconWrap: "bg-[#FEF3C7] text-[#F59E0B]",
      icon: "fa-clock",
      title: "審査中です",
      body: "書類を確認しています。しばらくお待ちください。",
      step: ["done", "active", "off"],
    },
    approved: {
      iconWrap: "bg-[#DCFCE7] text-[#16A34A]",
      icon: "fa-circle-check",
      title: "本人確認が完了しました",
      body: "KYCが承認されました。全ての機能をご利用いただけます。",
      step: ["done", "done", "done"],
    },
    rejected: {
      iconWrap: "bg-[#FEE2E2] text-[#EF4444]",
      icon: "fa-circle-xmark",
      title: "本人確認が却下されました",
      body: "書類を確認の上、再提出してください。",
      step: ["done", "fail", "off"],
    },
  };

  const current = states[state];

  return (
    <div>
      <div className="flex flex-col items-center py-4 text-center">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-[20px] text-[28px]",
            current.iconWrap,
          )}
        >
          <i className={cn("fa-solid", current.icon)} />
        </div>
        <div className="mt-4 text-base font-black text-[#191513]">
          {current.title}
        </div>
        <div className="mt-2 text-sm font-bold leading-6 text-[#6A615B]">
          {current.body}
        </div>
      </div>

      <div className="my-4 flex items-center">
        {["書類提出", "審査中", "完了"].map((label, index) => (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-black",
                  current.step[index] === "done" &&
                    "border-[#16A34A] bg-[#16A34A] text-white",
                  current.step[index] === "active" &&
                    "border-[#F59E0B] bg-[#FEF3C7] text-[#F59E0B]",
                  current.step[index] === "fail" &&
                    "border-[#EF4444] bg-[#FEE2E2] text-[#EF4444]",
                  current.step[index] === "off" &&
                    "border-[#D1D5DB] bg-[#F3F4F6] text-[#A1958D]",
                )}
              >
                {current.step[index] === "done" ? (
                  <i className="fa-solid fa-check text-[10px]" />
                ) : current.step[index] === "fail" ? (
                  <i className="fa-solid fa-xmark text-[10px]" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="mt-1 text-[10px] font-black text-[#6A615B]">
                {label}
              </span>
            </div>
            {index < 2 ? (
              <div
                className={cn(
                  "mb-[18px] h-[2px] flex-1 bg-[#E5E7EB]",
                  current.step[index] === "done" && "bg-[#16A34A]",
                )}
              />
            ) : null}
          </div>
        ))}
      </div>

      {state === "none" ? (
        <div className="rounded-[22px] border border-dashed border-[#D9CEC5] bg-[#FCFAF8] p-4">
          <div className="text-[12px] font-extrabold text-[#6A615B]">
            書類種別
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {["運転免許証", "パスポート", "マイナンバー"].map((item, index) => (
              <span
                key={item}
                className={cn(
                  "rounded-full border px-4 py-2 text-[13px] font-extrabold",
                  index === 0
                    ? "border-[#E53935] bg-[#E53935] text-white"
                    : "border-[#E8E1DB] bg-white text-[#4B443F]",
                )}
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mt-4 rounded-[20px] border-2 border-dashed border-[#D9CEC5] bg-white px-4 py-8 text-center">
            <i className="fa-solid fa-cloud-arrow-up text-xl text-[#A1958D]" />
            <div className="mt-2 text-[13px] font-bold text-[#A1958D]">
              書類をアップロード
            </div>
            <div className="mt-1 text-[10px] font-bold text-[#A1958D]">
              JPG / PNG / PDF（最大5MB）
            </div>
          </div>
          <PrimaryButton className="mt-4" onClick={onResubmit}>
            提出する
          </PrimaryButton>
        </div>
      ) : null}

      {state === "pending" ? (
        <div className="space-y-1">
          <KeyValueRow label="提出日" value="2026/02/18" />
          <KeyValueRow label="書類種別" value="運転免許証" />
        </div>
      ) : null}

      {state === "approved" ? (
        <div className="space-y-1">
          <KeyValueRow label="認証日" value="2026/02/20" />
          <KeyValueRow label="書類種別" value="運転免許証" />
        </div>
      ) : null}

      {state === "rejected" ? (
        <div>
          <div className="rounded-[18px] bg-[#FEF2F2] p-4">
            <div className="text-[12px] font-black text-[#991B1B]">
              却下理由
            </div>
            <div className="mt-1 text-[12px] font-bold leading-5 text-[#7F1D1D]">
              書類の画像が不鮮明です。鮮明な画像で再提出してください。
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <KeyValueRow label="提出日" value="2026/02/15" />
            <KeyValueRow label="却下日" value="2026/02/17" />
            <KeyValueRow label="書類種別" value="運転免許証" />
          </div>
          <PrimaryButton className="mt-4" onClick={onResubmit}>
            再提出する
          </PrimaryButton>
        </div>
      ) : null}
    </div>
  );
}

function PayoutStateCard({ state }) {
  const config = {
    completed: {
      amount: "500 USDT",
      tone: "success",
      label: "完了",
      date: "2026/2/10 10:00:00",
      steps: ["done", "done", "done", "done"],
      footer: "TxHash: 0x9f8e7d6c5b4a3928...c2b1a0",
    },
    pending: {
      amount: "0.02 BTC",
      tone: "warn",
      label: "申請中",
      date: "2026/2/21 14:30:00",
      steps: ["active", "off", "off", "off"],
      action: "キャンセル",
    },
    approved: {
      amount: "0.5 ETH",
      tone: "info",
      label: "承認済み",
      date: "2026/2/25 09:15:00",
      steps: ["done", "done", "off", "off"],
    },
    processing: {
      amount: "1,200 KQ",
      tone: "info",
      label: "処理中",
      date: "2026/2/28 11:00:00",
      steps: ["done", "done", "done", "off"],
    },
    rejected: {
      amount: "100 XRP",
      tone: "danger",
      label: "却下",
      date: "2026/1/20 16:00:00",
      steps: ["done", "fail", "off", "off"],
      reason: "出金先アドレスが確認できませんでした",
      recovery: "残高復帰済み: +100 XRP",
    },
    failed: {
      amount: "800 USDT",
      tone: "danger",
      label: "失敗",
      date: "2026/1/15 08:30:00",
      steps: ["done", "done", "done", "fail"],
      footer: "TxHash: 0xa1b2c3d4e5f67890...failed",
      reason: "ネットワークエラーにより送金が失敗しました",
      recovery: "残高復帰済み: +800 USDT",
    },
    cancelled: {
      amount: "3,000 KQ",
      tone: "neutral",
      label: "キャンセル済み",
      date: "2026/1/10 12:00:00",
      steps: null,
      recovery: "残高復帰済み: +3,000 KQ",
    },
  };

  const current = config[state];
  const labels = ["申請中", "承認済み", "処理中", "送金完了"];

  return (
    <div className="rounded-[20px] border border-[#E8E1DB] border-l-4 border-l-[#E53935] bg-white p-4 shadow-[0_10px_28px_rgba(25,21,19,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-base font-black text-[#191513]">
          {current.amount}
        </div>
        <StatusPill tone={current.tone}>{current.label}</StatusPill>
      </div>
      <div className="mt-1 text-[11px] font-bold text-[#A1958D]">
        {current.date}
      </div>

      {current.steps ? (
        <div className="mt-4 flex items-start">
          {labels.map((label, index) => (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-black",
                    current.steps[index] === "done" &&
                      "border-[#16A34A] bg-[#16A34A] text-white",
                    current.steps[index] === "active" &&
                      "border-[#F59E0B] bg-[#FEF3C7] text-[#F59E0B]",
                    current.steps[index] === "fail" &&
                      "border-[#EF4444] bg-[#FEE2E2] text-[#EF4444]",
                    current.steps[index] === "off" &&
                      "border-[#D1D5DB] bg-[#F3F4F6] text-[#A1958D]",
                  )}
                >
                  {current.steps[index] === "done" ? (
                    <i className="fa-solid fa-check text-[9px]" />
                  ) : current.steps[index] === "fail" ? (
                    <i className="fa-solid fa-xmark text-[9px]" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "mt-1 text-[10px] font-black text-[#A1958D]",
                    current.steps[index] === "done" && "text-[#16A34A]",
                    current.steps[index] === "active" && "text-[#F59E0B]",
                    current.steps[index] === "fail" && "text-[#EF4444]",
                  )}
                >
                  {label}
                </span>
              </div>
              {index < labels.length - 1 ? (
                <div
                  className={cn(
                    "mb-[18px] h-[2px] flex-1 bg-[#E5E7EB]",
                    current.steps[index] === "done" && "bg-[#16A34A]",
                  )}
                />
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {current.footer ? (
        <div className="mt-4 text-[10px] font-bold text-[#374151]">
          {current.footer}
        </div>
      ) : null}
      {current.reason ? (
        <div className="mt-4 rounded-[16px] bg-[#FEF2F2] p-3 text-[11px] font-bold text-[#7F1D1D]">
          {current.reason}
        </div>
      ) : null}
      {current.recovery ? (
        <div className="mt-3 text-[10px] font-bold text-[#16A34A]">
          {current.recovery}
        </div>
      ) : null}
      {current.action ? (
        <SecondaryButton className="mt-4 border-[#FECACA] text-[#991B1B]">
          {current.action}
        </SecondaryButton>
      ) : null}
    </div>
  );
}

function HistoryItem({ date, tag, incoming = false, title, amount }) {
  return (
    <div className="rounded-[20px] border border-[#E8E1DB] bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-bold text-[#A1958D]">{date}</span>
        <span
          className={cn(
            "rounded-full px-2 py-1 text-[10px] font-black",
            incoming
              ? "bg-[#DCFCE7] text-[#166534]"
              : "bg-[#FEE2E2] text-[#991B1B]",
          )}
        >
          {tag}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex-1 text-sm font-bold text-[#191513]">{title}</div>
        <div
          className={cn(
            "text-base font-black",
            incoming ? "text-[#16A34A]" : "text-[#991B1B]",
          )}
        >
          {amount}
        </div>
      </div>
    </div>
  );
}

export default UserApp;
