import { imageUrlWithBase } from "./promotionDisplay";

function idStr(id) {
  if (id == null || id === "") return "";
  return typeof id === "object" && id._id != null ? String(id._id) : String(id);
}

function targetName(targetType, targetId, maps) {
  if (!targetId || targetType === "all") return "";
  const tid = idStr(targetId);
  if (targetType === "department") return maps.departments.get(tid) || "";
  if (targetType === "category") return maps.categories.get(tid) || "";
  if (targetType === "product") return maps.products.get(tid) || "";
  return "";
}

function contextName(contextType, contextId, maps) {
  if (!contextId || !contextType || contextType === "none") return "";
  const cid = idStr(contextId);
  if (contextType === "department") return maps.departments.get(cid) || "";
  if (contextType === "category") return maps.categories.get(cid) || "";
  if (contextType === "product") return maps.products.get(cid) || "";
  return "";
}

/**
 * Maps API / form promotion document into the shape expected by PromotionPreviewCard.
 */
export function normalizePromotionForPreviewCard(promotion, maps, apiUrl) {
  if (!promotion) return null;

  const img = imageUrlWithBase(promotion.imageUrl, apiUrl);

  const targets = (promotion.targets || []).map((t) => ({
    target_type: t.targetType || t.target_type || "all",
    target_id: t.targetId != null ? idStr(t.targetId) : t.target_id,
    target_name: targetName(t.targetType || t.target_type, t.targetId ?? t.target_id, maps),
  }));

  const placements = (promotion.placements || []).map((p) => ({
    surface: p.surface,
    slot: p.slot,
    context_type: p.contextType || p.context_type || "none",
    context_id: p.contextId != null ? idStr(p.contextId) : p.context_id,
    context_name: contextName(
      p.contextType || p.context_type,
      p.contextId ?? p.context_id,
      maps
    ),
  }));

  const audiences = (promotion.audiences || []).map((a) => ({
    audience_type: a.audienceType || a.audience_type || "",
    audience_rule: a.audienceRule || a.audience_rule || {},
  }));

  const promo = {
    type: promotion.type,
    title: promotion.title || "",
    subtitle: promotion.subtitle || "",
    status: promotion.status || "draft",
    image_url: img || "",
    start_at: promotion.startAt || promotion.start_at,
    end_at: promotion.endAt || promotion.end_at,
  };

  let config = {};
  const type = promotion.type;
  if (type === "special") {
    const c = promotion.specialConfig || {};
    config = {
      badge_label: c.badgeLabel,
      cta_label: c.ctaLabel,
      cta_type: c.ctaType,
      cta_target: c.ctaTarget,
      highlight_style: c.highlightStyle,
    };
  } else if (type === "sale") {
    const c = promotion.saleConfig || {};
    config = {
      discount_type: c.discountType || c.discount_type,
      discount_value: c.discountValue ?? c.discount_value,
      show_sale_badge: c.showSaleBadge ?? c.show_sale_badge,
      badge_label: c.badgeLabel || c.badge_label,
    };
  } else if (type === "banner") {
    const c = promotion.bannerConfig || {};
    config = {
      headline: c.headline,
      subheadline: c.subheadline,
      button_label: c.buttonLabel || c.button_label,
      button_type: c.buttonType || c.button_type,
      button_target: c.buttonTarget || c.button_target,
      theme: c.theme,
      text_alignment: c.textAlignment || c.text_alignment,
    };
  } else if (type === "coupon") {
    const c = promotion.couponConfig || {};
    config = {
      code: c.code,
      discount_type: c.discountType || c.discount_type,
      discount_value: c.discountValue ?? c.discount_value,
      minimum_order_amount: c.minimumOrderAmount ?? c.minimum_order_amount ?? 0,
      first_order_only: c.firstOrderOnly ?? c.first_order_only,
    };
  } else if (type === "deal") {
    const c = promotion.dealConfig || {};
    config = {
      deal_type: c.dealType || c.deal_type,
      promo_label: c.promoLabel || c.promo_label,
      minimum_order_amount: c.minimumOrderAmount ?? c.minimum_order_amount,
    };
  }

  const conditions = (promotion.dealConditions || promotion.deal_conditions || []).map((c, i) => ({
    id: c._id || c.id || `c-${i}`,
    condition_type: c.conditionType || c.condition_type,
    condition_value: c.conditionValue != null ? c.conditionValue : c.condition_value,
  }));

  const rewards = (promotion.dealRewards || promotion.deal_rewards || []).map((r, i) => ({
    id: r._id || r.id || `r-${i}`,
    reward_type: r.rewardType || r.reward_type,
    reward_value: r.rewardValue != null ? r.rewardValue : r.reward_value,
  }));

  return {
    promotion: promo,
    targets,
    placements,
    audiences,
    config,
    conditions,
    rewards,
  };
}
