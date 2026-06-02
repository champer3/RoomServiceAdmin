import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import moment from "moment";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableEmptyState from "../components/TableEmptyState";
import {
  faBox,
  faCalendarDay,
  faCircleCheck,
  faClock,
  faMoneyBillWave,
  faStore,
  faTruck,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "../config";
import { PageContext } from "../context/PageContext";
import StyledDashboardButton from "../components/dashboard_components/StyledDashboardButton";
import OrangeLabel from "../components/StatusLabels/OrangeLabel";
import GreenLabel from "../components/StatusLabels/GreenLabel";
import RedLabel from "../components/StatusLabels/RedLabel";
import YellowLabel from "../components/StatusLabels/YellowLabel";
import BlueLabel from "../components/StatusLabels/BlueLabel";
import FilterButton from "../components/FilterButton";
import OrderDetailPanel from "../components/order_components/OrderDetailPanel";
import TableHead from "../components/dashboard_components/TableHead";
import {
  CollapsibleSection,
  CustomRadioOption,
  PriceRangeSlider,
} from "../components/ProductsFilterDrawer";
import statIconDelivering from "../assets/image 14.png";
import statIconReady from "../assets/image 15.png";
import statIconPreparing from "../assets/image 16.png";
import statIconPending from "../assets/image 17.png";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

const STATUS_OPTIONS = [
  { value: "placed", label: "Placed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0.00";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(d) {
  if (!d) return "—";
  return moment(d).format("D MMM YYYY");
}

function normalizeStatus(rawStatus) {
  const value = String(rawStatus ?? "").trim().toLowerCase();
  const map = {
    ordered: "placed",
    placed: "placed",
    preparing: "preparing",
    ready: "ready",
    ready_for_delivery: "ready",
    "ready for delivery": "ready",
    ready_for_pickup: "ready",
    "ready for pickup": "ready",
    "ready for pick up": "ready",
    assigned: "out_for_delivery",
    picked_up: "completed",
    out_for_delivery: "out_for_delivery",
    "out for delivery": "out_for_delivery",
    delivered: "completed",
    completed: "completed",
    cancelled: "cancelled",
    canceled: "cancelled",
  };
  return map[value] || value || "placed";
}

function statusLabel(status) {
  const labels = {
    placed: "Placed",
    preparing: "Preparing",
    ready: "Ready",
    out_for_delivery: "Out for Delivery",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] || "Placed";
}

function normalizePaymentStatus(raw, paymentMethod) {
  const val = String(raw ?? "").trim().toLowerCase();
  if (val === "true") return "paid";
  if (val === "false") return "pending";
  if (["paid", "pending", "failed", "refunded"].includes(val)) return val;
  if (paymentMethod && String(paymentMethod).toLowerCase().includes("cash")) return "pending";
  return "pending";
}

function normalizeOrderType(rawType) {
  return String(rawType || "delivery").toLowerCase() === "pickup" ? "Pickup" : "Delivery";
}

function extractItems(order) {
  if (Array.isArray(order?.items) && order.items.length > 0) {
    return order.items.map((line) => ({
      name: String(line?.name || line?.productName || "Item"),
      qty: Number(line?.quantity) > 0 ? Number(line.quantity) : 1,
    }));
  }
  const details = Array.isArray(order?.orderDetails) ? order.orderDetails : [];
  return details.map((line) => ({
    name: String(line?.productName || line?.name || "Item"),
    qty: Array.isArray(line?.dressing) && line.dressing.length > 0 ? line.dressing.length : 1,
  }));
}

function displayOrderCode(order) {
  const number = String(order?.orderNumber || "").trim();
  if (number) return number.startsWith("RS-") ? number : `RS-${number}`;
  const id = String(order?.orderId || "");
  return `RS-${id.slice(-4).toUpperCase()}`;
}

function normalizeOrder(order) {
  const orderId = String(order?._id ?? order?.id ?? "");
  const status = normalizeStatus(order?.status ?? order?.orderStatus);
  const paymentMethod = String(order?.paymentMethod ?? order?.payment?.method ?? "N/A");
  const items = extractItems(order);
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const date = order?.placedAt ?? order?.createdAt ?? order?.date ?? null;
  const customer =
    String(order?.guestName || "").trim() ||
    String(order?.userName || "").trim() ||
    String(order?.customerName || "").trim() ||
    "Unknown";

  return {
    ...order,
    orderId,
    orderNumber: order?.orderNumber ?? null,
    status,
    statusLabel: statusLabel(status),
    date,
    customer,
    paymentMethod,
    paymentStatus: normalizePaymentStatus(order?.paymentStatus, paymentMethod),
    orderType: normalizeOrderType(order?.orderType),
    total: Number(order?.totalAmount ?? order?.totalPrice ?? order?.total ?? 0) || 0,
    driver: String(order?.driver || "").trim(),
    items,
    itemCount,
    productText: items.map((i) => i.name).join(", "),
  };
}

function dateRangeMatch(orderDate, datePreset, customStart, customEnd) {
  if (!orderDate) return false;
  const d = moment(orderDate);
  if (!d.isValid()) return false;
  if (datePreset === "all") return true;
  if (datePreset === "today") return d.isSame(moment(), "day");
  if (datePreset === "yesterday") return d.isSame(moment().subtract(1, "day"), "day");
  if (datePreset === "last7") return d.isSameOrAfter(moment().subtract(6, "day").startOf("day"));
  if (datePreset === "custom") {
    const start = customStart ? moment(customStart).startOf("day") : null;
    const end = customEnd ? moment(customEnd).endOf("day") : null;
    if (start && d.isBefore(start)) return false;
    if (end && d.isAfter(end)) return false;
    return true;
  }
  return true;
}

function exportOrdersCsv(orders) {
  const headers = ["Order Code", "Order ID", "Date", "Customer", "Type", "Items", "Total", "Payment Method", "Payment Status", "Status"];
  const rows = orders.map((o) => [
    displayOrderCode(o),
    o.orderId,
    formatDate(o.date),
    o.customer,
    o.orderType,
    o.productText,
    o.total,
    o.paymentMethod,
    o.paymentStatus,
    o.statusLabel,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders-${moment().format("YYYY-MM-DD-HH-mm")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function OrdersFiltersDrawer({
  open,
  onClose,
  statusFilters,
  setStatusFilters,
  orderTypeFilter,
  setOrderTypeFilter,
  datePreset,
  setDatePreset,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  paymentStatusFilters,
  setPaymentStatusFilters,
  amountMin,
  setAmountMin,
  amountMax,
  setAmountMax,
  sortBy,
  setSortBy,
  onReset,
}) {
  const [openSections, setOpenSections] = useState({
    status: true,
    type: false,
    date: false,
    payment: false,
    amount: true,
    sort: false,
  });

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const bounds = { min: 0, max: 2000, step: 10 };
  const priceRange = { min: amountMin, max: amountMax };
  const setPriceRange = (updater) => {
    const next = typeof updater === "function" ? updater(priceRange) : updater;
    setAmountMin(String(next?.min ?? ""));
    setAmountMax(String(next?.max ?? ""));
  };

  const setMin = (raw) => setAmountMin(String(raw ?? "").replace(/[^\d]/g, ""));
  const setMax = (raw) => setAmountMax(String(raw ?? "").replace(/[^\d]/g, ""));

  const toggleListFilter = (value, setFn) => {
    setFn((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handleToggle = (k) => setOpenSections((s) => ({ ...s, [k]: !s[k] }));

  return (
    <>
      <button type="button" className="fixed inset-0 z-40 bg-black/40 border-0 p-0" onClick={onClose} aria-label="Close filters" />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
          <h2 className="text-lg font-semibold text-[#111827]">Filters</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6]">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <CollapsibleSection title="STATUS" open={openSections.status} onToggle={() => handleToggle("status")}>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {STATUS_OPTIONS.map((o) => (
                <CustomRadioOption
                  key={o.value}
                  checked={statusFilters.includes(o.value)}
                  label={o.label}
                  onChange={() => toggleListFilter(o.value, setStatusFilters)}
                />
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="ORDER TYPE" open={openSections.type} onToggle={() => handleToggle("type")}>
            <div className="space-y-2">
              {["all", "Delivery", "Pickup"].map((v) => (
                <CustomRadioOption
                  key={v}
                  checked={orderTypeFilter === v}
                  label={v === "all" ? "All" : v}
                  onChange={() => setOrderTypeFilter(v)}
                />
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="DATE RANGE" open={openSections.date} onToggle={() => handleToggle("date")}>
            <select
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value)}
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7">Last 7 days</option>
              <option value="custom">Custom</option>
            </select>
            {datePreset === "custom" && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm" />
                <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm" />
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection title="PAYMENT STATUS" open={openSections.payment} onToggle={() => handleToggle("payment")}>
            <div className="space-y-2">
              {PAYMENT_STATUS_OPTIONS.map((o) => (
                <CustomRadioOption
                  key={o.value}
                  checked={paymentStatusFilters.includes(o.value)}
                  label={o.label}
                  onChange={() => toggleListFilter(o.value, setPaymentStatusFilters)}
                />
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="AMOUNT" open={openSections.amount} onToggle={() => handleToggle("amount")}>
            <PriceRangeSlider
              bounds={bounds}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              setMin={setMin}
              setMax={setMax}
            />
          </CollapsibleSection>

          <CollapsibleSection title="SORT" open={openSections.sort} onToggle={() => handleToggle("sort")}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="total_high">Total high to low</option>
              <option value="total_low">Total low to high</option>
            </select>
          </CollapsibleSection>
        </div>
        <div className="border-t border-[#E5E7EB] px-4 py-3 flex gap-2">
          <button type="button" onClick={onReset} className="flex-1 rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#4B5563] hover:bg-[#F9FAFB]">
            Reset
          </button>
          <button type="button" onClick={onClose} className="flex-1 rounded-lg bg-[#283618] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1F2714]">
            Done
          </button>
        </div>
      </div>
    </>
  );
}

export default function OrdersPage() {
  const { changePage } = useContext(PageContext);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState([]);
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [datePreset, setDatePreset] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [paymentStatusFilters, setPaymentStatusFilters] = useState([]);
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [savingOrderAction, setSavingOrderAction] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const getAllOrders = async () => {
    const authToken = localStorage.getItem("token");
    const orders = await axios.get(`${API_URL}/api/v1/orders`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    return orders?.data?.data?.orders ?? [];
  };

  const refreshOrders = useCallback(async () => {
    setLoading(true);
    try {
      const orders = await getAllOrders();
      setOrderList(orders);
    } catch {
      setOrderList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const normalizedOrders = useMemo(() => (orderList || []).map(normalizeOrder), [orderList]);

  const filteredOrders = useMemo(() => {
    let list = [...normalizedOrders];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((o) => {
        const searchBlob = [
          o.orderId,
          o.orderNumber,
          displayOrderCode(o),
          o.customer,
          o.productText,
          o.driver,
          o.items.map((i) => i.name).join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return searchBlob.includes(q);
      });
    }

    if (statusFilters.length > 0) list = list.filter((o) => statusFilters.includes(o.status));
    if (orderTypeFilter !== "all") list = list.filter((o) => o.orderType === orderTypeFilter);
    if (paymentStatusFilters.length > 0) list = list.filter((o) => paymentStatusFilters.includes(o.paymentStatus));

    const min = amountMin === "" ? null : Number(amountMin);
    const max = amountMax === "" ? null : Number(amountMax);
    if (min != null && Number.isFinite(min)) list = list.filter((o) => o.total >= min);
    if (max != null && Number.isFinite(max)) list = list.filter((o) => o.total <= max);

    list = list.filter((o) => dateRangeMatch(o.date, datePreset, customStartDate, customEndDate));

    if (sortBy === "newest") list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    if (sortBy === "oldest") list.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    if (sortBy === "total_high") list.sort((a, b) => b.total - a.total);
    if (sortBy === "total_low") list.sort((a, b) => a.total - b.total);
    return list;
  }, [
    normalizedOrders,
    searchQuery,
    statusFilters,
    orderTypeFilter,
    paymentStatusFilters,
    amountMin,
    amountMax,
    datePreset,
    customStartDate,
    customEndDate,
    sortBy,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    statusFilters,
    orderTypeFilter,
    paymentStatusFilters,
    amountMin,
    amountMax,
    datePreset,
    customStartDate,
    customEndDate,
    sortBy,
    itemsPerPage,
  ]);

  useEffect(() => {
    setSelectedRows([]);
  }, [currentPage, itemsPerPage, filteredOrders.length]);

  const paidRevenue = useMemo(
    () =>
      filteredOrders.reduce(
        (sum, o) => sum + (o.paymentStatus === "paid" ? o.total : 0),
        0
      ),
    [filteredOrders]
  );
  const completedCount = useMemo(
    () => filteredOrders.filter((o) => o.status === "completed").length,
    [filteredOrders]
  );
  const cancelledCount = useMemo(
    () => filteredOrders.filter((o) => o.status === "cancelled").length,
    [filteredOrders]
  );
  const avgOrderValue = useMemo(
    () => (filteredOrders.length ? paidRevenue / filteredOrders.length : 0),
    [paidRevenue, filteredOrders.length]
  );
  const dateRangeDays = useMemo(() => {
    if (!filteredOrders.length) return 1;
    if (datePreset === "today" || datePreset === "yesterday") return 1;
    if (datePreset === "last7") return 7;
    if (datePreset === "custom" && customStartDate && customEndDate) {
      const start = moment(customStartDate).startOf("day");
      const end = moment(customEndDate).endOf("day");
      const d = Math.max(1, end.diff(start, "days") + 1);
      return d;
    }
    const dates = filteredOrders
      .map((o) => moment(o.date))
      .filter((d) => d.isValid())
      .sort((a, b) => a.valueOf() - b.valueOf());
    if (!dates.length) return 1;
    return Math.max(1, dates[dates.length - 1].diff(dates[0], "days") + 1);
  }, [filteredOrders, datePreset, customStartDate, customEndDate]);
  const perPeriodValue = useMemo(() => {
    if (dateRangeDays >= 14) {
      return (filteredOrders.length / (dateRangeDays / 7)).toFixed(1);
    }
    return (filteredOrders.length / dateRangeDays).toFixed(1);
  }, [filteredOrders.length, dateRangeDays]);
  const perPeriodLabel = dateRangeDays >= 14 ? "Orders / Week" : "Orders / Day";

  const lastPage = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const currentSlice = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const pageNumbers = Array.from({ length: lastPage }, (_, i) => i + 1);
  const appliedFilterCount =
    statusFilters.length +
    paymentStatusFilters.length +
    (orderTypeFilter !== "all" ? 1 : 0) +
    (datePreset !== "all" ? 1 : 0) +
    (amountMin !== "" || amountMax !== "" ? 1 : 0) +
    (sortBy !== "newest" ? 1 : 0);

  const completedPct = filteredOrders.length
    ? ((completedCount / filteredOrders.length) * 100).toFixed(1)
    : "0.0";
  const cancelledPct = filteredOrders.length
    ? ((cancelledCount / filteredOrders.length) * 100).toFixed(1)
    : "0.0";

  const statsCards = [
    {
      key: "total",
      label: "Total Orders",
      value: filteredOrders.length,
      icon: statIconPending,
      onClick: null,
    },
    {
      key: "revenue",
      label: "Revenue (Paid)",
      value: `$${formatMoney(paidRevenue)}`,
      icon: statIconPreparing,
      onClick: null,
    },
    {
      key: "per_period",
      label: perPeriodLabel,
      value: perPeriodValue,
      icon: statIconDelivering,
      onClick: null,
    },
    {
      key: "avg",
      label: "Average Order",
      value: `$${formatMoney(avgOrderValue)}`,
      icon: statIconReady,
      onClick: null,
    },
    {
      key: "completed",
      label: "Completed",
      value: completedCount,
      pct: Number(completedPct),
      icon: statIconReady,
      onClick: () => {
        setStatusFilters(["completed"]);
      },
    },
    {
      key: "cancelled",
      label: "Cancelled",
      value: cancelledCount,
      pct: Number(cancelledPct),
      icon: statIconPending,
      onClick: () => {
        setStatusFilters(["cancelled"]);
      },
    },
  ];

  function handleIsSelected(row) {
    setSelectedRows((prevState) => [...prevState, row]);
  }

  function handleIsRemoved(row) {
    setSelectedRows((prevState) => prevState.filter((item) => item !== row));
  }

  function paymentStatusUi(status) {
    const s = String(status || "").toLowerCase();
    if (s === "paid") {
      return {
        icon: faCircleCheck,
        cls: "text-emerald-700 bg-emerald-50",
        label: "Paid",
      };
    }
    if (s === "failed") {
      return {
        icon: faXmarkCircle,
        cls: "text-rose-700 bg-rose-50",
        label: "Failed",
      };
    }
    if (s === "refunded") {
      return {
        icon: faMoneyBillWave,
        cls: "text-indigo-700 bg-indigo-50",
        label: "Refunded",
      };
    }
    return {
      icon: faClock,
      cls: "text-amber-700 bg-amber-50",
      label: "Pending",
    };
  }

  const updateOrderPatch = async (id, body) => {
    const authToken = localStorage.getItem("token");
    await axios.patch(`${API_URL}/api/v1/orders/${id}`, JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder?.orderId) return;
    setSavingOrderAction(true);
    try {
      await updateOrderPatch(selectedOrder.orderId, { status: "cancelled" });
      await refreshOrders();
      setSelectedOrder((prev) => (prev ? { ...prev, status: "cancelled", statusLabel: "Cancelled" } : prev));
    } finally {
      setSavingOrderAction(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!selectedOrder?.orderId) return;
    if (selectedOrder.status === "completed") return;
    setSavingOrderAction(true);
    try {
      await updateOrderPatch(selectedOrder.orderId, { status: "completed" });
      await refreshOrders();
      setSelectedOrder((prev) => (prev ? { ...prev, status: "completed", statusLabel: "Completed" } : prev));
    } finally {
      setSavingOrderAction(false);
    }
  };

  const resetFilters = () => {
    setStatusFilters([]);
    setOrderTypeFilter("all");
    setDatePreset("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setPaymentStatusFilters([]);
    setAmountMin("");
    setAmountMax("");
    setSortBy("newest");
  };

  const renderStatusChip = (order) => {
    if (order.status === "placed" || order.status === "preparing") return <OrangeLabel>{order.statusLabel}</OrangeLabel>;
    if (order.status === "ready") return <YellowLabel>{order.statusLabel}</YellowLabel>;
    if (order.status === "out_for_delivery") return <BlueLabel>{order.statusLabel}</BlueLabel>;
    if (order.status === "completed") return <GreenLabel>{order.statusLabel}</GreenLabel>;
    if (order.status === "cancelled") return <RedLabel>{order.statusLabel}</RedLabel>;
    return <OrangeLabel>Placed</OrangeLabel>;
  };

  return (
    <div className="flex h-full min-h-0 w-[calc(100vw-330px)] max-w-full overflow-hidden">
      <OrdersFiltersDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        statusFilters={statusFilters}
        setStatusFilters={setStatusFilters}
        orderTypeFilter={orderTypeFilter}
        setOrderTypeFilter={setOrderTypeFilter}
        datePreset={datePreset}
        setDatePreset={setDatePreset}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
        paymentStatusFilters={paymentStatusFilters}
        setPaymentStatusFilters={setPaymentStatusFilters}
        amountMin={amountMin}
        setAmountMin={setAmountMin}
        amountMax={amountMax}
        setAmountMax={setAmountMax}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={resetFilters}
      />

      <div className={selectedOrder ? "flex-1 min-w-0 overflow-hidden flex flex-col pr-3" : "flex-1 min-w-0 overflow-hidden flex flex-col"}>
        {changePage("orders")}
        <div className="flex items-center shrink-0">
          <div>
            <p className="text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]">Orders</p>
            <p className="mt-1 text-[15px] text-[#6B7280] font-normal">Manage all orders across time</p>
          </div>
          <div className="flex ml-auto gap-2">
            <button
              type="button"
              onClick={() => exportOrdersCsv(filteredOrders)}
              className="flex items-center border border-[#283618] rounded-xl px-[14px] py-[10px] text-[#283618] font-semibold text-[14px] leading-[20px] tracking-[0.005em] bg-white hover:bg-[#F4F9EE]"
            >
              Export
            </button>
            <Link to="/order-notifications" className="flex items-center rounded-xl px-[14px] py-[10px] bg-[#283618] text-white font-semibold text-[14px] leading-[20px] tracking-[0.005em] hover:bg-[#1F2714]">
              View Operations →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 mt-4 mb-4 shrink-0">
          {statsCards.map((card) => (
            <button
              key={card.key}
              type="button"
              onClick={card.onClick || undefined}
              className={[
                "rounded-xl border px-3 py-3 text-left transition-all",
                "bg-gradient-to-b from-white to-[#F8FAFC] border-[#E5EAF0] shadow-sm",
                card.onClick ? "hover:shadow-md hover:border-[#D6DEE8] cursor-pointer" : "cursor-default",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[22px] leading-none font-semibold text-[#111827] truncate">{card.value}</p>
                    {typeof card.pct === "number" && (
                      <span
                        className={[
                          "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          card.key === "completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700",
                        ].join(" ")}
                      >
                        {card.pct.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[#6B7280] leading-snug">{card.label}</p>
                </div>
                <span className="h-12 w-12 shrink-0 rounded-full bg-[#EEF2F7] flex items-center justify-center overflow-hidden ring-1 ring-[#E5EAF0]">
                  <img src={card.icon} alt="" className="h-9 w-9 object-contain opacity-90" />
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-end gap-2 shrink-0">
          <div className="w-[320px]">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, items, driver, customer"
              className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#283618]"
            />
          </div>
          <FilterButton onClick={() => setFilterDrawerOpen(true)} active={appliedFilterCount > 0} appliedCount={appliedFilterCount} />
        </div>

        <div className="mt-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col min-h-[220px] max-h-[calc(100vh-260px)]">
          <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto min-h-[220px]">
            <table className="min-w-full w-max text-sm">
              <thead className="sticky top-0 z-10 bg-[#F9FAFB] border-b border-[#E5E7EB] shadow-[0_1px_0_0_#E5E7EB]">
                <tr>
                  <th className="w-10 px-4 py-1 text-left">
                    <button>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="20" height="20" rx="6" fill="#BC6C25" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.75 10C3.75 9.53978 4.1231 9.16669 4.58333 9.16669H15.4167C15.8769 9.16669 16.25 9.53978 16.25 10C16.25 10.4603 15.8769 10.8334 15.4167 10.8334H4.58333C4.1231 10.8334 3.75 10.4603 3.75 10Z" fill="white" />
                      </svg>
                    </button>
                  </th>
                  <th className="px-4 py-1 text-left"><TableHead heading={"Order ID"} /></th>
                  <th className="w-[150px] px-4 py-1 text-left"><TableHead heading={"Product"} /></th>
                  <th className="px-4 py-1 text-left"><TableHead heading={"Date"} /></th>
                  <th className="px-4 py-1 text-left"><TableHead heading={"Customer"} /></th>
                  <th className="px-4 py-1 text-left"><TableHead heading={"Type"} /></th>
                  <th className="px-4 py-1 text-left"><TableHead heading={"Total"} /></th>
                  <th className="px-4 py-1 text-left"><TableHead heading={"Payment"} /></th>
                  <th className="px-4 py-1 text-left"><TableHead heading={"Status"} /></th>
                  <th className="px-4 py-1 text-left pr-6"><TableHead heading={"Actions"} /></th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  currentSlice.map((order) => (
                    <tr key={order.orderId} className={`${selectedRows.includes(order.orderId) ? "bg-[#F9FAFB]" : "bg-white"} border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors`}>
                      <td className="px-4 py-3 align-middle">
                        {selectedRows.includes(order.orderId) ? (
                          <button type="button" onClick={() => handleIsRemoved(order.orderId)}>
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="20" height="20" rx="6" fill="#BC6C25" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M15.947 4.77386C16.302 5.06675 16.3523 5.59197 16.0594 5.94699L8.91034 14.6126C8.76045 14.7943 8.48987 14.8157 8.31326 14.6598L4.44862 11.2499C4.10351 10.9454 4.0706 10.4188 4.3751 10.0737C4.67961 9.72855 5.20622 9.69563 5.55132 10.0001L8.44704 12.5552L14.7738 4.88635C15.0667 4.53134 15.5919 4.48097 15.947 4.77386Z" fill="white" />
                            </svg>
                          </button>
                        ) : (
                          <button type="button" onClick={() => handleIsSelected(order.orderId)}>
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="1" y="1" width="18" height="18" rx="5" fill="white" stroke="#CBD5E1" strokeWidth="2" />
                            </svg>
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <button type="button" onClick={() => setSelectedOrder(order)} className="text-left">
                          <p className="text-[14px] text-[#BC6C25] font-semibold">{displayOrderCode(order)}</p>
                        </button>
                      </td>
                      <td className="w-[150px] px-4 py-3 align-middle max-w-[150px]">
                        <p className="truncate text-[13px] text-[#374151]" title={order.productText || "—"}>{order.productText || "—"}</p>
                        <p className="mt-0.5 text-[12px] text-[#6B7280]">{order.itemCount} items</p>
                      </td>
                      <td className="px-4 py-3 align-middle text-[13px] text-[#4B5563]">
                        <span className="inline-flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faCalendarDay} className="text-[#9CA3AF] h-3 w-3" />
                          {formatDate(order.date)}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle text-[13px] text-[#111827] font-semibold">{order.customer}</td>
                      <td className="px-4 py-3 align-middle">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[#F3F4F6] text-[#374151]">
                          <FontAwesomeIcon icon={order.orderType === "Pickup" ? faStore : faTruck} />
                          {order.orderType}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle text-[13px] font-semibold text-[#111827]">${formatMoney(order.total)}</td>
                      <td className="px-4 py-3 align-middle text-[13px] text-[#4B5563]">
                        <p>{order.paymentMethod}</p>
                        <span
                          className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${paymentStatusUi(order.paymentStatus).cls}`}
                        >
                          <FontAwesomeIcon icon={paymentStatusUi(order.paymentStatus).icon} />
                          {paymentStatusUi(order.paymentStatus).label}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle">{renderStatusChip(order)}</td>
                      <td className="px-4 py-3 align-middle text-right pr-6">
                        <button type="button" onClick={() => setSelectedOrder(order)} className="inline-flex items-center gap-1 text-[#6B7280] hover:text-[#111827]">
                          <FontAwesomeIcon icon={faBox} className="h-3 w-3" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!loading && filteredOrders.length === 0 && (
              <TableEmptyState title="No orders found" description="Try adjusting your search or filters." />
            )}
            {loading && <p className="px-6 py-6 text-[#6B7280] font-medium">Loading orders...</p>}
          </div>

          {filteredOrders.length > 0 && (
            <div className="shrink-0 bg-white w-full p-4 flex items-center border-t border-[#F0F1F3]">
              <p className="font-semibold text-[14px] text-customGrey">
                Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </p>
              <div className="ml-4 flex items-center gap-2">
                <label htmlFor="orders-items-per-page" className="text-[13px] text-[#6B7280] font-medium">Items per page</label>
                <select
                  id="orders-items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="h-9 rounded-lg border border-[#D1D5DB] bg-white px-2.5 text-[13px] text-[#374151]"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="ml-auto flex space-x-2">
                <StyledDashboardButton handleClick={() => setCurrentPage(Math.max(1, currentPage - 1))} isDisabled={currentPage === 1}>
                  {"<"}
                </StyledDashboardButton>
                {pageNumbers.map((pageNum) => (
                  <StyledDashboardButton key={pageNum} handleClick={() => setCurrentPage(pageNum)} isActive={currentPage === pageNum}>
                    {pageNum}
                  </StyledDashboardButton>
                ))}
                <StyledDashboardButton handleClick={() => setCurrentPage(Math.min(lastPage, currentPage + 1))} isDisabled={currentPage === lastPage}>
                  {">"}
                </StyledDashboardButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className="w-[420px] shrink-0 h-full bg-white border-l border-[#E5E7EB] shadow-xl flex flex-col overflow-hidden">
          <OrderDetailPanel order={selectedOrder} onClose={() => setSelectedOrder(null)} variant="sidebar" />
          {selectedOrder.status !== "cancelled" && (
            <div className="border-t border-[#E5E7EB] p-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={savingOrderAction}
                onClick={handleCancelOrder}
                className="rounded-lg border border-[#DC2626] text-[#DC2626] px-3 py-2 text-sm font-semibold hover:bg-[#FEF2F2] disabled:opacity-40"
              >
                Cancel Order
              </button>
              {selectedOrder.status !== "completed" ? (
                <button
                  type="button"
                  disabled={savingOrderAction}
                  onClick={handleCompleteOrder}
                  className="rounded-lg bg-[#283618] text-white px-3 py-2 text-sm font-semibold hover:bg-[#1F2714] disabled:opacity-40"
                >
                  Mark Completed
                </button>
              ) : (
                <div />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
