import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faCircleCheck,
  faCreditCard,
  faEllipsisVertical,
  faList,
  faLocationDot,
  faMinus,
  faPlus,
  faSpinner,
  faStore,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Backdrop from "../Backdrop";
import {
  buildOrderTimeline,
  coerceDate,
  getKanbanUrgencyTierStyle,
} from "./orderTimeHelpers";
import { getStatusIconPresentation } from "./orderStatusPresentation";
import {
  aggregateOrderLines,
  displayQuantity,
  getPrepProgressLineCounts,
  lineFingerprint,
  lineReadyCount,
} from "./orderLineAggregate";

function formatNumberWithCommas(number) {
  const formattedNumber = parseFloat(number.toFixed(2)).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  return formattedNumber;
}

function safeJsonParse(value, fallback = null) {
  if (value == null || typeof value !== "string") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function formatElapsedHMS(totalSeconds) {
  const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => (n < 10 ? `0${n}` : String(n));
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

/** Legacy OrderInfoCard header: yellow → ~8m amber → ~15m red */
function waitUrgencyStyle(totalSeconds) {
  const sec = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  let bg = "#ffc107";
  if (sec > 900) bg = "#A52A2A";
  else if (sec > 480) bg = "#BC6C25";
  const fg = bg === "#ffc107" ? "#111827" : "#ffffff";
  return { backgroundColor: bg, color: fg };
}

function useElapsedSincePlaced(placedMs, ticking) {
  const [seconds, setSeconds] = useState(() => {
    if (placedMs == null || Number.isNaN(placedMs)) return 0;
    return Math.max(0, Math.floor((Date.now() - placedMs) / 1000));
  });

  useEffect(() => {
    if (placedMs == null || Number.isNaN(placedMs)) {
      setSeconds(0);
      return;
    }
    const refresh = () =>
      setSeconds(Math.max(0, Math.floor((Date.now() - placedMs) / 1000)));
    refresh();
    if (!ticking) return;
    const id = setInterval(refresh, 1000);
    return () => clearInterval(id);
  }, [placedMs, ticking]);

  return seconds;
}

/**
 * Static timeline copy: all lines visible (no content swap).
 * Set to true for a subtle rotating highlight on detail lines (every ~4s).
 */
const ORDER_CARD_TIME_HIGHLIGHT_CYCLE = false;

function OrderCardTimeSection({ compact, timeline, enableCycle }) {
  const [hi, setHi] = useState(0);
  const hasLine3 = Boolean(timeline.line3);
  const cycleCount = hasLine3 ? 2 : 1;

  useEffect(() => {
    if (!enableCycle || cycleCount < 2) return;
    const id = setInterval(() => {
      setHi((i) => (i + 1) % cycleCount);
    }, 4000);
    return () => clearInterval(id);
  }, [enableCycle, cycleCount]);

  const lineCls = compact
    ? "text-[10px] text-[#6B7280] leading-snug"
    : "text-xs text-[#6B7280] leading-snug";

  const pulse = (index) =>
    enableCycle &&
    cycleCount >= 2 &&
    hi === index &&
    "bg-amber-50/90 ring-1 ring-amber-200/70 rounded-md px-1 py-0.5 -mx-0.5 transition-all duration-700";

  return (
    <div className="mt-2 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-2 space-y-1">
      <p className={`${lineCls} ${pulse(0)}`}>{timeline.line2}</p>
      {timeline.line3 ? (
        <p className={`${lineCls} ${pulse(1)}`}>{timeline.line3}</p>
      ) : null}
    </div>
  );
}

function formatDriverDisplay(driver) {
  const raw = driver != null ? String(driver).trim() : "";
  if (!raw) return { line: "Unassigned", assigned: false };
  if (raw.includes("@")) {
    const local = raw.split("@")[0] || raw;
    const pretty = local
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { line: `${pretty} (Assigned)`, assigned: true };
  }
  return { line: `${raw} (Assigned)`, assigned: true };
}

function isHttpUrl(str) {
  if (str == null || typeof str !== "string") return false;
  const s = str.trim();
  return s.startsWith("http://") || s.startsWith("https://");
}

function initialsFromEmail(email) {
  const local = String(email || "").split("@")[0] || "";
  const parts = local.replace(/[._-]+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase() || "—";
  }
  const one = parts[0] || local;
  if (one.length >= 2) return one.slice(0, 2).toUpperCase();
  return (one[0] || "D").toUpperCase() + (one[1] || "").toUpperCase();
}

function driverDisplayNameFromPopulated(driverDoc) {
  if (!driverDoc || typeof driverDoc !== "object") return "";
  const fn = String(driverDoc.firstName || "").trim();
  const ln = String(driverDoc.lastName || "").trim();
  if (fn || ln) return `${fn} ${ln}`.trim();
  if (driverDoc.email) return String(driverDoc.email);
  return "";
}

function initialsFromPopulatedDriver(driverDoc) {
  if (!driverDoc || typeof driverDoc !== "object") return "—";
  const fn = String(driverDoc.firstName || "").trim();
  const ln = String(driverDoc.lastName || "").trim();
  const joined = `${fn}${ln}`.replace(/\s/g, "");
  if (joined.length >= 2) return joined.slice(0, 2).toUpperCase();
  if (fn.length >= 2) return fn.slice(0, 2).toUpperCase();
  if (driverDoc.email) return initialsFromEmail(driverDoc.email);
  return "—";
}

const DRIVER_ROW_BG = [
  "bg-orange-500",
  "bg-violet-600",
  "bg-sky-600",
  "bg-emerald-600",
  "bg-rose-500",
  "bg-amber-600",
];

function displayNameFromEmail(email) {
  const local = String(email).split("@")[0] || "";
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function colorClassForEmail(email) {
  let h = 0;
  const s = String(email);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return DRIVER_ROW_BG[h % DRIVER_ROW_BG.length];
}

function currentDriverEmail(order) {
  const pop = order?.assignedDriverId;
  if (
    pop != null &&
    typeof pop === "object" &&
    !Array.isArray(pop) &&
    pop.email
  ) {
    return String(pop.email).trim().toLowerCase();
  }
  const d = order?.driver;
  if (d && String(d).trim().includes("@"))
    return String(d).trim().toLowerCase();
  return "";
}

/**
 * Delivery-only: driver avatar opens a floating popover (search + Unassigned + drivers).
 */
function DriverAssignTrigger({
  order,
  isPickup,
  compact,
  /** Smaller avatar for inline “Driver:” row */
  inline = false,
  driverEmails,
  onSetDriver,
  /** Increment (e.g. from parent double-click) to open the picker programmatically */
  openSignal = 0,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const anchorRef = useRef(null);
  const panelRef = useRef(null);
  const searchInputRef = useRef(null);
  const lastOpenSignalRef = useRef(0);

  useEffect(() => {
    if (openSignal > lastOpenSignalRef.current) {
      lastOpenSignalRef.current = openSignal;
      setOpen(true);
    }
  }, [openSignal]);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const margin = 8;
      const width = 288;
      const estH = 340;
      let left = r.left;
      let top = r.bottom + margin;
      if (left + width > window.innerWidth - margin) {
        left = Math.max(margin, window.innerWidth - width - margin);
      }
      if (top + estH > window.innerHeight - margin) {
        top = Math.max(margin, r.top - estH - margin);
      }
      setPos({ top, left });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      const t = e.target;
      if (anchorRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setSearch("");
      const id = requestAnimationFrame(() => searchInputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  if (isPickup) return null;

  const pop = order?.assignedDriverId;
  const hasPopulatedDriver =
    pop != null &&
    typeof pop === "object" &&
    !Array.isArray(pop) &&
    (pop._id != null || pop.email != null);

  const driverFieldAssigned = formatDriverDisplay(order?.driver).assigned;
  const assigned = hasPopulatedDriver || driverFieldAssigned;

  let photoUrl = null;
  if (hasPopulatedDriver && isHttpUrl(pop.photo)) {
    photoUrl = pop.photo.trim();
  }

  let initials = "—";
  if (hasPopulatedDriver) {
    initials = initialsFromPopulatedDriver(pop);
  } else if (driverFieldAssigned && order?.driver) {
    initials = initialsFromEmail(order.driver);
  }

  const displayName = hasPopulatedDriver
    ? driverDisplayNameFromPopulated(pop)
    : assigned && order?.driver
      ? formatDriverDisplay(order.driver).line.replace(/\s*\(Assigned\)\s*$/, "")
      : "";

  const title = assigned
    ? displayName || "Driver assigned"
    : "No driver assigned — click to assign";

  const size = inline
    ? compact
      ? "h-6 w-6"
      : "h-7 w-7"
    : compact
      ? "h-8 w-8"
      : "h-10 w-10";
  const iconSize = inline
    ? compact
      ? "h-3 w-3"
      : "h-3.5 w-3.5"
    : compact
      ? "h-3.5 w-3.5"
      : "h-4 w-4";
  const initialsClass = inline
    ? compact
      ? "text-[8px] font-bold"
      : "text-[10px] font-bold"
    : compact
      ? "text-[10px] font-bold"
      : "text-xs font-bold";

  const assignedEmail = currentDriverEmail(order);
  const q = search.trim().toLowerCase();
  const list = Array.isArray(driverEmails) ? driverEmails : [];
  const filtered = list.filter((email) => {
    if (!q) return true;
    const e = String(email).toLowerCase();
    const name = displayNameFromEmail(email).toLowerCase();
    return e.includes(q) || name.includes(q);
  });

  const rowBase =
    "w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors hover:bg-[#F3F4F6] focus:outline-none focus-visible:bg-[#F3F4F6] border-l-[3px]";
  const rowActive = "border-l-[#2563EB] bg-[#F9FAFB]";
  const rowIdle = "border-l-transparent";

  const choose = (email) => {
    onSetDriver?.(email);
    setOpen(false);
  };

  let avatarInner;
  if (!assigned) {
    avatarInner = (
      <span
        className={`shrink-0 ${size} rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#6B7280]`}
      >
        <FontAwesomeIcon icon={faUser} className={iconSize} aria-hidden />
      </span>
    );
  } else if (photoUrl) {
    avatarInner = (
      <span
        className={`shrink-0 ${size} rounded-full overflow-hidden bg-[#E5E7EB] inline-block`}
      >
        <img
          src={photoUrl}
          alt=""
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </span>
    );
  } else {
    const safeInitials =
      String(initials || "—").replace(/\s/g, "").slice(0, 2).toUpperCase() ||
      "—";
    avatarInner = (
      <span
        className={`shrink-0 ${size} rounded-full bg-[#2563EB] flex items-center justify-center text-white ${initialsClass}`}
      >
        {safeInitials}
      </span>
    );
  }

  const panel =
    open &&
    createPortal(
      <div
        ref={panelRef}
        className="fixed z-[200] w-[min(calc(100vw-16px),288px)] rounded-xl border border-[#E5E7EB] bg-white shadow-xl flex flex-col overflow-hidden"
        style={{ top: pos.top, left: pos.left }}
        role="dialog"
        aria-label="Choose driver"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 border-b border-[#F3F4F6] shrink-0">
          {assignedEmail ? (
            <div className="mb-2 flex items-center gap-2 rounded-lg border-2 border-[#2563EB] px-2 py-1.5">
              <span
                className={`h-8 w-8 shrink-0 rounded-full ${colorClassForEmail(assignedEmail)} flex items-center justify-center text-[10px] font-bold text-white`}
              >
                {initialsFromEmail(assignedEmail)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#111827]">
                  {displayNameFromEmail(assignedEmail)}
                </p>
                <p className="truncate text-xs text-[#6B7280]">{assignedEmail}</p>
              </div>
            </div>
          ) : null}
          <div className="rounded-lg border-2 border-[#2563EB] px-2.5 py-2">
            <input
              ref={searchInputRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drivers…"
              className="w-full border-0 bg-transparent p-0 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-0"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="max-h-[min(320px,calc(100vh-140px))] overflow-y-auto overscroll-y-contain py-1 [scrollbar-width:thin]">
          <button
            type="button"
            className={`${rowBase} ${!assignedEmail ? rowActive : rowIdle}`}
            onClick={(e) => {
              e.stopPropagation();
              choose(null);
            }}
          >
            <span
              className="h-9 w-9 shrink-0 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#6B7280]"
              aria-hidden
            >
              <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
            </span>
            <span className="font-medium text-[#111827]">Unassigned</span>
          </button>
          {filtered.map((email) => {
            const em = String(email).toLowerCase();
            const active = assignedEmail === em;
            const rowBg = colorClassForEmail(email);
            return (
              <button
                key={email}
                type="button"
                className={`${rowBase} ${active ? rowActive : rowIdle}`}
                onClick={(e) => {
                  e.stopPropagation();
                  choose(email);
                }}
              >
                <span
                  className={`h-9 w-9 shrink-0 rounded-full ${rowBg} flex items-center justify-center text-xs font-bold text-white`}
                >
                  {initialsFromEmail(email)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-[#111827] truncate">
                    {displayNameFromEmail(email)}
                  </span>
                  <span className="block text-xs text-[#6B7280] truncate">
                    {email}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <button
        type="button"
        ref={anchorRef}
        title={title}
        aria-label={title}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={[
          "shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2",
          open ? "ring-2 ring-[#2563EB] ring-offset-2" : "",
        ].join(" ")}
      >
        {avatarInner}
      </button>
      {panel}
    </>
  );
}

const LINE_ITEMS_SCROLL_THRESHOLD = 6;
const LINE_ITEMS_MAX_HEIGHT_COMPACT = "max-h-[15rem]"; /* ~176px */
const LINE_ITEMS_MAX_HEIGHT = "max-h-[18.5rem]"; /* ~216px */

function prepProgressMap(order) {
  const p = order?.preparationProgress;
  if (!p || typeof p !== "object" || Array.isArray(p)) return {};
  return typeof p.toObject === "function" ? p.toObject() : { ...p };
}

function stopKanbanBubble(e) {
  e.stopPropagation();
}

/** Progress segments beside Order title (preparing checklist) */
export function OrderPrepProgressHeader({ order, compact }) {
  const { done, total } = getPrepProgressLineCounts(
    order,
    order?.preparationProgress
  );
  if (total <= 0) return null;
  const pct = Math.max(0, Math.min(100, Math.round((done / total) * 100)));
  const barWidth = compact ? "w-20" : "w-28";
  return (
    <div
      className="flex items-center gap-2 shrink-0 min-w-0 ml-6"
      title={`${done} of ${total} lines ready`}
    >
      <div className={`${barWidth} h-2 rounded-full bg-[#E5E7EB] overflow-hidden`} aria-hidden>
        <div
          className="h-full bg-[#283618] transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={
          compact
            ? "text-[9px] font-semibold tabular-nums text-[#374151]"
            : "text-[10px] font-semibold tabular-nums text-[#374151]"
        }
      >
        {done}/{total}
      </span>
    </div>
  );
}

/** Full order progress bar for preparing checklist */
export function OrderPrepProgressBar({ order, compact }) {
  const { done, total } = getPrepProgressLineCounts(
    order,
    order?.preparationProgress
  );
  if (total <= 0) return null;
  const pct = Math.max(0, Math.min(100, Math.round((done / total) * 100)));
  return (
    <div className={compact ? "mt-1" : "mt-1.5"}>
      <div className="flex items-center justify-between mb-1">
        <span
          className={
            compact
              ? "text-[9px] font-semibold text-[#6B7280]"
              : "text-[10px] font-semibold text-[#6B7280]"
          }
        >
          Order progress
        </span>
        <span
          className={
            compact
              ? "text-[9px] font-semibold tabular-nums text-[#374151]"
              : "text-[10px] font-semibold tabular-nums text-[#374151]"
          }
        >
          {done}/{total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#E5E7EB] overflow-hidden" aria-hidden>
        <div
          className="h-full bg-[#283618] transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Line items: new `items[]` schema or legacy `orderDetails` */
export function OrderCardLineItems({
  order,
  compact,
  preparingInteractive = false,
  onPreparingProgressCommit,
}) {
  const [pendingActions, setPendingActions] = useState({});
  const [pendingExpected, setPendingExpected] = useState({});
  const [optimisticProgress, setOptimisticProgress] = useState({});
  const pendingTimeoutsRef = useRef({});

  useEffect(() => {
    return () => {
      Object.values(pendingTimeoutsRef.current).forEach((id) => {
        clearTimeout(id);
      });
      pendingTimeoutsRef.current = {};
    };
  }, []);
  const fromItems = Array.isArray(order?.items) && order.items.length > 0;
  const rawList = fromItems
    ? order.items
    : Array.isArray(order?.orderDetails)
      ? order.orderDetails
      : [];
  const list =
    rawList.length > 0 ? aggregateOrderLines(rawList, fromItems) : [];

  useEffect(() => {
    const expectedEntries = Object.entries(pendingExpected);
    if (!expectedEntries.length) return;

    expectedEntries.forEach(([fp, expected]) => {
      const serverVal = lineReadyCount(fp, order?.preparationProgress);
      if (serverVal === Number(expected)) {
        clearPendingForLine(fp, true);
      }
    });
  }, [order?.preparationProgress, pendingExpected]);

  if (!list.length) {
    return (
      <p
        className={
          compact
            ? "text-[11px] text-[#9CA3AF] italic"
            : "text-xs text-[#9CA3AF] italic"
        }
      >
        No line items
      </p>
    );
  }

  const titleCls = compact
    ? "text-[11px] font-semibold text-[#111827]"
    : "text-xs font-semibold text-[#111827]";
  const variantCls = compact
    ? "text-[10px] text-[#6B7280] italic pl-2 border-l-2 border-[#E5E7EB]"
    : "text-[11px] text-[#6B7280] italic pl-2 border-l-2 border-[#E5E7EB]";
  const sideCls = compact
    ? "text-[10px] text-[#4B5563] pl-2 border-l-2 border-[#E5E7EB]"
    : "text-[11px] text-[#4B5563] pl-2 border-l-2 border-[#E5E7EB]";

  const scroll =
    list.length >= LINE_ITEMS_SCROLL_THRESHOLD ||
    rawList.length > LINE_ITEMS_SCROLL_THRESHOLD;
  const maxH = compact ? LINE_ITEMS_MAX_HEIGHT_COMPACT : LINE_ITEMS_MAX_HEIGHT;
  const listWrapClass = scroll
    ? `${maxH} overflow-y-auto overscroll-y-contain pr-1 -mr-1 [scrollbar-width:thin]`
    : "";

  const collapsedRows = rawList.length - list.length;

  const iconLg = compact ? "h-3.5 w-3.5 mt-0.5 shrink-0" : "h-4 w-4 mt-0.5 shrink-0";
  const btnIcon = compact ? "h-3 w-3" : "h-3.5 w-3.5";
  const stepBtn =
    "inline-flex items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:pointer-events-none " +
    (compact ? "p-0.5" : "p-1");

  const clearPendingForLine = (fp, clearOptimistic = true) => {
    setPendingActions((curr) => {
      const next = { ...curr };
      delete next[fp];
      return next;
    });
    setPendingExpected((curr) => {
      const next = { ...curr };
      delete next[fp];
      return next;
    });
    if (clearOptimistic) {
      setOptimisticProgress((curr) => {
        const next = { ...curr };
        delete next[fp];
        return next;
      });
    }
    if (pendingTimeoutsRef.current[fp]) {
      clearTimeout(pendingTimeoutsRef.current[fp]);
      delete pendingTimeoutsRef.current[fp];
    }
  };

  const commitLine = async (fp, Q, nextVal, actionType = "toggle") => {
    if (!onPreparingProgressCommit) return;
    if (pendingActions[fp]) return;
    const prev = prepProgressMap(order);
    const next = { ...prev };
    const clamped = Math.max(0, Math.min(Q, Math.floor(nextVal)));
    next[fp] = clamped;
    setOptimisticProgress((curr) => ({ ...curr, [fp]: clamped }));
    setPendingExpected((curr) => ({ ...curr, [fp]: clamped }));
    setPendingActions((curr) => ({ ...curr, [fp]: actionType }));
    if (pendingTimeoutsRef.current[fp]) clearTimeout(pendingTimeoutsRef.current[fp]);
    pendingTimeoutsRef.current[fp] = setTimeout(() => {
      clearPendingForLine(fp, true);
    }, 12000);
    try {
      await Promise.resolve(onPreparingProgressCommit(order, next));
    } finally {
      // Keep spinner/optimistic value until server state catches up.
    }
  };

  const lineModifiers = (line, lineDone = false) => (
    <>
      {fromItems &&
        Array.isArray(line?.variants) &&
        line.variants.map((v, i) => (
          <p
            key={`nv-${i}`}
            className={`${variantCls} mt-1 ${
              lineDone ? "line-through opacity-60" : ""
            }`}
          >
            {v.groupName}: {v.choiceName}
          </p>
        ))}

      {!fromItems &&
        Array.isArray(line?.flavor) &&
        line.flavor.map((product, i) => {
          const parsed = safeJsonParse(product);
          if (!parsed?.values?.length) return null;
          return (
            <p
              key={`f-${i}`}
              className={`${variantCls} mt-1 ${
                lineDone ? "line-through opacity-60" : ""
              }`}
            >
              {parsed.name}:{" "}
              {parsed.values.map((val) => val.name).join(", ")}
            </p>
          );
        })}

      {fromItems &&
        Array.isArray(line?.addons) &&
        line.addons.map((ad, i) => (
          <p
            key={`na-${i}`}
            className={`${sideCls} mt-0.5 ${
              lineDone ? "line-through opacity-60" : ""
            }`}
          >
            + {ad.addonName}
          </p>
        ))}

      {!fromItems &&
        Array.isArray(line?.sides) &&
        line.sides.map((product, i) => {
          const parsed = safeJsonParse(product);
          if (!parsed?.name) return null;
          return (
            <p
              key={`s-${i}`}
              className={`${sideCls} mt-0.5 ${
                lineDone ? "line-through opacity-60" : ""
              }`}
            >
              + {parsed.name}
            </p>
          );
        })}
    </>
  );

  const listInner = (
    <ul className="space-y-2.5">
      {list.map((line, index) => {
        const qty = displayQuantity(line, fromItems);
        const fp = lineFingerprint(line, fromItems);
        const raw = lineReadyCount(fp, order?.preparationProgress);
        const optimistic = optimisticProgress[fp];
        const effectiveRaw =
          optimistic == null ? raw : Number(optimistic);
        const shown = Math.min(qty, Math.max(0, effectiveRaw));
        const lineDone = shown >= qty;
        const pendingAction = pendingActions[fp] || null;
        const lineBusy = Boolean(pendingAction);
        const name = line?.productName || line?.name || "Item";
        const component = fromItems
          ? String(line?.notes || "").trim()
          : line?.component
            ? String(line.component).trim()
            : "";

        const titleBlock = (
          <div
            className={`${titleCls} flex-1 min-w-0 ${
              lineDone ? "line-through opacity-60" : ""
            }`}
          >
            {qty > 1 ? `${qty}× ` : ""}
            {name}
            {component ? (
              <span
                className={`font-normal text-[#6B7280] ${
                  lineDone ? "line-through opacity-60" : ""
                }`}
              >
                {" "}
                (+ {component})
              </span>
            ) : null}
          </div>
        );

        if (preparingInteractive && onPreparingProgressCommit) {
          const checkIcon = lineDone ? (
            <FontAwesomeIcon
              icon={faCircleCheck}
              className={`${iconLg} text-emerald-600`}
              aria-hidden
            />
          ) : (
            <FontAwesomeIcon
              icon={faCircle}
              className={`${iconLg} text-[#D1D5DB]`}
              aria-hidden
            />
          );

          if (qty <= 1) {
            return (
              <li key={`${fp}-${index}`}>
                <button
                  type="button"
                  className="flex w-full text-left gap-2 items-start rounded-lg px-1 py-1 -mx-1 hover:bg-white/90 border border-transparent hover:border-[#E5E7EB]/80 transition-colors"
                  onClick={(e) => {
                    stopKanbanBubble(e);
                    void commitLine(fp, 1, lineDone ? 0 : 1, "toggle");
                  }}
                  disabled={lineBusy}
                >
                  {lineBusy ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className={`${iconLg} text-[#6B7280] animate-spin`}
                      aria-hidden
                    />
                  ) : (
                    checkIcon
                  )}
                  {titleBlock}
                </button>
                {lineModifiers(line, lineDone)}
              </li>
            );
          }

          return (
            <li key={`${fp}-${index}`}>
              <div className="rounded-lg px-1 py-1 -mx-1 border border-transparent hover:border-[#E5E7EB]/80 hover:bg-white/90 transition-colors">
                <div className="flex gap-2 items-start w-full">
                  <button
                    type="button"
                    className="flex flex-1 min-w-0 text-left gap-2 items-start rounded-md"
                    onClick={(e) => {
                      stopKanbanBubble(e);
                      void commitLine(fp, qty, lineDone ? 0 : qty, "toggle");
                    }}
                    disabled={lineBusy}
                  >
                    {lineBusy && pendingAction === "toggle" ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className={`${iconLg} text-[#6B7280] animate-spin`}
                        aria-hidden
                      />
                    ) : (
                      checkIcon
                    )}
                    {titleBlock}
                  </button>
                  <div
                    className="flex items-center gap-1 shrink-0"
                    onPointerDown={stopKanbanBubble}
                    onClick={stopKanbanBubble}
                  >
                    <button
                      type="button"
                      className={stepBtn}
                      aria-label="Fewer plates ready"
                      disabled={shown <= 0 || lineBusy}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void commitLine(fp, qty, shown - 1, "minus");
                      }}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <FontAwesomeIcon
                        icon={pendingAction === "minus" ? faSpinner : faMinus}
                        className={`${btnIcon} ${pendingAction === "minus" ? "animate-spin" : ""}`}
                      />
                    </button>
                    <span
                      className={
                        compact
                          ? "text-[10px] font-semibold tabular-nums text-[#374151] min-w-[2.25rem] text-center"
                          : "text-xs font-semibold tabular-nums text-[#374151] min-w-[2.5rem] text-center"
                      }
                    >
                      {shown}/{qty}
                    </span>
                    <button
                      type="button"
                      className={stepBtn}
                      aria-label="More plates ready"
                      disabled={shown >= qty || lineBusy}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void commitLine(fp, qty, shown + 1, "plus");
                      }}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <FontAwesomeIcon
                        icon={pendingAction === "plus" ? faSpinner : faPlus}
                        className={`${btnIcon} ${pendingAction === "plus" ? "animate-spin" : ""}`}
                      />
                    </button>
                  </div>
                </div>
                {lineModifiers(line, lineDone)}
              </div>
            </li>
          );
        }

        return (
          <li key={`${fp}-${index}`}>
            <div className="flex items-start justify-between gap-2">
              <p
                className={`${titleCls} flex-1 min-w-0 ${
                  lineDone ? "line-through opacity-60" : ""
                }`}
              >
                {qty > 1 ? `${qty}× ` : ""}
                {name}
                {component ? (
                  <span
                    className={`font-normal text-[#6B7280] ${
                      lineDone ? "line-through opacity-60" : ""
                    }`}
                  >
                    {" "}
                    (+ {component})
                  </span>
                ) : null}
              </p>
            </div>
            {lineModifiers(line, lineDone)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div
      onPointerDown={
        preparingInteractive && onPreparingProgressCommit
          ? stopKanbanBubble
          : undefined
      }
      onClick={
        preparingInteractive && onPreparingProgressCommit
          ? stopKanbanBubble
          : undefined
      }
    >
      {collapsedRows > 0 ? (
        <p
          className={
            compact
              ? "text-[10px] text-[#9CA3AF] mb-1.5"
              : "text-[11px] text-[#9CA3AF] mb-1.5"
          }
        >
          {list.length} line{list.length !== 1 ? "s" : ""} (
          {rawList.length} items)
        </p>
      ) : null}
      <div className={listWrapClass}>{listInner}</div>
    </div>
  );
}

export default function OrderInfoCard({
  orderId,
  status,
  orderType = "Delivery",
  idShort,
  customer,
  order,
  itemCount,
  total,
  shippingAddress,
  compact = false,
  /** When true, timer uses neutral styling (urgency shown on parent kanban card instead) */
  neutralTimerUrgency = false,
  /** Header primary text follows parent color (kanban urgency snap blink) */
  urgencyBlinkTextSync = false,
  /** Bumps to open driver picker (kanban double-click on ready delivery without driver) */
  driverPickerOpenSignal = 0,
  driverEmails = [],
  onSetOrderDriver,
  onUpdateStatus,
  /** Preparing-column kitchen checklist: PATCH progress via parent */
  onPreparingProgressCommit,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const isPickup = orderType === "Pickup";
  const st = String(status || "").toLowerCase();
  const isPreparing = st === "preparing";
  const showOrderPrep = isPreparing && Boolean(onPreparingProgressCommit);
  const isOrdered = st === "placed" || st === "ordered";
  const isTerminal =
    st === "delivered" ||
    st === "completed" ||
    st === "cancelled" ||
    (isPickup && st === "picked_up");

  const paymentPaid =
    order?.paymentStatus === "paid" ||
    order?.paymentStatus === true;
  const paymentMethod = order?.paymentMethod
    ? String(order.paymentMethod)
    : "—";
  const notes = String(
    order?.notes ?? order?.orderInstruction ?? ""
  ).trim();

  const canOverflow = !isTerminal;
  const totalFormatted = formatNumberWithCommas(Number(total) || 0);
  const timeline = useMemo(
    () => buildOrderTimeline(order, status, isPickup),
    [order, status, isPickup]
  );

  const placedMs = useMemo(() => {
    const d = coerceDate(order?.placedAt ?? order?.date);
    return d ? d.getTime() : null;
  }, [order?.placedAt, order?.date]);

  const showHeaderElapsed = !isTerminal && placedMs != null;
  const headerElapsedSec = useElapsedSincePlaced(placedMs, showHeaderElapsed);
  const urgencyTier = getKanbanUrgencyTierStyle(headerElapsedSec);

  const pad = compact ? "p-3" : "p-4";
  const headCustomer = compact ? "text-xs" : "text-sm";
  const sectionTitle = compact
    ? "text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]"
    : "text-[11px] font-bold uppercase tracking-wide text-[#9CA3AF]";
  const bodyText = compact ? "text-[11px] text-[#374151]" : "text-sm text-[#374151]";
  const muted = compact ? "text-[10px] text-[#6B7280]" : "text-xs text-[#6B7280]";
  const statusPresentation = getStatusIconPresentation(status);
  const statusIconSize = compact ? "h-3.5 w-3.5" : "h-4 w-4";
  const inlineIconMuted = compact ? "h-3 w-3 shrink-0 text-[#9CA3AF]" : "h-3.5 w-3.5 shrink-0 text-[#9CA3AF]";
  const cardShell = compact
    ? "rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-2.5"
    : "rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3";
  const sectionTitleRow = `${sectionTitle} flex items-center gap-2 mb-2`;
  const orderSectionTitleRow = showOrderPrep
    ? `${sectionTitle} flex flex-wrap items-center justify-between gap-x-4 gap-y-1 mb-2 min-w-0`
    : sectionTitleRow;

  return (
    <div className={`relative ${pad}`}>
      {menuOpen && (
        <>
          <Backdrop onClick={() => setMenuOpen(false)} />
          <div
            ref={menuRef}
            className="absolute z-[100] top-2 right-2 rounded-xl border border-[#E5E7EB] bg-white shadow-lg py-1 min-w-[160px]"
            onClick={(e) => e.stopPropagation()}
          >
            {canOverflow && (
              <>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB]"
                  onClick={() => {
                    onUpdateStatus?.(orderId, "cancelled");
                    setMenuOpen(false);
                  }}
                >
                  Cancel order
                </button>
                {!isOrdered ? (
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB]"
                    onClick={() => {
                      onUpdateStatus?.(orderId, "placed");
                      setMenuOpen(false);
                    }}
                  >
                    Reset to placed
                  </button>
                ) : null}
              </>
            )}
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB]"
              onClick={() => setMenuOpen(false)}
            >
              Close
            </button>
          </div>
        </>
      )}

      <div className="pb-2 mb-2 border-b border-[#E5E7EB]">
        <div className="flex items-center w-full min-w-0 justify-between">
        <div className="min-w-0 flex-1 basis-0 flex flex-col justify-center gap-0.5">
          <p
            className={
              compact
                ? `font-bold text-xs truncate ${urgencyBlinkTextSync ? "text-inherit" : "text-[#111827]"}`
                : `font-bold text-sm truncate ${urgencyBlinkTextSync ? "text-inherit" : "text-[#111827]"}`
            }
          >
            #{idShort}
          </p>
          <p
            className={`font-medium truncate ${headCustomer} ${urgencyBlinkTextSync ? "text-inherit" : "text-[#111827]"}`}
          >
            {customer}
          </p>
         
        </div>

        <div className="shrink-0 flex flex-col items-center justify-center px-1 gap-1">
          {showHeaderElapsed ? (
            <div
              className={[
                "rounded-md px-1.5 py-0.5 font-mono tabular-nums font-semibold leading-none tracking-tight",
                compact ? "text-[13px]" : "text-sm",
                neutralTimerUrgency
                  ? urgencyBlinkTextSync
                    ? "border-2 kanban-timer-urgency-snap"
                    : "border-2 shadow-sm"
                  : "shadow-sm",
              ].join(" ")}
              style={
                neutralTimerUrgency
                  ? urgencyBlinkTextSync
                    ? undefined
                    : {
                        backgroundColor: urgencyTier.bg,
                        borderColor: urgencyTier.border,
                        color: urgencyTier.fg,
                      }
                  : waitUrgencyStyle(headerElapsedSec)
              }
              title="Elapsed since order was placed"
            >
              {formatElapsedHMS(headerElapsedSec)}
            </div>
          ) : null}
          <span
            className={
              compact
                ? `rounded-full bg-[#283618]/10 text-[#283618] text-[9px] font-semibold px-1.5 py-0.5 shrink-0 ${urgencyBlinkTextSync ? "text-inherit" : "text-[#283618]"}`
                : `rounded-full bg-[#283618]/10 text-[#283618] text-[10px] font-semibold px-2 py-0.5 shrink-0 ${urgencyBlinkTextSync ? "text-inherit" : "text-[#283618]"}`
            }
          >
            {isPickup ? "Pickup" : "Delivery"}
          </span>
        </div>

        <div className="min-w-0 flex-1 basis-0 flex justify-end items-center gap-1">
          <div
            className={`flex shrink-0 items-center justify-center rounded-full p-2 ${statusPresentation.wrap}`}
            title={status || undefined}
            aria-label={`Order status: ${status || "Unknown"}`}
          >
            <FontAwesomeIcon
              icon={statusPresentation.icon}
              className={statusIconSize}
              aria-hidden
            />
          </div>
          {canOverflow ? (
            <button
              type="button"
              aria-label="More actions"
              title="More actions"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((o) => !o);
              }}
              className={
                compact
                  ? "shrink-0 rounded-lg text-[#6B7280] p-1.5 hover:bg-[#F3F4F6] hover:text-[#374151] inline-flex items-center justify-center"
                  : "shrink-0 rounded-lg text-[#6B7280] p-2 hover:bg-[#F3F4F6] hover:text-[#374151] inline-flex items-center justify-center"
              }
            >
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                className={compact ? "h-3.5 w-3.5" : "h-4 w-4"}
                aria-hidden
              />
            </button>
          ) : null}
        </div>
        </div>
      </div>

      <div className="mt-1 space-y-3">
        <div className={cardShell}>
          <div className={orderSectionTitleRow}>
            <span className="flex items-center gap-2 min-w-0">
              <FontAwesomeIcon
                icon={faList}
                className="h-3.5 w-3.5 text-[#9CA3AF] shrink-0"
                aria-hidden
              />
              Order
            </span>
            {showOrderPrep ? (
              <OrderPrepProgressHeader order={order} compact={compact} />
            ) : null}
          </div>
          <div>
            <OrderCardLineItems
              order={order}
              compact={compact}
              preparingInteractive={showOrderPrep}
              onPreparingProgressCommit={onPreparingProgressCommit}
            />
          </div>
          {notes ? (
            <div className="mt-2 rounded-lg bg-white/90 px-2 py-1.5 border border-[#E5E7EB]/80">
              <p className={muted}>
                <span className="font-semibold text-[#374151]">Notes: </span>
                {notes}
              </p>
            </div>
          ) : null}
          <p
            className={`${bodyText} ${compact ? "mt-1.5" : "mt-2"} flex flex-wrap items-baseline gap-x-1 gap-y-0`}
          >
            <span>{itemCount} items</span>
            <span className="text-[#D1D5DB]">·</span>
            <span className="font-semibold text-[#111827] tabular-nums">
              ${totalFormatted}
            </span>
          </p>
          <OrderCardTimeSection
            compact={compact}
            timeline={timeline}
            enableCycle={ORDER_CARD_TIME_HIGHLIGHT_CYCLE}
          />
        </div>

        {!isPickup ? (
          <div className={cardShell}>
            <p className={sectionTitleRow}>
              <FontAwesomeIcon
                icon={faLocationDot}
                className="h-3.5 w-3.5 text-[#9CA3AF] shrink-0"
                aria-hidden
              />
              Delivery
            </p>
            <p className={`${bodyText} flex items-start gap-1.5 break-words`}>
              <FontAwesomeIcon
                icon={faLocationDot}
                className={inlineIconMuted + " mt-0.5"}
                aria-hidden
              />
              <span>
                {shippingAddress && String(shippingAddress).trim()
                  ? shippingAddress
                  : "—"}
              </span>
            </p>
            <div
              className={`${bodyText} mt-1.5 flex items-center gap-2 min-w-0`}
            >
              <span className="text-[#6B7280] shrink-0">Driver:</span>
              <DriverAssignTrigger
                order={order}
                isPickup={isPickup}
                compact={compact}
                inline
                driverEmails={driverEmails}
                openSignal={driverPickerOpenSignal}
                onSetDriver={(email) => onSetOrderDriver?.(order, email)}
              />
            </div>
          </div>
        ) : (
          <div className={cardShell}>
            <p className={sectionTitleRow}>
              <FontAwesomeIcon
                icon={faStore}
                className="h-3.5 w-3.5 text-[#9CA3AF] shrink-0"
                aria-hidden
              />
              Pickup
            </p>
            <p className={muted}>Customer picks up in store</p>
          </div>
        )}

        <div className={cardShell}>
          <p className={sectionTitleRow}>
            <FontAwesomeIcon
              icon={faCreditCard}
              className="h-3.5 w-3.5 text-[#9CA3AF] shrink-0"
              aria-hidden
            />
            Payment
          </p>
          <p className={`${bodyText} flex items-start gap-1.5`}>
            <span>
              {paymentPaid ? "Paid" : "Unpaid"}
              <span className="text-[#D1D5DB]"> · </span>
              Method: {paymentMethod}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
