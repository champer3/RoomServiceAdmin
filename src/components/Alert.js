/**
 * Alert for form messages, validation, or confirmations.
 * With overlay (default): floating centered modal style. Without: inline.
 *
 * @param {string} variant - 'success' | 'error' | 'warning' | 'info'
 * @param {string} [title] - Optional heading
 * @param {React.ReactNode} children - Message content
 * @param {function} [onDismiss] - If provided, shows a close button
 * @param {string} [className] - Extra CSS classes
 * @param {boolean} [withOverlay] - If true, show dimmed overlay and center alert (default true)
 * @param {string} [overlayClassName] - Extra classes on the overlay wrapper (e.g. z-index)
 */
const variantStyles = {
  success: "bg-[#ECFDF3] border-[#15803D] text-[#15803D]",
  error: "bg-[#FEF2F2] border-red-600 text-red-700",
  warning: "bg-[#FFF7ED] border-[#F97316] text-[#C2410C]",
  info: "bg-[#EFF6FF] border-[#3B82F6] text-[#1D4ED8]",
};

// Simple circle icon; color comes from variant
const iconPath = "M10 18a8 8 0 100-16 8 8 0 000 16z";

export default function Alert({
  variant = "info",
  title,
  children,
  onDismiss,
  className = "",
  withOverlay = true,
  overlayClassName = "",
}) {
  const style = variantStyles[variant] || variantStyles.info;

  const content = (
    <div
      role="alert"
      className={`rounded-xl border-l-4 px-4 py-3 text-sm shadow-xl ${style} ${className}`}
    >
      <div className="flex items-start gap-3">
        <svg className="h-5 w-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d={iconPath} clipRule="evenodd" />
        </svg>
        <div className="flex-1 min-w-0">
          {title && <p className="font-semibold">{title}</p>}
          <div className={title ? "mt-0.5" : ""}>{children}</div>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 p-1 rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1"
            aria-label="Dismiss"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        )}
      </div>
    </div>
  );

  if (withOverlay) {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center p-4 bg-black/40 ${overlayClassName ?? "z-[70]"}`.trim()}
        aria-modal="true"
        role="dialog"
      >
        <div className="w-full max-w-md">{content}</div>
      </div>
    );
  }

  return content;
}
