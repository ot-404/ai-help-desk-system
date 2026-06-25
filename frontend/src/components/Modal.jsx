import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, children, title, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className={`relative my-auto w-full ${maxWidth} animate-fade-in rounded-2xl border border-line bg-surface shadow-2xl shadow-black/50`}
      >
        {title !== undefined && (
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <h2 className="text-sm font-medium text-ink">{title}</h2>
            <button onClick={onClose} className="rounded-md p-1 text-faint hover:bg-surface2 hover:text-ink">
              <X size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
