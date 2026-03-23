import { useMemo, useState } from "react";
import { panelBase } from "../ui/styles";

const initialUsers = [
  {
    id: "U001",
    email: "user001@example.com",
    wallet: "0x9a...1b2c",
    rank: "GOLD",
    rankTone: "gold",
    kyc: "APPROVED",
    kycTone: "APPROVED",
    accounts: [
      { broker: "EXNESS", no: "12345678", status: "APPROVED" },
      { broker: "FXGT", no: "14151617", status: "PENDING" },
    ],
    balances: {
      KQ: 12000,
      BTC: 0.05,
      ETH: 0.8,
      USDT: 500,
      USDC: 300,
      XRP: 200,
      JPYR: 8000,
      JPYC: 5000,
      IZAKAYA: 150,
    },
    status: "ACTIVE",
  },
  {
    id: "U002",
    email: "user002@example.com",
    wallet: "0x4f...99aa",
    rank: "SILVER",
    rankTone: "silver",
    kyc: "APPROVED",
    kycTone: "APPROVED",
    accounts: [{ broker: "FXGT", no: "87654321", status: "APPROVED" }],
    balances: {
      KQ: 3500,
      BTC: 0.01,
      ETH: 0.2,
      USDT: 150,
      USDC: 80,
      XRP: 80,
      JPYR: 3200,
      JPYC: 1500,
      IZAKAYA: 40,
    },
    status: "ACTIVE",
  },
  {
    id: "U003",
    email: "user003@example.com",
    wallet: "0x77...cdef",
    rank: "MEMBER",
    rankTone: "member",
    kyc: "PENDING",
    kycTone: "PENDING",
    accounts: [{ broker: "XM", no: "11223344", status: "APPROVED" }],
    balances: {
      KQ: 900,
      BTC: 0,
      ETH: 0,
      USDT: 50,
      USDC: 30,
      XRP: 30,
      JPYR: 4500,
      JPYC: 800,
      IZAKAYA: 0,
    },
    status: "ACTIVE",
  },
  {
    id: "U004",
    email: "user004@example.com",
    wallet: "0xa3...4e5f",
    rank: "GOLD",
    rankTone: "gold",
    kyc: "APPROVED",
    kycTone: "APPROVED",
    accounts: [
      { broker: "EXNESS", no: "22334455", status: "APPROVED" },
      { broker: "XM", no: "18192021", status: "PENDING" },
    ],
    balances: {
      KQ: 8200,
      BTC: 0.03,
      ETH: 0.5,
      USDT: 350,
      USDC: 200,
      XRP: 150,
      JPYR: 6000,
      JPYC: 3000,
      IZAKAYA: 100,
    },
    status: "ACTIVE",
  },
  {
    id: "U005",
    email: "user005@example.com",
    wallet: "0xb1...7c8d",
    rank: "SILVER",
    rankTone: "silver",
    kyc: "APPROVED",
    kycTone: "APPROVED",
    accounts: [
      { broker: "FXGT", no: "33445566", status: "APPROVED" },
      { broker: "XM", no: "30405060", status: "APPROVED" },
    ],
    balances: {
      KQ: 4100,
      BTC: 0.02,
      ETH: 0.3,
      USDT: 200,
      USDC: 120,
      XRP: 100,
      JPYR: 2800,
      JPYC: 1200,
      IZAKAYA: 60,
    },
    status: "ACTIVE",
  },
  {
    id: "U006",
    email: "user006@example.com",
    wallet: "0xc2...9e0a",
    rank: "MEMBER",
    rankTone: "member",
    kyc: "NOT_SUBMITTED",
    kycTone: "NOT_SUBMITTED",
    accounts: [{ broker: "XM", no: "44556677", status: "APPROVED" }],
    balances: {
      KQ: 1500,
      BTC: 0,
      ETH: 0.1,
      USDT: 80,
      USDC: 50,
      XRP: 40,
      JPYR: 1200,
      JPYC: 600,
      IZAKAYA: 20,
    },
    status: "ACTIVE",
  },
  {
    id: "U007",
    email: "user007@example.com",
    wallet: "0xd4...b1c2",
    rank: "GOLD",
    rankTone: "gold",
    kyc: "APPROVED",
    kycTone: "APPROVED",
    accounts: [
      { broker: "EXNESS", no: "55667788", status: "APPROVED" },
      { broker: "XM", no: "50607080", status: "APPROVED" },
    ],
    balances: {
      KQ: 15000,
      BTC: 0.08,
      ETH: 1.2,
      USDT: 800,
      USDC: 450,
      XRP: 300,
      JPYR: 12000,
      JPYC: 7000,
      IZAKAYA: 200,
    },
    status: "ACTIVE",
  },
  {
    id: "U008",
    email: "user008@example.com",
    wallet: "0xe5...d3e4",
    rank: "SILVER",
    rankTone: "silver",
    kyc: "APPROVED",
    kycTone: "APPROVED",
    accounts: [{ broker: "FXGT", no: "66778899", status: "APPROVED" }],
    balances: {
      KQ: 2800,
      BTC: 0.01,
      ETH: 0.15,
      USDT: 120,
      USDC: 70,
      XRP: 60,
      JPYR: 3200,
      JPYC: 900,
      IZAKAYA: 30,
    },
    status: "ACTIVE",
  },
  {
    id: "U009",
    email: "user009@example.com",
    wallet: "0xf6...f5a6",
    rank: "MEMBER",
    rankTone: "member",
    kyc: "PENDING",
    kycTone: "PENDING",
    accounts: [{ broker: "XM", no: "77889900", status: "APPROVED" }],
    balances: {
      KQ: 600,
      BTC: 0,
      ETH: 0,
      USDT: 30,
      USDC: 20,
      XRP: 15,
      JPYR: 800,
      JPYC: 400,
      IZAKAYA: 10,
    },
    status: "ACTIVE",
  },
  {
    id: "U010",
    email: "user010@example.com",
    wallet: "0xa7...17b8",
    rank: "SILVER",
    rankTone: "silver",
    kyc: "APPROVED",
    kycTone: "APPROVED",
    accounts: [{ broker: "EXNESS", no: "88990011", status: "APPROVED" }],
    balances: {
      KQ: 5200,
      BTC: 0.02,
      ETH: 0.4,
      USDT: 250,
      USDC: 140,
      XRP: 120,
      JPYR: 4000,
      JPYC: 2000,
      IZAKAYA: 80,
    },
    status: "ACTIVE",
  },
  {
    id: "U011",
    email: "user011@example.com",
    wallet: "0xb8...29c9",
    rank: "GOLD",
    rankTone: "gold",
    kyc: "APPROVED",
    kycTone: "APPROVED",
    accounts: [{ broker: "FXGT", no: "99001122", status: "APPROVED" }],
    balances: {
      KQ: 9800,
      BTC: 0.04,
      ETH: 0.6,
      USDT: 400,
      USDC: 220,
      XRP: 180,
      JPYR: 7500,
      JPYC: 4000,
      IZAKAYA: 120,
    },
    status: "ACTIVE",
  },
  {
    id: "U012",
    email: "user012@example.com",
    wallet: "0xc9...3bda",
    rank: "MEMBER",
    rankTone: "member",
    kyc: "NOT_SUBMITTED",
    kycTone: "NOT_SUBMITTED",
    accounts: [{ broker: "XM", no: "10111213", status: "APPROVED" }],
    balances: {
      KQ: 1100,
      BTC: 0,
      ETH: 0.05,
      USDT: 60,
      USDC: 35,
      XRP: 25,
      JPYR: 900,
      JPYC: 500,
      IZAKAYA: 15,
    },
    status: "ACTIVE",
  },
];

