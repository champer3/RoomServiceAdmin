import { useEffect } from "react";

const VISIBILITY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "hidden", label: "Hidden" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name_az", label: "Name A-Z" },
  { value: "name_za", label: "Name Z-A" },
  { value: "display_order_asc", label: "Display Order (Low-High)" },
  { value: "display_order_desc", label: "Display Order (High-Low)" },
];

export default function CategoriesFilterDrawer({
  open,
  onClose,
  visibilityFilter,
  setVisibilityFilter,
  sortBy,
  setSortBy,
  onReset,
}) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Category filters"
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
          <h2 className="text-lg font-semibold text-[#111827]">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6]"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2">Visibility</label>
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:border-[#283618] focus:ring-1 focus:ring-[#283618]"
            >
              {VISIBILITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:border-[#283618] focus:ring-1 focus:ring-[#283618]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] px-4 py-3 flex gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#4B5563] hover:bg-[#F9FAFB]"
          >
            Reset Filters
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg bg-[#283618] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1F2714]"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}

