function formatDateRange(startAt, endAt) {
  if (!startAt && !endAt) return "No schedule";
  const start = startAt ? new Date(startAt).toLocaleDateString() : "Now";
  const end = endAt ? new Date(endAt).toLocaleDateString() : "No end";
  return `${start} – ${end}`;
}

function formatMoney(value) {
  const num = Number(value || 0);
  return `$${num.toFixed(2)}`;
}

function statusBadgeClass(status) {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200";
    case "scheduled":
      return "bg-blue-50 text-blue-800 ring-1 ring-blue-200";
    case "expired":
      return "bg-red-50 text-red-800 ring-1 ring-red-200";
    case "inactive":
      return "bg-stone-100 text-stone-600 ring-1 ring-stone-200";
    default:
      return "bg-stone-100 text-stone-600 ring-1 ring-stone-200";
  }
}

function capitalize(value = "") {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function capitalizeWords(value = "") {
  return String(value)
    .split("_")
    .map(capitalize)
    .join(" ");
}

function renderTargetSummary(targets = []) {
  if (!targets.length) return "All products";
  return targets
    .map((t) => {
      const tt = t.target_type || t.targetType;
      if (tt === "all") return "All";
      const name = t.target_name || t.targetName;
      return `${capitalize(tt)}${name ? `: ${name}` : ""}`;
    })
    .join(" • ");
}

function renderPlacementSummary(placements = []) {
  if (!placements.length) return "No placement";
  return placements
    .map((p) => {
      const surface = capitalize(p.surface || "");
      const slotPretty = capitalizeWords(String(p.slot || ""));
      const ct = p.context_type || p.contextType;
      const context =
        ct && ct !== "none"
          ? ` (${capitalize(ct)}${p.context_name || p.contextName ? `: ${p.context_name || p.contextName}` : ""})`
          : "";
      return `${surface} • ${slotPretty}${context}`;
    })
    .join(" • ");
}

function renderAudienceSummary(audiences = []) {
  if (!audiences.length) return "All users";
  return audiences
    .map((a) => {
      const at = a.audience_type || a.audienceType || "";
      switch (at) {
        case "first_order":
        case "first_order_only":
          return "First-time users";
        case "high_order_count":
        case "order_count":
          return "Order count rule";
        case "high_spend":
        case "lifetime_spend":
          return "High spend users";
        case "high_aov":
        case "average_order_value":
          return "High AOV users";
        case "inactive_users":
        case "days_since_last_order":
          return "Inactive users";
        case "compensated_users":
        case "has_received_compensation":
          return "Compensated users";
        case "all_users":
          return "All users";
        case "vip":
          return "VIP";
        default:
          return capitalizeWords(at || "Audience");
      }
    })
    .join(" • ");
}

function PreviewMeta({ label, value }) {
  return (
    <div className="flex justify-between gap-3 items-start text-[13px]">
      <span className="text-[#667085] shrink-0 min-w-[90px]">{label}</span>
      <span className="text-[#101828] text-right font-semibold">{value}</span>
    </div>
  );
}

function describeCondition(condition) {
  const value = condition?.condition_value || condition?.conditionValue || {};

  switch (condition?.condition_type || condition?.conditionType) {
    case "product_quantity":
      return `Buy ${value.minQty ?? value.min_qty ?? 1} of ${value.productName || value.product_name || "selected product"}`;
    case "category_quantity":
      return `Buy ${value.minQty ?? value.min_qty ?? 1} items from ${value.categoryName || value.category_name || "selected category"}`;
    case "department_subtotal":
      return `Spend at least ${formatMoney(value.minSubtotal ?? value.min_subtotal)} in ${value.departmentName || value.department_name || "selected department"}`;
    case "order_type":
      return `Order type must be ${value.value || "selected type"}`;
    case "order_minimum":
      return `Minimum order of ${formatMoney(value.amount)}`;
    default:
      return capitalizeWords(String(condition?.condition_type || condition?.conditionType || "condition"));
  }
}

function describeReward(reward) {
  const value = reward?.reward_value || reward?.rewardValue || {};

  switch (reward?.reward_type || reward?.rewardType) {
    case "free_product":
      return `Free ${value.qty || 1} ${value.productName || value.product_name || "product"}`;
    case "free_addon":
      return `Free add-on: ${value.addonName || value.addon_name || "selected add-on"}`;
    case "percentage_discount":
    case "discount":
      return `${value.value ?? value.percent ?? 0}% off`;
    case "fixed_discount":
      return `${formatMoney(value.value)} off`;
    case "bundle_price":
      return `Bundle price: ${formatMoney(value.value)}`;
    case "free_delivery":
      return "Free delivery";
    default:
      return capitalizeWords(String(reward?.reward_type || reward?.rewardType || "reward"));
  }
}

function EmptyPreview() {
  return (
    <div className="w-full max-w-[380px] rounded-[20px] border border-[#E4E9E4] bg-white shadow-[0_10px_28px_rgba(16,24,16,0.08)] overflow-hidden">
      <div className="p-[18px]">
        <p className="text-center text-sm text-[#667085] py-10">No promotion selected</p>
      </div>
    </div>
  );
}

function UnknownPreview({ type }) {
  return (
    <div className="w-full max-w-[380px] rounded-[20px] border border-[#E4E9E4] bg-white shadow-[0_10px_28px_rgba(16,24,16,0.08)] overflow-hidden">
      <div className="p-[18px]">
        <p className="text-center text-sm text-[#667085] py-10">Unsupported promotion type: {type || "—"}</p>
      </div>
    </div>
  );
}

function SpecialPreview({ data }) {
  const { promotion, config, targets, placements, audiences } = data;

  return (
    <div className="w-full max-w-[380px] rounded-[20px] border border-[#E4E9E4] bg-white shadow-[0_10px_28px_rgba(16,24,16,0.08)] overflow-hidden">
      {promotion.image_url ? (
        <img src={promotion.image_url} alt="" className="w-full h-[190px] object-cover block" />
      ) : null}

      <div className="p-[18px]">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-bold ${statusBadgeClass(promotion.status)}`}>
            {capitalize(promotion.status || "draft")}
          </span>
          {config?.badge_label ? (
            <span className="inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-bold bg-[#F4F7F4] text-[#344054]">
              {config.badge_label}
            </span>
          ) : null}
        </div>

        <h3 className="m-0 mb-2 text-2xl font-extrabold leading-tight text-[#101828]">{promotion.title}</h3>
        {promotion.subtitle ? <p className="m-0 mb-3.5 text-sm leading-relaxed text-[#667085]">{promotion.subtitle}</p> : null}

        <div className="mb-4">
          <button
            type="button"
            className="rounded-xl bg-[#283618] text-white font-bold text-sm px-4 py-3 cursor-default w-full sm:w-auto"
          >
            {config?.cta_label || "View special"}
          </button>
        </div>

        <div className="grid gap-2.5 mt-3">
          <PreviewMeta label="Target" value={renderTargetSummary(targets)} />
          <PreviewMeta label="Placement" value={renderPlacementSummary(placements)} />
          <PreviewMeta label="Audience" value={renderAudienceSummary(audiences)} />
          <PreviewMeta label="Schedule" value={formatDateRange(promotion.start_at, promotion.end_at)} />
        </div>
      </div>
    </div>
  );
}

function SalePreview({ data }) {
  const { promotion, config, targets, placements, audiences } = data;
  const dt = config?.discount_type;
  const saleText =
    dt === "percentage" ? `${config?.discount_value ?? 0}% OFF` : `${formatMoney(config?.discount_value)} OFF`;

  return (
    <div className="w-full max-w-[380px] rounded-[20px] border border-emerald-200 bg-white shadow-[0_10px_28px_rgba(40,54,24,0.12)] overflow-hidden ring-1 ring-[#283618]/10">
      {promotion.image_url ? (
        <img src={promotion.image_url} alt="" className="w-full h-[190px] object-cover block" />
      ) : null}

      <div className="p-[18px]">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-bold ${statusBadgeClass(promotion.status)}`}>
            {capitalize(promotion.status || "draft")}
          </span>
          <span className="inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-bold bg-[#283618] text-white">
            {config?.badge_label || "Sale"}
          </span>
        </div>

        <h3 className="m-0 mb-2 text-2xl font-extrabold leading-tight text-[#101828]">{promotion.title}</h3>
        {promotion.subtitle ? <p className="m-0 mb-3.5 text-sm leading-relaxed text-[#667085]">{promotion.subtitle}</p> : null}

        <div className="m-0 mb-4 text-[28px] font-extrabold text-[#283618]">{saleText}</div>

        <div className="grid gap-2.5 mt-3">
          <PreviewMeta label="Scope" value={renderTargetSummary(targets)} />
          <PreviewMeta label="Placement" value={renderPlacementSummary(placements)} />
          <PreviewMeta label="Audience" value={renderAudienceSummary(audiences)} />
          <PreviewMeta label="Schedule" value={formatDateRange(promotion.start_at, promotion.end_at)} />
        </div>
      </div>
    </div>
  );
}

