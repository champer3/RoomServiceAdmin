import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCircleCheck,
  faClock,
  faCreditCard,
  faEnvelope,
  faHashtag,
  faList,
  faLocationDot,
  faNoteSticky,
  faPhone,
  faRotate,
  faStore,
  faTruck,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { getStatusIconPresentation } from "./orderStatusPresentation";
import {
  coerceDate,
  formatClockAmPm,
  formatDateTimeDetailed,
  formatRelativeTime,
  getOrderMilestoneEvents,
} from "./orderTimeHelpers";
import {
  OrderCardLineItems,
  OrderPrepProgressHeader,
} from "./OrderInfoCard";

const sectionTitle =
  "text-[11px] font-bold uppercase tracking-wide text-[#9CA3AF] flex items-center gap-2";
const bodyText = "text-sm text-[#374151]";
const muted = "text-xs text-[#6B7280]";
const card = "rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3";

function formatMoney(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "—";
  return x.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getOrderIdShort(order) {
  const num = order?.orderNumber && String(order.orderNumber).trim();
  if (num && num.length >= 4) return num.slice(-5);
  return String(order?._id || order?.id || "").slice(-5);
}

function getStatus(order) {
  return String(order?.status ?? order?.orderStatus ?? "—");
}

function getOrderType(order) {
  return String(order?.orderType || "delivery").toLowerCase() === "pickup"
    ? "Pickup"
    : "Delivery";
}

function getCustomer(order) {
  const guest = order?.guestName && String(order.guestName).trim();
  if (guest) return guest;
  const u = order?.customerId;
  if (u && typeof u === "object") {
    const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
    if (name) return name;
    if (u.email) return String(u.email);
  }
  return String(order?.userName || "—");
}

function humanizeStatus(s) {
  if (s == null || s === "") return "—";
  return String(s)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Normalize status string for milestone matching */
function normalizedOrderStatus(order) {
  return String(order?.status ?? order?.orderStatus ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
}

/**
 * Which timeline milestone key corresponds to the order’s current status
 * (keys from getOrderMilestoneEvents: placed, accepted, ready, assigned, pickedUp, delivered, cancelled).
 */
function milestoneKeyForCurrentOrder(order) {
  const s = normalizedOrderStatus(order);
  const pickup =
    String(order?.orderType || "delivery").toLowerCase() === "pickup";
  const hasPickedUpAt = Boolean(coerceDate(order?.pickedUpAt));

  if (s === "cancelled") return "cancelled";
  if (pickup && (s === "picked_up" || (s === "completed" && hasPickedUpAt))) {
    return "pickedUp";
  }
  if (s === "delivered" || s === "completed") return "delivered";

  if (s === "placed" || s === "ordered") return "placed";
  if (s === "preparing") return "accepted";
  if (
    s === "ready" ||
    s === "ready_for_delivery" ||
    s === "ready_for_pickup"
  ) {
    return "ready";
  }
  if (s === "assigned" || s === "out_for_delivery") return "assigned";
  if (s === "picked_up") return "pickedUp";

  return null;
}

function timelineMilestoneVisual(order, evKey) {
  const s = normalizedOrderStatus(order);
  const pickup =
    String(order?.orderType || "delivery").toLowerCase() === "pickup";
  const hasPickedUpAt = Boolean(coerceDate(order?.pickedUpAt));
  const currentKey = milestoneKeyForCurrentOrder(order);

  const greenCheckDelivered =
    evKey === "delivered" && (s === "delivered" || s === "completed");
  const greenCheckPickupDone =
    evKey === "pickedUp" &&
    pickup &&
    (s === "picked_up" || (s === "completed" && hasPickedUpAt));
  const cancelledNode = evKey === "cancelled";

  if (cancelledNode) {
    return {
      kind: "cancelled",
      className:
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600",
    };
  }
  if (greenCheckDelivered || greenCheckPickupDone) {
    return {
      kind: "done",
      className:
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600",
    };
  }
  if (currentKey === evKey && s !== "cancelled") {
    return {
      kind: "current",
      className:
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#283618] text-white timeline-milestone-pulse",
    };
  }
  return {
    kind: "past",
    className:
      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5E7EB] text-[#9CA3AF]",
  };
}

function driverDisplay(order) {
  const pop = order?.assignedDriverId;
  if (pop && typeof pop === "object" && !Array.isArray(pop)) {
    const fn = String(pop.firstName || "").trim();
    const ln = String(pop.lastName || "").trim();
    const name = `${fn} ${ln}`.trim();
    if (name) return name;
    if (pop.email) return String(pop.email);
  }
  const d = order?.driver != null ? String(order.driver).trim() : "";
  return d || "—";
}

function formatMetaTime(order) {
  const u = coerceDate(order?.updatedAt);
  const c = coerceDate(order?.createdAt);
  const parts = [];
  if (u) parts.push(`Updated ${formatDateTimeDetailed(u)}`);
  if (c) parts.push(`Created ${formatDateTimeDetailed(c)}`);
  return parts.length ? parts.join(" · ") : null;
}

function actorLabel(entry) {
  const id = entry?.changedByUserId;
  if (id && typeof id === "object") {
    const em = id.email && String(id.email);
    const fn = [id.firstName, id.lastName].filter(Boolean).join(" ").trim();
    if (fn) return fn;
    if (em) return em;
  }
  if (id != null && (typeof id === "string" || typeof id === "number")) {
    const s = String(id);
    return s.length > 8 ? `…${s.slice(-6)}` : s;
  }
  return null;
}

function Section({ icon, title, titleRight = null, children }) {
  return (
    <section>
      <p
        className={`${sectionTitle} mb-2 flex flex-wrap justify-between items-center gap-x-2 gap-y-1 min-w-0`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5 text-[#9CA3AF]" />
          {title}
        </span>
        {titleRight}
      </p>
      {children}
    </section>
  );
}

function InfoRow({ label, value, className = "" }) {
  if (value == null || value === "") return null;
  const v = typeof value === "string" ? value.trim() : value;
  if (v === "" || v === "—") return null;
  return (
    <div className={`flex gap-2 text-sm ${className}`}>
      <span className="text-[#6B7280] shrink-0 min-w-[5.5rem]">{label}</span>
      <span className="text-[#111827] min-w-0 break-words">{value}</span>
    </div>
  );
}

function MoneyLine({ label, amount, always }) {
  if (amount == null || amount === "") return null;
  const n = Number(amount);
  if (!Number.isFinite(n)) return null;
  if (!always && n === 0) return null;
  return (
    <div className="flex justify-between text-sm gap-4">
      <span className="text-[#6B7280]">{label}</span>
      <span className="font-medium text-[#111827] tabular-nums">
        ${formatMoney(n)}
      </span>
    </div>
  );
}

/**
 * Full order detail body for Order Notifications sidebar / mobile modal.
 */
export default function OrderDetailPanel({
  order,
  onClose,
  variant = "sidebar",
  onPreparingProgressCommit,
}) {
  if (!order) return null;

  const status = getStatus(order);
  const isPickup = getOrderType(order) === "Pickup";
  const normalizedStatus = normalizedOrderStatus(order);
  const statusForPresentation =
    isPickup && normalizedStatus === "picked_up" ? "completed" : status;
  const statusPresentation = getStatusIconPresentation(statusForPresentation);
  const milestones = getOrderMilestoneEvents(order);
  const history = Array.isArray(order.statusHistory)
    ? [...order.statusHistory].sort((a, b) => {
        const tb = coerceDate(b?.createdAt)?.getTime() ?? 0;
        const ta = coerceDate(a?.createdAt)?.getTime() ?? 0;
        return tb - ta;
      })
    : [];

  const addr =
    order.shippingAddress && String(order.shippingAddress).trim()
      ? String(order.shippingAddress).trim()
      : order.deliveryAddress?.formattedAddress &&
          String(order.deliveryAddress.formattedAddress).trim()
        ? String(order.deliveryAddress.formattedAddress).trim()
        : null;

  const da = order.deliveryAddress;
  const addrExtra =
    da && typeof da === "object"
      ? {
          line: da.addressLine1,
          city: da.city,
          state: da.state,
          postal: da.postalCode,
        }
      : null;

  const notes = String(
    order?.notes ?? order?.orderInstruction ?? ""
  ).trim();

  const paymentPaid =
    order?.paymentStatus === "paid" || order?.paymentStatus === true;

  const stLower = String(status || "").toLowerCase();
  const showItemsPrep =
    stLower === "preparing" && Boolean(onPreparingProgressCommit);

  const metaLine = formatMetaTime(order);
  const idFull = String(order?._id || order?.id || "");

  const headerPad = variant === "modal" ? "px-4 py-3" : "px-4 py-3";
  const scrollPad = "px-4 py-4";

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      <div
        className={`${headerPad} border-b border-[#E5E7EB] flex items-center justify-between gap-2 shrink-0`}
      >
        <div className="min-w-0 flex items-center gap-2">
          <p className="font-semibold text-[#111827] truncate">
            Order #{getOrderIdShort(order)}
          </p>
          {order.orderNumber ? (
            <span className={`${muted} truncate hidden sm:inline`}>
              #{String(order.orderNumber)}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] shrink-0"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
        </button>
      </div>

      <div
        className={`flex-1 overflow-y-auto ${scrollPad} space-y-5 min-h-0 [scrollbar-width:thin]`}
      >
        <div className={card}>
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`flex shrink-0 items-center justify-center rounded-full p-2.5 ${statusPresentation.wrap}`}
              title={status}
            >
              <FontAwesomeIcon
                icon={statusPresentation.icon}
                className="h-5 w-5"
                aria-hidden
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Status
              </p>
              <p className="text-base font-semibold text-[#111827]">
                {humanizeStatus(status)}
              </p>
              {metaLine ? (
                <p className={`${muted} mt-0.5 flex items-start gap-1.5`}>
                  <FontAwesomeIcon
                    icon={faClock}
                    className="h-3.5 w-3.5 mt-0.5 shrink-0 opacity-70"
                  />
                  {metaLine}
                </p>
              ) : null}
            </div>
            <span className="rounded-full bg-[#283618]/10 text-[#283618] text-xs font-semibold px-2.5 py-1">
              {getOrderType(order)}
            </span>
          </div>
          <div className={`mt-3 pt-3 border-t border-[#E5E7EB] space-y-1.5 ${muted}`}>
            {idFull ? (
              <div className="flex items-start gap-2">
                <FontAwesomeIcon
                  icon={faHashtag}
                  className="h-3.5 w-3.5 mt-0.5 shrink-0"
                />
                <span className="break-all font-mono text-[11px]">{idFull}</span>
              </div>
            ) : null}
            {order.trackingToken ? (
              <InfoRow label="Tracking" value={String(order.trackingToken)} />
            ) : null}
          </div>
        </div>

        <Section icon={faUser} title="Customer">
          <div className={`${card} space-y-2`}>
            <div className="flex gap-2 text-sm">
              <span className="text-[#6B7280] shrink-0 min-w-[5.5rem]">
                Name
              </span>
              <span className="text-[#111827] min-w-0 break-words">
                {getCustomer(order)}
              </span>
            </div>
            {order.guestPhone ? (
              <div className="flex gap-2 text-sm items-start">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="h-4 w-4 text-[#9CA3AF] shrink-0 mt-0.5"
                />
                <span className="text-[#111827]">
                  {String(order.guestPhone)}
                </span>
              </div>
            ) : null}
            {order.guestEmail ? (
              <div className="flex gap-2 text-sm items-start">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="h-4 w-4 text-[#9CA3AF] shrink-0 mt-0.5"
                />
                <span className="text-[#111827] break-all">
                  {String(order.guestEmail)}
                </span>
              </div>
            ) : null}
          </div>
        </Section>

        <Section
          icon={faList}
          title="Items"
          titleRight={
            showItemsPrep ? (
              <OrderPrepProgressHeader order={order} compact={false} />
            ) : null
          }
        >
          <div className={card}>
            <OrderCardLineItems
              order={order}
              compact={false}
              preparingInteractive={showItemsPrep}
              onPreparingProgressCommit={onPreparingProgressCommit}
            />
          </div>
        </Section>

        <Section icon={faCreditCard} title="Payment & totals">
          <div className={`${card} space-y-2`}>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span
                className={
                  paymentPaid
                    ? "rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-semibold"
                    : "rounded-md bg-amber-100 text-amber-900 px-2 py-0.5 text-xs font-semibold"
                }
              >
                {paymentPaid ? "Paid" : "Unpaid"}
              </span>
              <span className="text-[#374151]">
                Method: {order.paymentMethod || "—"}
              </span>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-[#E5E7EB]">
              <MoneyLine label="Subtotal" amount={order.subtotal} />
              <MoneyLine label="Tax" amount={order.taxAmount} />
              <MoneyLine label="Delivery fee" amount={order.deliveryFee} />
              <MoneyLine label="Discount" amount={order.discountAmount} />
              <MoneyLine
                label="Total"
                amount={
                  order.totalAmount ?? order.totalPrice ?? 0
                }
                always
              />
            </div>
          </div>
        </Section>

        {!isPickup ? (
          <Section icon={faLocationDot} title="Delivery">
            <div className={`${card} space-y-2`}>
              <p className={`${bodyText} break-words`}>
                {addr || "—"}
              </p>
              {addrExtra && (addrExtra.line || addrExtra.city) ? (
                <p className={muted}>
                  {[
                    addrExtra.line,
                    [addrExtra.city, addrExtra.state, addrExtra.postal]
                      .filter(Boolean)
                      .join(", "),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              ) : null}
              <div className="flex gap-2 items-center pt-1 border-t border-[#E5E7EB]">
                <FontAwesomeIcon
                  icon={faTruck}
                  className="h-4 w-4 text-[#9CA3AF] shrink-0"
                />
                <span className="text-sm text-[#6B7280] shrink-0">Driver</span>
                <span className="text-sm font-medium text-[#111827] min-w-0">
                  {driverDisplay(order)}
                </span>
              </div>
            </div>
          </Section>
        ) : (
          <Section icon={faStore} title="Pickup">
            <p className={`${card} ${muted} mb-0`}>
              Customer picks up in store
            </p>
          </Section>
        )}

        {milestones.length > 0 ? (
          <Section icon={faClock} title="Timeline">
            <div className={`${card} space-y-0`}>
              <ul className="space-y-0">
                {milestones.map((ev, i) => {
                  const vis = timelineMilestoneVisual(order, ev.key);
                  return (
                    <li
                      key={ev.key}
                      className="flex gap-3 min-h-[3.5rem] last:min-h-0"
                    >
                      <div className="flex flex-col items-center shrink-0 w-9">
                        <div className={vis.className} aria-hidden>
                          {vis.kind === "cancelled" ? (
                            <FontAwesomeIcon
                              icon={faBan}
                              className="h-4 w-4"
                            />
                          ) : null}
                          {vis.kind === "done" ? (
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              className="h-5 w-5"
                            />
                          ) : null}
                          {vis.kind === "current" ? (
                            <FontAwesomeIcon
                              icon={faClock}
                              className="h-4 w-4"
                            />
                          ) : null}
                          {vis.kind === "past" ? (
                            <span className="h-2.5 w-2.5 rounded-full bg-[#283618]  ring-4 ring-[#283618]/15" />
                          ) : null}
                        </div>
                        {i < milestones.length - 1 ? (
                          <span className="w-px flex-1 min-h-[1.25rem] bg-[#E5E7EB] my-1" />
                        ) : null}
                      </div>
                      <div className="pb-4 last:pb-0 min-w-0 flex-1 pt-1">
                        <p className="text-sm font-semibold text-[#111827]">
                          {ev.label}
                        </p>
                        <p className={`${muted} mt-0.5`}>
                          {formatDateTimeDetailed(ev.date)}{" "}
                          <span className="text-[#D1D5DB]">·</span>{" "}
                          {formatClockAmPm(ev.date)}{" "}
                          <span className="text-[#D1D5DB]">·</span>{" "}
                          {formatRelativeTime(ev.date)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Section>
        ) : null}

        {history.length > 0 ? (
          <Section icon={faRotate} title="Status history">
            <ul className="space-y-2">
              {history.map((h, idx) => {
                const when = formatDateTimeDetailed(h?.createdAt);
                const actor = actorLabel(h);
                const role = h?.changedByRole
                  ? String(h.changedByRole)
                  : null;
                return (
                  <li
                    key={`${idx}-${h?.createdAt}`}
                    className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5"
                  >
                    <p className="text-sm font-medium text-[#111827]">
                      {humanizeStatus(h?.fromStatus)}{" "}
                      <span className="text-[#9CA3AF] font-normal">→</span>{" "}
                      {humanizeStatus(h?.toStatus)}
                    </p>
                    <p className={`${muted} mt-1`}>{when}</p>
                    {(actor || role) && (
                      <p className={`${muted} mt-0.5`}>
                        {[actor, role].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {h?.note ? (
                      <p className={`${bodyText} mt-1.5 text-xs italic`}>
                        {String(h.note)}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </Section>
        ) : null}

        {notes ? (
          <Section icon={faNoteSticky} title="Notes">
            <div className={card}>
              <p className={`${bodyText} whitespace-pre-wrap`}>{notes}</p>
            </div>
          </Section>
        ) : null}
      </div>
    </div>
  );
}
