import { useMemo, useState } from "react";
import {
  btnGhost,
  fieldLabel,
  inputBase,
  panelBase,
  panelBody,
  panelHeader,
  thBase,
} from "../ui/styles";

const PAGE_SIZE = 10;

const initialLedger = [
  {
    id: "L001",
    date: "2026-03-08",
    userId: "U001",
    asset: "KQ",
    delta: 1800,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L002",
    date: "2026-03-08",
    userId: "U002",
    asset: "USDT",
    delta: 120,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L003",
    date: "2026-03-08",
    userId: "U003",
    asset: "JPYC",
    delta: 6500,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L004",
    date: "2026-03-07",
    userId: "U004",
    asset: "BTC",
    delta: 0.0018,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L005",
    date: "2026-03-07",
    userId: "U005",
    asset: "IZAKAYA",
    delta: 85,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L006",
    date: "2026-03-06",
    userId: "U006",
    asset: "USDC",
    delta: 95,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L007",
    date: "2026-03-06",
    userId: "U007",
    asset: "ETH",
    delta: 0.15,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L008",
    date: "2026-03-05",
    userId: "U008",
    asset: "XRP",
    delta: 220,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L009",
    date: "2026-03-05",
    userId: "U009",
    asset: "JPYR",
    delta: 4200,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L010",
    date: "2026-03-04",
    userId: "U010",
    asset: "KQ",
    delta: 2400,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L011",
    date: "2026-03-04",
    userId: "U011",
    asset: "USDT",
    delta: 180,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L012",
    date: "2026-03-03",
    userId: "U012",
    asset: "JPYC",
    delta: 3800,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L013",
    date: "2026-03-03",
    userId: "U001",
    asset: "IZAKAYA",
    delta: 120,
    type: "CREDIT",
    reason: "キャンペーンボーナス",
    ref: "CMP001",
  },
  {
    id: "L014",
    date: "2026-03-02",
    userId: "U002",
    asset: "BTC",
    delta: 0.0008,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L015",
    date: "2026-03-02",
    userId: "U003",
    asset: "ETH",
    delta: 0.04,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L016",
    date: "2026-03-01",
    userId: "U004",
    asset: "USDC",
    delta: 210,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L017",
    date: "2026-03-01",
    userId: "U005",
    asset: "XRP",
    delta: 350,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-03",
  },
  {
    id: "L018",
    date: "2026-02-28",
    userId: "U006",
    asset: "KQ",
    delta: 1600,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L019",
    date: "2026-02-28",
    userId: "U007",
    asset: "JPYR",
    delta: 9500,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L020",
    date: "2026-02-27",
    userId: "U008",
    asset: "USDT",
    delta: 95,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L021",
    date: "2026-02-27",
    userId: "U009",
    asset: "IZAKAYA",
    delta: 45,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L022",
    date: "2026-02-26",
    userId: "U010",
    asset: "JPYC",
    delta: 5200,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L023",
    date: "2026-02-25",
    userId: "U011",
    asset: "BTC",
    delta: 0.003,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L024",
    date: "2026-02-25",
    userId: "U012",
    asset: "ETH",
    delta: 0.02,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L025",
    date: "2026-02-24",
    userId: "U001",
    asset: "USDC",
    delta: 280,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L026",
    date: "2026-02-23",
    userId: "U002",
    asset: "XRP",
    delta: 180,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L027",
    date: "2026-02-22",
    userId: "U003",
    asset: "JPYR",
    delta: 3800,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L028",
    date: "2026-02-20",
    userId: "U004",
    asset: "KQ",
    delta: 3200,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L029",
    date: "2026-02-18",
    userId: "U005",
    asset: "USDT",
    delta: 160,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L030",
    date: "2026-02-15",
    userId: "U001",
    asset: "KQ",
    delta: -1500,
    type: "DEBIT",
    reason: "出金",
    ref: "W001",
  },
  {
    id: "L031",
    date: "2026-02-15",
    userId: "U007",
    asset: "USDT",
    delta: -200,
    type: "DEBIT",
    reason: "出金",
    ref: "W002",
  },
  {
    id: "L032",
    date: "2026-02-14",
    userId: "U006",
    asset: "IZAKAYA",
    delta: 55,
    type: "CREDIT",
    reason: "キャンペーンボーナス",
    ref: "CMP002",
  },
  {
    id: "L033",
    date: "2026-02-12",
    userId: "U007",
    asset: "USDC",
    delta: 420,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L034",
    date: "2026-02-10",
    userId: "U008",
    asset: "JPYC",
    delta: 2800,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L035",
    date: "2026-02-08",
    userId: "U009",
    asset: "BTC",
    delta: 0.0005,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L036",
    date: "2026-02-06",
    userId: "U010",
    asset: "ETH",
    delta: 0.08,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-02",
  },
  {
    id: "L037",
    date: "2026-01-31",
    userId: "U011",
    asset: "XRP",
    delta: 280,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-01",
  },
  {
    id: "L038",
    date: "2026-01-31",
    userId: "U012",
    asset: "JPYR",
    delta: 2200,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-01",
  },
  {
    id: "L039",
    date: "2026-01-28",
    userId: "U001",
    asset: "USDT",
    delta: 140,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-01",
  },
  {
    id: "L040",
    date: "2026-01-25",
    userId: "U002",
    asset: "JPYC",
    delta: 4100,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-01",
  },
  {
    id: "L041",
    date: "2026-01-22",
    userId: "U003",
    asset: "KQ",
    delta: 900,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-01",
  },
  {
    id: "L042",
    date: "2026-01-20",
    userId: "U004",
    asset: "KQ",
    delta: 150,
    type: "ADJUSTMENT",
    reason: "手動調整（計算誤差補正）",
    ref: "ADJ-001",
  },
  {
    id: "L043",
    date: "2026-01-18",
    userId: "U005",
    asset: "IZAKAYA",
    delta: -30,
    type: "CONFISCATE",
    reason: "不正利用による没収",
    ref: "CONF-001",
  },
  {
    id: "L044",
    date: "2026-01-15",
    userId: "U006",
    asset: "USDC",
    delta: 45,
    type: "CREDIT",
    reason: "入会ボーナス",
    ref: "SIGNUP-U006",
  },
  {
    id: "L045",
    date: "2026-01-12",
    userId: "U007",
    asset: "BTC",
    delta: 0.005,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-01",
  },
  {
    id: "L046",
    date: "2026-01-10",
    userId: "U008",
    asset: "ETH",
    delta: 0.12,
    type: "CREDIT",
    reason: "月次IB報酬",
    ref: "BATCH-2026-01",
  },
  {
    id: "L047",
    date: "2026-01-08",
    userId: "U009",
    asset: "JPYR",
    delta: 1500,
    type: "CREDIT",
    reason: "入会ボーナス",
    ref: "SIGNUP-U009",
  },
  {
    id: "L048",
    date: "2026-01-05",
    userId: "U010",
    asset: "USDT",
    delta: 75,
    type: "CREDIT",
    reason: "入会ボーナス",
    ref: "SIGNUP-U010",
  },
];

