import { useEffect } from "react";

/**
 * Fixed floating notification (top-right). Use for: save/delete success, API errors.
 *
 * @param {boolean} open - Whether the toast is visible
 * @param {function} onClose - Called when toast is dismissed or auto-hides
 * @param {string} message - Main message text
 * @param {string} [type] - 'success' | 'error' | 'warning' | 'info'
 * @param {string} [title] - Optional title (e.g. "Success", "Error")
 * @param {number} [autoHideDuration] - ms to auto-close; 0 = no auto-close
 */
const typeStyles = {
  success: "bg-[#283618]",
  error: "bg-red-600",
  warning: "bg-[#F97316]",
  info: "bg-[#6B7280]",
};

export default function Toast({
  open,
  onClose,
  message,
  type = "success",
  title,
  autoHideDuration = 5000,
}) {
  useEffect(() => {
    if (!open || !onClose || autoHideDuration <= 0) return;
    const t = setTimeout(onClose, autoHideDuration);
    return () => clearTimeout(t);
  }, [open, onClose, autoHideDuration]);

  if (!open) return null;

  const bg = typeStyles[type] || typeStyles.success;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-end pt-4 pr-4">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative flex items-start gap-3 rounded-xl px-4 py-3 text-sm text-white shadow-2xl ring-1 ring-black/10 ${bg}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 min-w-0">
          {title && <p className="font-semibold">{title}</p>}
          <p className={title ? "mt-0.5" : ""}>{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 ml-1 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded p-0.5"
          aria-label="Close"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      </div>
    </div>
  );
}
