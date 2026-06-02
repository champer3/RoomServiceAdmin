import moment from "moment";

export const PROMOTION_TYPE_TABS = [
  { key: "all", label: "All", type: null },
  { key: "special", label: "Specials", type: "special" },
  { key: "sale", label: "Sales", type: "sale" },
  { key: "deal", label: "Deals", type: "deal" },
  { key: "banner", label: "Banners", type: "banner" },
  { key: "coupon", label: "Coupons", type: "coupon" },
];

export const PROMOTION_STATUSES = ["draft", "active", "inactive", "scheduled", "expired"];

export const TARGET_TYPES = ["department", "category", "product", "order", "all"];

export const PLACEMENT_SURFACES = [
  "home",
  "department",
  "category",
  "product",
  "cart",
  "checkout",
];

export const PLACEMENT_SLOTS = [
  "hero",
  "top_banner",
  "featured_strip",
  "inline_banner",
  "section_card",
  "popup",
  "badge_area",
  "summary_block",
  "coupon_entry",
  "summary_line",
];

export const PLACEMENT_CONTEXT_TYPES = ["none", "department", "category", "product"];

export const AUDIENCE_TYPES = [
  { value: "all_users", label: "All Users" },
  { value: "first_order", label: "First-time Users" },
  { value: "high_order_count", label: "High Order Count" },
  { value: "high_spend", label: "High Spend Users" },
  { value: "high_aov", label: "High AOV Users" },
  { value: "inactive_users", label: "Inactive Users" },
  { value: "compensated_users", label: "Compensated Users" },
  { value: "vip", label: "VIP" },
];

export const DEAL_TYPES = ["bogo", "bundle_price", "free_addon", "percentage_off", "fixed_amount_off"];

export const CONDITION_TYPES = [
  "buy_quantity",
  "buy_product",
  "buy_category",
  "order_minimum",
  "product_quantity",
  "category_quantity",
  "department_subtotal",
  "order_type",
];

export const REWARD_TYPES = [
  "free_product",
  "free_addon",
  "discount",
  "bundle_price",
  "percentage_discount",
  "fixed_discount",
  "free_delivery",
];

export const CTA_TYPES = ["product", "category", "department", "custom_link", "none"];

export const DISCOUNT_TYPES = ["percentage", "fixed_amount"];

export const COUPON_DISCOUNT_TYPES = ["percentage", "fixed_amount", "free_delivery"];

const SURFACE_LABELS = {
  home: "Home",
  department: "Department",
  category: "Category",
  product: "Product",
  cart: "Cart",
  checkout: "Checkout",
};

const SLOT_LABELS = {
  hero: "Hero",
  top_banner: "Top banner",
  featured_strip: "Featured strip",
  inline_banner: "Inline banner",
  section_card: "Section card",
  popup: "Popup",
  badge_area: "Badge area",
  summary_block: "Summary block",
  coupon_entry: "Coupon entry",
  summary_line: "Summary line",
};

const TYPE_LABELS = {
  special: "Special",
  sale: "Sale",
  deal: "Deal",
  banner: "Banner",
  coupon: "Coupon",
};

const TARGET_SHORT = {
  department: "Dept",
  category: "Category",
  product: "Product",
  order: "Order",
  all: "All",
};

export function typeLabel(type) {
  return TYPE_LABELS[type] || type || "—";
}

