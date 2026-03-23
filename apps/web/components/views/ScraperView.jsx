import { useEffect, useMemo, useRef, useState } from "react";
import { panelBase } from "../ui/styles";

const STORAGE_KEY = "kq_csv_import_records";

const mockUsers = [
  { id: "U001", accountNo: "12345678", wallet: "0x9a...1b2c" },
  { id: "U002", accountNo: "87654321", wallet: "0x4f...99aa" },
  { id: "U003", accountNo: "11223344", wallet: "0x77...cdef" },
  { id: "U004", accountNo: "18192021", wallet: "0xa3...4e5f" },
  { id: "U005", accountNo: "14151617", wallet: "0xb1...7c8d" },
];

function csvParse(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;
  const normalized = text
    .replace(/\uFEFF/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  const pushCell = () => {
    row.push(cur);
    cur = "";
  };
  const pushRow = () => {
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < normalized.length; i += 1) {
    const ch = normalized[i];
    if (inQuotes) {
      if (ch === '"') {
        const next = normalized[i + 1];
        if (next === '"') {
          cur += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      pushCell();
    } else if (ch === "\n") {
      pushCell();
      pushRow();
    } else {
      cur += ch;
    }
  }
  pushCell();
  pushRow();

  const compact = rows.filter((r) =>
    r.some((c) => String(c || "").trim() !== ""),
  );
  if (!compact.length) return { header: [], data: [] };
  return {
    header: compact[0].map((h) => String(h || "").trim()),
    data: compact.slice(1),
  };
}

function hashText(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `00000000${(h >>> 0).toString(16)}`.slice(-8);
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString();
}

function statusPill(status) {
  if (status === "APPROVED") return "bg-emerald-100 text-emerald-700";
  if (status === "SKIPPED") return "bg-yellow-100 text-yellow-700";
  if (status === "EXCLUDED") return "bg-gray-200 text-gray-700";
  return "bg-red-100 text-red-700";
}

function makeTemplateCsv() {
  const headers = [
    "broker",
    "トレーダー名",
    "口座タイプ",
    "口座通貨",
    "キャンペーン",
    "発注時間",
    "決済時間",
    "取引カテゴリ",
    "取引タイプ",
    "金融商品",
    "銘柄グループ",
    "ロット数",
    "合計報酬",
    "アフィリエイト報酬",
  ];
  const rows = [headers.join(",")];
  const sample = [
    [
      "XM",
      "U001",
      "Standard",
      "USD",
      "",
      "2026-03-01T09:10:00",
      "2026-03-01T10:02:00",
      "FX",
      "BUY",
      "EURUSD",
      "FX Majors",
      "1.20",
      "120.00",
      "36.00",
    ],
    [
      "FXGT",
      "U003",
      "Standard",
      "USD",
      "",
      "2026-03-01T12:25:00",
      "2026-03-01T13:14:00",
      "FX",
      "SELL",
      "USDJPY",
      "FX Majors",
      "0.80",
      "80.00",
      "24.00",
    ],
  ];
  sample.forEach((r) => rows.push(r.join(",")));
  return rows.join("\n");
}

function parsePreview(text) {
  const { header, data } = csvParse(text);
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  const isNew =
    idx.broker != null &&
    idx["トレーダー名"] != null &&
    idx["アフィリエイト報酬"] != null;
  const isOld = idx.broker != null && idx.accountNo != null && idx.lots != null;

  if (!isNew && !isOld) {
    return {
      preview: [],
      counts: { rows: 0, applied: 0, skipped: 0, excluded: 0 },
      log: [
        "[error] 必須列が不足しています。新形式: broker/トレーダー名/アフィリエイト報酬 または 旧形式: broker/accountNo/lots",
      ],
    };
  }

  const preview = [];
  const counts = { rows: data.length, applied: 0, skipped: 0, excluded: 0 };

  if (isNew) {
    const traderAgg = {};
    data.forEach((row) => {
      const userId = String(row[idx["トレーダー名"]] || "").trim();
      const broker = String(row[idx.broker] || "")
        .trim()
        .toUpperCase();
      const ib = Number(row[idx["アフィリエイト報酬"]] || 0);
      if (!userId) return;
      if (!traderAgg[userId])
        traderAgg[userId] = { userId, broker, ibReward: 0 };
      traderAgg[userId].ibReward += Number.isFinite(ib) ? ib : 0;
    });

    Object.values(traderAgg).forEach((item, i) => {
      const user = mockUsers.find((u) => u.id === item.userId);
      const row = {
        rowNo: i + 1,
        userId: item.userId,
        broker: item.broker,
        accountNo: user?.accountNo || "-",
        ibReward: Math.round(item.ibReward),
        delta: Math.floor(item.ibReward * 0.3),
        status: "APPROVED",
        reason: "還元率30%で算出",
      };
      if (!user) {
        row.status = "EXCLUDED";
        row.reason = "未登録ユーザーのため除外";
      }
      preview.push(row);
      if (row.status === "APPROVED") counts.applied += 1;
      if (row.status === "EXCLUDED") counts.excluded += 1;
    });
  } else {
    data.forEach((row, i) => {
      const broker = String(row[idx.broker] || "")
        .trim()
        .toUpperCase();
      const accountNo = String(row[idx.accountNo] || "").trim();
      const lots = Number(row[idx.lots] || 0);
      const user = mockUsers.find((u) => u.accountNo === accountNo);
      const ibReward = Math.floor((Number.isFinite(lots) ? lots : 0) * 30);
      const item = {
        rowNo: i + 1,
        userId: user?.id || "-",
        broker,
        accountNo,
        ibReward,
        delta: Math.floor(ibReward * 0.3),
        status: "APPROVED",
        reason: "旧フォーマット換算(1lot=30)",
      };
      if (!user) {
        item.status = "EXCLUDED";
        item.reason = "未承認口座または未登録口座";
      }
      preview.push(item);
      if (item.status === "APPROVED") counts.applied += 1;
      if (item.status === "EXCLUDED") counts.excluded += 1;
    });
  }

  return {
    preview,
    counts,
    log: [
      `[parse] rows=${counts.rows} applied=${counts.applied} skipped=${counts.skipped} excluded=${counts.excluded}`,
    ],
  };
}

export default function ScraperView({ isActive }) {
  const fileRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [kqRate, setKqRate] = useState(114.28);
  const [importDraft, setImportDraft] = useState(null);
  const [lastImportTime, setLastImportTime] = useState("未実行");
  const [toast, setToast] = useState(null);

  const importedHashes = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, [importDraft]);

  useEffect(() => {
    const id = setInterval(() => {
      setKqRate((prev) => {
        const next = prev + (Math.random() - 0.5) * 0.8;
        return Math.max(80, Math.min(200, Number(next.toFixed(2))));
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const showToast = (type, title, message) => {
    const id = Date.now();
    setToast({ id, type, title, message });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 2600);
  };

  const handleDownloadTemplate = () => {
    const csv = makeTemplateCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kq_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = async (file) => {
    if (!file) return;
    const text = await file.text();
    const fileHash = hashText(text);
    const parsed = parsePreview(text);
    const isFileDuplicate = importedHashes.includes(fileHash);

    if (isFileDuplicate) {
      parsed.log = [
        ...(parsed.log || []),
        "[warn] 同一ファイル(hash一致)は取り込み済みです",
      ];
    }

    setImportDraft({
      fileName: file.name,
      fileHash,
      isFileDuplicate,
      ...parsed,
    });
  };

  const handleChooseFile = () => {
    fileRef.current?.click();
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const applyCsvImport = () => {
    if (!importDraft) return;
    if (importDraft.isFileDuplicate) {
      showToast("err", "取り込み済み", "同一ファイルは確定できません");
      return;
    }
    if (!importDraft.counts?.applied) {
      showToast("warn", "適用なし", "適用対象行がありません");
      return;
    }

    const records = [...importedHashes, importDraft.fileHash];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

    const now = new Date().toLocaleString();
    setLastImportTime(now);
    setImportDraft(null);
    if (fileRef.current) fileRef.current.value = "";
    showToast(
      "ok",
      "確定しました",
      `${importDraft.counts.applied}行を反映しました`,
    );
  };

  return (
    <section
      className={`view ${isActive ? "" : "is-hidden"} [&.is-hidden]:hidden`}
      id="view-scraper"
    >
      <div className="mb-3.5 rounded-2xl border border-gray-200 bg-white">
        <div className="p-5 text-center">
          <div className="mb-1 text-[0.85rem] text-gray-500">
            KQ トークンレート（リアルタイム）
          </div>
          <div className="text-[2rem] font-black tracking-tight text-gray-800">
            ¥{kqRate.toFixed(2)}
          </div>
        </div>
      </div>

      <div className={panelBase}>
        <div className="border-b border-gray-200 px-4 py-3.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-black text-gray-700">
                取引データCSVインポート
              </div>
              <div className="mt-1 text-[0.86rem] text-gray-500">
                ブローカーからダウンロードしたCSV/Excelを取り込み、KQトークン付与を計算します
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <span className="material-icons text-[18px]">download</span>
              テンプレートCSV
            </button>
          </div>
        </div>

        <div className="p-3.5">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt"
            hidden
            onChange={handleFileInput}
          />

          <div
            className={`rounded-2xl border border-dashed p-10 transition ${
              isDragOver
                ? "border-[#d62828] bg-red-50"
                : "border-gray-300 bg-gray-50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-[#D62828]/12 text-[#D62828]">
                <span className="material-icons">cloud_upload</span>
              </div>
              <div className="mt-4 text-xl font-black text-gray-700">
                CSVファイルをドラッグ&ドロップ
              </div>
              <div className="mt-1 text-[0.85rem] text-gray-500">
                ブローカーのレポートCSVをここにドラッグしてください
              </div>
              <div className="my-4 text-xs text-gray-400">または</div>

              <button
                type="button"
                onClick={handleChooseFile}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D62828] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#B71C1C]"
              >
                <span className="material-icons text-[18px]">folder_open</span>
                ファイルを選択してアップロード
              </button>

              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full border border-gray-300 bg-white px-3 py-0.5 text-[0.72rem] font-semibold text-gray-500">
                  .csv
                </span>
                <span className="rounded-full border border-gray-300 bg-white px-3 py-0.5 text-[0.72rem] font-semibold text-gray-500">
                  .txt
                </span>
              </div>
              <div className="mt-2 text-[0.8rem] text-gray-400">
                CSV内の broker 列でブローカーを自動判定
              </div>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            {importDraft ? (
              <>
                <b>{importDraft.fileName}</b>
                <span className="ml-2 text-xs text-gray-400">
                  hash: {importDraft.fileHash}
                </span>
              </>
            ) : (
              "ファイル未選択"
            )}
          </div>

          <div
            className={`mt-3 grid gap-3 md:grid-cols-2 ${importDraft ? "" : "hidden"}`}
          >
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="text-xs text-gray-500">行数</div>
              <div className="text-xl font-black text-gray-800">
                {importDraft?.counts?.rows ?? 0}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="text-xs text-gray-500">
                適用 / スキップ / 除外
              </div>
              <div className="text-xl font-black text-gray-800">
                {importDraft?.counts?.applied ?? 0} /{" "}
                {importDraft?.counts?.skipped ?? 0} /{" "}
                {importDraft?.counts?.excluded ?? 0}
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] border-separate border-spacing-0 text-[0.83rem]">
                <thead>
                  <tr>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      行
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      ユーザー
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      ブローカー
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      口座番号
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-right text-[0.8rem] font-semibold text-gray-500">
                      原資(IB報酬)
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-right text-[0.8rem] font-semibold text-gray-500">
                      付与KQ
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      ステータス
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      備考
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {importDraft?.preview?.length ? (
                    importDraft.preview.map((r) => (
                      <tr
                        key={`${r.rowNo}-${r.userId}-${r.accountNo}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-200 px-3 py-2.5 text-gray-600">
                          {r.rowNo}
                        </td>
                        <td className="border-b border-gray-200 px-3 py-2.5 font-semibold text-gray-700">
                          {r.userId}
                        </td>
                        <td className="border-b border-gray-200 px-3 py-2.5 text-gray-700">
                          {r.broker || "-"}
                        </td>
                        <td className="border-b border-gray-200 px-3 py-2.5 font-mono text-gray-500">
                          {r.accountNo || "-"}
                        </td>
                        <td className="border-b border-gray-200 px-3 py-2.5 text-right font-semibold text-gray-700">
                          ¥{formatMoney(r.ibReward)}
                        </td>
                        <td className="border-b border-gray-200 px-3 py-2.5 text-right font-semibold text-gray-700">
                          {formatMoney(r.delta)}
                        </td>
                        <td className="border-b border-gray-200 px-3 py-2.5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${statusPill(r.status)}`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="border-b border-gray-200 px-3 py-2.5 text-gray-500">
                          {r.reason}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-3 py-8 text-center text-[0.9rem] text-gray-400"
                      >
                        CSVファイルをアップロードしてください
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {!!importDraft?.log?.length && (
            <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
              <details>
                <summary className="cursor-pointer text-sm text-gray-500">
                  処理ログ
                </summary>
                <pre className="mt-2 max-h-52 overflow-auto rounded-lg bg-white p-2 text-xs text-gray-600">
                  {importDraft.log.join("\n")}
                </pre>
              </details>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={applyCsvImport}
              disabled={
                !importDraft ||
                importDraft.isFileDuplicate ||
                !importDraft.counts?.applied
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#d62828] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#eca5a5]"
            >
              <span className="material-icons text-[18px]">check_circle</span>
              確定して台帳に反映
            </button>
            <div className="text-[0.82rem] text-gray-500">
              最終インポート:{" "}
              <span className="font-semibold">{lastImportTime}</span>
            </div>
          </div>

          <div className="mt-3.5 flex gap-2.5 rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <span
              className="material-icons text-[20px] text-gray-800"
              aria-hidden="true"
            >
              info
            </span>
            <div>
              <div className="font-black text-gray-700">運用フロー</div>
              <div className="mt-0.5 text-[0.84rem] leading-relaxed text-gray-500">
                月1回、各ブローカーの管理画面からレポートCSVをダウンロード →
                この画面でアップロード → プレビュー確認 →
                「確定して台帳に反映」で付与が確定します。
              </div>
            </div>
          </div>
        </div>
      </div>

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
