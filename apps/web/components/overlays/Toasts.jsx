export default function Toasts() {
  return (
    <div
      className="toasts fixed bottom-4 right-4 z-40 flex flex-col gap-2.5"
      id="toasts"
      aria-live="polite"
      aria-atomic="true"
    ></div>
  );
}
