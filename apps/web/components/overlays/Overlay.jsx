export default function Overlay({ isVisible, onClick }) {
  if (!isVisible) {
    return null;
  }

  return (
    <button
      className="overlay fixed inset-0 z-20 block bg-black/55 md:hidden"
      id="overlay"
      type="button"
      aria-label="Close menu"
      onClick={onClick}
    ></button>
  );
}
