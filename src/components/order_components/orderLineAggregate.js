/** Stable key so identical products/modifiers collapse into one row with summed qty */
export function lineFingerprint(line, fromItems) {
  if (fromItems) {
    const pid = line?.productId != null ? String(line.productId) : "";
    const name = String(line?.productName || "")
      .toLowerCase()
      .trim();
    const v = Array.isArray(line?.variants)
      ? line.variants
          .map((x) => `${x.groupName}:${x.choiceName}`)
          .sort()
          .join("|")
      : "";
    const a = Array.isArray(line?.addons)
      ? line.addons
          .map((x) => `${x.addonName}:${x.quantity ?? 1}`)
          .sort()
          .join("|")
      : "";
    const n = String(line?.notes || "").trim();
    return `i:${pid}:${name}|${v}|${a}|${n}`;
  }
  const name = String(line?.productName || line?.name || "Item")
    .toLowerCase()
    .trim();
  const comp = String(line?.component || "").trim();
  const fl = Array.isArray(line?.flavor) ? line.flavor.join("\x1e") : "";
  const sd = Array.isArray(line?.sides) ? line.sides.join("\x1e") : "";
  return `l:${name}|${comp}|${fl}|${sd}`;
}

export function unitQuantityForLine(line, fromItems) {
  if (fromItems) return Math.max(1, Number(line?.quantity) || 1);
  if (Array.isArray(line?.dressing) && line.dressing.length > 0) {
    return Math.max(1, line.dressing.length);
  }
  return Math.max(1, Number(line?.quantity) || 1);
}

/** Merge duplicate rows (same fingerprint) so the card stays scannable */
export function aggregateOrderLines(list, fromItems) {
  const map = new Map();
  for (const line of list) {
    const fp = lineFingerprint(line, fromItems);
    const add = unitQuantityForLine(line, fromItems);
    if (!map.has(fp)) {
      map.set(fp, { line, qty: add });
    } else {
      map.get(fp).qty += add;
    }
  }
  return Array.from(map.values()).map(({ line, qty }) => ({
    ...line,
    quantity: qty,
  }));
}

export function displayQuantity(line, fromItems) {
  if (fromItems) return Math.max(1, Number(line?.quantity) || 1);
  const q = Number(line?.quantity);
  if (Number.isFinite(q) && q > 0) return Math.max(1, Math.floor(q));
  if (Array.isArray(line?.dressing) && line.dressing.length > 0) {
    return Math.max(1, line.dressing.length);
  }
  return 1;
}

export function getAggregatedPrepLines(order) {
  const fromItems = Array.isArray(order?.items) && order.items.length > 0;
  const rawList = fromItems
    ? order.items
    : Array.isArray(order?.orderDetails)
      ? order.orderDetails
      : [];
  const list =
    rawList.length > 0 ? aggregateOrderLines(rawList, fromItems) : [];
  return { list, fromItems, rawList };
}

function prepProgressAsObject(progress) {
  if (!progress || typeof progress !== "object" || Array.isArray(progress)) {
    return {};
  }
  if (typeof progress.toObject === "function") {
    return progress.toObject();
  }
  return { ...progress };
}

export function lineReadyCount(lineKey, progress) {
  const p = prepProgressAsObject(progress);
  const n = Number(p[lineKey]);
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

export function isLinePrepComplete(line, fromItems, progress) {
  const Q = displayQuantity(line, fromItems);
  const c = lineReadyCount(lineFingerprint(line, fromItems), progress);
  return c >= Q;
}

export function getPrepProgressLineCounts(order, progress) {
  const { list, fromItems } = getAggregatedPrepLines(order);
  let done = 0;
  for (const line of list) {
    if (isLinePrepComplete(line, fromItems, progress)) done += 1;
  }
  return { done, total: list.length, list, fromItems };
}

export function isOrderPrepFullyComplete(order, progress) {
  const { total, done } = getPrepProgressLineCounts(order, progress);
  return total > 0 && done === total;
}
