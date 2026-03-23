import { useState } from "react";
import { panelBase, panelBody } from "../ui/styles";

const initialApprovals = [
  {
    id: "A001",
    userId: "U001",
    wallet: "0x9a...1b2c",
    broker: "EXNESS",
    accountNo: "12345678",
    status: "APPROVED",
    date: "2026/3/9 10:56:39",
  },
  {
    id: "A002",
    userId: "U002",
    wallet: "0x4f...99aa",
    broker: "FXGT",
    accountNo: "87654321",
    status: "APPROVED",
    date: "2026/3/9 10:56:39",
  },
  {
    id: "A003",
    userId: "U003",
    wallet: "0x77...cdef",
    broker: "XM",
    accountNo: "11223344",
    status: "APPROVED",
    date: "2026/3/9 10:56:39",
  },
  {
    id: "A015",
    userId: "U001",
    wallet: "0x9a...1b2c",
    broker: "FXGT",
    accountNo: "14151617",
    status: "PENDING",
    date: "2026/3/9 10:56:39",
  },
  {
    id: "A016",
    userId: "U004",
    wallet: "0xa3...4e5f",
    broker: "XM",
    accountNo: "18192021",
    status: "PENDING",
    date: "2026/3/9 10:56:39",
  },
];

const initialWithdrawals = [
  {
    id: "W001",
    userId: "U001",
    userEmail: "user001@example.com",
    wallet: "0x9a...1b2c",
    kycStatus: "approved",
    holdings: {
      KQ: 1200,
      BTC: 0,
      ETH: 0,
      USDT: 500,
      USDC: 0,
      XRP: 0,
      JPYR: 5000,
      JPYC: 300,
      IZAKAYA: 0,
    },
    withdrawalAmount: 1500,
    asset: "KQ",
    status: "PENDING",
    txHash: "",
    date: "2026/3/9 10:56:39",
  },
  {
    id: "W002",
    userId: "U007",
    userEmail: "user007@example.com",
    wallet: "0xd4...b1c2",
    kycStatus: "approved",
    holdings: {
      KQ: 500,
      BTC: 0.05,
      ETH: 0.2,
      USDT: 5000,
      USDC: 2000,
      XRP: 100,
      JPYR: 10000,
      JPYC: 1500,
      IZAKAYA: 50,
    },
    withdrawalAmount: 300,
    asset: "USDT",
    status: "PENDING",
    txHash: "",
    date: "2026/3/9 10:56:39",
  },
  {
    id: "W003",
    userId: "U004",
    userEmail: "user004@example.com",
    wallet: "0xa3...4e5f",
    kycStatus: "approved",
    holdings: {
      KQ: 800,
      BTC: 0.02,
      ETH: 0.1,
      USDT: 1000,
      USDC: 500,
      XRP: 30,
      JPYR: 8200,
      JPYC: 600,
      IZAKAYA: 0,
    },
    withdrawalAmount: 5000,
    asset: "JPYR",
    status: "PROCESSING",
    txHash: "",
    date: "2026/3/9 10:56:39",
  },
];

const getStatusColor = (status) => {
  if (status === "APPROVED") return "bg-emerald-100 text-emerald-700";
  if (status === "REJECTED") return "bg-red-100 text-red-700";
  if (status === "PENDING") return "bg-yellow-100 text-yellow-700";
  if (status === "PROCESSING") return "bg-blue-100 text-blue-700";
  if (status === "COMPLETED") return "bg-emerald-100 text-emerald-700";
  if (status === "FAILED") return "bg-red-100 text-red-700";
  if (status === "CANCELLED") return "bg-gray-200 text-gray-500";
  return "bg-gray-200 text-gray-500";
};

const getKycStatusColor = (status) => {
  if (status === "approved") return "bg-emerald-100 text-emerald-700";
  if (status === "under_review" || status === "pending")
    return "bg-yellow-100 text-yellow-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  if (status === "not_submitted") return "bg-gray-200 text-gray-700";
  return "bg-gray-200 text-gray-500";
};

const getKycStatusJa = (status) => {
  if (status === "approved") return "承認済";
  if (status === "under_review" || status === "pending") return "審査中";
  if (status === "rejected") return "却下";
  if (status === "not_submitted") return "未提出";
  return status;
};

