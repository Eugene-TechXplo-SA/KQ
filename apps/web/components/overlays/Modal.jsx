export default function Modal() {
  return (
    <div
      className="modal is-hidden fixed inset-0 z-30 grid place-items-center bg-black/55 p-[18px] [&.is-hidden]:hidden"
      id="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="modal-card w-full max-w-[720px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_15px_rgba(15,23,42,0.06)]">
        <div className="modal-h flex items-center justify-between gap-2.5 border-b border-gray-200 px-3.5 py-3">
          <div className="modal-title font-black" id="modalTitle">
            Title
          </div>
          <button
            className="icon-btn grid h-[34px] w-[34px] place-items-center rounded-full bg-transparent text-gray-800 hover:bg-gray-900/5 focus:outline-none focus:ring-2 focus:ring-[#C62828]/25"
            data-action="closeModal"
            type="button"
            aria-label="Close"
          >
            <span className="material-icons text-[20px]" aria-hidden="true">
              close
            </span>
          </button>
        </div>
        <div className="modal-b p-3.5" id="modalBody"></div>
        <div
          className="modal-f flex items-center justify-between gap-2.5 border-t border-gray-200 px-3.5 py-3"
          id="modalFooter"
        ></div>
      </div>
    </div>
  );
}
