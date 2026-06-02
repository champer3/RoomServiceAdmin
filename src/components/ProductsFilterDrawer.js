import { useEffect, useRef, useState } from "react";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const VISIBILITY_OPTIONS = [
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Hidden" },
];

const STOCK_OPTIONS = [
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "name_az", label: "Name A–Z" },
  { value: "price_low", label: "Price Low–High" },
  { value: "stock_low", label: "Stock Low–High" },
];



export function PriceRangeSlider({
  bounds,
  priceRange,
  setPriceRange,
  setMin,
  setMax,
}) {
  const sliderRef = useRef(null);
  const [activePriceThumb, setActivePriceThumb] = useState(null);

  const range = Math.max(1, bounds.max - bounds.min);

  const safeMin =
    priceRange.min === "" || Number.isNaN(Number(priceRange.min))
      ? bounds.min
      : Math.max(bounds.min, Math.min(Number(priceRange.min), bounds.max));

  const safeMax =
    priceRange.max === "" || Number.isNaN(Number(priceRange.max))
      ? bounds.max
      : Math.max(bounds.min, Math.min(Number(priceRange.max), bounds.max));

  const leftPct = ((safeMin - bounds.min) / range) * 100;
  const rightPct = 100 - ((safeMax - bounds.min) / range) * 100;

  const getValueFromClientX = (clientX) => {
    const el = sliderRef.current;
    if (!el) return bounds.min;

    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const pct = rect.width === 0 ? 0 : x / rect.width;
    const raw = bounds.min + pct * (bounds.max - bounds.min);

    return Math.round(raw);
  };

  const updateThumbValue = (thumb, clientX) => {
    const n = getValueFromClientX(clientX);

    setPriceRange((r) => {
      const currentMin = r.min === "" ? bounds.min : Number(r.min);
      const currentMax = r.max === "" ? bounds.max : Number(r.max);

      if (!Number.isFinite(currentMin) || !Number.isFinite(currentMax)) return r;

      if (thumb === "min") {
        return {
          ...r,
          min: String(Math.min(n, currentMax)),
        };
      }

      return {
        ...r,
        max: String(Math.max(n, currentMin)),
      };
    });
  };

  useEffect(() => {
    if (!activePriceThumb) return;

    const handlePointerMove = (e) => {
      updateThumbValue(activePriceThumb, e.clientX);
    };

    const handlePointerUp = () => {
      setActivePriceThumb(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [activePriceThumb]);

  return (
    <div className="space-y-4">
      <div
        ref={sliderRef}
        className="relative h-5 flex items-center select-none"
        onPointerDown={(e) => {
          const n = getValueFromClientX(e.clientX);

          setPriceRange((r) => {
            const currentMin = r.min === "" ? bounds.min : Number(r.min);
            const currentMax = r.max === "" ? bounds.max : Number(r.max);

            if (!Number.isFinite(currentMin) || !Number.isFinite(currentMax)) return r;

            const distToMin = Math.abs(n - currentMin);
            const distToMax = Math.abs(n - currentMax);

            if (distToMin <= distToMax) {
              setActivePriceThumb("min");
              return { ...r, min: String(Math.min(n, currentMax)) };
            } else {
              setActivePriceThumb("max");
              return { ...r, max: String(Math.max(n, currentMin)) };
            }
          });
        }}
      >
        <div className="absolute inset-y-1 left-0 right-0 h-2 rounded-full bg-[#BFDBFE]" />

        <div
          className="absolute inset-y-1 h-2 rounded-full bg-[#16A34A]"
          style={{
            left: `${leftPct}%`,
            width: `${safeMax > safeMin ? ((safeMax - safeMin) / range) * 100 : 0}%`,
          }}
        />

        {(() => {
          const minPct = ((safeMin - bounds.min) / range) * 100;
          const maxPct = ((safeMax - bounds.min) / range) * 100;
          const thumbSize = 18;

          return (
            <>
              <div
                role="slider"
                aria-label="Minimum price"
                tabIndex={0}
                className="absolute top-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `calc(${minPct}% - ${thumbSize / 2}px)`,
                  zIndex: activePriceThumb === "min" ? 30 : 10,
                }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActivePriceThumb("min");
                  updateThumbValue("min", e.clientX);
                }}
              >
                <div className="w-[18px] h-[18px] rounded-full bg-[#16A34A] border-2 border-white shadow-sm" />
              </div>

              <div
                role="slider"
                aria-label="Maximum price"
                tabIndex={0}
                className="absolute top-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `calc(${maxPct}% - ${thumbSize / 2}px)`,
                  zIndex: activePriceThumb === "max" ? 30 : 10,
                }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActivePriceThumb("max");
                  updateThumbValue("max", e.clientX);
                }}
              >
                <div className="w-[18px] h-[18px] rounded-full bg-[#16A34A] border-2 border-white shadow-sm" />
              </div>
            </>
          );
        })()}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          inputMode="numeric"
          value={priceRange.min}
          onChange={(e) => setMin(e.target.value)}
          placeholder={String(bounds.min)}
          className="w-1/2 rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#283618]"
        />
        <span className="text-[#6B7280] font-semibold">—</span>
        <input
          type="text"
          inputMode="numeric"
          value={priceRange.max}
          onChange={(e) => setMax(e.target.value)}
          placeholder={String(bounds.max)}
          className="w-1/2 rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#283618]"
        />
      </div>
    </div>
  );
}