function rankClass(tone) {
  if (tone === "gold") return "text-red-600";
  if (tone === "silver") return "text-red-600";
  return "text-red-600";
}

function kycClass(tone) {
  if (tone === "APPROVED") return "bg-emerald-100 text-emerald-700";
  if (tone === "PENDING") return "bg-amber-100 text-amber-700";
  return "bg-gray-200 text-gray-500";
}

function kycLabel(status) {
  if (status === "APPROVED") return "承認済";
  if (status === "PENDING") return "審査中";
  if (status === "NOT_SUBMITTED") return "未提出";
  if (status === "REJECTED") return "却下";
  return status;
}

function statusClass(status) {
  if (status === "APPROVED") return "bg-emerald-100 text-emerald-700";
  if (status === "PENDING") return "bg-gray-200 text-gray-500";
  return "bg-red-100 text-red-700";
}

export default function UsersView({ isActive }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const addToast = (type, title, message = "") => {
    const id = Date.now() + Math.random();
    setToast({ id, type, title, message });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 2600);
  };

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.id.toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q),
    );
  }, [users, searchQuery]);

  const handleOpenUserActions = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalOpen(false);
  };

  const handleAddDemoWithdrawalRequest = () => {
    const activeUsers = users.filter((u) => u.status === "ACTIVE");
    const pendingSet = new Set(
      withdrawalRequests
        .filter((r) => r.status === "PENDING")
        .map((r) => r.userId),
    );
    const candidates = activeUsers.filter((u) => !pendingSet.has(u.id));
    if (candidates.length === 0) {
      addToast("warn", "追加不可", "退会申請可能なユーザーがいません");
      return;
    }
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    setWithdrawalRequests((prev) => [
      ...prev,
      {
        id: `WR_${Math.random().toString(16).slice(2)}_${Date.now()}`,
        userId: picked.id,
        requestedAt: new Date().toISOString(),
        status: "PENDING",
      },
    ]);
    addToast("ok", "デモ退会申請を追加", `ユーザー ${picked.id} の退会申請`);
  };

  const handleBanUser = () => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, status: "BANNED" } : u,
      ),
    );
    addToast("warn", "強制退会しました", `${selectedUser.id} をBANしました`);
    handleCloseModal();
  };

  const handleUnbanUser = () => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, status: "ACTIVE" } : u,
      ),
    );
    addToast(
      "ok",
      "BAN解除しました",
      `${selectedUser.id} をACTIVEに戻しました`,
    );
    handleCloseModal();
  };

  const handleConfiscate = () => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              balances: Object.fromEntries(
                Object.keys(u.balances).map((k) => [k, 0]),
              ),
            }
          : u,
      ),
    );
    addToast(
      "warn",
      "トークン没収しました",
      `${selectedUser.id} の残高を0にしました`,
    );
    handleCloseModal();
  };

  const handleApproveWithdrawalRequest = () => {
    if (!selectedUser) return;
    const pendingReq = withdrawalRequests.find(
      (r) => r.userId === selectedUser.id && r.status === "PENDING",
    );
    if (!pendingReq) return;

    setWithdrawalRequests((prev) =>
      prev.map((r) =>
        r.id === pendingReq.id
          ? { ...r, status: "APPROVED", approvedAt: new Date().toISOString() }
          : r,
      ),
    );
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, status: "WITHDRAWN" } : u,
      ),
    );
    addToast(
      "ok",
      "退会申請を承認しました",
      `ユーザー ${selectedUser.id} を退会処理しました`,
    );
    handleCloseModal();
  };

  const pendingForUser = (userId) =>
    withdrawalRequests.find(
      (r) => r.userId === userId && r.status === "PENDING",
    );

  return (
    <section
      className={`view ${isActive ? "" : "is-hidden"} [&.is-hidden]:hidden`}
      id="view-users"
    >
      <div className={panelBase}>
        <div className="border-b border-gray-200 px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-black text-gray-700">
                ユーザー管理
              </div>
              <div className="mt-1 text-[0.86rem] text-gray-500">
                ウォレット・ランク・残高の確認。BAN・トークン没収・退会処理
              </div>
            </div>
            <button
              onClick={handleAddDemoWithdrawalRequest}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-gray-600 hover:bg-gray-50"
              type="button"
            >
              + デモ退会申請を追加
            </button>
          </div>

          <div className="mt-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div className="w-full sm:max-w-[380px]">
              <label className="mb-1.5 block text-[0.78rem] font-semibold text-gray-500">
                検索（user_id, メール）
              </label>
              <input
                className="h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#d62828]/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="U001, user@example.com..."
              />
            </div>
            <div className="pb-1 text-sm text-gray-400 sm:ml-auto">
              {filteredUsers.length}件
            </div>
          </div>
        </div>

        <div className="p-3.5">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table
                className="w-full min-w-[1080px] border-separate border-spacing-0 text-[0.82rem]"
                id="tblUsers"
              >
                <thead>
                  <tr>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      ID
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      Wallet
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      ランク
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      KYC
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      紐づき口座一覧
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      残高
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      状態
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-right text-[0.8rem] font-semibold text-gray-500">
                      操作
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const pendingReq = pendingForUser(user.id);
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="border-b border-gray-200 px-3 py-3 font-semibold text-gray-700">
                          {user.id}
                        </td>
                        <td className="border-b border-gray-200 px-3 py-3">
                          <div className="font-mono text-[0.76rem] text-gray-500">
                            {user.wallet}
                          </div>
                          <div className="text-[0.72rem] text-gray-400">
                            {user.email}
                          </div>
                        </td>

                        <td className="border-b border-gray-200 px-3 py-3">
                          <span
                            className={`inline-flex rounded-full border border-gray-300 bg-gray-200 px-3 py-1 text-[0.72rem] font-bold ${rankClass(user.rankTone)}`}
                          >
                            {user.rank === "GOLD"
                              ? "Gold (x2)"
                              : user.rank === "SILVER"
                                ? "Silver (x1.5)"
                                : "Member (x1)"}
                          </span>
                        </td>

                        <td className="border-b border-gray-200 px-3 py-3">
                          <span
                            className={`inline-flex h-16 w-10 items-center justify-center rounded-full text-[0.68rem] font-bold [writing-mode:vertical-rl] [text-orientation:upright] ${kycClass(user.kycTone)}`}
                          >
                            {kycLabel(user.kyc)}
                          </span>
                        </td>

                        <td className="border-b border-gray-200 px-3 py-3">
                          <div className="space-y-1.5">
                            {user.accounts.map((acc) => (
                              <div
                                key={`${user.id}-${acc.broker}-${acc.no}`}
                                className="flex items-center gap-2"
                              >
                                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[0.62rem] font-semibold text-red-600">
                                  {acc.broker}
                                </span>
                                <span className="text-[0.74rem] text-gray-500">
                                  {acc.no}
                                </span>
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[0.62rem] font-bold ${statusClass(acc.status)}`}
                                >
                                  {acc.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="border-b border-gray-200 px-3 py-3">
                          <div className="flex max-w-[260px] flex-wrap gap-1">
                            {Object.entries(user.balances).map(
                              ([asset, amount]) => (
                                <span
                                  key={`${user.id}-${asset}`}
                                  className="rounded-full bg-gray-200 px-2 py-0.5 text-[0.64rem] font-semibold text-gray-500"
                                >
                                  {asset}:
                                  {typeof amount === "number" &&
                                  amount > 0 &&
                                  amount < 1
                                    ? amount.toFixed(4)
                                    : Number(amount).toLocaleString()}
                                </span>
                              ),
                            )}
                          </div>
                        </td>

                        <td className="border-b border-gray-200 px-3 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-[0.68rem] font-bold ${user.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : user.status === "BANNED" ? "bg-red-100 text-red-700" : "bg-gray-200 text-gray-700"}`}
                          >
                            {user.status}
                          </span>
                          {pendingReq && (
                            <span className="ml-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[0.62rem] font-bold text-amber-700">
                              退会申請中
                            </span>
                          )}
                        </td>

                        <td className="border-b border-gray-200 px-3 py-3 text-right">
                          <button
                            onClick={() => handleOpenUserActions(user)}
                            className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-1.5 text-[0.75rem] font-semibold text-gray-500 hover:bg-gray-100"
                          >
                            操作
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-3 py-8 text-center text-gray-400"
                      >
                        ユーザーがいません
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && selectedUser && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/55 p-[18px]">
          <div className="w-full max-w-[720px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_15px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-2.5 border-b border-gray-200 px-3.5 py-3">
              <div className="font-black">ユーザー操作: {selectedUser.id}</div>
              <button
                onClick={handleCloseModal}
                className="grid h-[34px] w-[34px] place-items-center rounded-full text-gray-800 hover:bg-gray-900/5"
                type="button"
                aria-label="Close"
              >
                <span className="material-icons text-[20px]">close</span>
              </button>
            </div>
            <div className="p-3.5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-600">ユーザー</span>
                  <span className="text-gray-700">{selectedUser.id}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-600">メール</span>
                  <span className="font-mono text-gray-700">
                    {selectedUser.email}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-600">Wallet</span>
                  <span className="font-mono text-gray-700">
                    {selectedUser.wallet}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-600">状態</span>
                  <span className="text-gray-700">{selectedUser.status}</span>
                </div>
                {pendingForUser(selectedUser.id) && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-600">
                      退会申請
                    </span>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[0.62rem] font-bold text-amber-700">
                      PENDING
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-gray-200 px-3.5 py-3">
              <button
                onClick={handleCloseModal}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                閉じる
              </button>
              <div className="flex flex-wrap gap-2">
                {selectedUser.status === "BANNED" ? (
                  <button
                    onClick={handleUnbanUser}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    BAN解除
                  </button>
                ) : (
                  <button
                    onClick={handleBanUser}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    BAN
                  </button>
                )}
                <button
                  onClick={handleConfiscate}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  トークン没収
                </button>
                {pendingForUser(selectedUser.id) && (
                  <button
                    onClick={handleApproveWithdrawalRequest}
                    className="rounded-xl bg-[#d62828] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b71c1c]"
                  >
                    退会申請を承認
                  </button>
                )}
              </div>
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
