import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { btnBase, btnGhost, navItemBase } from "../ui/styles";

export default function Sidebar({ activeView, isOpen, onClose, onNavigate }) {
  const router = useRouter();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("kq_admin_logged_in");
      if (raw == null) {
        localStorage.setItem("kq_admin_logged_in", "true");
        setIsAdminLoggedIn(true);
      } else {
        setIsAdminLoggedIn(raw === "true");
      }
    } catch {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const navItemClass = (view) =>
    view === activeView
      ? `${navItemBase} is-active rounded-none border-r-4 border-r-[#C62828] bg-[#FEF2F2] font-bold text-[#C62828]`
      : navItemBase;

  const navLabelClass =
    "min-w-0 flex-1 whitespace-normal break-words leading-snug text-[0.92rem]";
  const navIconClass = "notranslate material-icons mt-0.5 shrink-0 text-[20px]";

  const handleNavigate = (view) => {
    setIsAccountOpen(false);
    onClose?.();
    onNavigate(view);
  };

  const handleAccountToggle = () => {
    setIsAccountOpen((prev) => !prev);
  };

  const handleLogin = () => {
    setIsAccountOpen(false);
    router.push("/login");
  };

  const handleLogout = () => {
    try {
      localStorage.setItem("kq_admin_logged_in", "false");
    } catch {
      // ignore storage errors for local mock mode
    }
    setIsAdminLoggedIn(false);
    setIsAccountOpen(false);
    onClose?.();
    router.push("/login");
  };

  return (
    <aside
      className={`sidebar fixed left-0 top-0 z-[25] flex h-screen w-[320px] flex-col gap-3.5 border-r border-gray-200 bg-white shadow-sm transition-transform duration-200 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-[105%]"
      } md:sticky md:z-auto md:translate-x-0`}
      id="sidebar"
    >
      <div className="brand flex items-center gap-3 border-b border-gray-200/70 bg-white px-4 pb-3.5 pt-4">
        <div
          className="logo grid h-10 w-10 place-items-center rounded-[14px] bg-[#FEF2F2] font-extrabold text-[#C62828]"
          aria-hidden="true"
        >
          KQ
        </div>
        <div className="brand-text">
          <div className="brand-title text-base font-extrabold tracking-[0.03em]">
            KING <span className="gold text-[#C62828]">&</span> QUEEN
          </div>
          <div className="brand-sub mt-0.5 text-sm text-gray-500">
            管理コンソール
          </div>
        </div>
      </div>

      <nav className="nav flex flex-col gap-1.5" aria-label="Main navigation">
        <div className="nav-section mx-2.5 mb-1 mt-2.5 text-[0.8rem] uppercase tracking-[0.08em] text-gray-500">
          メイン
        </div>
        <button
          className={navItemClass("dashboard")}
          data-view="dashboard"
          type="button"
          onClick={() => handleNavigate("dashboard")}
        >
          <span className={navIconClass} aria-hidden="true" translate="no">
            dashboard
          </span>
          <span className={navLabelClass}>ダッシュボード</span>
        </button>

        <div className="nav-section mx-2.5 mb-1 mt-2.5 text-[0.8rem] uppercase tracking-[0.08em] text-gray-500">
          運用・操作
        </div>
        <button
          className={navItemClass("approvals")}
          data-view="approvals"
          type="button"
          onClick={() => handleNavigate("approvals")}
        >
          <span className={navIconClass} aria-hidden="true" translate="no">
            how_to_reg
          </span>
          <span className={navLabelClass}>承認タスク</span>
          <span
            className="badge ml-auto mt-0.5 inline-flex h-5 min-w-[22px] shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 px-2 text-[0.78rem] text-gray-700"
            id="badgeApprovals"
          >
            0
          </span>
        </button>
        <button
          className={navItemClass("scraper")}
          data-view="scraper"
          type="button"
          onClick={() => handleNavigate("scraper")}
        >
          <span className={navIconClass} aria-hidden="true" translate="no">
            cloud_sync
          </span>
          <span className={navLabelClass}>CSVインポート・台帳反映</span>
        </button>
        {/*
        <button
          className={navItemClass("withdrawals")}
          data-view="withdrawals"
          type="button"
          onClick={() => handleNavigate("withdrawals")}
        >
          <span className="material-icons text-[20px]" aria-hidden="true">
            payments
          </span>
          <span>Withdrawal Management</span>
          <span
            className="badge ml-auto inline-flex h-5 min-w-[22px] items-center justify-center rounded-full border border-gray-200 bg-gray-100 px-2 text-[0.78rem] text-gray-700"
            id="badgeWithdrawals"
          >
            0
          </span>
        </button>
        */}

        <div className="nav-section mx-2.5 mb-1 mt-2.5 text-[0.8rem] uppercase tracking-[0.08em] text-gray-500">
          データベース
        </div>
        <button
          className={navItemClass("users")}
          data-view="users"
          type="button"
          onClick={() => handleNavigate("users")}
        >
          <span className={navIconClass} aria-hidden="true" translate="no">
            people
          </span>
          <span className={navLabelClass}>ユーザー管理</span>
        </button>
        <button
          className={navItemClass("ledger")}
          data-view="ledger"
          type="button"
          onClick={() => handleNavigate("ledger")}
        >
          <span className={navIconClass} aria-hidden="true" translate="no">
            receipt_long
          </span>
          <span className={navLabelClass}>トークン台帳</span>
        </button>

        <div className="nav-section mx-2.5 mb-1 mt-2.5 text-[0.8rem] uppercase tracking-[0.08em] text-gray-500">
          コンテンツ
        </div>
        <button
          className={navItemClass("announcements")}
          data-view="announcements"
          type="button"
          onClick={() => handleNavigate("announcements")}
        >
          <span className={navIconClass} aria-hidden="true" translate="no">
            campaign
          </span>
          <span className={navLabelClass}>お知らせ管理</span>
        </button>

        <div className="nav-section mx-2.5 mb-1 mt-2.5 text-[0.8rem] uppercase tracking-[0.08em] text-gray-500">
          システム
        </div>
        <button
          className={navItemClass("settings")}
          data-view="settings"
          type="button"
          onClick={() => handleNavigate("settings")}
        >
          <span className={navIconClass} aria-hidden="true" translate="no">
            settings
          </span>
          <span className={navLabelClass}>マスター管理</span>
        </button>
        <button
          className={navItemBase}
          id="btnAccountToggle"
          type="button"
          onClick={handleAccountToggle}
        >
          <span className={navIconClass} aria-hidden="true" translate="no">
            account_circle
          </span>
          <span className={navLabelClass}>アカウント</span>
        </button>
        <div
          className={`account-slide overflow-hidden px-4 transition-[max-height] duration-300 ease-in-out ${
            isAccountOpen ? "is-open max-h-[220px]" : "max-h-0"
          }`}
          id="accountSlide"
        >
          <div className="account-panel flex flex-col gap-2 pt-2.5">
            <div className="account-chip flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2.5">
              <span className="chip-k text-sm text-gray-500">権限</span>
              <span className="chip-v font-bold" id="accountRole">
                管理者
              </span>
            </div>
            <button
              className={`${btnBase} ${btnGhost} ${isAdminLoggedIn ? "hidden" : ""} w-full justify-center`}
              id="btnLogin"
              type="button"
              onClick={handleLogin}
            >
              <span
                className="notranslate material-icons text-[20px]"
                aria-hidden="true"
                translate="no"
              >
                login
              </span>
              <span>ログイン</span>
            </button>
            <button
              className={`${btnBase} ${btnGhost} ${isAdminLoggedIn ? "" : "hidden"} w-full justify-center`}
              id="btnLogout"
              type="button"
              onClick={handleLogout}
            >
              <span
                className="notranslate material-icons text-[20px]"
                aria-hidden="true"
                translate="no"
              >
                logout
              </span>
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