export function CollapsibleSection({ title, open, onToggle, children }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] px-3 py-3">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[#374151]">{title}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        >
          <path
            d="M4.75 7.5L10 12.75L15.25 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function CustomRadioOption({ checked, label, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#374151] cursor-pointer select-none">
  <input
    type="checkbox"
    className="sr-only"
    checked={checked}
    onChange={onChange}
    aria-label={label}
  />

  <span
    className={[
      "relative w-5 h-5 rounded-full border-2 transition-colors",
      checked ? "bg-white border-[#16A34A]" : "bg-white border-[#111827]",
    ].join(" ")}
  >
    {checked && (
      <span className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-[#16A34A] rounded-full -translate-x-1/2 -translate-y-1/2" />
    )}
  </span>

  <span className="truncate">{label}</span>
</label>
  );
}

function sanitizeIntegerLike(raw) {
  const cleaned = String(raw ?? "").replace(/[^\d]/g, "");
  if (cleaned === "") return "";
  // prevent huge values from breaking the slider
  return cleaned.length > 12 ? cleaned.slice(0, 12) : cleaned;
}

export default function ProductsFilterDrawer({
  open,
  onClose,
  statusFilters,
  setStatusFilters,
  visibilityFilters,
  setVisibilityFilters,
  stockFilters,
  setStockFilters,
  priceRange,
  setPriceRange,
  priceBounds,
  sortBy,
  setSortBy,
  filterCategoryIds,
  setFilterCategoryIds,
  categoriesByDepartment,
  onReset,
}) {
  const [openSections, setOpenSections] = useState({
    category: true,
    status: false,
    visibility: false,
    stock: false,
    price: true,
    sort: false,
  });

  useEffect(() => {
    if (open) {
      const handleEscape = (e) => e.key === "Escape" && onClose();
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }
  }, [open, onClose]);

  const bounds = priceBounds || { min: 0, max: 100000, step: 100 };
  const minVal = priceRange.min === "" ? bounds.min : Number(priceRange.min);
  const maxVal = priceRange.max === "" ? bounds.max : Number(priceRange.max);

  const safeMin = Number.isFinite(minVal) ? minVal : bounds.min;
  const safeMax = Number.isFinite(maxVal) ? maxVal : bounds.max;
  const total = Math.max(1, bounds.max - bounds.min);
  const leftPct = ((Math.min(safeMin, safeMax) - bounds.min) / total) * 100;
  const rightPct = ((bounds.max - Math.max(safeMin, safeMax)) / total) * 100;

  const setMin = (raw) => {
    const next = sanitizeIntegerLike(raw);
    if (next === "") {
      setPriceRange((r) => ({ ...r, min: "" }));
      return;
    }
    const n = Number(next);
    const clamped = Math.min(Math.max(bounds.min, n), bounds.max);
    setPriceRange((r) => {
      const currentMax = r.max === "" ? bounds.max : Number(r.max);
      const minFixed = Math.min(clamped, Number.isFinite(currentMax) ? currentMax : bounds.max);
      return { ...r, min: String(minFixed) };
    });
  };

  const setMax = (raw) => {
    const next = sanitizeIntegerLike(raw);
    if (next === "") {
      setPriceRange((r) => ({ ...r, max: "" }));
      return;
    }
    const n = Number(next);
    const clamped = Math.min(Math.max(bounds.min, n), bounds.max);
    setPriceRange((r) => {
      const currentMin = r.min === "" ? bounds.min : Number(r.min);
      const maxFixed = Math.max(clamped, Number.isFinite(currentMin) ? currentMin : bounds.min);
      return { ...r, max: String(maxFixed) };
    });
  };

  const onMinSlider = (v) => {
    const n = Number(v);
    setPriceRange((r) => {
      const currentMax = r.max === "" ? bounds.max : Number(r.max);
      const minFixed = Math.min(n, Number.isFinite(currentMax) ? currentMax : bounds.max);
      return { ...r, min: String(minFixed) };
    });
  };

  const onMaxSlider = (v) => {
    const n = Number(v);
    setPriceRange((r) => {
      const currentMin = r.min === "" ? bounds.min : Number(r.min);
      const maxFixed = Math.max(n, Number.isFinite(currentMin) ? currentMin : bounds.min);
      return { ...r, max: String(maxFixed) };
    });
  };

  const handleToggle = (k) => setOpenSections((s) => ({ ...s, [k]: !s[k] }));
  const sliderRef = useRef(null);
  const [activePriceThumb, setActivePriceThumb] = useState(null); // "min" | "max" | null

  const getValueFromClientX = (clientX) => {
    const el = sliderRef.current;
    if (!el) return bounds.min;
    const rect = el.getBoundingClientRect();
    const width = rect.width || 1;
    const x = Math.min(Math.max(clientX - rect.left, 0), width);
    const pct = x / width;
    const raw = bounds.min + pct * (bounds.max - bounds.min);
    const snapped = Math.round(raw / bounds.step) * bounds.step;
    return Math.min(bounds.max, Math.max(bounds.min, snapped));
  };

  useEffect(() => {
    if (!activePriceThumb) return;

    const onMove = (e) => {
      const n = getValueFromClientX(e.clientX);
      setPriceRange((r) => {
        const currentMin = r.min === "" ? bounds.min : Number(r.min);
        const currentMax = r.max === "" ? bounds.max : Number(r.max);

        if (!Number.isFinite(currentMin) || !Number.isFinite(currentMax)) {
          return r;
        }

        if (activePriceThumb === "min") {
          const minFixed = Math.min(n, currentMax);
          return { ...r, min: String(minFixed) };
        }

        const maxFixed = Math.max(n, currentMin);
        return { ...r, max: String(maxFixed) };
      });
    };

    const onUp = () => setActivePriceThumb(null);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [activePriceThumb, bounds.min, bounds.max, bounds.step, setPriceRange]);

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
        aria-label="Product filters"
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
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          <CollapsibleSection
            title="SIZE"
            open={openSections.category}
            onToggle={() => handleToggle("category")}
          >
            <div className="max-h-40 overflow-y-auto space-y-2">
              {categoriesByDepartment.length === 0 ? (
                <p className="text-sm text-[#6B7280]">No categories</p>
              ) : (
                categoriesByDepartment.map((c) => {
                  const checked = filterCategoryIds.includes(c._id);
                  return (
                    <CustomRadioOption
                      key={c._id}
                      checked={checked}
                      label={c.name}
                      onChange={() =>
                        setFilterCategoryIds((prev) =>
                          prev.includes(c._id) ? prev.filter((id) => id !== c._id) : [...prev, c._id]
                        )
                      }
                    />
                  );
                })
              )}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="STATUS"
            open={openSections.status}
            onToggle={() => handleToggle("status")}
          >
            <div className="space-y-2">
              {STATUS_OPTIONS.map((o) => {
                const checked = statusFilters.includes(o.value);
                return (
                  <CustomRadioOption
                    key={o.value}
                    checked={checked}
                    label={o.label}
                    onChange={() =>
                      setStatusFilters((prev) =>
                        prev.includes(o.value) ? prev.filter((v) => v !== o.value) : [...prev, o.value]
                      )
                    }
                  />
                );
              })}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="VISIBILITY"
            open={openSections.visibility}
            onToggle={() => handleToggle("visibility")}
          >
            <div className="space-y-2">
              {VISIBILITY_OPTIONS.map((o) => {
                const checked = visibilityFilters.includes(o.value);
                return (
                  <CustomRadioOption
                    key={o.value}
                    checked={checked}
                    label={o.label}
                    onChange={() =>
                      setVisibilityFilters((prev) =>
                        prev.includes(o.value) ? prev.filter((v) => v !== o.value) : [...prev, o.value]
                      )
                    }
                  />
                );
              })}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="STOCK"
            open={openSections.stock}
            onToggle={() => handleToggle("stock")}
          >
            <div className="space-y-2">
              {STOCK_OPTIONS.map((o) => {
                const checked = stockFilters.includes(o.value);
                return (
                  <CustomRadioOption
                    key={o.value}
                    checked={checked}
                    label={o.label}
                    onChange={() =>
                      setStockFilters((prev) =>
                        prev.includes(o.value) ? prev.filter((v) => v !== o.value) : [...prev, o.value]
                      )
                    }
                  />
                );
              })}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="PRICE"
            open={openSections.price}
            onToggle={() => handleToggle("price")}
          >
            <PriceRangeSlider
              bounds={bounds}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              setMin={setMin}
              setMax={setMax}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="SORT"
            open={openSections.sort}
            onToggle={() => handleToggle("sort")}
          >
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
          </CollapsibleSection>
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
