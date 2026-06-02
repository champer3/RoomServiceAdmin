import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faMagnifyingGlass,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { PageContext } from "../context/PageContext";
import Path from "../components/Path";
import TableHead from "../components/dashboard_components/TableHead";
import TableEmptyState from "../components/TableEmptyState";
import StyledDashboardButton from "../components/dashboard_components/StyledDashboardButton";
import Toast from "../components/Toast";
import GreenLabel from "../components/StatusLabels/GreenLabel";
import GreyLabel from "../components/StatusLabels/GreyLabel";
import OrangeLabel from "../components/StatusLabels/OrangeLabel";
import RedLabel from "../components/StatusLabels/RedLabel";
import YellowLabel from "../components/StatusLabels/YellowLabel";
import BlueLabel from "../components/StatusLabels/BlueLabel";
import { API_URL } from "../config";
import {
  listPromotions,
  getPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../api/promotions";
import PromotionPreviewPanel from "../components/promotions/PromotionPreviewPanel";
import {
  PROMOTION_TYPE_TABS,
  PROMOTION_STATUSES,
  TARGET_TYPES,
  PLACEMENT_SURFACES,
  PLACEMENT_SLOTS,
  AUDIENCE_TYPES,
  buildNameMaps,
  formatTargetCell,
  formatPlacementCell,
  formatAudienceCell,
  formatDateRange,
  promotionMatchesSearch,
  promotionOverlapsDateRange,
  typeLabel,
} from "../utils/promotionDisplay";

const ITEMS_PER_PAGE = 12;

function StatusChip({ status }) {
  const s = String(status || "").toLowerCase();
  if (s === "active") return <GreenLabel>{statusLabel(s)}</GreenLabel>;
  if (s === "draft") return <GreyLabel>{statusLabel(s)}</GreyLabel>;
  if (s === "inactive") return <OrangeLabel>{statusLabel(s)}</OrangeLabel>;
  if (s === "scheduled") return <BlueLabel>{statusLabel(s)}</BlueLabel>;
  if (s === "expired") return <RedLabel>{statusLabel(s)}</RedLabel>;
  return <YellowLabel>{status || "—"}</YellowLabel>;
}

function statusLabel(s) {
  return String(s || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function TypeChip({ type }) {
  const colors = {
    special: "bg-violet-100 text-violet-800",
    sale: "bg-emerald-100 text-emerald-800",
    deal: "bg-amber-100 text-amber-900",
    banner: "bg-sky-100 text-sky-800",
    coupon: "bg-orange-100 text-orange-900",
  };
  const cls = colors[type] || "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{typeLabel(type)}</span>
  );
}

export default function PromotionsPage() {
  const { changePage } = useContext(PageContext);
  const [loading, setLoading] = useState(true);
  const [rawList, setRawList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [tabKey, setTabKey] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTarget, setFilterTarget] = useState("");
  const [filterSurface, setFilterSurface] = useState("");
  const [filterSlot, setFilterSlot] = useState("");
  const [filterAudience, setFilterAudience] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  const maps = useMemo(
    () => buildNameMaps(departments, categories, products),
    [departments, categories, products]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (tabKey !== "all") {
        const tab = PROMOTION_TYPE_TABS.find((t) => t.key === tabKey);
        if (tab?.type) params.type = tab.type;
      }
      if (filterStatus) params.status = filterStatus;
      if (filterSurface) params.surface = filterSurface;
      if (filterSlot) params.slot = filterSlot;
      const res = await listPromotions(params);
      const list = res?.data?.data?.promotions ?? [];
      setRawList(Array.isArray(list) ? list : []);
    } catch (e) {
      setRawList([]);
      setToast({ open: true, message: e?.response?.data?.message || e.message || "Failed to load promotions", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [tabKey, filterStatus, filterSurface, filterSlot]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/departments`)
      .then((r) => r.json())
      .then((j) => setDepartments(j.data?.departments || []))
      .catch(() => setDepartments([]));
    fetch(`${API_URL}/api/v1/categories`)
      .then((r) => r.json())
      .then((j) => setCategories(j.data?.categories || []))
      .catch(() => setCategories([]));
    fetch(`${API_URL}/api/v1/products`)
      .then((r) => r.json())
      .then((j) => setProducts(j.data?.products || []))
      .catch(() => setProducts([]));
  }, []);

  const filtered = useMemo(() => {
    let rows = rawList;
    if (tabKey !== "all") {
      const tab = PROMOTION_TYPE_TABS.find((t) => t.key === tabKey);
      if (tab?.type) rows = rows.filter((p) => p.type === tab.type);
    }
    rows = rows.filter((p) => promotionMatchesSearch(p, searchQuery));
    if (filterStatus) rows = rows.filter((p) => p.status === filterStatus);
    if (filterTarget) {
      rows = rows.filter((p) => (p.targets?.[0]?.targetType || "all") === filterTarget);
    }
    if (filterAudience) {
      rows = rows.filter((p) => {
        const a = p.audiences?.[0]?.audienceType;
        if (filterAudience === "__none__") return !a || a === "all_users";
        return a === filterAudience;
      });
    }
    if (filterSurface) {
      rows = rows.filter((p) => p.placements?.some((pl) => pl.surface === filterSurface));
    }
    if (filterSlot) {
      rows = rows.filter((p) => p.placements?.some((pl) => pl.slot === filterSlot));
    }
    const ds = dateStart || null;
    const de = dateEnd || null;
    if (ds || de) {
      rows = rows.filter((p) => promotionOverlapsDateRange(p, ds, de));
    }
    return rows;
  }, [
    rawList,
    tabKey,
    searchQuery,
    filterStatus,
    filterTarget,
    filterAudience,
    filterSurface,
    filterSlot,
    dateStart,
    dateEnd,
  ]);

  const selectedPromotion = useMemo(
    () => filtered.find((p) => String(p._id) === String(selectedId)) || rawList.find((p) => String(p._id) === String(selectedId)),
    [filtered, rawList, selectedId]
  );

  const lastPage = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1);
  const pageSlice = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tabKey, searchQuery, filterStatus, filterTarget, filterSurface, filterSlot, filterAudience, dateStart, dateEnd]);

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, lastPage));
  }, [lastPage]);

  function resetFilters() {
    setSearchQuery("");
    setFilterStatus("");
    setFilterTarget("");
    setFilterSurface("");
    setFilterSlot("");
    setFilterAudience("");
    setDateStart("");
    setDateEnd("");
  }

  async function handleToggleActive(p) {
    try {
      const next = p.status === "active" ? "inactive" : "active";
      await updatePromotion(p._id, { status: next });
      setToast({ open: true, message: next === "active" ? "Activated" : "Deactivated", type: "success" });
      await refresh();
    } catch (e) {
      setToast({
        open: true,
        message: e?.response?.data?.message || e.message || "Update failed",
        type: "error",
      });
    }
  }

  async function handleDuplicate(p) {
    try {
      const full = await getPromotion(p._id);
      const doc = full?.data?.data?.promotion;
      if (!doc) throw new Error("Not found");
      const { _id, __v, createdAt, updatedAt, ...rest } = doc;
      const body = {
        ...rest,
        title: `${doc.title || "Promotion"} (copy)`,
        status: "draft",
      };
      if (body.couponConfig?.code) {
        const nextCode = `${body.couponConfig.code}-COPY`.slice(0, 50);
        body.couponConfig = { ...body.couponConfig, code: nextCode };
      }
      await createPromotion(body);
      setToast({ open: true, message: "Duplicated promotion", type: "success" });
      await refresh();
    } catch (e) {
      setToast({
        open: true,
        message: e?.response?.data?.message || e.message || "Duplicate failed",
        type: "error",
      });
    }
  }

  async function handleArchive(p) {
    try {
      await updatePromotion(p._id, { status: "expired" });
      setToast({ open: true, message: "Archived", type: "success" });
      await refresh();
    } catch (e) {
      setToast({
        open: true,
        message: e?.response?.data?.message || e.message || "Archive failed",
        type: "error",
      });
    }
  }

  async function handleDelete(p) {
    if (!window.confirm("Delete this promotion? It will be marked inactive.")) return;
    try {
      await deletePromotion(p._id);
      setToast({ open: true, message: "Removed", type: "success" });
      if (selectedId === p._id) setSelectedId(null);
      await refresh();
    } catch (e) {
      setToast({
        open: true,
        message: e?.response?.data?.message || e.message || "Delete failed",
        type: "error",
      });
    }
  }

  return (
    <>
      {changePage("promotions")}
      <Toast
        open={toast.open}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        message={toast.message}
        type={toast.type}
        title={toast.type === "error" ? "Error" : "Done"}
      />

      <div className="flex h-full min-h-0 w-full max-w-full overflow-hidden">
        <div className={`flex-1 min-w-0 overflow-hidden flex flex-col ${selectedPromotion ? "pr-3" : ""}`}>
          <div className="flex items-start gap-4 shrink-0">
            <div>
              <p className="text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]">Promotions</p>
              <p className="mt-1 text-[15px] text-[#6B7280] font-normal max-w-xl">
                Manage all campaigns, discounts, placements, and audience targeting
              </p>
              <Path pages={[{ name: "Dashboard", link: "dashboard" }, { name: "Promotions", link: "promotions" }]} />
            </div>
            <div className="flex ml-auto gap-2">
              <Link
                to="/promotions/new"
                className="inline-flex items-center gap-2 rounded-xl px-[14px] py-[10px] bg-[#283618] text-white font-semibold text-[14px] hover:bg-[#1F2714]"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.3333 9.33333H10.6667V2.66667C10.6667 2.48986 10.5964 2.32029 10.4714 2.19526C10.3464 2.07024 10.1768 2 10 2C9.82319 2 9.65362 2.07024 9.5286 2.19526C9.40357 2.32029 9.33333 2.48986 9.33333 2.66667V9.33333H2.66667C2.48986 9.33333 2.32029 9.40357 2.19526 9.5286C2.07024 9.65362 2 9.82319 2 10C2 10.1768 2.07024 10.3464 2.19526 10.4714C2.32029 10.5964 2.48986 10.6667 2.66667 10.6667H9.33333V17.3333C9.33333 17.5101 9.40357 17.6797 9.5286 17.8047C9.65362 17.9298 9.82319 18 10 18C10.1768 18 10.3464 17.9298 10.4714 17.8047C10.5964 17.6797 10.6667 17.5101 10.6667 17.3333V10.6667H17.3333C17.5101 10.6667 17.6797 10.5964 17.8047 10.4714C17.9298 10.3464 18 10.1768 18 10C18 9.82319 17.9298 9.65362 17.8047 9.5286C17.6797 9.40357 17.5101 9.33333 17.3333 9.33333Z"
                    fill="white"
                  />
                </svg>
                Create Promotion
              </Link>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 shrink-0 border-b border-[#E5E7EB] pb-3">
            {PROMOTION_TYPE_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTabKey(t.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  tabKey === t.key
                    ? "bg-[#283618] text-white shadow-sm"
                    : "bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-2 shrink-0">
            <div className="relative min-w-[200px] flex-1 max-w-md">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] h-3.5 w-3.5"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search promotions..."
                className="w-full rounded-xl border border-[#E5E7EB] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#283618]"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm bg-white"
            >
              <option value="">Status</option>
              {PROMOTION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </select>
            <select
              value={filterTarget}
              onChange={(e) => setFilterTarget(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm bg-white"
            >
              <option value="">Target</option>
              {TARGET_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={filterSurface}
              onChange={(e) => setFilterSurface(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm bg-white max-w-[140px]"
            >
              <option value="">Surface</option>
              {PLACEMENT_SURFACES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={filterSlot}
              onChange={(e) => setFilterSlot(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm bg-white max-w-[160px]"
            >
              <option value="">Slot</option>
              {PLACEMENT_SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={filterAudience}
              onChange={(e) => setFilterAudience(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm bg-white max-w-[180px]"
            >
              <option value="">Audience</option>
              <option value="__none__">All users (default)</option>
              {AUDIENCE_TYPES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-2 py-2 text-xs"
              />
              <span className="text-[#9CA3AF]">–</span>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-2 py-2 text-xs"
              />
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#F9FAFB]"
            >
              <FontAwesomeIcon icon={faRotateLeft} className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          <div className="mt-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col min-h-[240px] max-h-[calc(100vh-320px)]">
            <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto">
              <table className="min-w-[1100px] w-full text-sm">
                <thead className="sticky top-0 z-10 bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-4 py-2 text-left">
                      <TableHead heading="Title" />
                    </th>
                    <th className="px-4 py-2 text-left w-[90px]">
                      <TableHead heading="Type" />
                    </th>
                    <th className="px-4 py-2 text-left min-w-[140px]">
                      <TableHead heading="Target" />
                    </th>
                    <th className="px-4 py-2 text-left min-w-[160px]">
                      <TableHead heading="Placement" />
                    </th>
                    <th className="px-4 py-2 text-left min-w-[120px]">
                      <TableHead heading="Audience" />
                    </th>
                    <th className="px-4 py-2 text-left w-[100px]">
                      <TableHead heading="Status" />
                    </th>
                    <th className="px-4 py-2 text-left min-w-[160px]">
                      <TableHead heading="Date range" />
                    </th>
                    <th className="px-4 py-2 text-right w-[52px] pr-6">
                      <TableHead heading="" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!loading &&
                    pageSlice.map((p) => {
                      const open = menuOpenId === p._id;
                      return (
                        <tr
                          key={p._id}
                          className={`border-b border-[#F3F4F6] hover:bg-[#FAFAFA] cursor-pointer ${
                            selectedId === p._id ? "bg-[#F4F9EE]/80" : ""
                          }`}
                          onClick={() => setSelectedId(p._id)}
                        >
                          <td className="px-4 py-3 align-top">
                            <p className="font-semibold text-[#111827]">{p.title}</p>
                            {p.subtitle && <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">{p.subtitle}</p>}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <TypeChip type={p.type} />
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span className="inline-flex rounded-md bg-[#F3F4F6] px-2 py-1 text-xs text-[#374151]">
                              {formatTargetCell(p.targets?.[0], maps)}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span className="inline-flex rounded-md bg-slate-50 px-2 py-1 text-xs text-[#334155]">
                              {formatPlacementCell(p.placements?.[0])}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span className="inline-flex rounded-md bg-indigo-50 px-2 py-1 text-xs text-indigo-900">
                              {formatAudienceCell(p.audiences)}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <StatusChip status={p.status} />
                          </td>
                          <td className="px-4 py-3 align-top text-[13px] text-[#4B5563]">
                            {formatDateRange(p.startAt, p.endAt)}
                          </td>
                          <td className="px-4 py-3 align-top text-right relative" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              className="p-2 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280]"
                              onClick={() => setMenuOpenId(open ? null : p._id)}
                            >
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                            {open && (
                              <div className="absolute right-8 top-10 z-20 w-48 rounded-xl border border-[#E5E7EB] bg-white shadow-lg py-1 text-left">
                                <Link
                                  to={`/promotions/${p._id}/edit`}
                                  className="block px-3 py-2 text-sm hover:bg-[#F9FAFB]"
                                  onClick={() => setMenuOpenId(null)}
                                >
                                  Edit
                                </Link>
                                <button
                                  type="button"
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#F9FAFB]"
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    handleToggleActive(p);
                                  }}
                                >
                                  {p.status === "active" ? "Deactivate" : "Activate"}
                                </button>
                                <button
                                  type="button"
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#F9FAFB]"
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    handleDuplicate(p);
                                  }}
                                >
                                  Duplicate
                                </button>
                                <button
                                  type="button"
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#F9FAFB]"
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    setSelectedId(p._id);
                                  }}
                                >
                                  Preview
                                </button>
                                <button
                                  type="button"
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#F9FAFB]"
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    handleArchive(p);
                                  }}
                                >
                                  Archive
                                </button>
                                <button
                                  type="button"
                                  className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    handleDelete(p);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {!loading && filtered.length === 0 && (
                <TableEmptyState title="No promotions found" description="Try another tab or reset filters." />
              )}
              {loading && <p className="px-6 py-8 text-[#6B7280]">Loading promotions…</p>}
            </div>

            {filtered.length > 0 && (
              <div className="shrink-0 border-t border-[#F0F1F3] px-4 py-3 flex items-center justify-between bg-white">
                <p className="text-sm text-[#6B7280]">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-2">
                  <StyledDashboardButton
                    isDisabled={currentPage <= 1}
                    handleClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </StyledDashboardButton>
                  <StyledDashboardButton
                    isDisabled={currentPage >= lastPage}
                    handleClick={() => setCurrentPage((p) => Math.min(lastPage, p + 1))}
                  >
                    Next
                  </StyledDashboardButton>
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedPromotion && (
          <aside className="hidden xl:flex flex-col w-[380px] shrink-0 border-l border-[#E5E7EB] pl-4 overflow-y-auto max-h-[calc(100vh-120px)]">
            <PromotionPreviewPanel
              promotion={selectedPromotion}
              maps={maps}
              onEdit={() => {}}
              onToggleActive={handleToggleActive}
              onDuplicate={handleDuplicate}
              onPreview={() => {}}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          </aside>
        )}
      </div>

      {menuOpenId && (
        <button
          type="button"
          className="fixed inset-0 z-10 cursor-default"
          aria-label="Close menu"
          onClick={() => setMenuOpenId(null)}
        />
      )}
    </>
  );
}