const ASSETS = [
  "KQ",
  "BTC",
  "ETH",
  "USDT",
  "USDC",
  "XRP",
  "JPYR",
  "JPYC",
  "IZAKAYA",
];

const ledgerTypeTone = {
  CREDIT: "bg-emerald-100 text-emerald-700",
  DEBIT: "bg-red-100 text-red-700",
  ADJUSTMENT: "bg-amber-100 text-amber-700",
  CONFISCATE: "bg-red-100 text-red-700",
};

function formatDelta(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return "0";
  if (Math.abs(n) > 0 && Math.abs(n) < 1) {
    return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function asCsvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export default function LedgerView({ isActive }) {
  const [ledgerRows, setLedgerRows] = useState(initialLedger);
  const [filterUser, setFilterUser] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterAsset, setFilterAsset] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [page, setPage] = useState(0);
  const [adjustModal, setAdjustModal] = useState({
    open: false,
    userId: "",
    asset: "KQ",
    amount: "0",
    reason: "",
  });
  const [toast, setToast] = useState(null);

  const filteredRows = useMemo(() => {
    let rows = [...ledgerRows].reverse();

    const user = filterUser.trim().toUpperCase();
    if (user)
      rows = rows.filter((r) => String(r.userId).toUpperCase().includes(user));
    if (filterDateFrom) rows = rows.filter((r) => r.date >= filterDateFrom);
    if (filterDateTo) rows = rows.filter((r) => r.date <= filterDateTo);
    if (filterAsset !== "ALL")
      rows = rows.filter((r) => r.asset === filterAsset);
    if (filterType !== "ALL")
      rows = rows.filter((r) => (r.type || "CREDIT") === filterType);

    return rows;
  }, [
    ledgerRows,
    filterUser,
    filterDateFrom,
    filterDateTo,
    filterAsset,
    filterType,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageRows = filteredRows.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE,
  );

  const showToast = (type, title, message = "") => {
    const id = Date.now() + Math.random();
    setToast({ id, type, title, message });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 2600);
  };

  const handleExportCsv = () => {
    const header = [
      "日付",
      "ユーザー",
      "アセット",
      "種別",
      "増減",
      "理由",
      "参照",
    ];
    const body = filteredRows.map((row) => [
      row.date,
      row.userId,
      row.asset,
      row.type || "CREDIT",
      row.delta,
      row.reason || "",
      row.ref || "",
    ]);
    const csv = [header, ...body]
      .map((line) => line.map(asCsvCell).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kq_ledger_export.csv";
    link.click();
    URL.revokeObjectURL(url);
    showToast("ok", "CSV出力完了", `${filteredRows.length}件をエクスポート`);
  };

  const openAdjustmentModal = (userId, asset) => {
    setAdjustModal({
      open: true,
      userId,
      asset,
      amount: "0",
      reason: "",
    });
  };

  const closeAdjustmentModal = () => {
    setAdjustModal((prev) => ({ ...prev, open: false }));
  };

  const applyAdjustment = () => {
    const amount = Number(adjustModal.amount);
    if (!adjustModal.userId || !adjustModal.asset) {
      showToast("err", "入力不正", "ユーザーとアセットは必須です");
      return;
    }
    if (!Number.isFinite(amount) || amount === 0) {
      showToast("err", "入力不正", "調整額は0以外の数値を入力してください");
      return;
    }
    if (!adjustModal.reason.trim()) {
      showToast("err", "理由が必須です", "調整理由を入力してください");
      return;
    }

    const newRow = {
      id: `L${String(ledgerRows.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().slice(0, 10),
      userId: adjustModal.userId,
      asset: adjustModal.asset,
      delta: amount,
      type: "ADJUSTMENT",
      reason: adjustModal.reason.trim(),
      ref: "ADMIN_DELTA",
    };

    setLedgerRows((prev) => [...prev, newRow]);
    setPage(0);
    closeAdjustmentModal();
    showToast(
      "ok",
      "デルタ調整を適用",
      `${newRow.userId} の ${newRow.asset} に ${amount > 0 ? "+" : ""}${formatDelta(amount)} を追記`,
    );
  };

  return (
    <section
      className={`view ${isActive ? "" : "is-hidden"} [&.is-hidden]:hidden`}
      id="view-ledger"
    >
      <div className={panelBase}>
        <div className={panelHeader}>
          <div>
            <div className="panel-title font-black">トークン台帳</div>
            <div className="panel-sub mt-1 text-[0.92rem] text-gray-500">
              付与/減算の履歴（追記型・編集不可）
            </div>
          </div>
          <div className="actions flex items-center gap-2">
            <button
              className={`${btnGhost} text-sm`}
              type="button"
              onClick={handleExportCsv}
            >
              <span className="material-icons text-[18px]" aria-hidden="true">
                download
              </span>
              CSV出力
            </button>
          </div>
        </div>
        <div className={panelBody}>
          <div className="toolbar mb-3 flex flex-wrap items-end gap-3">
            <div className="field min-w-[160px]">
              <label className={`${fieldLabel} mb-1.5 block`}>ユーザー</label>
              <input
                id="filterLedgerUser"
                type="text"
                placeholder="U001..."
                value={filterUser}
                onChange={(e) => {
                  setFilterUser(e.target.value);
                  setPage(0);
                }}
                className={`${inputBase} h-10 w-full text-sm`}
              />
            </div>
            <div className="field min-w-[160px]">
              <label className={`${fieldLabel} mb-1.5 block`}>開始日</label>
              <input
                id="filterLedgerDateFrom"
                type="date"
                value={filterDateFrom}
                onChange={(e) => {
                  setFilterDateFrom(e.target.value);
                  setPage(0);
                }}
                className={`${inputBase} h-10 w-full text-sm`}
              />
            </div>
            <div className="field min-w-[160px]">
              <label className={`${fieldLabel} mb-1.5 block`}>終了日</label>
              <input
                id="filterLedgerDateTo"
                type="date"
                value={filterDateTo}
                onChange={(e) => {
                  setFilterDateTo(e.target.value);
                  setPage(0);
                }}
                className={`${inputBase} h-10 w-full text-sm`}
              />
            </div>
            <div className="field min-w-[160px]">
              <label className={`${fieldLabel} mb-1.5 block`}>アセット</label>
              <select
                id="filterLedgerAsset"
                value={filterAsset}
                onChange={(e) => {
                  setFilterAsset(e.target.value);
                  setPage(0);
                }}
                className={`${inputBase} h-10 w-full text-sm`}
              >
                <option value="ALL">すべて</option>
                {ASSETS.map((asset) => (
                  <option key={asset} value={asset}>
                    {asset}
                  </option>
                ))}
              </select>
            </div>
            <div className="field min-w-[160px]">
              <label className={`${fieldLabel} mb-1.5 block`}>種別</label>
              <select
                id="filterLedgerType"
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setPage(0);
                }}
                className={`${inputBase} h-10 w-full text-sm`}
              >
                <option value="ALL">すべて</option>
                <option value="CREDIT">CREDIT</option>
                <option value="DEBIT">DEBIT</option>
                <option value="ADJUSTMENT">ADJUSTMENT</option>
                <option value="CONFISCATE">CONFISCATE</option>
              </select>
            </div>
            <div
              className="hint ml-auto pb-1 text-sm text-gray-500"
              id="ledgerHint"
            >
              {filteredRows.length}件（{currentPage + 1}/{totalPages}ページ）
            </div>
          </div>

          <div className="table-wrap overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table
                className="table w-full min-w-[900px] border-separate border-spacing-0 text-[0.9rem]"
                id="tblLedger"
              >
                <thead>
                  <tr>
                    <th className={thBase}>日付</th>
                    <th className={thBase}>ユーザー</th>
                    <th className={thBase}>アセット</th>
                    <th className={thBase}>種別</th>
                    <th className={`${thBase} right text-right`}>増減</th>
                    <th className={thBase}>参照</th>
                    <th className={`${thBase} right text-right`}>操作</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:hover]:bg-gray-50 [&_td]:border-b [&_td]:border-gray-200">
                  {pageRows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-3 py-3 text-gray-700">{row.date}</td>
                      <td className="px-3 py-3 font-semibold text-gray-700">
                        {row.userId}
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex rounded-full bg-gray-200 px-2.5 py-1 text-[0.72rem] font-bold text-gray-600">
                          {row.asset}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[0.72rem] font-bold ${ledgerTypeTone[row.type || "CREDIT"] || "bg-gray-200 text-gray-600"}`}
                        >
                          {row.type || "CREDIT"}
                        </span>
                      </td>
                      <td
                        className={`px-3 py-3 text-right font-bold ${Number(row.delta) >= 0 ? "text-emerald-700" : "text-red-700"}`}
                      >
                        {Number(row.delta) > 0 ? "+" : ""}
                        {formatDelta(row.delta)}
                      </td>
                      <td className="px-3 py-3 font-mono text-[0.78rem] text-gray-500">
                        {row.ref}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-[0.74rem] font-semibold text-gray-600 hover:bg-gray-100"
                          type="button"
                          onClick={() =>
                            openAdjustmentModal(row.userId, row.asset)
                          }
                        >
                          デルタ調整
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="empty p-[18px] text-center text-gray-500"
              id="emptyLedger"
              hidden={filteredRows.length !== 0}
            >
              台帳が空です
            </div>
          </div>

          <div
            className="pagination mt-3 flex items-center justify-center gap-2"
            id="ledgerPagination"
          >
            <button
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={currentPage <= 0}
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            >
              ← 前
            </button>
            <span className="text-sm text-gray-500">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={currentPage >= totalPages - 1}
              onClick={() =>
                setPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
            >
              次 →
            </button>
          </div>
        </div>
      </div>

      {adjustModal.open && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/55 p-[18px]">
          <div className="w-full max-w-[680px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_15px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-2.5 border-b border-gray-200 px-3.5 py-3">
              <div className="font-black">デルタ調整（追記型）</div>
              <button
                onClick={closeAdjustmentModal}
                className="grid h-[34px] w-[34px] place-items-center rounded-full text-gray-800 hover:bg-gray-900/5"
                type="button"
                aria-label="Close"
              >
                <span className="material-icons text-[20px]">close</span>
              </button>
            </div>
            <div className="space-y-3 p-3.5">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
                台帳は追記型です。この操作は新しいエントリを追加します。既存エントリは変更されません。
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className={`${fieldLabel} mb-1.5 block`}>
                    ユーザー
                  </label>
                  <input
                    type="text"
                    value={adjustModal.userId}
                    readOnly
                    className={`${inputBase} h-10 w-full bg-gray-100 text-sm`}
                  />
                </div>
                <div>
                  <label className={`${fieldLabel} mb-1.5 block`}>
                    アセット
                  </label>
                  <select
                    value={adjustModal.asset}
                    onChange={(e) =>
                      setAdjustModal((prev) => ({
                        ...prev,
                        asset: e.target.value,
                      }))
                    }
                    className={`${inputBase} h-10 w-full text-sm`}
                  >
                    {ASSETS.map((asset) => (
                      <option key={asset} value={asset}>
                        {asset}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`${fieldLabel} mb-1.5 block`}>
                    調整額（正=加算, 負=減算）
                  </label>
                  <input
                    type="number"
                    value={adjustModal.amount}
                    onChange={(e) =>
                      setAdjustModal((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    className={`${inputBase} h-10 w-full text-sm`}
                    placeholder="例: -500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`${fieldLabel} mb-1.5 block`}>
                    理由（必須）
                  </label>
                  <input
                    type="text"
                    value={adjustModal.reason}
                    onChange={(e) =>
                      setAdjustModal((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    className={`${inputBase} h-10 w-full text-sm`}
                    placeholder="例: 計算誤差の修正"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 border-t border-gray-200 px-3.5 py-3">
              <button
                onClick={closeAdjustmentModal}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                type="button"
              >
                キャンセル
              </button>
              <button
                onClick={applyAdjustment}
                className="rounded-xl bg-[#d62828] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b71c1c]"
                type="button"
              >
                適用
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${toast.type === "ok" ? "bg-emerald-600" : toast.type === "warn" ? "bg-yellow-600" : "bg-red-600"}`}
          >
            <div>{toast.title}</div>
            {toast.message && (
              <div className="text-xs opacity-90">{toast.message}</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
