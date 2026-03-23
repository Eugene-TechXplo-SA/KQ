import { useState } from "react";
import { fieldLabel, inputBase, panelBase, panelBody } from "../ui/styles";

const mockRows = [
  {
    id: "W001",
    requestedAt: "2026/3/9 10:56:39",
    userId: "U001",
    asset: "KQ",
    amount: "1,500",
    destination: "0x9a...1b2c",
    status: "Pending",
  },
];

const walletChips = [
  "KQ:12,000",
  "BTC:0.0500",
  "ETH:0.8000",
  "USDT:500",
  "USDC:300",
  "XRP:200",
  "JPYR:8,000",
  "JPYC:5,000",
  "IZAKAYA:150",
];

export default function WithdrawalsView({ isActive }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <section
      className={`view ${isActive ? "" : "is-hidden"} [&.is-hidden]:hidden`}
      id="view-withdrawals"
    >
      <div className={panelBase}>
        <div className="border-b border-gray-200 px-4 py-4">
          <div className="text-lg font-black text-gray-700">
            Withdrawal Management
          </div>
          <div className="mt-1 text-[0.86rem] text-gray-500">
            Manage withdrawal request confirmation, approval, and status updates
          </div>
        </div>

        <div className={panelBody}>
          <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div className="flex w-full flex-col gap-1.5 sm:w-auto sm:min-w-[220px]">
              <label className="text-[0.82rem] font-semibold text-gray-500">
                Status
              </label>
              <select
                className="h-11 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#d62828]/20"
                id="filterWStatus"
              >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
            <div
              id="withdrawalsHint"
              className="text-sm text-gray-400 sm:ml-auto"
            >
              {mockRows.length} items
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table
                className="w-full min-w-[920px] border-separate border-spacing-0 text-[0.83rem]"
                id="tblWithdrawals"
              >
                <thead>
                  <tr>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      Requested Date
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      User
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      Asset
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-right text-[0.8rem] font-semibold text-gray-500">
                      Amount
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      Destination
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-left text-[0.8rem] font-semibold text-gray-500">
                      Status
                    </th>
                    <th className="bg-gray-50 px-3 py-2.5 text-right text-[0.8rem] font-semibold text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockRows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="border-b border-gray-200 px-3 py-2.5 text-gray-500">
                        {row.requestedAt}
                      </td>
                      <td className="border-b border-gray-200 px-3 py-2.5 font-semibold text-gray-700">
                        {row.userId}
                      </td>
                      <td className="border-b border-gray-200 px-3 py-2.5">
                        <span className="rounded-full bg-gray-200 px-2 py-1 text-[0.68rem] font-semibold text-gray-600">
                          {row.asset}
                        </span>
                      </td>
                      <td className="border-b border-gray-200 px-3 py-2.5 text-right font-semibold text-gray-700">
                        {row.amount}
                      </td>
                      <td className="border-b border-gray-200 px-3 py-2.5 text-gray-500">
                        {row.destination}
                      </td>
                      <td className="border-b border-gray-200 px-3 py-2.5">
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-[0.68rem] font-bold text-amber-700">
                          {row.status}
                        </span>
                      </td>
                      <td className="border-b border-gray-200 px-3 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => setDetailOpen(true)}
                          className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-1.5 text-[0.75rem] font-semibold text-gray-500 hover:bg-gray-100"
                        >
                          Actions
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {detailOpen ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/35 p-4">
          <div className="w-full max-w-[720px] overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div className="text-xl font-black text-gray-800 sm:text-[1.7rem]">
                Withdrawal Request: W001
              </div>
              <button
                type="button"
                onClick={() => setDetailOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-gray-700 hover:bg-gray-100"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="space-y-2.5 px-4 py-4">
              <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-[0.86rem]">
                <span className="text-gray-500">User ID</span>
                <span className="font-semibold text-gray-700">U001</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-[0.86rem]">
                <span className="text-gray-500">Email</span>
                <span className="font-semibold text-gray-700">
                  user001@example.com
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-[0.86rem]">
                <span className="text-gray-500">KYC</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[0.72rem] font-bold text-emerald-700">
                  Approved
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-[0.86rem]">
                <span className="text-gray-500">Wallet Address</span>
                <span className="font-semibold text-gray-700">0x9a...1b2c</span>
              </div>
              <div className="rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-[0.86rem]">
                <div className="text-gray-500">Holdings</div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {walletChips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full bg-gray-200 px-2.5 py-1 text-[0.68rem] font-semibold text-gray-600"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-[0.86rem]">
                <span className="text-gray-500">Withdrawal Amount</span>
                <span className="text-[1.5rem] font-black text-gray-800">
                  1,500 KQ
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-[0.86rem]">
                <span className="text-gray-500">Transfer Status</span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-[0.72rem] font-bold text-amber-700">
                  Pending
                </span>
              </div>

              <div className="pt-1 text-[0.82rem] text-gray-500">
                Status Flow: PENDING → Approved → Processing → Completed/Failed
              </div>
            </div>

            <div className="flex flex-col items-stretch justify-between gap-2 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setDetailOpen(false)}
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDetailOpen(false);
                    setEditOpen(true);
                  }}
                  className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-[#D62828] px-4 py-2 text-sm font-semibold text-white hover:bg-[#B71C1C]"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {editOpen ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/35 p-4">
          <div className="w-full max-w-[720px] overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div className="text-xl font-black text-gray-800 sm:text-[1.7rem]">
                Edit Withdrawal Request: W001
              </div>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-gray-700 hover:bg-gray-100"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="grid gap-3 px-4 py-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className={fieldLabel}>Asset</label>
                <input className={inputBase} defaultValue="KQ" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={fieldLabel}>Amount</label>
                <input className={inputBase} defaultValue="1500" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={fieldLabel}>Destination</label>
                <input className={inputBase} defaultValue="0x9a...1b2c" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={fieldLabel}>Transfer Status</label>
                <input className={inputBase} defaultValue="未処理" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className={fieldLabel}>TxHash (Optional)</label>
                <input className={inputBase} />
              </div>
            </div>

            <div className="flex flex-col items-stretch justify-between gap-2 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="rounded-xl bg-[#D62828] px-4 py-2 text-sm font-semibold text-white hover:bg-[#B71C1C]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