function DealPreview({ data }) {
  const { promotion, config, targets, placements, audiences, conditions, rewards } = data;

  return (
    <div className="w-full max-w-[380px] rounded-[20px] border border-amber-200 bg-white shadow-[0_10px_28px_rgba(188,108,37,0.12)] overflow-hidden">
      {promotion.image_url ? (
        <img src={promotion.image_url} alt="" className="w-full h-[190px] object-cover block" />
      ) : null}

      <div className="p-[18px]">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-bold ${statusBadgeClass(promotion.status)}`}>
            {capitalize(promotion.status || "draft")}
          </span>
          {config?.promo_label ? (
            <span className="inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-bold bg-[#BC6C25] text-white">
              {config.promo_label}
            </span>
          ) : null}
        </div>

        <h3 className="m-0 mb-2 text-2xl font-extrabold leading-tight text-[#101828]">{promotion.title}</h3>
        {promotion.subtitle ? <p className="m-0 mb-3 text-sm leading-relaxed text-[#667085]">{promotion.subtitle}</p> : null}

        <div className="bg-[#F8FAF8] border border-[#E4E9E4] rounded-[14px] p-3 mb-3">
          <strong className="text-sm text-[#101828]">Deal rule</strong>
          <ul className="mt-2 mb-0 pl-[18px] text-[#344054] text-sm list-disc">
            {(conditions || []).length ? (
              (conditions || []).map((c) => <li key={c.id || JSON.stringify(c)}>{describeCondition(c)}</li>)
            ) : (
              <li className="text-[#667085]">No conditions</li>
            )}
          </ul>
        </div>

        <div className="bg-[#F8FAF8] border border-[#E4E9E4] rounded-[14px] p-3 mb-3">
          <strong className="text-sm text-[#101828]">Reward</strong>
          <ul className="mt-2 mb-0 pl-[18px] text-[#344054] text-sm list-disc">
            {(rewards || []).length ? (
              (rewards || []).map((r) => <li key={r.id || JSON.stringify(r)}>{describeReward(r)}</li>)
            ) : (
              <li className="text-[#667085]">No rewards</li>
            )}
          </ul>
        </div>

        <div className="grid gap-2.5 mt-3">
          <PreviewMeta label="Target" value={renderTargetSummary(targets)} />
          <PreviewMeta label="Placement" value={renderPlacementSummary(placements)} />
          <PreviewMeta label="Audience" value={renderAudienceSummary(audiences)} />
          <PreviewMeta label="Schedule" value={formatDateRange(promotion.start_at, promotion.end_at)} />
        </div>
      </div>
    </div>
  );
}

function BannerPreview({ data }) {
  const { promotion, config, placements, audiences } = data;

  return (
    <div className="w-full max-w-[380px] rounded-[20px] border border-sky-200 bg-gradient-to-b from-sky-50/80 to-white shadow-[0_10px_28px_rgba(14,116,144,0.1)] overflow-hidden">
      {promotion.image_url ? (
        <img src={promotion.image_url} alt="" className="w-full h-[190px] object-cover block" />
      ) : null}

      <div className="p-[18px]">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-bold ${statusBadgeClass(promotion.status)}`}>
            {capitalize(promotion.status || "draft")}
          </span>
          <span className="inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-bold bg-sky-100 text-sky-900">
            Banner
          </span>
        </div>

        <h3 className="m-0 mb-2 text-2xl font-extrabold leading-tight text-[#101828]">
          {config?.headline || promotion.title}
        </h3>

        {(config?.subheadline || promotion.subtitle) && (
          <p className="m-0 mb-3.5 text-sm leading-relaxed text-[#667085]">{config?.subheadline || promotion.subtitle}</p>
        )}

        {config?.button_label ? (
          <div className="mb-4">
            <button
              type="button"
              className="rounded-xl bg-sky-700 text-white font-bold text-sm px-4 py-3 cursor-default"
            >
              {config.button_label}
            </button>
          </div>
        ) : null}

        <div className="grid gap-2.5 mt-3">
          <PreviewMeta label="Placement" value={renderPlacementSummary(placements)} />
          <PreviewMeta label="Audience" value={renderAudienceSummary(audiences)} />
          <PreviewMeta label="Schedule" value={formatDateRange(promotion.start_at, promotion.end_at)} />
        </div>
      </div>
    </div>
  );
}

