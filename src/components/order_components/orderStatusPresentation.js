import {
  faBan,
  faCircleQuestion,
  faClipboardList,
  faFireFlameCurved,
  faHandsClapping,
  faRoute,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Icons chosen to avoid kanban column toolbar icons in OrderNotifications
 * (e.g. utensils, truck, bolt, clock, circle-check, store, box, etc.).
 */
export function getStatusIconPresentation(status) {
  const s = String(status || "").toLowerCase();
  if (s === "cancelled") {
    return {
      icon: faBan,
      wrap: "bg-rose-100 text-rose-700",
    };
  }
  if (
    s === "delivered" ||
    s === "completed"
  ) {
    return {
      icon: faHandsClapping,
      wrap: "bg-emerald-100 text-emerald-700",
    };
  }
  if (
    s === "ready" ||
    s === "ready for delivery" ||
    s === "ready for pickup"
  ) {
    return {
      icon: faWandMagicSparkles,
      wrap: "bg-emerald-100 text-emerald-700",
    };
  }
  if (
    s === "assigned" ||
    s === "picked_up" ||
    s === "out for delivery" ||
    s === "out_for_delivery"
  ) {
    return {
      icon: faRoute,
      wrap: "bg-violet-100 text-violet-700",
    };
  }
  if (s === "preparing") {
    return {
      icon: faFireFlameCurved,
      wrap: "bg-orange-100 text-orange-700",
    };
  }
  if (s === "placed" || s === "ordered") {
    return {
      icon: faClipboardList,
      wrap: "bg-amber-100 text-amber-700",
    };
  }
  return {
    icon: faCircleQuestion,
    wrap: "bg-slate-100 text-slate-600",
  };
}
