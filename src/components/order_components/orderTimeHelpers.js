/** Shared date/time helpers for order cards and detail panel */

export function formatRelativeTime(dateInput) {
  if (!dateInput) return "—";
  const d =
    dateInput instanceof Date ? dateInput : new Date(dateInput);
  const t = d.getTime();
  if (Number.isNaN(t)) return "—";
  const sec = Math.floor((Date.now() - t) / 1000);
  if (sec < 10) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

export function coerceDate(value) {
  if (value == null) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatClockAmPm(date) {
  if (!date) return "—";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Full date + time for logs and milestones */
export function formatDateTimeDetailed(dateInput) {
  const d = coerceDate(dateInput);
  if (!d) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Milestone events that have timestamps, sorted chronologically.
 */
export function getOrderMilestoneEvents(order) {
  const candidates = [
    { key: "placed", label: "Placed", at: order?.placedAt ?? order?.date },
    { key: "accepted", label: "Accepted", at: order?.acceptedAt },
    { key: "ready", label: "Ready", at: order?.preparedAt },
    { key: "assigned", label: "Assigned", at: order?.assignedAt },
    { key: "pickedUp", label: "Picked up", at: order?.pickedUpAt },
    { key: "delivered", label: "Delivered", at: order?.deliveredAt },
    { key: "cancelled", label: "Cancelled", at: order?.cancelledAt },
  ];
  return candidates
    .map((c) => {
      const date = coerceDate(c.at);
      return date ? { key: c.key, label: c.label, date } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function buildOrderTimeline(order, rawStatus, isPickup) {
  const st = String(rawStatus || "").toLowerCase();
  const placedAt = coerceDate(order?.placedAt ?? order?.date);
  const acceptedAt = coerceDate(order?.acceptedAt);
  const preparedAt = coerceDate(order?.preparedAt);
  const assignedAt = coerceDate(order?.assignedAt);
  const pickedUpAt = coerceDate(order?.pickedUpAt);
  const deliveredAt = coerceDate(order?.deliveredAt);
  const cancelledAt = coerceDate(order?.cancelledAt);

  const rel = formatRelativeTime;
  const clock = formatClockAmPm;

  const chainReadyAcceptedPlaced = [
    preparedAt ? `Ready ${rel(preparedAt)}` : null,
    acceptedAt ? `Accepted ${rel(acceptedAt)}` : null,
    placedAt ? `Placed ${rel(placedAt)}` : null,
  ]
    .filter(Boolean)
    .join(" • ");

  const chainAcceptedPlaced = [
    acceptedAt ? `Accepted ${rel(acceptedAt)}` : null,
    placedAt ? `Placed ${rel(placedAt)}` : null,
  ]
    .filter(Boolean)
    .join(" • ");

  if (st === "cancelled") {
    return {
      line2: cancelledAt
        ? `${rel(cancelledAt)} • Cancelled at ${clock(cancelledAt)}`
        : "—",
      line3: placedAt ? `Placed ${rel(placedAt)}` : null,
    };
  }

  if (isPickup && (st === "picked_up" || st === "completed")) {
    const pickupMoment = pickedUpAt || deliveredAt || preparedAt || acceptedAt || placedAt;
    return {
      line2: pickupMoment
        ? `${rel(pickupMoment)} • Picked up at ${clock(pickupMoment)}`
        : "—",
      line3: null,
    };
  }

  if (st === "delivered" || st === "completed") {
    return {
      line2: deliveredAt
        ? `${rel(deliveredAt)} • Delivered at ${clock(deliveredAt)}`
        : "—",
      line3: null,
    };
  }

  if (st === "preparing") {
    const since = acceptedAt || placedAt;
    const line2 = since
      ? `${rel(since)} • ${
          acceptedAt
            ? `Preparing since ${clock(acceptedAt)}`
            : `Waiting since ${clock(placedAt)}`
        }`
      : "—";
    return {
      line2,
      line3:
        acceptedAt && placedAt ? `Placed ${rel(placedAt)}` : null,
    };
  }

  if (st === "placed" || st === "ordered") {
    return {
      line2: placedAt
        ? `${rel(placedAt)} • Placed since ${clock(placedAt)}`
        : "—",
      line3: null,
    };
  }

  if (
    st === "ready" ||
    st === "ready for delivery" ||
    st === "ready for pickup"
  ) {
    const readyMoment = preparedAt || acceptedAt || placedAt;
    return {
      line2: readyMoment
        ? `${rel(preparedAt || readyMoment)} • Ready since ${clock(preparedAt || readyMoment)}`
        : "—",
      line3: chainAcceptedPlaced || null,
    };
  }

  if (st === "assigned" || st === "out for delivery") {
    const anchor = assignedAt || preparedAt || acceptedAt || placedAt;
    return {
      line2: anchor
        ? `${rel(assignedAt || anchor)} • Assigned since ${clock(assignedAt || anchor)}`
        : "—",
      line3: chainReadyAcceptedPlaced || null,
    };
  }

  if (st === "picked_up" && !isPickup) {
    const anchor = pickedUpAt || assignedAt || preparedAt || placedAt;
    return {
      line2: anchor
        ? `${rel(pickedUpAt || anchor)} • Out for delivery since ${clock(pickedUpAt || anchor)}`
        : "—",
      line3: null,
    };
  }

  return {
    line2: placedAt
      ? `${rel(placedAt)} • Placed since ${clock(placedAt)}`
      : "—",
    line3: null,
  };
}

/**
 * Kanban preparing-highlight tiers — same thresholds as OrderInfoCard waitUrgencyStyle
 * and OrderNotifications kanban urgency (~8m / ~15m).
 */
export function getKanbanUrgencyTierStyle(elapsedSeconds) {
  const s = Math.max(0, Math.floor(Number(elapsedSeconds) || 0));
  if (s > 900) {
    return { bg: "#A52A2A", border: "#f5d0d0", fg: "white" };
  }
  if (s > 480) {
    return { bg: "#f5e0c8", border: "#BC6C25", fg: "#6b2f0a" };
  }
  return { bg: "#ffc107", border: "#ffc107", fg: "#5c4a06" };
}

     