function CouponPreview({ data }) {
  const { promotion, config, audiences } = data;
  const dt = config?.discount_type;
  const discountText =
    dt === "percentage"
      ? `${config?.discount_value ?? 0}% OFF`
      : dt === "free_delivery"
        ? "FREE DELIVERY"
        : `${formatMoney(config?.discount_value)} OFF`;

  return (
    <div className="w-full max-w-[380px] rounded-[20px] border-2 border-dashed border-[#BC6C25]/40 bg-[#FFFBF7] shadow-[0_10px_28px_rgba(188,108,37,0.15)] overflow-hidden">
      <div className="p-[18px]">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-bold ${statusBadgeClass(promotion.status)}`}>
            {capitalize(promotion.status || "draft")}
          </span>
          <span className="inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-bold bg-[#BC6C25] text-white">
            Coupon
          </span>
        </div>

        <div className="inline-block px-3.5 py-2.5 border-2 border-dashed border-[#BC6C25] rounded-[14px] text-xl font-extrabold tracking-wide text-[#BC6C25] mb-3.5">
          {config?.code || "PROMOCODE"}
        </div>

        <h3 className="m-0 mb-2 text-xl font-extrabold text-[#101828]">{promotion.title}</h3>
        <div className="m-0 mb-4 text-2xl font-extrabold text-[#283618]">{discountText}</div>

        <div className="grid gap-2.5 mt-3">
          <PreviewMeta label="Minimum order" value={formatMoney(config?.minimum_order_amount || 0)} />
          <PreviewMeta label="Audience" value={renderAudienceSummary(audiences)} />
          <PreviewMeta label="Schedule" value={formatDateRange(promotion.start_at, promotion.end_at)} />
        </div>
      </div>
    </div>
  );
}

/**
 * Marketing-style promotion preview (second mode). Pass `data` from normalizePromotionForPreviewCard.
 */
export function PromotionPreviewCard({ data }) {
  const { promotion } = data || {};

  if (!promotion) {
    return <EmptyPreview />;
  }

  switch (promotion.type) {
    case "special":
      return <SpecialPreview data={data} />;
    case "sale":
      return <SalePreview data={data} />;
    case "deal":
      return <DealPreview data={data} />;
    case "banner":
      return <BannerPreview data={data} />;
    case "coupon":
      return <CouponPreview data={data} />;
    default:
      return <UnknownPreview type={promotion.type} />;
  }
}

export default PromotionPreviewCard;
