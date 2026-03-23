"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Footer from "../../components/layout/Footer";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import Modal from "../../components/overlays/Modal";
import Overlay from "../../components/overlays/Overlay";
import Toasts from "../../components/overlays/Toasts";

const viewMeta = {
  dashboard: {
    title: "ダッシュボード",
    crumb: "管理コンソール / ダッシュボード",
  },
  approvals: {
    title: "承認タスク",
    crumb: "管理コンソール / 承認タスク",
  },
  scraper: {
    title: "CSVインポート・台帳反映",
    crumb: "管理コンソール / CSVインポート・台帳反映",
  },
  withdrawals: {
    title: "出金管理",
    crumb: "管理コンソール / 出金管理",
  },
  users: { title: "ユーザー管理", crumb: "管理コンソール / ユーザー管理" },
  ledger: { title: "トークン台帳", crumb: "管理コンソール / トークン台帳" },
  announcements: {
    title: "お知らせ管理",
    crumb: "管理コンソール / お知らせ管理",
  },
  settings: {
    title: "マスター管理",
    crumb: "管理コンソール / マスター管理",
  },
};

export default function AppLayout({ children, activeView = "dashboard" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isSidebarOpen);

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isSidebarOpen]);

  const handleNavigate = (view) => {
    setIsSidebarOpen(false);

    if (view === "dashboard") {
      router.push("/dashboard");
    } else {
      router.push(`/${view}`);
    }
  };

  const pageMeta = viewMeta[activeView] ?? viewMeta.dashboard;

  return (
    <div
      className="app grid min-h-screen grid-cols-1 bg-[#F3F4F6] text-[#1F2937] md:grid-cols-[320px_1fr]"
      data-theme="light"
    >
      <Sidebar
        activeView={activeView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={handleNavigate}
      />
      <Overlay
        isVisible={isSidebarOpen}
        onClick={() => setIsSidebarOpen(false)}
      />

      <main className="main flex min-w-0 flex-col">
        <Topbar
          title={pageMeta.title}
          crumb={pageMeta.crumb}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
        />

        <section className="content block p-3 md:p-[18px]">{children}</section>

        <Footer />
      </main>

      <Modal />
      <Toasts />
    </div>
  );
}