const getWithdrawalStatusJa = (status) => {
  if (status === "PENDING") return "申請中";
  if (status === "APPROVED") return "承認済";
  if (status === "PROCESSING") return "処理中";
  if (status === "COMPLETED") return "完了";
  if (status === "FAILED") return "失敗";
  if (status === "CANCELLED") return "キャンセル";
  return status;
};

export default function ApprovalsView({ isActive }) {
  const [activeTab, setActiveTab] = useState("accountLinking");
  const [approvalFilter, setApprovalFilter] = useState("ALL");
  const [withdrawalFilter, setWithdrawalFilter] = useState("ALL");
  const [approvals, setApprovals] = useState(initialApprovals);
  const [withdrawals, setWithdrawals] = useState(initialWithdrawals);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [modalType, setModalType] = useState(null); // "approval", "withdrawal", "withdrawalEdit"
  const [toasts, setToasts] = useState([]);
  const [editData, setEditData] = useState({
    asset: "",
    amount: "",
    wallet: "",
    status: "",
    txHash: "",
  });

  // Filtered approvals
  const filteredApprovals =
    approvalFilter === "ALL"
      ? approvals
      : approvals.filter((a) => a.status === approvalFilter);

  // Filtered withdrawals
  const filteredWithdrawals =
    withdrawalFilter === "ALL"
      ? withdrawals
      : withdrawals.filter((w) => w.status === withdrawalFilter);

  const handleOpenApprovalActions = (approval) => {
    setSelectedApproval(approval);
    setSelectedWithdrawal(null);
    setRejectReason("");
    setShowRejectForm(false);
    setModalType("approval");
    setModalOpen(true);
  };

  const handleOpenWithdrawalActions = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setSelectedApproval(null);
    setModalType("withdrawal");
    setModalOpen(true);
  };

  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000,
    );
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedApproval(null);
    setSelectedWithdrawal(null);
    setShowRejectForm(false);
    setEditData({ asset: "", amount: "", wallet: "", status: "", txHash: "" });
  };

  const handleApproveApplication = () => {
    if (selectedApproval) {
      setApprovals(
        approvals.map((a) =>
          a.id === selectedApproval.id ? { ...a, status: "APPROVED" } : a,
        ),
      );
      addToast(
        "ok",
        "承認しました",
        `${selectedApproval.id} を APPROVED に更新`,
      );
      handleCloseModal();
    }
  };

  const handleRejectApplication = () => {
    setShowRejectForm(true);
  };

  const handleConfirmRejectApplication = () => {
    if (!rejectReason.trim()) {
      addToast("err", "入力不正", "理由を入力してください");
      return;
    }
    if (selectedApproval) {
      setApprovals(
        approvals.map((a) =>
          a.id === selectedApproval.id
            ? { ...a, status: "REJECTED", rejectedReason: rejectReason }
            : a,
        ),
      );
      addToast(
        "ok",
        "却下しました",
        `${selectedApproval.id} を REJECTED に更新`,
      );
      handleCloseModal();
    }
  };

  const handleApproveWithdrawal = () => {
    if (selectedWithdrawal) {
      setWithdrawals(
        withdrawals.map((w) =>
          w.id === selectedWithdrawal.id ? { ...w, status: "APPROVED" } : w,
        ),
      );
      addToast("ok", "承認", `${selectedWithdrawal.id}: 承認済`);
      handleCloseModal();
    }
  };

  const handleProcessWithdrawal = () => {
    if (selectedWithdrawal) {
      setWithdrawals(
        withdrawals.map((w) =>
          w.id === selectedWithdrawal.id ? { ...w, status: "PROCESSING" } : w,
        ),
      );
      addToast("ok", "送金ステータス更新", `${selectedWithdrawal.id}: 処理中`);
      handleCloseModal();
    }
  };

  const handleCompleteWithdrawal = () => {
    if (selectedWithdrawal) {
      const txHash =
        "0x" + Math.random().toString(16).slice(2).padEnd(64, "0").slice(0, 64);
      setWithdrawals(
        withdrawals.map((w) =>
          w.id === selectedWithdrawal.id
            ? { ...w, status: "COMPLETED", txHash }
            : w,
        ),
      );
      addToast("ok", "送金ステータス更新", `${selectedWithdrawal.id}: 完了`);
      handleCloseModal();
    }
  };

  const handleFailWithdrawal = () => {
    if (selectedWithdrawal) {
      setWithdrawals(
        withdrawals.map((w) =>
          w.id === selectedWithdrawal.id ? { ...w, status: "FAILED" } : w,
        ),
      );
      addToast("err", "送金ステータス更新", `${selectedWithdrawal.id}: 失敗`);
      handleCloseModal();
    }
  };

  const handleOpenWithdrawalEdit = () => {
    if (selectedWithdrawal) {
      setEditData({
        asset: selectedWithdrawal.asset || "",
        amount: String(selectedWithdrawal.withdrawalAmount || ""),
        wallet: selectedWithdrawal.wallet || "",
        status: selectedWithdrawal.status || "PENDING",
        txHash: selectedWithdrawal.txHash || "",
      });
      setModalType("withdrawalEdit");
    }
  };

  const handleSaveWithdrawalEdit = () => {
    const amount = Number(editData.amount);
    if (!Number.isFinite(amount) || amount < 0) {
      addToast("err", "入力不正", "数量が不正です");
      return;
    }
    if (selectedWithdrawal) {
      let txHash = editData.txHash.trim();
      if (editData.status === "COMPLETED" && !txHash) {
        txHash =
          "0x" +
          Math.random().toString(16).slice(2).padEnd(64, "0").slice(0, 64);
      }
      setWithdrawals(
        withdrawals.map((w) =>
          w.id === selectedWithdrawal.id
            ? {
                ...w,
                asset: editData.asset.trim() || w.asset,
                withdrawalAmount: Math.floor(amount),
                wallet: editData.wallet.trim() || w.wallet,
                status: editData.status,
                txHash,
              }
            : w,
        ),
      );
      addToast("ok", "保存しました", `出金 ${selectedWithdrawal.id} を更新`);
      handleCloseModal();
    }
  };

  const addDemoApplication = () => {
    const newId = `A${String(Math.max(...approvals.filter((a) => a.id.startsWith("A")).map((a) => parseInt(a.id.slice(1))), 0) + 1).padStart(3, "0")}`;
    const brokers = ["EXNESS", "FXGT", "XM"];
    const users = ["U001", "U002", "U003", "U004", "U005"];
    const newApproval = {
      id: newId,
      userId: users[Math.floor(Math.random() * users.length)],
      wallet: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      broker: brokers[Math.floor(Math.random() * brokers.length)],
      accountNo: String(Math.floor(10000000 + Math.random() * 89999999)),
      status: "PENDING",
      date: new Date().toLocaleString(),
    };
    setApprovals([newApproval, ...approvals]);
  };

  const addDemoWithdrawal = () => {
    const newId = `W${String(Math.max(...withdrawals.filter((w) => w.id.startsWith("W")).map((w) => parseInt(w.id.slice(1))), 0) + 1).padStart(3, "0")}`;
    const users = ["U001", "U002", "U003", "U004", "U005"];
    const assets = ["KQ", "USDT", "JPYR"];
    const kycStatuses = ["approved", "under_review", "not_submitted"];
    const userId = users[Math.floor(Math.random() * users.length)];
    const newWithdrawal = {
      id: newId,
      userId,
      userEmail: `user${userId.slice(1)}@example.com`,
      wallet: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      kycStatus: kycStatuses[Math.floor(Math.random() * kycStatuses.length)],
      holdings: {
        KQ: Math.floor(500 + Math.random() * 2000),
        BTC: Math.random() * 0.1,
        ETH: Math.random() * 0.5,
        USDT: Math.floor(1000 + Math.random() * 10000),
        USDC: Math.floor(500 + Math.random() * 5000),
        XRP: Math.floor(50 + Math.random() * 500),
        JPYR: Math.floor(3000 + Math.random() * 10000),
        JPYC: Math.floor(200 + Math.random() * 2000),
        IZAKAYA: Math.floor(Math.random() * 100),
      },
      withdrawalAmount: Math.floor(100 + Math.random() * 2000),
      asset: assets[Math.floor(Math.random() * assets.length)],
      status: "PENDING",
      txHash: "",
      date: new Date().toLocaleString(),
    };
    setWithdrawals([newWithdrawal, ...withdrawals]);
  };
  return (
    <section
      className={`view ${isActive ? "" : "is-hidden"} [&.is-hidden]:hidden`}
      id="view-approvalTasks"
    >
      <div className={panelBase}>
        <div className="border-b border-gray-200 px-4 py-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-black text-gray-700">承認タスク</div>
              <div className="mt-1 text-[0.86rem] text-gray-500">
                口座連携申請と出金申請の承認/却下を一元管理
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addDemoApplication}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-gray-600 hover:bg-gray-50"
              >
                + デモ口座申請
              </button>
              <button
                onClick={addDemoWithdrawal}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-gray-600 hover:bg-gray-50"
              >
                + デモ出金申請
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("accountLinking")}
              className={`flex items-center gap-2 border-b-2 pb-2 text-[0.78rem] font-semibold transition ${
                activeTab === "accountLinking"
                  ? "border-b-[#d62828] text-[#d62828]"
                  : "border-b-transparent text-gray-500"
              }`}
            >
              <span className="material-icons text-[15px]">how_to_reg</span>
              口座連携申請
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-200 px-1.5 text-[0.68rem] text-gray-600">
                {filteredApprovals.filter((a) => a.status === "PENDING").length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("withdrawalRequests")}
              className={`flex items-center gap-2 border-b-2 pb-2 text-[0.78rem] font-semibold transition ${
                activeTab === "withdrawalRequests"
                  ? "border-b-[#d62828] text-[#d62828]"
                  : "border-b-transparent text-gray-500"
              }`}
            >
              <span className="material-icons text-[15px]">payments</span>
              出金申請
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-200 px-1.5 text-[0.68rem] text-gray-600">
                {
                  filteredWithdrawals.filter((w) =>
                    ["PENDING", "PROCESSING"].includes(w.status),
                  ).length
                }
              </span>
            </button>
          </div>
        </div>

        <div className={`${panelBody} pt-3`}>
          {/* Account Linking Tab */}
          {activeTab === "accountLinking" && (
            <>
              <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
                <div className="flex w-full flex-col gap-1.5 sm:w-auto sm:min-w-[220px]">
                  <label className="text-[0.82rem] font-semibold text-gray-500">
                    ステータス
                  </label>
                  <select
                    value={approvalFilter}
                    onChange={(e) => setApprovalFilter(e.target.value)}
                    className="h-11 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#d62828]/20"
                  >
                    <option value="ALL">すべて</option>
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
                <div className="text-sm text-gray-400">
                  <span id="approvalsHint">{filteredApprovals.length}件</span>
                </div>
              </div>

              <div className="table-wrap overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="table w-full min-w-[860px] border-separate border-spacing-0 text-[0.83rem]">
                    <thead>
                      <tr>
                        <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                          申請日時
                        </th>
                        <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                          ユーザー (Wallet)
                        </th>
                        <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                          ブローカー
                        </th>
                        <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                          口座番号
                        </th>
                        <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                          ステータス
                        </th>
                        <th className="bg-gray-50 px-3 py-2.5 text-right text-[0.8rem] font-semibold text-gray-500">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApprovals.length > 0 ? (
                        filteredApprovals.map((row) => (
                          <tr key={row.id} className="hover:bg-gray-50">
                            <td className="border-b border-gray-200 px-3 py-2.5 text-gray-500">
                              {row.date}
                            </td>
                            <td className="border-b border-gray-200 px-3 py-2.5">
                              <div className="font-semibold text-gray-700">
                                {row.userId}
                              </div>
                              <div className="font-mono text-[0.75rem] text-gray-500">
                                {row.wallet}
                              </div>
                            </td>
                            <td className="border-b border-gray-200 px-3 py-2.5">
                              <span className="inline-flex rounded-full bg-gray-200 px-2 py-1 text-[0.62rem] font-semibold tracking-wide text-red-600">
                                {row.broker}
                              </span>
                            </td>
                            <td className="border-b border-gray-200 px-3 py-2.5 font-mono text-gray-500">
                              {row.accountNo}
                            </td>
                            <td className="border-b border-gray-200 px-3 py-2.5">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-bold ${getStatusColor(
                                  row.status,
                                )}`}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="border-b border-gray-200 px-3 py-2.5 text-right">
                              <button
                                onClick={() => handleOpenApprovalActions(row)}
                                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-1.5 text-[0.75rem] font-semibold text-gray-500 hover:bg-gray-100"
                              >
                                操作
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="border-b border-gray-200 px-3 py-8 text-center text-gray-400"
                          >
                            該当データがありません
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Withdrawal Requests Tab */}
          {activeTab === "withdrawalRequests" && (
            <>
              <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
                <div className="flex w-full flex-col gap-1.5 sm:w-auto sm:min-w-[220px]">
                  <label className="text-[0.82rem] font-semibold text-gray-500">
                    送金ステータス
                  </label>
                  <select
                    value={withdrawalFilter}
                    onChange={(e) => setWithdrawalFilter(e.target.value)}
                    className="h-11 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#d62828]/20"
                  >
                    <option value="ALL">すべて</option>
                    <option value="PENDING">申請中</option>
                    <option value="APPROVED">承認済み</option>
                    <option value="PROCESSING">処理中</option>
                    <option value="COMPLETED">完了</option>
                    <option value="FAILED">失敗</option>
                    <option value="CANCELLED">キャンセル</option>
                  </select>
                </div>
                <div className="text-sm text-gray-400">
                  <span id="withdrawalsHint">
                    {filteredWithdrawals.length}件
                  </span>
                </div>
              </div>

              <div className="table-wrap overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="table w-full min-w-[1100px] border-separate border-spacing-0 text-[0.83rem]">
                    <thead>
                      <tr>
                        <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                          申請日時
                        </th>
                        <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                          ユーザーID
                        </th>
                        <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                          メール
                        </th>
                        <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                          ウォレットアドレス
                        </th>
                        <th className="bg-gray-50 px-3 py-2.5 text-right text-[0.8rem] font-semibold text-gray-500">
                          保有ポイント
                        </th>
                        <th className="bg-gray-50 px-3 py-2.5 text-right text-[0.8rem] font-semibold text-gray-500">
                          出金申請額
                        </th>
                        <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                          アセット
                        </th>
                        <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                          送金ステータス
                        </th>
                        <th className="bg-gray-50 px-3 py-2.5 text-right text-[0.8rem] font-semibold text-gray-500">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWithdrawals.length > 0 ? (
                        filteredWithdrawals.map((row) => (
                          <tr key={row.id} className="hover:bg-gray-50">
                            <td className="border-b border-gray-200 px-3 py-2.5 text-gray-500">
                              {row.date}
                            </td>
                            <td className="border-b border-gray-200 px-3 py-2.5 font-semibold text-gray-700">
                              {row.userId}
                            </td>
                            <td className="border-b border-gray-200 px-3 py-2.5 font-mono text-gray-500">
                              {row.userEmail}
                            </td>
                            <td className="border-b border-gray-200 px-3 py-2.5 font-mono text-gray-500">
                              {row.wallet}
                            </td>
                            <td className="border-b border-gray-200 px-3 py-2.5 text-right font-semibold text-gray-700">
                              {row.holdings
                                ? Object.values(row.holdings)
                                    .reduce((s, v) => s + Number(v || 0), 0)
                                    .toLocaleString()
                                : "-"}
                            </td>
                            <td className="border-b border-gray-200 px-3 py-2.5 text-right font-semibold text-gray-700">
                              {row.withdrawalAmount.toLocaleString()}
                            </td>
                            <td className="border-b border-gray-200 px-3 py-2.5">
                              <span className="inline-flex rounded-full bg-gray-200 px-2 py-1 text-[0.62rem] font-semibold text-gray-600">
                                {row.asset}
                              </span>
                            </td>
                            <td className="border-b border-gray-200 px-3 py-2.5">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-bold ${getStatusColor(
                                  row.status,
                                )}`}
                              >
                                {getWithdrawalStatusJa(row.status)}
                              </span>
                            </td>
                            <td className="border-b border-gray-200 px-3 py-2.5 text-right">
                              <button
                                onClick={() => handleOpenWithdrawalActions(row)}
                                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-1.5 text-[0.75rem] font-semibold text-gray-500 hover:bg-gray-100"
                              >
                                操作
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="9"
                            className="border-b border-gray-200 px-3 py-8 text-center text-gray-400"
                          >
                            該当データがありません
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {modalOpen && modalType === "approval" && selectedApproval && (
        <div className="modal fixed inset-0 z-30 grid place-items-center bg-black/55 p-[18px]">
          <div className="modal-card w-full max-w-[720px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_15px_rgba(15,23,42,0.06)]">
            <div className="modal-h flex items-center justify-between gap-2.5 border-b border-gray-200 px-3.5 py-3">
              <div className="modal-title font-black">
                {showRejectForm
                  ? "却下理由の入力"
                  : `口座申請 操作: ${selectedApproval.id}`}
              </div>
              <button
                onClick={handleCloseModal}
                className="icon-btn grid h-[34px] w-[34px] place-items-center rounded-full bg-transparent text-gray-800 hover:bg-gray-900/5"
                type="button"
                aria-label="Close"
              >
                <span className="material-icons text-[20px]">close</span>
              </button>
            </div>

            <div className="modal-b p-3.5">
              {showRejectForm ? (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    理由（必須）
                  </label>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="例：口座番号が不正、本人確認未完了など"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d62828]/20"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">
                      申請日時
                    </span>
                    <span className="text-sm text-gray-700">
                      {selectedApproval.date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">
                      ユーザー
                    </span>
                    <span className="text-sm text-gray-700">
                      {selectedApproval.userId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">
                      Wallet
                    </span>
                    <span className="font-mono text-sm text-gray-700">
                      {selectedApproval.wallet}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">
                      ブローカー
                    </span>
                    <span className="text-sm text-gray-700">
                      {selectedApproval.broker}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">
                      口座番号
                    </span>
                    <span className="font-mono text-sm text-gray-700">
                      {selectedApproval.accountNo}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">
                      ステータス
                    </span>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-bold ${getStatusColor(
                        selectedApproval.status,
                      )}`}
                    >
                      {selectedApproval.status === "APPROVED"
                        ? "承認済"
                        : selectedApproval.status === "REJECTED"
                          ? "却下"
                          : selectedApproval.status === "PENDING"
                            ? "未承認"
                            : selectedApproval.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    承認または却下を選択してください
                  </p>
                </div>
              )}
            </div>

            <div className="modal-f flex items-center justify-between gap-2.5 border-t border-gray-200 px-3.5 py-3">
              {showRejectForm ? (
                <>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleConfirmRejectApplication}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    却下する
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCloseModal}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={handleApproveApplication}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      承認
                    </button>
                    <button
                      onClick={handleRejectApplication}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      却下
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {modalOpen && modalType === "withdrawal" && selectedWithdrawal && (
        <div className="modal fixed inset-0 z-30 grid place-items-center bg-black/55 p-[18px]">
          <div className="modal-card w-full max-w-[720px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_15px_rgba(15,23,42,0.06)]">
            <div className="modal-h flex items-center justify-between gap-2.5 border-b border-gray-200 px-3.5 py-3">
              <div className="modal-title font-black">
                出金操作: {selectedWithdrawal.id}
              </div>
              <button
                onClick={handleCloseModal}
                className="icon-btn grid h-[34px] w-[34px] place-items-center rounded-full bg-transparent text-gray-800 hover:bg-gray-900/5"
                type="button"
                aria-label="Close"
              >
                <span className="material-icons text-[20px]">close</span>
              </button>
            </div>

            <div className="modal-b p-3.5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">
                    ユーザーID
                  </span>
                  <span className="text-sm text-gray-700">
                    {selectedWithdrawal.userId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">
                    メール
                  </span>
                  <span className="font-mono text-sm text-gray-700">
                    {selectedWithdrawal.userEmail}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">
                    KYC
                  </span>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-bold ${getKycStatusColor(
                      selectedWithdrawal.kycStatus,
                    )}`}
                  >
                    {getKycStatusJa(selectedWithdrawal.kycStatus)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">
                    ウォレットアドレス
                  </span>
                  <span className="font-mono text-sm text-gray-700">
                    {selectedWithdrawal.wallet}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="shrink-0 text-sm font-semibold text-gray-600">
                    保有残高
                  </span>
                  <div className="flex flex-wrap justify-end gap-1">
                    {selectedWithdrawal.holdings &&
                      Object.entries(selectedWithdrawal.holdings).map(
                        ([currency, amount], idx) => {
                          const display =
                            typeof amount === "number" &&
                            amount > 0 &&
                            amount < 1
                              ? amount.toFixed(4)
                              : Math.floor(amount || 0).toLocaleString();
                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[0.68rem] font-semibold text-gray-700"
                            >
                              {currency}: <b className="ml-1">{display}</b>
                            </span>
                          );
                        },
                      )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">
                    出金申請額
                  </span>
                  <span className="text-sm font-bold text-gray-700">
                    {selectedWithdrawal.withdrawalAmount.toLocaleString()}{" "}
                    {selectedWithdrawal.asset}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">
                    送金ステータス
                  </span>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-bold ${getStatusColor(
                      selectedWithdrawal.status,
                    )}`}
                  >
                    {getWithdrawalStatusJa(selectedWithdrawal.status)}
                  </span>
                </div>
                {selectedWithdrawal.txHash && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">
                      TxHash
                    </span>
                    <span className="font-mono text-[0.7rem] text-gray-700 break-all">
                      {selectedWithdrawal.txHash}
                    </span>
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm text-gray-600">
                状態遷移: PENDING → 承認 → 処理中 → 完了/失敗
              </p>
            </div>

            <div className="modal-f flex items-center justify-between gap-2.5 border-t border-gray-200 px-3.5 py-3">
              <button
                onClick={handleCloseModal}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                閉じる
              </button>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleOpenWithdrawalEdit}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  編集
                </button>
                {selectedWithdrawal.status === "PENDING" && (
                  <button
                    onClick={handleApproveWithdrawal}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    承認
                  </button>
                )}
                {selectedWithdrawal.status === "APPROVED" && (
                  <button
                    onClick={handleProcessWithdrawal}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    送金処理開始
                  </button>
                )}
                {selectedWithdrawal.status === "PROCESSING" && (
                  <>
                    <button
                      onClick={handleCompleteWithdrawal}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      送金完了
                    </button>
                    <button
                      onClick={handleFailWithdrawal}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      送金失敗
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Withdrawal Edit Modal */}
      {modalOpen && modalType === "withdrawalEdit" && selectedWithdrawal && (
        <div className="modal fixed inset-0 z-30 grid place-items-center bg-black/55 p-[18px]">
          <div className="modal-card w-full max-w-[720px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_15px_rgba(15,23,42,0.06)]">
            <div className="modal-h flex items-center justify-between gap-2.5 border-b border-gray-200 px-3.5 py-3">
              <div className="modal-title font-black">
                出金申請 編集: {selectedWithdrawal.id}
              </div>
              <button
                onClick={handleCloseModal}
                className="icon-btn grid h-[34px] w-[34px] place-items-center rounded-full bg-transparent text-gray-800 hover:bg-gray-900/5"
                type="button"
                aria-label="Close"
              >
                <span className="material-icons text-[20px]">close</span>
              </button>
            </div>
            <div className="modal-b p-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[0.82rem] font-semibold text-gray-500">
                    アセット
                  </label>
                  <input
                    type="text"
                    value={editData.asset}
                    onChange={(e) =>
                      setEditData({ ...editData, asset: e.target.value })
                    }
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d62828]/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.82rem] font-semibold text-gray-500">
                    数量
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={editData.amount}
                    onChange={(e) =>
                      setEditData({ ...editData, amount: e.target.value })
                    }
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d62828]/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.82rem] font-semibold text-gray-500">
                    送付先
                  </label>
                  <input
                    type="text"
                    value={editData.wallet}
                    onChange={(e) =>
                      setEditData({ ...editData, wallet: e.target.value })
                    }
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d62828]/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.82rem] font-semibold text-gray-500">
                    送金ステータス
                  </label>
                  <select
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value })
                    }
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#d62828]/20"
                  >
                    <option value="PENDING">未処理</option>
                    <option value="PROCESSING">処理中</option>
                    <option value="COMPLETED">完了</option>
                    <option value="FAILED">失敗</option>
                  </select>
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[0.82rem] font-semibold text-gray-500">
                    TxHash（任意）
                  </label>
                  <input
                    type="text"
                    value={editData.txHash}
                    onChange={(e) =>
                      setEditData({ ...editData, txHash: e.target.value })
                    }
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-[#d62828]/20"
                  />
                </div>
              </div>
            </div>
            <div className="modal-f flex items-center justify-between gap-2.5 border-t border-gray-200 px-3.5 py-3">
              <button
                onClick={handleCloseModal}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSaveWithdrawalEdit}
                className="rounded-xl bg-[#d62828] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b71c1c]"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`flex items-start gap-3 rounded-xl px-4 py-3 text-white shadow-lg ${
                t.type === "ok" ? "bg-emerald-600" : "bg-red-600"
              }`}
            >
              <span className="material-icons mt-0.5 text-[18px]">
                {t.type === "ok" ? "check_circle" : "error"}
              </span>
              <div>
                <div className="text-sm font-bold">{t.title}</div>
                {t.message && (
                  <div className="text-[0.75rem] opacity-85">{t.message}</div>
                )}
              </div>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((x) => x.id !== t.id))
                }
                className="ml-2 text-white/70 hover:text-white"
              >
                <span className="material-icons text-[16px]">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
