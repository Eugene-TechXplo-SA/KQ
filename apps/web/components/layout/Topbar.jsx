export default function Topbar({
  title,
  crumb,
  isSidebarOpen,
  onToggleSidebar,
}) {
  const hasNotice = true;

  return (
    <header className="topbar sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-3 py-3 shadow-sm md:px-6 md:py-3.5">
      <div className="topbar-left flex items-center gap-3">
        <button
          className="icon-btn only-mobile inline-grid h-[34px] w-[34px] place-items-center rounded-full bg-transparent text-gray-800 hover:bg-gray-900/5 focus:outline-none focus:ring-2 focus:ring-[#C62828]/25 md:hidden"
          id="btnToggleSidebar"
          type="button"
          aria-controls="sidebar"
          aria-expanded={isSidebarOpen}
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          onClick={onToggleSidebar}
        >
          <span
            className="notranslate material-icons text-[20px]"
            aria-hidden="true"
            translate="no"
          >
            menu
          </span>
        </button>
        <div>
          <h1
            id="pageTitle"
            className="m-0 text-base font-semibold md:text-[1.1rem]"
          >
            {title}
          </h1>
          <div
            className="crumb mt-0.5 text-sm text-gray-500 md:text-[0.9rem]"
            id="pageCrumb"
          >
            {crumb}
          </div>
        </div>
      </div>
      <div className="topbar-right">
        <button
          className="icon-btn notification-btn relative inline-grid h-[34px] w-[34px] place-items-center rounded-full bg-transparent text-gray-800 hover:bg-gray-900/5 focus:outline-none focus:ring-2 focus:ring-[#C62828]/25"
          type="button"
          aria-label="通知"
          title="通知"
        >
          <i className="notranslate fa-regular fa-bell" translate="no"></i>
          <span
            className={`notification-dot absolute right-[7px] top-[7px] h-2 w-2 rounded-full ${hasNotice ? "bg-[#C62828]" : "bg-transparent"}`}
            id="notificationDot"
          ></span>
        </button>
      </div>
    </header>
  );
}
