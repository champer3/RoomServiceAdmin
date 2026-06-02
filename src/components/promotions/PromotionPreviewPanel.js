import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faImage,
  faPen,
  faCopy,
  faEye,
  faBoxArchive,
  faTrash,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "../../config";
import {
  formatAudienceCell,
  formatTargetCell,
  formatPlacementLong,
  formatDateRange,
  imageUrlWithBase,
  statusLabel,
  summarizeDealConditions,
  summarizeDealRewards,
  typeLabel,
} from "../../utils/promotionDisplay";
import { normalizePromotionForPreviewCard } from "../../utils/promotionPreviewCardData";
import { PromotionPreviewCard } from "./PromotionPreviewCard";

function Block({ title, children }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] mb-2">{title}</p>
      <div className="text-sm text-[#111827] space-y-1.5">{children}</div>
    </div>
  );
}

export default function PromotionPreviewPanel({
  promotion,
  maps,
  onEdit,
  onToggleActive,
  onDuplicate,
  onPreview,
  onArchive,
  onDelete,
  compact = false,
}) {
  const [previewMode, setPreviewMode] = useState("admin");

  const cardData = useMemo(
    () => (promotion ? normalizePromotionForPreviewCard(promotion, maps || { departments: new Map(), categories: new Map(), products: new Map() }, API_URL) : null),
    [promotion, maps]
  );

  if (!promotion) {
    return (
      <div className="h-full min-h-[280px] rounded-2xl border border-dashed border-[#E5E7EB] bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-[#6B7280] text-sm font-medium">Select a promotion</p>
        <p className="text-[#9CA3AF] text-xs mt-1">Click a row to preview details and quick actions.</p>
      </div>
    );
  }

  const img = imageUrlWithBase(promotion.imageUrl, API_URL);
  const targetStr = formatTargetCell(promotion.targets?.[0], maps);
  const placeStr = formatPlacementLong(promotion.placements?.[0], maps);
  const audienceStr = formatAudienceCell(promotion.audiences);

  const type = promotion.type;
  const sc = promotion.specialConfig || {};
  const sac = promotion.saleConfig || {};
  const bc = promotion.bannerConfig || {};
  const cc = promotion.couponConfig || {};
  const dc = promotion.dealConfig || {};

  return (
    <div className={`flex flex-col gap-3 ${compact ? "" : "min-w-[320px] max-w-[400px]"}`}>
      <div className="flex rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-1 gap-1">
        <button
          type="button"
          onClick={() => setPreviewMode("admin")}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
            previewMode === "admin" ? "bg-white text-[#283618] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          Admin summary
        </button>
        <button
          type="button"
          onClick={() => setPreviewMode("card")}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
            previewMode === "card" ? "bg-white text-[#283618] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          Customer card
        </button>
      </div>

      {previewMode === "card" ? (
        <div className="flex justify-center w-full">
          <PromotionPreviewCard data={cardData} />
        </div>
      ) : null}

      {previewMode === "admin" && (
      <>
      <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-[#283618]/10 to-[#BC6C25]/10 px-4 py-3 border-b border-[#E5E7EB]">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Preview</p>
          <p className="text-lg font-bold text-[#111827] mt-1 leading-snug">{promotion.title || "Untitled"}</p>
          {promotion.subtitle && <p className="text-sm text-[#4B5563] mt-0.5">{promotion.subtitle}</p>}
        </div>
        <div className="p-4 space-y-3">
          {img ? (
            <div className="relative rounded-lg overflow-hidden bg-[#F3F4F6] aspect-[16/9]">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="rounded-lg bg-[#F3F4F6] aspect-[16/9] flex items-center justify-center text-[#9CA3AF]">
              <FontAwesomeIcon icon={faImage} className="h-8 w-8" />
            </div>
          )}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center rounded-full px-2.5 py-1 font-semibold bg-[#EEF2FF] text-[#4338CA]">
              {typeLabel(type)}
            </span>
            <span className="inline-flex items-center rounded-full px-2.5 py-1 font-semibold bg-[#F3F4F6] text-[#374151]">
              {statusLabel(promotion.status)}
            </span>
          </div>
          <p className="text-xs text-[#6B7280] flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarDays} className="h-3 w-3" />
            {formatDateRange(promotion.startAt, promotion.endAt)}
          </p>
        </div>
      </div>

      <Block title="Targeting & placement">
        <p>
          <span className="text-[#6B7280]">Target:</span> {targetStr}
        </p>
        <p>
          <span className="text-[#6B7280]">Placement:</span> {placeStr}
        </p>
        <p>
          <span className="text-[#6B7280]">Audience:</span> {audienceStr}
        </p>
      </Block>

      {type === "special" && (
        <Block title="Special">
          <p>CTA: {sc.ctaLabel || "—"}</p>
          <p>CTA type: {sc.ctaType || "—"}</p>
          <p>Highlight: {sc.highlightStyle || "—"}</p>
        </Block>
      )}

      {type === "sale" && (
        <Block title="Sale">
          <p>
            Discount: {sac.discountType === "percentage" ? `${sac.discountValue}%` : `$${sac.discountValue}`}{" "}
            {sac.discountType === "fixed_amount" ? " off" : ""}
          </p>
          <p>Badge: {sac.badgeLabel || "Sale"}</p>
        </Block>
      )}

      {type === "banner" && (
        <Block title="Banner">
          <p className="font-semibold">{bc.headline || "—"}</p>
          <p className="text-[#6B7280]">{bc.subheadline || ""}</p>
          <p>Button: {bc.buttonLabel || "—"}</p>
        </Block>
      )}

      {type === "coupon" && (
        <Block title="Coupon">
          <p className="font-mono font-bold text-[#BC6C25]">{cc.code || "—"}</p>
          <p>
            Discount:{" "}
            {cc.discountType === "free_delivery"
              ? "Free delivery"
              : cc.discountType === "percentage"
                ? `${cc.discountValue}%`
                : `$${cc.discountValue}`}
          </p>
          <p>Min. order: ${Number(cc.minimumOrderAmount || 0).toFixed(2)}</p>
          {cc.firstOrderOnly && <p className="text-amber-700">First order only</p>}
        </Block>
      )}

      {type === "deal" && (
        <>
          <Block title="Deal">
            <p>Type: {dc.dealType || "—"}</p>
            <p>{dc.promoLabel || promotion.title}</p>
          </Block>
          <Block title="Conditions">{summarizeDealConditions(promotion.dealConditions)}</Block>
          <Block title="Rewards">{summarizeDealRewards(promotion.dealRewards)}</Block>
        </>
      )}
      </>
      )}

      {!compact && (previewMode === "admin" || previewMode === "card") && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 space-y-2">
          <p className="text-xs font-semibold text-[#6B7280] uppercase">Quick actions</p>
          <div className="flex flex-col gap-1.5">
            {onEdit && promotion._id && String(promotion._id) !== "preview" && (
              <Link
                to={`/promotions/${promotion._id}/edit`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#283618] hover:bg-[#F4F9EE]"
              >
                <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5" />
                Edit
              </Link>
            )}
            {onToggleActive && (
              <button
                type="button"
                onClick={() => onToggleActive(promotion)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-left text-[#374151] hover:bg-[#F9FAFB]"
              >
                <FontAwesomeIcon icon={promotion.status === "active" ? faToggleOff : faToggleOn} className="h-3.5 w-3.5" />
                {promotion.status === "active" ? "Deactivate" : "Activate"}
              </button>
            )}
            {onDuplicate && (
              <button
                type="button"
                onClick={() => onDuplicate(promotion)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-left text-[#374151] hover:bg-[#F9FAFB]"
              >
                <FontAwesomeIcon icon={faCopy} className="h-3.5 w-3.5" />
                Duplicate
              </button>
            )}
            {previewMode === "admin" && onPreview && (
              <button
                type="button"
                onClick={() => onPreview(promotion)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-left text-[#374151] hover:bg-[#F9FAFB]"
              >
                <FontAwesomeIcon icon={faEye} className="h-3.5 w-3.5" />
                Focus in list
              </button>
            )}
            {onArchive && (
              <button
                type="button"
                onClick={() => onArchive(promotion)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-left text-amber-800 hover:bg-amber-50"
              >
                <FontAwesomeIcon icon={faBoxArchive} className="h-3.5 w-3.5" />
                Archive
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(promotion)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-left text-red-700 hover:bg-red-50"
              >
                <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