export function statusLabel(status) {
  if (!status) return "—";
  return String(status).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatDateRange(startAt, endAt) {
  const a = startAt ? moment(startAt) : null;
  const b = endAt ? moment(endAt) : null;
  if (!a && !b) return "—";
  if (a && !b) return `${a.format("D MMM YYYY")} → —`;
  if (!a && b) return `— → ${b.format("D MMM YYYY")}`;
  return `${a.format("D MMM YYYY")} — ${b.format("D MMM YYYY")}`;
}

function idStr(id) {
  if (id == null) return "";
  return typeof id === "object" && id._id ? String(id._id) : String(id);
}

/**
 * @param {object} target - promotion.targets[0]
 * @param {{ departments: Map, categories: Map, products: Map }} maps - id string -> name
 */
export function formatTargetCell(target, maps) {
  if (!target || !target.targetType) return "—";
  const tt = target.targetType;
  if (tt === "all") return "All";
  const tid = idStr(target.targetId);
  if (tt === "department") return maps.departments.get(tid) ? `Dept: ${maps.departments.get(tid)}` : `Department`;
  if (tt === "category") return maps.categories.get(tid) ? `Category: ${maps.categories.get(tid)}` : `Category`;
  if (tt === "product") return maps.products.get(tid) ? `Product: ${maps.products.get(tid)}` : `Product`;
  if (tt === "order") return "Order";
  return TARGET_SHORT[tt] || tt;
}

export function formatPlacementCell(placement) {
  if (!placement) return "—";
  const surf = SURFACE_LABELS[placement.surface] || placement.surface;
  const slot = SLOT_LABELS[placement.slot] || placement.slot;
  return `${surf} · ${slot}`;
}

export function formatPlacementLong(placement, maps) {
  if (!placement) return "—";
  const surf = SURFACE_LABELS[placement.surface] || placement.surface;
  const slot = SLOT_LABELS[placement.slot] || placement.slot;
  let ctx = "";
  if (placement.contextType && placement.contextType !== "none" && placement.contextId) {
    const cid = idStr(placement.contextId);
    if (placement.contextType === "department" && maps.departments.get(cid)) {
      ctx = ` (${maps.departments.get(cid)})`;
    } else if (placement.contextType === "category" && maps.categories.get(cid)) {
      ctx = ` (${maps.categories.get(cid)})`;
    } else if (placement.contextType === "product" && maps.products.get(cid)) {
      ctx = ` (${maps.products.get(cid)})`;
    } else {
      ctx = ` (context)`;
    }
  }
  return `${surf} — ${slot}${ctx}`;
}

export function formatAudienceCell(audiences) {
  if (!audiences || !audiences.length) return "All Users";
  const a = audiences[0];
  const def = AUDIENCE_TYPES.find((x) => x.value === a.audienceType);
  return def ? def.label : a.audienceType || "—";
}

export function promotionMatchesSearch(promotion, q) {
  if (!q || !String(q).trim()) return true;
  const s = String(q).trim().toLowerCase();
  const title = (promotion.title || "").toLowerCase();
  const sub = (promotion.subtitle || "").toLowerCase();
  const code = (promotion.couponConfig?.code || "").toLowerCase();
  return title.includes(s) || sub.includes(s) || code.includes(s);
}

export function promotionOverlapsDateRange(promotion, start, end) {
  if (!start && !end) return true;
  const ps = promotion.startAt ? moment(promotion.startAt).startOf("day") : null;
  const pe = promotion.endAt ? moment(promotion.endAt).endOf("day") : null;
  const rs = start ? moment(start).startOf("day") : null;
  const re = end ? moment(end).endOf("day") : null;
  if (rs && pe && pe.isBefore(rs)) return false;
  if (re && ps && ps.isAfter(re)) return false;
  return true;
}

export function buildNameMaps(departments, categories, products) {
  const dep = new Map();
  (departments || []).forEach((d) => {
    const id = d._id ?? d.id;
    if (id) dep.set(String(id), d.name || d.title || "—");
  });
  const cat = new Map();
  (categories || []).forEach((c) => {
    const id = c._id ?? c.id;
    if (id) cat.set(String(id), c.name || "—");
  });
  const prod = new Map();
  (products || []).forEach((p) => {
    const id = p._id ?? p.id;
    if (id) prod.set(String(id), p.name || p.title || "—");
  });
  return { departments: dep, categories: cat, products: prod };
}

export function summarizeDealConditions(conditions) {
  if (!conditions || !conditions.length) return "—";
  return conditions
    .map((c) => `${c.conditionType || "?"}: ${typeof c.conditionValue === "object" ? JSON.stringify(c.conditionValue) : c.conditionValue}`)
    .join("; ");
}

export function summarizeDealRewards(rewards) {
  if (!rewards || !rewards.length) return "—";
  return rewards
    .map((r) => `${r.rewardType || "?"}: ${typeof r.rewardValue === "object" ? JSON.stringify(r.rewardValue) : r.rewardValue}`)
    .join("; ");
}

export function imageUrlWithBase(url, apiUrl) {
  if (!url) return "";
  const u = String(url).trim();
  if (u.startsWith("http")) return u;
  return `${apiUrl}${u.startsWith("/") ? "" : "/"}${u}`;
}
