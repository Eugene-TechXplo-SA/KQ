import { useMemo, useState } from "react";
import {
  btnBase,
  btnGhost,
  fieldLabel,
  inputBase,
  panelBase,
  panelBody,
  panelHeader,
  thBase,
} from "../ui/styles";

const initialAnnouncements = [
  {
    id: "ANN001",
    title: "サービス開始のお知らせ",
    body: "KING and QUEENのサービスを正式にリリースしました。",
    category: "UPDATE",
    priority: "HIGH",
    status: "PUBLISHED",
    createdAt: "2026-02-19T10:00:00Z",
    updatedAt: "2026-02-19T10:00:00Z",
  },
  {
    id: "ANN002",
    title: "メンテナンスのお知らせ",
    body: "2月25日 0:00〜6:00 にシステムメンテナンスを実施します。",
    category: "MAINTENANCE",
    priority: "NORMAL",
    status: "PUBLISHED",
    createdAt: "2026-02-22T10:00:00Z",
    updatedAt: "2026-02-22T10:00:00Z",
  },
  {
    id: "ANN003",
    title: "春のキャンペーン（下書き）",
    body: "3月限定でKQトークンの付与率が1.5倍になるキャンペーンを開催予定です。",
    category: "CAMPAIGN",
    priority: "NORMAL",
    status: "DRAFT",
    createdAt: "2026-02-23T08:00:00Z",
    updatedAt: "2026-02-23T08:00:00Z",
  },
  {
    id: "ANN004",
    title: "ランクシステム改定（予定）",
    body: "4月よりランクの昇格条件を一部見直す予定です。",
    category: "UPDATE",
    priority: "LOW",
    status: "SCHEDULED",
    createdAt: "2026-03-05T14:00:00Z",
    updatedAt: "2026-03-05T14:00:00Z",
    scheduledAt: "2026-04-01T00:00:00Z",
  },
];

function fmtDate(iso) {
  return new Date(iso).toLocaleString();
}

function categoryPill(category) {
  const map = {
    MAINTENANCE: { label: "メンテナンス", cls: "bg-amber-100 text-amber-700" },
    UPDATE: { label: "アップデート", cls: "bg-emerald-100 text-emerald-700" },
    CAMPAIGN: { label: "キャンペーン", cls: "bg-gray-200 text-gray-700" },
    OTHER: { label: "その他", cls: "bg-gray-200 text-gray-700" },
  };
  return map[category] || { label: category, cls: "bg-gray-200 text-gray-700" };
}

function priorityPill(priority) {
  const map = {
    HIGH: { label: "高", cls: "bg-red-100 text-red-700" },
    NORMAL: { label: "通常", cls: "bg-gray-200 text-gray-700" },
    LOW: { label: "低", cls: "bg-gray-200 text-gray-700" },
  };
  return map[priority] || { label: priority, cls: "bg-gray-200 text-gray-700" };
}

function statusPill(status) {
  const map = {
    DRAFT: { label: "下書き", cls: "bg-gray-200 text-gray-700" },
    SCHEDULED: { label: "予約公開", cls: "bg-amber-100 text-amber-700" },
    PUBLISHED: { label: "公開中", cls: "bg-emerald-100 text-emerald-700" },
    ARCHIVED: { label: "アーカイブ", cls: "bg-gray-300 text-gray-700" },
  };
  return map[status] || { label: status, cls: "bg-gray-200 text-gray-700" };
}

export default function AnnouncementsView({ isActive }) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    body: "",
    category: "UPDATE",
    priority: "NORMAL",
    status: "DRAFT",
    scheduledAt: "",
  });

  const filteredAnnouncements = useMemo(() => {
    const rows = [...announcements].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (statusFilter === "ALL") return rows;
    return rows.filter((row) => row.status === statusFilter);
  }, [announcements, statusFilter]);

  const showToast = (type, title, message = "") => {
    const id = Date.now() + Math.random();
    setToast({ id, type, title, message });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 2600);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      title: "",
      body: "",
      category: "UPDATE",
      priority: "NORMAL",
      status: "DRAFT",
      scheduledAt: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (announcement) => {
    setEditingId(announcement.id);
    setForm({
      title: announcement.title || "",
      body: announcement.body || "",
      category: announcement.category || "UPDATE",
      priority: announcement.priority || "NORMAL",
      status: announcement.status || "DRAFT",
      scheduledAt: announcement.scheduledAt
        ? String(announcement.scheduledAt).slice(0, 16)
        : "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const saveAnnouncement = (forcedStatus) => {
    const title = form.title.trim();
    if (!title) {
      showToast("err", "入力不正", "タイトルは必須です");
      return;
    }

    const now = new Date().toISOString();
    const nextStatus = forcedStatus || form.status || "DRAFT";

    if (editingId) {
      setAnnouncements((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? {
                ...row,
                title,
                body: form.body.trim(),
                category: form.category,
                priority: form.priority,
                status: nextStatus,
                scheduledAt: form.scheduledAt || null,
                updatedAt: now,
              }
            : row,
        ),
      );
      showToast("ok", "更新しました", `お知らせ ${editingId} を更新`);
    } else {
      const newId = `ANN${String(announcements.length + 1).padStart(3, "0")}`;
      setAnnouncements((prev) => [
        {
          id: newId,
          title,
          body: form.body.trim(),
          category: form.category,
          priority: form.priority,
          status: nextStatus,
          scheduledAt: form.scheduledAt || null,
          createdAt: now,
          updatedAt: now,
        },
        ...prev,
      ]);
      showToast("ok", "作成しました", `お知らせ ${newId} を作成`);
    }

    closeModal();
  };

  const deleteAnnouncement = () => {
    if (!editingId) return;
    setAnnouncements((prev) => prev.filter((row) => row.id !== editingId));
    showToast("ok", "削除しました", `お知らせ ${editingId} を削除`);
    closeModal();
  };

  const editingRow = editingId
    ? announcements.find((row) => row.id === editingId)
    : null;
  const canDelete =
    editingRow && ["DRAFT", "SCHEDULED"].includes(editingRow.status);

  return (
    <section
      className={`view ${isActive ? "" : "is-hidden"} [&.is-hidden]:hidden`}
      id="view-announcements"
    >
      <div className={panelBase}>
        <div className={panelHeader}>
          <div>
            <div className="panel-title font-black">お知らせ管理（CMS）</div>
            <div className="panel-sub mt-1 text-[0.92rem] text-gray-500">
              ユーザーに表示するお知らせの作成・編集・公開管理
            </div>
          </div>
          <div className="actions">
            <button
              className={`${btnBase} text-sm`}
              type="button"
              onClick={openCreateModal}
            >
              <span className="material-icons text-[18px]" aria-hidden="true">
                add
              </span>
              新規作成
            </button>
          </div>
        </div>

        <div className={panelBody}>
          <div className="toolbar mb-3 flex flex-wrap items-end gap-3">
            <div className="field min-w-[220px]">
              <label className={`${fieldLabel} mb-1.5 block`}>ステータス</label>
              <select
                id="filterAnnStatus"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={`${inputBase} h-10 w-full text-sm`}
              >
                <option value="ALL">すべて</option>
                <option value="DRAFT">下書き</option>
                <option value="SCHEDULED">予約公開</option>
                <option value="PUBLISHED">公開中</option>
                <option value="ARCHIVED">アーカイブ</option>
              </select>
            </div>
            <div
              className="hint ml-auto pb-1 text-sm text-gray-500"
              id="announcementsHint"
            >
              {filteredAnnouncements.length}件
            </div>
          </div>

          <div className="table-wrap overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table
                className="table w-full min-w-[980px] border-separate border-spacing-0 text-[0.9rem]"
                id="tblAnnouncements"
              >
                <thead>
                  <tr>
                    <th className={thBase}>作成日時</th>
                    <th className={thBase}>タイトル / 本文</th>
                    <th className={thBase}>カテゴリ</th>
                    <th className={thBase}>優先度</th>
                    <th className={thBase}>ステータス</th>
                    <th className={`${thBase} right text-right`}>操作</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:hover]:bg-gray-50 [&_td]:border-b [&_td]:border-gray-200">
                  {filteredAnnouncements.map((row) => {
                    const cat = categoryPill(row.category);
                    const pri = priorityPill(row.priority);
                    const stat = statusPill(row.status);
                    return (
                      <tr key={row.id}>
                        <td className="px-3 py-3 text-gray-700">
                          {fmtDate(row.createdAt)}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-semibold text-gray-700">
                            {row.title}
                          </div>
                          <div className="mt-1 max-w-[420px] truncate text-[0.82rem] text-gray-500">
                            {row.body}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[0.72rem] font-bold ${cat.cls}`}
                          >
                            {cat.label}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[0.72rem] font-bold ${pri.cls}`}
                          >
                            {pri.label}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[0.72rem] font-bold ${stat.cls}`}
                          >
                            {stat.label}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-[0.74rem] font-semibold text-gray-600 hover:bg-gray-100"
                            type="button"
                            onClick={() => openEditModal(row)}
                          >
                            編集
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div
              className="empty p-[18px] text-center text-gray-500"
              id="emptyAnnouncements"
              hidden={filteredAnnouncements.length !== 0}
            >
              お知らせがありません
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/55 p-[18px]">
          <div className="w-full max-w-[760px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_15px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-2.5 border-b border-gray-200 px-3.5 py-3">
              <div className="font-black">
                {editingId ? "お知らせを編集" : "お知らせを作成"}
              </div>
              <button
                onClick={closeModal}
                className="grid h-[34px] w-[34px] place-items-center rounded-full text-gray-800 hover:bg-gray-900/5"
                type="button"
                aria-label="Close"
              >
                <span className="material-icons text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 p-3.5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={`${fieldLabel} mb-1.5 block`}>タイトル</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className={`${inputBase} h-10 w-full text-sm`}
                  placeholder="例：メンテナンスのお知らせ"
                />
              </div>
              <div className="md:col-span-2">
                <label className={`${fieldLabel} mb-1.5 block`}>本文</label>
                <textarea
                  value={form.body}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, body: event.target.value }))
                  }
                  className="min-h-[120px] w-full rounded-[10px] border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#C62828]/45 focus:ring-2 focus:ring-[#C62828]/25"
                />
              </div>
              <div>
                <label className={`${fieldLabel} mb-1.5 block`}>カテゴリ</label>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      category: event.target.value,
                    }))
                  }
                  className={`${inputBase} h-10 w-full text-sm`}
                >
                  <option value="MAINTENANCE">メンテナンス</option>
                  <option value="UPDATE">アップデート</option>
                  <option value="CAMPAIGN">キャンペーン</option>
                  <option value="OTHER">その他</option>
                </select>
              </div>
              <div>
                <label className={`${fieldLabel} mb-1.5 block`}>優先度</label>
                <select
                  value={form.priority}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      priority: event.target.value,
                    }))
                  }
                  className={`${inputBase} h-10 w-full text-sm`}
                >
                  <option value="HIGH">高</option>
                  <option value="NORMAL">通常</option>
                  <option value="LOW">低</option>
                </select>
              </div>
              <div>
                <label className={`${fieldLabel} mb-1.5 block`}>
                  ステータス
                </label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, status: event.target.value }))
                  }
                  className={`${inputBase} h-10 w-full text-sm`}
                >
                  <option value="DRAFT">下書き</option>
                  <option value="SCHEDULED">予約公開</option>
                  <option value="PUBLISHED">公開中</option>
                  <option value="ARCHIVED">アーカイブ</option>
                </select>
              </div>
              <div>
                <label className={`${fieldLabel} mb-1.5 block`}>
                  予約公開日時
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      scheduledAt: event.target.value,
                    }))
                  }
                  className={`${inputBase} h-10 w-full text-sm`}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-gray-200 px-3.5 py-3">
              <div className="flex gap-2">
                <button
                  onClick={closeModal}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold ${btnGhost}`}
                  type="button"
                >
                  キャンセル
                </button>
                {canDelete && (
                  <button
                    onClick={deleteAnnouncement}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    type="button"
                  >
                    削除
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => saveAnnouncement("DRAFT")}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold ${btnGhost}`}
                  type="button"
                >
                  下書き保存
                </button>
                <button
                  onClick={() => saveAnnouncement("SCHEDULED")}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold ${btnGhost}`}
                  type="button"
                >
                  予約公開
                </button>
                <button
                  onClick={() => saveAnnouncement("PUBLISHED")}
                  className={`${btnBase} rounded-xl px-4 py-2 text-sm`}
                  type="button"
                >
                  公開
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
              toast.type === "ok"
                ? "bg-emerald-600"
                : toast.type === "warn"
                  ? "bg-yellow-600"
                  : "bg-red-600"
            }`}
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
