import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownWideShort,
  faArrowDownShortWide,
  faBolt,
  faBox,
  faCheckDouble,
  faCircleCheck,
  faClock,
  faHandHoldingHeart,
  faMinus,
  faPlus,
  faStore,
  faTriangleExclamation,
  faTruck,
  faUtensils,
  faExpand,
  faCompress,
} from "@fortawesome/free-solid-svg-icons";
import { getSocket } from "../socketService";
import { API_URL, PRINTER_IP } from "../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderInfoCard from "../components/order_components/OrderInfoCard";
import OrderDetailPanel from "../components/order_components/OrderDetailPanel";
import { isOrderPrepFullyComplete } from "../components/order_components/orderLineAggregate";
import { getKanbanUrgencyTierStyle } from "../components/order_components/orderTimeHelpers";
import Alert from "../components/Alert";
import statIconDelivering from "../assets/image 14.png";
import statIconReady from "../assets/image 15.png";
import statIconPreparing from "../assets/image 16.png";
import statIconPending from "../assets/image 17.png";

const AUTO_ACCEPT_LS_KEY = "kanban_autoAcceptPlaced";
const AUTO_ACCEPT_SINCE_LS_KEY = "kanban_autoAcceptSince";
const DELAYED_WAIT_MS = 15 * 60 * 1000;
/** Must match `1.4s` in `.kanban-card-urgency-snap` / `.kanban-timer-urgency-snap` (index.css) */
const KANBAN_URGENCY_ANIMATION_MS = 1400;

const emitOrderInDeliveryMessage = () => {
  const socket = getSocket();
  if (socket) {
    console.log("Tried to emit the message");
    socket.emit("orderInDelivery", "Your Order is being delivered");
  }
};

const getAllOrders = async () => {
  const authToken = localStorage.getItem("token");
  try {
    const orders = await axios.get(`${API_URL}/api/v1/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
    });

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const todaysOrders = orders.data.data.orders.filter((order) => {
      const orderDate = new Date(order.date);
      return (
        orderDate >= startOfDay &&
        orderDate < new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
      );
    });

    return todaysOrders.reverse();
  } catch (err) {
    console.log(err);
    return [];
  }
};

const OrderNotifications = () => {
  const [printer, setPrinter] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const printerIP = PRINTER_IP;

  const connectPrinter = () => {
    const ePosDev = new window.epson.ePOSDevice();

    ePosDev.connect(printerIP, 8008, (deviceObj, errorCode) => {
      if (deviceObj === null) {
        console.error("Connection failed:", errorCode);
        return;
      }

      const createdPrinter = ePosDev.createDevice(
        "local_printer",
        ePosDev.DEVICE_TYPE_PRINTER
      );

      if (createdPrinter === null) {
        console.error("Failed to create printer object");
        return;
      }

      setPrinter(createdPrinter);
      setIsConnected(true);
    });
  };

  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((prevState) => prevState + 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const printReceipt = useCallback(() => {
    if (!printer) {
      console.error("Printer is not connected");
      return;
    }

    printer.addTextAlign(printer.ALIGN_CENTER);
    printer.addText("Hello, this is a test receipt!\n");
    printer.addFeedLine(1);
    printer.addCut(printer.CUT_FEED);

    printer.send(
      () => {
        console.log("Receipt printed successfully!");
      },
      (errorCode) => {
        console.error("Print error:", errorCode);
      }
    );
  }, [printer]);

  const [orderList, setOrderList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [progressOpen, setProgressOpen] = useState(true);
  const [statsOpen, setStatsOpen] = useState(true);
  const [kanbanFullscreen, setKanbanFullscreen] = useState(false);
  const [draggedOrder, setDraggedOrder] = useState(null); // { id, fromTabId }
  const [dropTargetTab, setDropTargetTab] = useState(null);
  const [tabOrderMap, setTabOrderMap] = useState({});
  const [dropIndicator, setDropIndicator] = useState(null); // { tabId, index }
  const [flag, setFlag] = useState(false);
  const [collapsedCols, setCollapsedCols] = useState({});
  const [placedSort, setPlacedSort] = useState("newest");
  const [autoAcceptPlaced, setAutoAcceptPlaced] = useState(() => {
    try {
      return localStorage.getItem(AUTO_ACCEPT_LS_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [columnSortOldestFirst, setColumnSortOldestFirst] = useState({});
  const [readyTypeFilter, setReadyTypeFilter] = useState("all");
  const [highlightDelayedPreparing, setHighlightDelayedPreparing] =
    useState(false);

  /** One delay on :root so every .kanban-*-urgency-snap shares the same phase */
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!highlightDelayedPreparing) {
      root.style.removeProperty("--kanban-pulse-delay");
      return () => {};
    }
    root.style.setProperty(
      "--kanban-pulse-delay",
      `${-(Date.now() % KANBAN_URGENCY_ANIMATION_MS)}ms`
    );
    return () => root.style.removeProperty("--kanban-pulse-delay");
  }, [highlightDelayedPreparing, orderList.length]);

  const [bulkActionKey, setBulkActionKey] = useState(null);
  const [bulkConfirm, setBulkConfirm] = useState(null);
  const [boardSlideDirection, setBoardSlideDirection] = useState(null);
  const [driverPickerBump, setDriverPickerBump] = useState({
    id: null,
    seq: 0,
  });

  const boardScrollRef = useRef(null);
  const boardViewportRef = useRef(null);
  const kanbanFullscreenRef = useRef(kanbanFullscreen);
  const boardToggleDragRef = useRef({
    active: false,
    startY: 0,
    pointerId: null,
    moved: false,
  });
  const suppressBoardToggleClickRef = useRef(false);
  /** Delays single-click card select so double-click can advance status without opening the panel */
  const selectOrderClickTimerRef = useRef(null);
  const columnBodyRefs = useRef({});
  const autoExpandedDuringDragRef = useRef(new Set());
  const autoScrollFrameRef = useRef(null);
  const autoScrollStateRef = useRef({
    boardDx: 0,
    columnId: null,
    columnDy: 0,
  });

  const updateStatus = async (id, nextStatus) => {
    const authToken = localStorage.getItem("token");
    try {
      await axios.patch(
        `${API_URL}/api/v1/orders/${id}`,
        JSON.stringify({ status: nextStatus }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setFlag((prevState) => !prevState);
    } catch (err) {
      console.log(err);
    }
  };

  const patchOrderDriver = async (orderId, driverEmail) => {
    if (!orderId) return;
    const authToken = localStorage.getItem("token");
    const trimmed = driverEmail != null ? String(driverEmail).trim() : "";
    const body = trimmed
      ? { driver: trimmed, status: "assigned" }
      : { driver: null };

    try {
      await axios.patch(
        `${API_URL}/api/v1/orders/${orderId}`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setFlag((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const patchOrder = useCallback(async (id, body) => {
    const authToken = localStorage.getItem("token");
    await axios.patch(
      `${API_URL}/api/v1/orders/${id}`,
      JSON.stringify(body),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  }, []);

  const bulkRefresh = useCallback(() => {
    setFlag((f) => !f);
  }, []);

  useEffect(() => {
    return () => {
      if (selectOrderClickTimerRef.current != null) {
        clearTimeout(selectOrderClickTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(AUTO_ACCEPT_LS_KEY, autoAcceptPlaced ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [autoAcceptPlaced]);

  useEffect(() => {
    if (!autoAcceptPlaced) return;
    try {
      if (localStorage.getItem(AUTO_ACCEPT_SINCE_LS_KEY) == null) {
        localStorage.setItem(
          AUTO_ACCEPT_SINCE_LS_KEY,
          String(Date.now())
        );
      }
    } catch {
      /* ignore */
    }
  }, [autoAcceptPlaced]);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrders();
      setOrderList(orders);
    };
    fetchOrders();
  }, [flag]);

  useEffect(() => {
    let refetchTimer = null;
    let pollId = null;
    let socket = null;

    const debouncedRefetch = () => {
      if (refetchTimer) clearTimeout(refetchTimer);
      refetchTimer = setTimeout(async () => {
        const orders = await getAllOrders();
        setOrderList(orders);
      }, 300);
    };

    const attach = () => {
      socket = getSocket();
      if (!socket) return false;
      socket.off("order", debouncedRefetch);
      socket.off("orderStatusUpdate", debouncedRefetch);
      socket.on("order", debouncedRefetch);
      socket.on("orderStatusUpdate", debouncedRefetch);
      return true;
    };

    if (!attach()) {
      pollId = window.setInterval(() => {
        if (attach() && pollId) {
          clearInterval(pollId);
          pollId = null;
        }
      }, 1000);
    }

    return () => {
      if (refetchTimer) clearTimeout(refetchTimer);
      if (pollId) clearInterval(pollId);
      if (socket) {
        socket.off("order", debouncedRefetch);
        socket.off("orderStatusUpdate", debouncedRefetch);
      }
    };
  }, []);

  const stopAutoScroll = useCallback(() => {
    autoScrollStateRef.current = {
      boardDx: 0,
      columnId: null,
      columnDy: 0,
    };

    if (autoScrollFrameRef.current) {
      cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopAutoScroll();
  }, [stopAutoScroll]);

  useEffect(() => {
    kanbanFullscreenRef.current = kanbanFullscreen;
  }, [kanbanFullscreen]);

  const clearBoardViewportDragTransform = useCallback(() => {
    const el = boardViewportRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.transition = "";
  }, []);

  const snapBoardViewportDragBack = useCallback(() => {
    const el = boardViewportRef.current;
    if (!el) return;
    el.style.transition =
      "transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.transform = "translateY(0px)";
    window.setTimeout(() => clearBoardViewportDragTransform(), 320);
  }, [clearBoardViewportDragTransform]);

  const BOARD_TOGGLE_DRAG_THRESHOLD = 56;
  const BOARD_TOGGLE_MAX_PULL = 88;
  const BOARD_TOGGLE_MOVE_SLOP = 8;

  const onBoardTogglePointerDown = useCallback((e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    suppressBoardToggleClickRef.current = false;
    boardToggleDragRef.current = {
      active: true,
      startY: e.clientY,
      pointerId: e.pointerId,
      moved: false,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const el = boardViewportRef.current;
    if (el) el.style.transition = "none";
  }, []);

  const onBoardTogglePointerMove = useCallback((e) => {
    if (!boardToggleDragRef.current.active) return;
    const startY = boardToggleDragRef.current.startY;
    const dy = e.clientY - startY;
    if (Math.abs(dy) > BOARD_TOGGLE_MOVE_SLOP) {
      boardToggleDragRef.current.moved = true;
    }
    const el = boardViewportRef.current;
    if (!el) return;
    const fs = kanbanFullscreenRef.current;
    if (!fs) {
      const pull = Math.max(-BOARD_TOGGLE_MAX_PULL, Math.min(0, dy));
      el.style.transform = `translateY(${pull}px)`;
    } else {
      const pull = Math.min(BOARD_TOGGLE_MAX_PULL, Math.max(0, dy));
      el.style.transform = `translateY(${pull}px)`;
    }
  }, []);

  const finishBoardTogglePointer = useCallback(
    (e, targetEl) => {
      const { active, startY, moved } = boardToggleDragRef.current;
      if (!active) return;
      boardToggleDragRef.current = {
        active: false,
        startY: 0,
        pointerId: null,
        moved: false,
      };
      try {
        if (targetEl && e?.pointerId != null) {
          targetEl.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* ignore */
      }

      const dy = e ? e.clientY - startY : 0;
      const fs = kanbanFullscreenRef.current;

      const openFromDrag = !fs && dy <= -BOARD_TOGGLE_DRAG_THRESHOLD;
      const closeFromDrag = fs && dy >= BOARD_TOGGLE_DRAG_THRESHOLD;

      if (openFromDrag) {
        suppressBoardToggleClickRef.current = true;
        clearBoardViewportDragTransform();
        setBoardSlideDirection("up");
        setKanbanFullscreen(true);
        return;
      }
      if (closeFromDrag) {
        suppressBoardToggleClickRef.current = true;
        clearBoardViewportDragTransform();
        stopAutoScroll();
        setBoardSlideDirection("down");
        setKanbanFullscreen(false);
        return;
      }

      if (moved) {
        suppressBoardToggleClickRef.current = true;
        snapBoardViewportDragBack();
      } else {
        clearBoardViewportDragTransform();
      }
    },
    [
      clearBoardViewportDragTransform,
      snapBoardViewportDragBack,
      stopAutoScroll,
    ]
  );

  const onBoardTogglePointerUp = useCallback(
    (e) => {
      finishBoardTogglePointer(e, e.currentTarget);
    },
    [finishBoardTogglePointer]
  );

  const onBoardTogglePointerCancel = useCallback(
    (e) => {
      finishBoardTogglePointer(e, e.currentTarget);
    },
    [finishBoardTogglePointer]
  );

  const onBoardToggleLostPointerCapture = useCallback(
    (e) => {
      if (boardToggleDragRef.current.active) {
        finishBoardTogglePointer(e, null);
      }
    },
    [finishBoardTogglePointer]
  );

  useEffect(() => {
    if (!boardSlideDirection || !boardViewportRef.current) return;

    const keyframes =
      boardSlideDirection === "up"
        ? [
            { transform: "translateY(24px)", opacity: 0.96 },
            { transform: "translateY(0px)", opacity: 1 },
          ]
        : [
            { transform: "translateY(-24px)", opacity: 0.96 },
            { transform: "translateY(0px)", opacity: 1 },
          ];

    const animation = boardViewportRef.current.animate(keyframes, {
      duration: 260,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "both",
    });

    animation.onfinish = () => setBoardSlideDirection(null);
    return () => animation.cancel();
  }, [boardSlideDirection, kanbanFullscreen]);

  const handleFinishOrder = (id, newStatus) => {
    updateStatus(id, newStatus);
  };

  const toggleAutoAcceptPlaced = () => {
    setAutoAcceptPlaced((v) => {
      const next = !v;
      if (next) {
        try {
          localStorage.setItem(
            AUTO_ACCEPT_SINCE_LS_KEY,
            String(Date.now())
          );
        } catch {
          /* ignore */
        }
      }
      return next;
    });
  };

  const DRIVERS = [
    "testuser1@rs.com",
    "testuser11@rs.com",
    "testuser12@rs.com",
    "testuser13@rs.com",
    "testuser14@rs.com",
  ];

  const getOrderIdShort = (order) => {
    const num = order?.orderNumber && String(order.orderNumber).trim();
    if (num && num.length >= 4) return num.slice(-5);
    return String(order?._id || order?.id || "").slice(-5);
  };
  const getOrderKey = (order) =>
    String(order?._id || order?.id || Math.random());
  const getOrderId = (order) => String(order?._id || order?.id || "");
  const getOrderType = (order) =>
    String(order?.orderType || "delivery").toLowerCase() === "pickup"
      ? "Pickup"
      : "Delivery";
  const getStatus = (order) =>
    String(order?.status ?? order?.orderStatus ?? "");

  /** Next status on card double-click (same rules as OrderInfoCard primary action). */
  const getKanbanDoubleClickNextStatus = (order) => {
    const isPickup = getOrderType(order) === "Pickup";
    const st = getStatus(order).toLowerCase();
    const isOrdered = st === "placed" || st === "ordered";
    const isPreparing = st === "preparing";
    const isReady =
      st === "ready" ||
      st === "ready for delivery" ||
      st === "ready for pickup";
    const isOut =
      !isPickup &&
      (st === "assigned" ||
        st === "picked_up" ||
        st === "out for delivery");
    const isTerminal =
      st === "delivered" ||
      st === "completed" ||
      st === "cancelled" ||
      (isPickup && st === "picked_up");

    if (isTerminal) return null;
    if (isOrdered) return "preparing";
    if (isPreparing) return "ready";
    if (isReady) {
      if (isPickup) return "picked_up";
      return null;
    }
    if (isOut) return "delivered";
    return null;
  };

  /** Ready delivery with no driver — double-click should open driver picker */
  const isDeliveryReadyWithoutDriver = (order) => {
    if (getOrderType(order) !== "Delivery") return false;
    const st = getStatus(order).toLowerCase();
    if (
      st !== "ready" &&
      st !== "ready for delivery" &&
      st !== "ready for pickup"
    ) {
      return false;
    }
    const pop = order?.assignedDriverId;
    const hasPopulated =
      pop != null &&
      typeof pop === "object" &&
      !Array.isArray(pop) &&
      (pop._id != null || pop.email != null);
    if (hasPopulated) return false;
    const raw = order?.driver != null ? String(order.driver).trim() : "";
    return !raw;
  };

  const handlePreparingProgressCommit = useCallback(
    async (order, nextMap) => {
      const id = getOrderId(order);
      if (!id) return;
      const st = getStatus(order).toLowerCase();
      if (st !== "preparing") return;
      try {
        await patchOrder(id, { preparationProgress: nextMap });
        const mergedOrder = { ...order, preparationProgress: nextMap };
        if (isOrderPrepFullyComplete(mergedOrder, nextMap)) {
          await patchOrder(id, { status: "ready" });
          const toastId = toast.success(
            <div className="flex flex-col gap-2 pr-1">
              <p className="text-sm font-medium text-[#111827] leading-snug">
                All items completed – marked Ready
              </p>
              <button
                type="button"
                className="self-start text-sm font-semibold text-[#1d4ed8] underline hover:text-[#1e40af]"
                onClick={async () => {
                  try {
                    await patchOrder(id, { status: "preparing" });
                    bulkRefresh();
                  } catch (e) {
                    console.error(e);
                  }
                  toast.dismiss(toastId);
                }}
              >
                Undo
              </button>
            </div>,
            {
              autoClose: 8000,
              closeOnClick: false,
            }
          );
        }
        bulkRefresh();
      } catch (e) {
        console.error(e);
      }
    },
    [patchOrder, bulkRefresh]
  );

  const getCustomer = (order) => {
    const guest = order?.guestName && String(order.guestName).trim();
    if (guest) return guest;
    const u = order?.customerId;
    if (u && typeof u === "object") {
      const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
      if (name) return name;
      if (u.email) return String(u.email);
    }
    return String(order?.userName || "—");
  };

  const getItemCount = (order) => {
    if (Array.isArray(order?.items) && order.items.length) {
      return order.items.reduce(
        (sum, line) => sum + (Number(line?.quantity) || 0),
        0
      );
    }
    const details = Array.isArray(order?.orderDetails)
      ? order.orderDetails
      : [];
    return details.reduce(
      (sum, d) =>
        sum + (Array.isArray(d?.dressing) ? d.dressing.length : 0),
      0
    );
  };

  useEffect(() => {
    if (!autoAcceptPlaced) return;
    let sinceMs = 0;
    try {
      sinceMs = parseInt(
        localStorage.getItem(AUTO_ACCEPT_SINCE_LS_KEY) || "0",
        10
      );
    } catch {
      sinceMs = 0;
    }
    if (!sinceMs) return;

    const candidates = orderList.filter((o) => {
      if (getStatus(o) !== "placed" && getStatus(o) !== "Ordered") return false;
      const t = o?.placedAt
        ? new Date(o.placedAt).getTime()
        : o?.date
          ? new Date(o.date).getTime()
          : 0;
      return t >= sinceMs;
    });
    if (!candidates.length) return;

    (async () => {
      try {
        await Promise.all(
          candidates.map((o) =>
            patchOrder(getOrderId(o), { status: "preparing" })
          )
        );
        bulkRefresh();
      } catch (e) {
        console.log(e);
      }
    })();
  }, [orderList, autoAcceptPlaced, patchOrder, bulkRefresh]);

  const sortOrdersByDate = (orders, direction) => {
    const mult = direction === "oldest" ? 1 : -1;
    return [...orders].sort((a, b) => {
      const ta = a?.placedAt
        ? new Date(a.placedAt).getTime()
        : a?.date
          ? new Date(a.date).getTime()
          : 0;
      const tb = b?.placedAt
        ? new Date(b.placedAt).getTime()
        : b?.date
          ? new Date(b.date).getTime()
          : 0;
      if (ta !== tb) return (ta - tb) * mult;
      return String(getOrderId(a)).localeCompare(String(getOrderId(b)));
    });
  };

  const clearTabOrder = (tabId) => {
    setTabOrderMap((prev) => {
      if (!prev[tabId]) return prev;
      const next = { ...prev };
      delete next[tabId];
      return next;
    });
  };

  const toggleColumnSortOldest = (tabId) => {
    clearTabOrder(tabId);
    setColumnSortOldestFirst((p) => ({ ...p, [tabId]: !p[tabId] }));
  };

  const isCollapsed = (tabId) => !!collapsedCols[tabId];
  const expandColumn = (tabId) => {
    setCollapsedCols((p) => ({ ...p, [tabId]: false }));
  };

  const expandColumnForDrag = (tabId) => {
    if (!isCollapsed(tabId)) return;
    autoExpandedDuringDragRef.current.add(tabId);
    expandColumn(tabId);
  };

  const keepExpandedAfterDrop = (tabId) => {
    autoExpandedDuringDragRef.current.delete(tabId);
  };

  const restoreDragExpandedColumns = useCallback(() => {
    const toRestore = Array.from(autoExpandedDuringDragRef.current);
    autoExpandedDuringDragRef.current.clear();
    if (!toRestore.length) return;
    setCollapsedCols((prev) => {
      const next = { ...prev };
      toRestore.forEach((tid) => {
        next[tid] = true;
      });
      return next;
    });
  }, []);
  const toggleColumnCollapsed = (tabId) => {
    setCollapsedCols((p) => ({ ...p, [tabId]: !p[tabId] }));
  };

  const readyForPickupOrDelivery = () => "ready";

  const isOrderDelayed = (order) => {
    const t = order?.placedAt
      ? new Date(order.placedAt).getTime()
      : order?.date
        ? new Date(order.date).getTime()
        : 0;
    return t > 0 && Date.now() - t > DELAYED_WAIT_MS;
  };

  const orderElapsedSeconds = (order) => {
    const t = order?.placedAt
      ? new Date(order.placedAt).getTime()
      : order?.date
        ? new Date(order.date).getTime()
        : 0;
    if (!t || Number.isNaN(t)) return 0;
    return Math.max(0, Math.floor((Date.now() - t) / 1000));
  };

  /**
   * Same elapsed thresholds as OrderInfoCard timer (>8m amber, >15m red).
   * Solid-tint card backgrounds when preparing + “highlight” toggle is on.
   */
  const kanbanCardUrgencyClasses = (seconds) => {
    const s = Math.max(0, seconds | 0);
    if (s > 900) return "bg-[#f5d0d0] border-[#A52A2A]";
    if (s > 480) return "bg-[#BC6C25] border-[#BC6C25]";
    return "bg-[#eab308] border-[#ffc107] text-white";
  };

  /** CSS variables for .kanban-card-urgency-snap and timer (tier-matched text on color phase) */
  const kanbanCardUrgencyCssVars = (seconds) => {
    const t = getKanbanUrgencyTierStyle(seconds);
    return {
      "--k-urg-bg": t.bg,
      "--k-urg-bd": t.border,
      "--k-urg-fg": t.fg,
    };
  };

  const tabDef = [
    {
      id: "placed",
      label: "Placed",
      match: (o) => {
        const s = getStatus(o);
        return s === "placed" || s === "Ordered";
      },
      empty: "No placed orders right now.",
    },
    {
      id: "preparing",
      label: "Preparing",
      match: (o) => {
        const s = getStatus(o);
        return s === "preparing" || s === "Preparing";
      },
      empty: "No orders in preparation.",
    },
    {
      id: "ready",
      label: "Ready",
      match: (o) => {
        const s = getStatus(o);
        return (
          s === "ready" ||
          s === "Ready" ||
          s === "Ready for Delivery" ||
          s === "Ready for Pickup"
        );
      },
      empty: "No ready orders right now.",
    },
    {
      id: "out",
      label: "Out for Delivery",
      match: (o) => {
        const s = getStatus(o);
        const delivery = getOrderType(o) === "Delivery";
        if (!delivery) return false;
        return (
          s === "assigned" ||
          s === "picked_up" ||
          s === "Out for Delivery" ||
          s === "Assigned" ||
          s === "Picked_up"
        );
      },
      empty: "No deliveries out right now.",
    },
    {
      id: "completed",
      label: "Completed",
      match: (o) => {
        const s = getStatus(o);
        const pickup = getOrderType(o) === "Pickup";
        if (s === "delivered" || s === "Delivered" || s === "Completed")
          return true;
        if (pickup && s === "picked_up") return true;
        return false;
      },
      empty: "No completed orders yet.",
    },
    {
      id: "cancelled",
      label: "Cancelled",
      match: (o) => {
        const s = getStatus(o);
        return s === "cancelled" || s === "Cancelled";
      },
      empty: "No cancelled orders.",
    },
  ];

  const filteredBySearch = orderList.filter((o) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const id = String(o?._id || o?.id || "").toLowerCase();
    const shortId = id.slice(-8);
    const name = String(o?.guestName || o?.userName || "").toLowerCase();
    return id.includes(q) || shortId.includes(q) || name.includes(q);
  });

  const ordersByTab = (tabId) => {
    const def = tabDef.find((t) => t.id === tabId);
    if (!def) return [];

    let base = filteredBySearch.filter((o) => def.match(o));

    if (tabId === "ready" && readyTypeFilter !== "all") {
      base = base.filter((o) => {
        const pickup = getOrderType(o) === "Pickup";
        return readyTypeFilter === "pickup" ? pickup : !pickup;
      });
    }

    const manualOrder = tabOrderMap[tabId] || [];
    if (manualOrder.length) {
      const indexMap = new Map(manualOrder.map((id, idx) => [id, idx]));
      return [...base].sort((a, b) => {
        const aId = getOrderId(a);
        const bId = getOrderId(b);
        const aIdx = indexMap.has(aId)
          ? indexMap.get(aId)
          : Number.MAX_SAFE_INTEGER;
        const bIdx = indexMap.has(bId)
          ? indexMap.get(bId)
          : Number.MAX_SAFE_INTEGER;
        if (aIdx !== bIdx) return aIdx - bIdx;
        return 0;
      });
    }

    if (tabId === "placed") {
      return sortOrdersByDate(base, placedSort);
    }
    if (columnSortOldestFirst[tabId]) {
      return sortOrdersByDate(base, "oldest");
    }

    return base;
  };

  const reorderIdsAtIndex = (ids, movingId, index) => {
    const source = ids.filter((id) => id !== movingId);
    const clampedIndex = Math.max(
      0,
      Math.min(Number(index ?? source.length), source.length)
    );
    source.splice(clampedIndex, 0, movingId);
    return source;
  };

  const tabIdToStatus = {
    placed: "placed",
    preparing: "preparing",
    ready: "ready",
    out: "assigned",
    completed: "delivered",
    cancelled: "cancelled",
  };

  const resolveDropStatusForTab = (tabId, order) => {
    if (tabId === "out" && getOrderType(order) === "Pickup") return null;
    if (tabId === "ready") return "ready";
    if (tabId === "completed") {
      return getOrderType(order) === "Pickup" ? "picked_up" : "delivered";
    }
    return tabIdToStatus[tabId];
  };

  const tickAutoScroll = useCallback(() => {
    const { boardDx, columnId, columnDy } = autoScrollStateRef.current;

    if (boardScrollRef.current && boardDx !== 0) {
      boardScrollRef.current.scrollLeft += boardDx;
    }

    if (columnId && columnDy !== 0) {
      const el = columnBodyRefs.current[columnId];
      if (el) el.scrollTop += columnDy;
    }

    if (boardDx !== 0 || columnDy !== 0) {
      autoScrollFrameRef.current = requestAnimationFrame(tickAutoScroll);
    } else {
      autoScrollFrameRef.current = null;
    }
  }, []);

  const ensureAutoScrollRunning = useCallback(() => {
    if (!autoScrollFrameRef.current) {
      autoScrollFrameRef.current = requestAnimationFrame(tickAutoScroll);
    }
  }, [tickAutoScroll]);

  const updateBoardAutoScroll = (clientX) => {
    const el = boardScrollRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const edgeThreshold = 80;
    const maxSpeed = 18;

    let dx = 0;

    if (clientX < rect.left + edgeThreshold) {
      const strength = 1 - (clientX - rect.left) / edgeThreshold;
      dx = -Math.max(4, Math.round(strength * maxSpeed));
    } else if (clientX > rect.right - edgeThreshold) {
      const strength = 1 - (rect.right - clientX) / edgeThreshold;
      dx = Math.max(4, Math.round(strength * maxSpeed));
    }

    autoScrollStateRef.current.boardDx = dx;

    if (dx !== 0 || autoScrollStateRef.current.columnDy !== 0) {
      ensureAutoScrollRunning();
    } else if (
      autoScrollStateRef.current.boardDx === 0 &&
      autoScrollStateRef.current.columnDy === 0
    ) {
      stopAutoScroll();
    }
  };

  const updateColumnAutoScroll = (tabId, clientY) => {
    const el = columnBodyRefs.current[tabId];
    if (!el) {
      autoScrollStateRef.current.columnId = null;
      autoScrollStateRef.current.columnDy = 0;
      return;
    }

    const rect = el.getBoundingClientRect();
    const edgeThreshold = 90;
const maxSpeed = 18;

    let dy = 0;

    if (clientY < rect.top + edgeThreshold) {
      const strength = 1 - (clientY - rect.top) / edgeThreshold;
      dy = -Math.max(3, Math.round(strength * maxSpeed));
    } else if (clientY > rect.bottom - edgeThreshold) {
      const strength = 1 - (rect.bottom - clientY) / edgeThreshold;
      dy = Math.max(3, Math.round(strength * maxSpeed));
    }

    autoScrollStateRef.current.columnId = dy !== 0 ? tabId : null;
    autoScrollStateRef.current.columnDy = dy;

    if (autoScrollStateRef.current.boardDx !== 0 || dy !== 0) {
      ensureAutoScrollRunning();
    } else {
      stopAutoScroll();
    }
  };

  const onColumnDragOver = (e, tabId) => {
    e.preventDefault();
    e.stopPropagation();

    expandColumnForDrag(tabId);

    updateBoardAutoScroll(e.clientX);
    updateColumnAutoScroll(tabId, e.clientY);

    const movingOrder = draggedOrder?.id
      ? orderList.find((o) => getOrderId(o) === String(draggedOrder.id))
      : null;
    const invalidDropTarget = Boolean(
      movingOrder &&
        tabId === "out" &&
        getOrderType(movingOrder) === "Pickup"
    );

    const colOrders = ordersByTab(tabId);
    setDropTargetTab(tabId);
    if (invalidDropTarget) {
      setDropIndicator(null);
    } else {
      setDropIndicator({ tabId, index: colOrders.length });
    }
  };

  const onCardDragStart = (e, order, fromTabId) => {
    const orderId = order?._id || order?.id;
    if (!orderId) return;

    autoExpandedDuringDragRef.current = new Set();
    setDraggedOrder({ id: String(orderId), fromTabId });

    try {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify({ id: String(orderId), fromTabId })
      );
    } catch (_) {}
  };

  const onColumnDrop = async (e, toTabId) => {
    e.preventDefault();
    e.stopPropagation();
    stopAutoScroll();

    let payload = draggedOrder;

    try {
      const raw = e.dataTransfer.getData("application/json");
      if (raw) payload = JSON.parse(raw);
    } catch (_) {}

    if (!payload?.id) {
      setDropTargetTab(null);
      setDropIndicator(null);
      return;
    }

    if (payload.fromTabId === toTabId) {
      keepExpandedAfterDrop(toTabId);
      const currentIds = ordersByTab(toTabId).map((o) => getOrderId(o));
      const insertIndex =
        dropIndicator?.tabId === toTabId
          ? dropIndicator.index
          : currentIds.length;

      const nextIds = reorderIdsAtIndex(
        currentIds,
        String(payload.id),
        insertIndex
      );

      setTabOrderMap((prev) => ({ ...prev, [toTabId]: nextIds }));
      setDraggedOrder(null);
      setDropTargetTab(null);
      setDropIndicator(null);
      return;
    }

    const movingOrder = orderList.find(
      (o) => getOrderId(o) === String(payload.id)
    );
    const nextStatus = resolveDropStatusForTab(toTabId, movingOrder);
    if (!nextStatus) {
      setDraggedOrder(null);
      setDropTargetTab(null);
      setDropIndicator(null);
      return;
    }

    keepExpandedAfterDrop(toTabId);
    await updateStatus(payload.id, nextStatus);

    setTabOrderMap((prev) => {
      const fromIds = (prev[payload.fromTabId] || []).filter(
        (id) => id !== String(payload.id)
      );
      const existingTo = (prev[toTabId] || []).filter(
        (id) => id !== String(payload.id)
      );
      const insertIndex =
        dropIndicator?.tabId === toTabId
          ? dropIndicator.index
          : existingTo.length;
      const toIds = reorderIdsAtIndex(
        existingTo,
        String(payload.id),
        insertIndex
      );

      return {
        ...prev,
        [payload.fromTabId]: fromIds,
        [toTabId]: toIds,
      };
    });

    setDraggedOrder(null);
    setDropTargetTab(null);
    setDropIndicator(null);
  };

  const onCardDragOver = (e, tabId, targetId) => {
    e.preventDefault();
    e.stopPropagation();

    updateBoardAutoScroll(e.clientX);
    updateColumnAutoScroll(tabId, e.clientY);

    if (!draggedOrder) return;
    const movingOrder = orderList.find(
      (o) => getOrderId(o) === String(draggedOrder.id)
    );
    const invalidDropTarget = Boolean(
      movingOrder &&
        tabId === "out" &&
        getOrderType(movingOrder) === "Pickup"
    );
    if (invalidDropTarget) {
      setDropTargetTab(tabId);
      setDropIndicator(null);
      return;
    }

    const colOrders = ordersByTab(tabId);
    const targetIndex = colOrders.findIndex(
      (o) => getOrderId(o) === String(targetId)
    );
    if (targetIndex === -1) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const isAbove = offsetY < rect.height / 2;
    const insertIndex = isAbove ? targetIndex : targetIndex + 1;

    setDropTargetTab(tabId);
    setDropIndicator({ tabId, index: insertIndex });
  };

  const onCardDrop = async (e, toTabId) => {
    e.preventDefault();
    e.stopPropagation();
    stopAutoScroll();

    let payload = draggedOrder;

    try {
      const raw = e.dataTransfer.getData("application/json");
      if (raw) payload = JSON.parse(raw);
    } catch (_) {}

    if (!payload?.id) {
      setDropTargetTab(null);
      setDropIndicator(null);
      return;
    }

    const movingId = String(payload.id);
    const insertIndex =
      dropIndicator?.tabId === toTabId
        ? dropIndicator.index
        : ordersByTab(toTabId).length;

    if (payload.fromTabId === toTabId) {
      keepExpandedAfterDrop(toTabId);
      const currentIds = ordersByTab(toTabId).map((o) => getOrderId(o));
      const nextIds = reorderIdsAtIndex(currentIds, movingId, insertIndex);

      setTabOrderMap((prev) => ({ ...prev, [toTabId]: nextIds }));
      setDraggedOrder(null);
      setDropTargetTab(null);
      setDropIndicator(null);
      return;
    }

    const movingOrder = orderList.find((o) => getOrderId(o) === movingId);
    const nextStatus = resolveDropStatusForTab(toTabId, movingOrder);
    if (!nextStatus) {
      setDraggedOrder(null);
      setDropTargetTab(null);
      setDropIndicator(null);
      return;
    }

    keepExpandedAfterDrop(toTabId);
    await updateStatus(payload.id, nextStatus);

    setTabOrderMap((prev) => {
      const fromIds = (prev[payload.fromTabId] || []).filter(
        (id) => id !== movingId
      );

      const destinationIds = ordersByTab(toTabId)
        .map((o) => getOrderId(o))
        .filter((id) => id !== movingId);

      const mergedBase = [
        ...new Set([...(prev[toTabId] || []), ...destinationIds]),
      ].filter((id) => id !== movingId);

      const nextToIds = reorderIdsAtIndex(
        mergedBase,
        movingId,
        insertIndex
      );

      return {
        ...prev,
        [payload.fromTabId]: fromIds,
        [toTabId]: nextToIds,
      };
    });

    setDraggedOrder(null);
    setDropTargetTab(null);
    setDropIndicator(null);
  };
  const onColumnBodyDragOver = (e, tabId) => {
  e.preventDefault();
  e.stopPropagation();

  updateBoardAutoScroll(e.clientX);
  updateColumnAutoScroll(tabId, e.clientY);

  const colOrders = ordersByTab(tabId);
  const movingOrder = draggedOrder?.id
    ? orderList.find((o) => getOrderId(o) === String(draggedOrder.id))
    : null;
  const invalidDropTarget = Boolean(
    movingOrder &&
      tabId === "out" &&
      getOrderType(movingOrder) === "Pickup"
  );
  setDropTargetTab(tabId);

  // If dragging in empty space in the body, default to end of column
  if (invalidDropTarget) {
    setDropIndicator(null);
    return;
  }
  if (!dropIndicator || dropIndicator.tabId !== tabId) {
    setDropIndicator({ tabId, index: colOrders.length });
  }
};

  const openBulkConfirmAcceptPlaced = () => {
    const list = ordersByTab("placed");
    if (!list.length) return;
    setBulkConfirm({ type: "acceptPlaced", count: list.length });
  };

  const executeAcceptAllPlaced = async () => {
    const list = ordersByTab("placed");
    if (!list.length) return;
    setBulkActionKey("placed-accept");
    try {
      await Promise.all(
        list.map((o) =>
          patchOrder(getOrderId(o), { status: "preparing" })
        )
      );
      bulkRefresh();
    } catch (e) {
      console.log(e);
    }
    setBulkActionKey(null);
  };

  const openBulkConfirmPreparingReady = () => {
    const list = ordersByTab("preparing");
    if (!list.length) return;
    setBulkConfirm({ type: "preparingReady", count: list.length });
  };

  const executeMarkAllPreparingReady = async () => {
    const list = ordersByTab("preparing");
    if (!list.length) return;
    setBulkActionKey("preparing-ready");
    try {
      await Promise.all(
        list.map((o) =>
          patchOrder(getOrderId(o), {
            status: readyForPickupOrDelivery(o),
          })
        )
      );
      bulkRefresh();
    } catch (e) {
      console.log(e);
    }
    setBulkActionKey(null);
  };

  const openBulkConfirmReadyPickupComplete = () => {
    const list = ordersByTab("ready").filter(
      (o) => getOrderType(o) === "Pickup"
    );
    if (!list.length) return;
    setBulkConfirm({ type: "readyPickup", count: list.length });
  };

  const executeMarkAllReadyPickupComplete = async () => {
    const list = ordersByTab("ready").filter(
      (o) => getOrderType(o) === "Pickup"
    );
    if (!list.length) return;
    setBulkActionKey("ready-pickup");
    try {
      await Promise.all(
        list.map((o) =>
          patchOrder(getOrderId(o), { status: "picked_up" })
        )
      );
      bulkRefresh();
    } catch (e) {
      console.log(e);
    }
    setBulkActionKey(null);
  };

  const openBulkAssignReady = () => {
    setSelectedDriver("");
    setAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setAssignModalOpen(false);
  };

  const setReadyFilterPickup = () => {
    clearTabOrder("ready");
    setReadyTypeFilter((f) => (f === "pickup" ? "all" : "pickup"));
  };

  const setReadyFilterDelivery = () => {
    clearTabOrder("ready");
    setReadyTypeFilter((f) => (f === "delivery" ? "all" : "delivery"));
  };

  const openBulkConfirmOutDelivered = () => {
    const list = ordersByTab("out");
    if (!list.length) return;
    setBulkConfirm({ type: "outDelivered", count: list.length });
  };

  const executeMarkAllOutDelivered = async () => {
    const list = ordersByTab("out");
    if (!list.length) return;
    setBulkActionKey("out-delivered");
    try {
      await Promise.all(
        list.map((o) =>
          patchOrder(getOrderId(o), { status: "delivered" })
        )
      );
      bulkRefresh();
    } catch (e) {
      console.log(e);
    }
    setBulkActionKey(null);
  };

  const executeConfirmedBulk = async () => {
    if (!bulkConfirm) return;
    const snap = bulkConfirm;
    setBulkConfirm(null);
    switch (snap.type) {
      case "acceptPlaced":
        await executeAcceptAllPlaced();
        break;
      case "preparingReady":
        await executeMarkAllPreparingReady();
        break;
      case "readyPickup":
        await executeMarkAllReadyPickupComplete();
        break;
      case "outDelivered":
        await executeMarkAllOutDelivered();
        break;
      case "readyBulkAssign": {
        const email = snap.driverEmail;
        if (!email) break;
        const targets = ordersByTab("ready").filter(
          (o) => getOrderType(o) === "Delivery"
        );
        if (!targets.length) break;
        setBulkActionKey("ready-bulk-assign");
        try {
          await Promise.all(
            targets.map((o) =>
              patchOrder(getOrderId(o), {
                driver: email,
                status: "assigned",
              })
            )
          );
          bulkRefresh();
        } catch (e) {
          console.log(e);
        }
        setBulkActionKey(null);
        closeAssignModal();
        break;
      }
      default:
        break;
    }
  };

  const bulkConfirmTitle =
    bulkConfirm?.type === "acceptPlaced"
      ? `Accept all ${bulkConfirm.count} currently placed orders?`
      : bulkConfirm?.type === "preparingReady"
        ? `Mark all ${bulkConfirm.count} preparing orders as ready?`
        : bulkConfirm?.type === "readyPickup"
          ? `Mark ${bulkConfirm.count} ready pickup order${
              bulkConfirm.count === 1 ? "" : "s"
            } as picked up?`
          : bulkConfirm?.type === "outDelivered"
            ? `Mark all ${bulkConfirm.count} out-for-delivery order${
                bulkConfirm.count === 1 ? "" : "s"
              } as delivered?`
            : bulkConfirm?.type === "readyBulkAssign"
              ? `Assign driver to all ${bulkConfirm.count} ready delivery orders?`
              : "";

  const iconBtnBase =
    "inline-flex items-center justify-center rounded-lg p-1.5 transition shrink-0 disabled:opacity-40 disabled:pointer-events-none";

  const SortOldestFirstButton = ({ tabId }) => (
    <button
      type="button"
      className={`${iconBtnBase} ${
        columnSortOldestFirst[tabId]
          ? "text-sky-700 bg-sky-50 hover:bg-sky-100"
          : "text-sky-600 hover:bg-sky-50"
      }`}
      title={
        columnSortOldestFirst[tabId]
          ? "Sorted by oldest first. Click for default order."
          : "Sort by oldest first (longest waiting)"
      }
      aria-label="Toggle sort by oldest first"
      onClick={() => toggleColumnSortOldest(tabId)}
    >
      <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5" />
    </button>
  );

  const counts = tabDef.reduce((acc, t) => {
    acc[t.id] = ordersByTab(t.id).length;
    return acc;
  }, {});

  const totalToday = filteredBySearch.length;
  const completedToday = counts.completed || 0;
  const completionPct =
    totalToday > 0
      ? Math.round((completedToday / totalToday) * 100)
      : 0;
  const preparingCount = counts.preparing || 0;
  const readyToServeCount = counts.ready || 0;
  const deliveringCount = counts.out || 0;
  const pendingCount =
    (counts.placed || 0) +
    preparingCount +
    readyToServeCount +
    deliveringCount;

  const STAT_ICONS = {
    delivering: statIconDelivering,
    ready: statIconReady,
    preparing: statIconPreparing,
    pending: statIconPending,
  };
  const DropLine = () => (
    <div className="pointer-events-none relative h-4 transition-all duration-150 ease-out">
      <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 border-t-2 border-blue-500" />
      <div className="absolute left-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-blue-500 bg-white" />
    </div>
  );

  return (
    <>
      <ToastContainer
        position="top-center"
        newestOnTop
        closeOnClick={false}
        pauseOnHover
        theme="light"
        limit={4}
      />
      <div className="relative flex h-full min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden">
        {!kanbanFullscreen && (
          <div className="shrink-0 flex items-start justify-between gap-4">
            <div>
              <p className="text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]">
                Live Orders
              </p>
              <p className="mt-1 text-[15px] text-[#6B7280] font-normal">
                Manage live pickup and delivery orders
              </p>
            </div>
{/* 
            <button
              type="button"
              onClick={() => {
                stopAutoScroll();
                setKanbanFullscreen(true);
              }}
              className="flex items-center rounded-xl px-[14px] py-[10px] bg-[#283618] hover:bg-[#1F2714] text-white font-semibold text-[14px] leading-[20px] tracking-[0.005em] transition shrink-0"
              aria-label="Open Kanban full screen"
              title="Full screen"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M7 4H4V7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 4L9.5 9.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 16H16V13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 16L10.5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="ml-2">Full screen</p>
            </button> */}
          </div>
        )}

        {!kanbanFullscreen && (
          <div className="mt-4 shrink-0 flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-5">
          <div className="flex-1 min-w-0 flex flex-col lg:max-w-[min(640px,50%)]">
          
            {progressOpen && (
              <div className="rounded-3xl bg-[#FBFAF5] border border-[#F0EFE7] px-6 py-5 flex-1 flex flex-col min-h-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[28px] font-semibold text-[#111827] leading-tight">
                    Today Order Complete
                  </p>
                  <p className="text-[40px] font-semibold text-[#111827] leading-none shrink-0">
                    {completedToday}
                    <span className="text-[24px] text-[#6B7280] font-medium">
                      /{totalToday}
                    </span>
                  </p>
                </div>

                <div className="mt-5 flex-1 flex flex-col justify-end min-h-0">
                  <div className="relative h-4 rounded-full bg-[#E9E8E0] overflow-hidden shrink-0">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#F4D243] to-[#ECD16D]"
                      style={{ width: `${completionPct}%` }}
                    />
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-[33%]">
                      <span className="h-7 w-[2px] bg-[#2F2F2F]/60" />
                      <span className="h-7 w-[2px] bg-[#2F2F2F]/60" />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-[#6B7280] shrink-0">
                    <span>0%</span>
                    <span>{completionPct}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col min-h-0">
           

            {statsOpen && (
              <div className="flex flex-1 flex-col gap-2 min-h-[140px] lg:min-h-0">
                <div className="flex flex-1 gap-2 min-h-0">
                  <div className="flex-1 min-w-0 rounded-xl bg-[#F8F9FA] border border-[#EEF0F2] px-3 py-3 flex flex-col justify-center min-h-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-9 w-9 shrink-0 rounded-full bg-[#E4E7EB] flex items-center justify-center overflow-hidden">
                        <img
                          src={STAT_ICONS.pending}
                          alt="Pending"
                          className="h-7 w-7 object-contain opacity-80"
                        />
                      </span>
                      <p className="text-[28px] leading-none font-semibold text-[#111827] truncate">
                        {pendingCount}
                      </p>
                    </div>
                    <p className="mt-1.5 text-xs text-[#6B7280] leading-snug">
                      Total Pending Orders
                    </p>
                  </div>

                  <div className="flex-1 min-w-0 rounded-xl bg-[#F8F9FA] border border-[#EEF0F2] px-3 py-3 flex flex-col justify-center min-h-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-9 w-9 shrink-0 rounded-full bg-[#E4E7EB] flex items-center justify-center overflow-hidden">
                        <img
                          src={STAT_ICONS.preparing}
                          alt="Preparing"
                          className="h-7 w-7 object-contain opacity-80"
                        />
                      </span>
                      <p className="text-[28px] leading-none font-semibold text-[#111827] truncate">
                        {preparingCount}
                      </p>
                    </div>
                    <p className="mt-1.5 text-xs text-[#6B7280] leading-snug">
                      Preparing Orders
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 gap-2 min-h-0">
                  <div className="flex-1 min-w-0 rounded-xl bg-[#F8F9FA] border border-[#EEF0F2] px-3 py-3 flex flex-col justify-center min-h-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-9 w-9 shrink-0 rounded-full bg-[#E4E7EB] flex items-center justify-center overflow-hidden">
                        <img
                          src={STAT_ICONS.ready}
                          alt="Ready"
                          className="h-7 w-7 object-contain opacity-80"
                        />
                      </span>
                      <p className="text-[28px] leading-none font-semibold text-[#111827] truncate">
                        {readyToServeCount}
                      </p>
                    </div>
                    <p className="mt-1.5 text-xs text-[#6B7280] leading-snug">
                      Ready to serve
                    </p>
                  </div>

                  <div className="flex-1 min-w-0 rounded-xl bg-[#F8F9FA] border border-[#EEF0F2] px-3 py-3 flex flex-col justify-center min-h-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-9 w-9 shrink-0 rounded-full bg-[#E4E7EB] flex items-center justify-center overflow-hidden">
                        <img
                          src={STAT_ICONS.delivering}
                          alt="Delivering"
                          className="h-7 w-7 object-contain opacity-80"
                        />
                      </span>
                      <p className="text-[28px] leading-none font-semibold text-[#111827] truncate">
                        {deliveringCount}
                      </p>
                    </div>
                    <p className="mt-1.5 text-xs text-[#6B7280] leading-snug">
                      Delivering Orders
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
{/* 
        <div className="mt-4 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 flex flex-wrap gap-3 items-center shrink-0">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order # or customer"
            className="flex-1 min-w-[220px] rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#283618]"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#283618]"
            disabled
            title="Order type filter coming soon"
          >
            <option value="all">All Types</option>
            <option value="delivery">Delivery</option>
            <option value="pickup">Pickup</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setTypeFilter("all");
            }}
            className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB]"
          >
            Reset
          </button>
        </div> */}

        <div
          className={
            kanbanFullscreen
            ? "absolute inset-0 z-[60] flex min-h-0 flex-col gap-3 overflow-hidden"
            : "mt-4 flex-1 min-h-0 min-w-0 w-[calc(100vw-20.6rem)] max-w-full flex flex-col lg:flex-row gap-3 overflow-hidden"
         }
          ref={boardViewportRef}
        >
          <div className="flex h-full min-h-0 min-w-0 max-w-full border rounded-t-2xl flex-1 flex-col gap-3 overflow-hidden">
          {/* {kanbanFullscreen && (
            <div className="absolute top-[0px] right-4 z-[85]">
              <button
                type="button"
                onClick={() => {
                  stopAutoScroll();
                  setKanbanFullscreen(false);
                }}
                className="flex items-center rounded-xl px-[14px] py-[10px] bg-[#283618] hover:bg-[#1F2714] text-white font-semibold text-[14px] leading-[20px] tracking-[0.005em] transition"
                aria-label="Minimize Kanban full screen"
                title="Minimize"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M13 4H16V7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 4L10.5 9.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 16H4V13"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 16L9.5 10.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="ml-2">Minimize</p>
              </button>
            </div>
          )} */}
           <button
              type="button"
              className="group flex w-full shrink-0 touch-none select-none flex-col gap-2 border border-[#E5E7EB] bg-gradient-to-b from-[#FAFAF9] to-white px-4 py-2.5 text-left shadow-sm transition-all hover:border-[#D1D5DB] hover:shadow-md active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#283618]/30 focus-visible:ring-offset-2 cursor-grab active:cursor-grabbing"
              aria-label={
                kanbanFullscreen
                  ? "Exit board focus and return to dashboard view. Drag down to exit."
                  : "Expand board to full screen Kanban view. Drag up to expand."
              }
              title={
                kanbanFullscreen
                  ? "Return to dashboard with stats and details (or drag down)"
                  : "Open full-screen Kanban board (or drag up)"
              }
              onPointerDown={onBoardTogglePointerDown}
              onPointerMove={onBoardTogglePointerMove}
              onPointerUp={onBoardTogglePointerUp}
              onPointerCancel={onBoardTogglePointerCancel}
              onLostPointerCapture={onBoardToggleLostPointerCapture}
              onClick={(e) => {
                if (suppressBoardToggleClickRef.current) {
                  suppressBoardToggleClickRef.current = false;
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                if (kanbanFullscreen) {
                  stopAutoScroll();
                  setBoardSlideDirection("down");
                  setKanbanFullscreen(false);
                } else {
                  setBoardSlideDirection("up");
                  setKanbanFullscreen(true);
                }
              }}
            >
              <div className="flex justify-center h-3 flex items-center" aria-hidden>
                <span className="h-1 w-11 rounded-full bg-[#D1D5DB] transition-colors group-hover:bg-[#9CA3AF]" />
              </div>
             
            </button>
            <div
  ref={boardScrollRef}
  className={
    kanbanFullscreen
      ? "w-full max-w-full h-full min-w-0 overflow-auto overscroll-contain pb-4 pl-2"
      : "flex-1 min-h-0 min-w-0 w-full max-w-full overflow-auto overscroll-contain pb-4 pl-2"
  }
>
            <div
              className={
                kanbanFullscreen
                  ? "flex gap-2 w-max min-h-full pr-2"
                  : "flex gap-3 w-max min-h-full pr-2"
              }
            >
              {tabDef.map((col) => {
                const colOrders = ordersByTab(col.id);
                const collapsed = isCollapsed(col.id);
                const busy = !!bulkActionKey;
                const movingOrder = draggedOrder?.id
                  ? orderList.find((o) => getOrderId(o) === String(draggedOrder.id))
                  : null;
                const invalidDropTarget = Boolean(
                  movingOrder &&
                    col.id === "out" &&
                    getOrderType(movingOrder) === "Pickup"
                );

                const widthClass = collapsed
                ? "w-[76px] min-w-[76px] max-w-[76px]"
                : kanbanFullscreen
                  ? "w-fit max-w-screen"
                  : "w-[320px] sm:w-[360px] lg:w-[380px]";

                const headerActions = (() => {
                  if (col.id === "placed") {
                    return (
                      <>
                        <button
                          type="button"
                          className={`${iconBtnBase} hover:bg-amber-50 text-amber-600`}
                          title="Accept all orders in this column"
                          aria-label="Accept all placed orders"
                          disabled={busy}
                          onClick={() => openBulkConfirmAcceptPlaced()}
                        >
                          <FontAwesomeIcon icon={faCheckDouble} className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className={`${iconBtnBase} ${
                            autoAcceptPlaced
                              ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                              : "text-slate-400 hover:bg-slate-100"
                          }`}
                          title="Auto-accept new incoming orders only (not orders already in Placed when enabled)"
                          aria-label={
                            autoAcceptPlaced
                              ? "Disable auto-accept new orders"
                              : "Enable auto-accept new orders"
                          }
                          onClick={() => toggleAutoAcceptPlaced()}
                        >
                          <FontAwesomeIcon icon={faBolt} className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className={`${iconBtnBase} text-slate-600 hover:bg-slate-100`}
                          title={
                            placedSort === "oldest"
                              ? "Sort: oldest first (click for newest first)"
                              : "Sort: newest first (click for oldest first)"
                          }
                          aria-label="Toggle sort oldest or newest"
                          onClick={() => {
                            clearTabOrder("placed");
                            setPlacedSort((s) =>
                              s === "oldest" ? "newest" : "oldest"
                            );
                          }}
                        >
                          <FontAwesomeIcon
                            icon={
                              placedSort === "oldest"
                                ? faArrowDownWideShort
                                : faArrowDownShortWide
                            }
                            className="h-3.5 w-3.5"
                          />
                        </button>
                      </>
                    );
                  }
                  if (col.id === "preparing") {
                    return (
                      <>
                        <button
                          type="button"
                          className={`${iconBtnBase} text-orange-600 hover:bg-orange-50`}
                          title="Mark all preparing orders ready"
                          aria-label="Mark all preparing orders ready"
                          disabled={busy}
                          onClick={() => openBulkConfirmPreparingReady()}
                        >
                          <FontAwesomeIcon icon={faUtensils} className="h-3.5 w-3.5" />
                        </button>
                        <SortOldestFirstButton tabId="preparing" />
                        <button
                          type="button"
                          className={`${iconBtnBase} ${
                            highlightDelayedPreparing
                              ? "text-rose-600 bg-rose-50 hover:bg-rose-100"
                              : "text-rose-400 hover:bg-rose-50"
                          }`}
                          title="Highlight orders waiting over 15 minutes"
                          aria-label="Toggle highlight delayed orders"
                          onClick={() =>
                            setHighlightDelayedPreparing((v) => !v)
                          }
                        >
                          <FontAwesomeIcon
                            icon={faTriangleExclamation}
                            className="h-3.5 w-3.5"
                          />
                        </button>
                      </>
                    );
                  }
                  if (col.id === "ready") {
                    return (
                      <>
                        <button
                          type="button"
                          className={`${iconBtnBase} text-indigo-600 hover:bg-indigo-50`}
                          title="Assign one driver to all ready delivery orders"
                          aria-label="Bulk assign driver to ready delivery orders"
                          disabled={busy}
                          onClick={() => openBulkAssignReady()}
                        >
                          <FontAwesomeIcon icon={faTruck} className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className={`${iconBtnBase} text-teal-600 hover:bg-teal-50`}
                          title="Mark all pickup orders in Ready as picked up"
                          aria-label="Mark all ready pickup orders complete"
                          disabled={busy}
                          onClick={() => openBulkConfirmReadyPickupComplete()}
                        >
                          <FontAwesomeIcon
                            icon={faHandHoldingHeart}
                            className="h-3.5 w-3.5"
                          />
                        </button>
                        <button
                          type="button"
                          className={`${iconBtnBase} ${
                            readyTypeFilter === "pickup"
                              ? "text-violet-700 bg-violet-50 hover:bg-violet-100"
                              : "text-violet-600 hover:bg-violet-50"
                          }`}
                          title={
                            readyTypeFilter === "pickup"
                              ? "Pickup only (click to show all)"
                              : "Show pickup orders only"
                          }
                          aria-label="Toggle pickup-only filter"
                          onClick={() => setReadyFilterPickup()}
                        >
                          <FontAwesomeIcon icon={faStore} className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className={`${iconBtnBase} ${
                            readyTypeFilter === "delivery"
                              ? "text-fuchsia-700 bg-fuchsia-50 hover:bg-fuchsia-100"
                              : "text-fuchsia-600 hover:bg-fuchsia-50"
                          }`}
                          title={
                            readyTypeFilter === "delivery"
                              ? "Delivery only (click to show all)"
                              : "Show delivery orders only"
                          }
                          aria-label="Toggle delivery-only filter"
                          onClick={() => setReadyFilterDelivery()}
                        >
                          <FontAwesomeIcon icon={faBox} className="h-3.5 w-3.5" />
                        </button>
                        <SortOldestFirstButton tabId="ready" />
                      </>
                    );
                  }
                  if (col.id === "out") {
                    return (
                      <>
                        <button
                          type="button"
                          className={`${iconBtnBase} text-lime-700 hover:bg-lime-50`}
                          title="Mark all out-for-delivery orders as delivered"
                          aria-label="Mark all as delivered"
                          disabled={busy}
                          onClick={() => openBulkConfirmOutDelivered()}
                        >
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="h-3.5 w-3.5"
                          />
                        </button>
                        <SortOldestFirstButton tabId="out" />
                      </>
                    );
                  }
                  if (col.id === "completed" || col.id === "cancelled") {
                    return <SortOldestFirstButton tabId={col.id} />;
                  }
                  return null;
                })();

                return (
                  <div
                    key={col.id}
                    onDragOver={(e) => onColumnDragOver(e, col.id)}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      expandColumnForDrag(col.id);
                      setDropTargetTab(col.id);
                    }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        if (autoScrollStateRef.current.columnId === col.id) {
                          autoScrollStateRef.current.columnId = null;
                          autoScrollStateRef.current.columnDy = 0;
                          if (autoScrollStateRef.current.boardDx === 0) {
                            stopAutoScroll();
                          }
                        }

                        setDropTargetTab((prev) =>
                          prev === col.id ? null : prev
                        );
                        setDropIndicator((prev) =>
                          prev?.tabId === col.id ? null : prev
                        );
                      }
                    }}
                    onDrop={(e) => onColumnDrop(e, col.id)}
                    className={[
                      widthClass,
                      "flex-none min-h-0 rounded-2xl border bg-white flex flex-col transition-colors",
                      invalidDropTarget && dropTargetTab === col.id
                        ? "border-rose-500 ring-2 ring-rose-200"
                        : dropTargetTab === col.id
                        ? "border-[#283618] ring-2 ring-[#283618]/20"
                        : "border-[#E5E7EB]",
                    ].join(" ")}
                  >
                    {collapsed ? (
                      <div className="flex flex-col items-center gap-2 py-3 px-1 border-b border-[#E5E7EB] sticky top-0 bg-white rounded-t-2xl z-10 min-h-[120px]">
                        <span
                          className="text-[11px] font-semibold text-[#111827] leading-tight text-center max-h-[100px] overflow-hidden [writing-mode:vertical-rl] rotate-180"
                          title={col.label}
                        >
                          {col.label}
                        </span>
                        <span className="inline-flex items-center justify-center h-6 min-w-[1.5rem] px-1 rounded-full bg-[#F3F4F6] text-[#6B7280] text-[10px] font-semibold">
                          {colOrders.length}
                        </span>
                        <button
                          type="button"
                          className={`${iconBtnBase} text-[#283618] hover:bg-[#F3F4F6]`}
                          title="Expand column"
                          aria-label={`Expand ${col.label} column`}
                          onClick={() => toggleColumnCollapsed(col.id)}
                        >
                          <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className={
                          kanbanFullscreen
                            ? "px-2 py-2 border-b border-[#E5E7EB] flex items-center gap-1 sticky top-0 bg-white rounded-t-2xl z-10 flex-wrap"
                            : "px-3 py-2 border-b border-[#E5E7EB] flex items-center gap-1 sticky top-0 bg-white rounded-t-2xl z-10 flex-wrap"
                        }
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <p className="font-semibold text-[#111827] text-sm flex items-center gap-2 truncate">
                            <span className="truncate">{col.label}</span>
                            <span className="inline-flex items-center justify-center h-7 w-7 shrink-0 rounded-full bg-[#F3F4F6] text-[#6B7280] text-xs font-semibold">
                              {colOrders.length}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0 flex-wrap justify-end">
                          {headerActions}
                          <button
                            type="button"
                            className={`${iconBtnBase} text-slate-500 hover:bg-slate-100`}
                            title="Collapse column to strip"
                            aria-label={`Collapse ${col.label} column`}
                            onClick={() => toggleColumnCollapsed(col.id)}
                          >
                            <FontAwesomeIcon icon={faMinus} className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {!collapsed && (
                    <div
                      ref={(el) => {
                        if (el) columnBodyRefs.current[col.id] = el;
                        else delete columnBodyRefs.current[col.id];
                      }}
                      onDragOver={(e) => onColumnBodyDragOver(e, col.id)}
                      onDragLeave={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          if (autoScrollStateRef.current.columnId === col.id) {
                            autoScrollStateRef.current.columnId = null;
                            autoScrollStateRef.current.columnDy = 0;
                            if (autoScrollStateRef.current.boardDx === 0)
                              stopAutoScroll();
                          }
                        }
                      }}
                      className={
                        kanbanFullscreen
                          ? "flex-1 min-h-0 overflow-y-auto p-2"
                          : "flex-1 min-h-0 overflow-y-auto p-3"
                      }
                    >
                      {colOrders.length === 0 ? (
                        <div>
                          <div
                            className={[
                              "rounded-xl  border border-dashed px-4 py-10 text-center  text-sm transition",
                              invalidDropTarget && dropTargetTab === col.id
                                ? "border-rose-500 bg-rose-50 text-rose-700"
                                : dropTargetTab === col.id
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-[#E5E7EB] bg-[#FAFAFA] text-[#6B7280]",
                              kanbanFullscreen ? "w-[250px]" : "w-full",
                            ].join(" ")}
                          >
                            {invalidDropTarget && dropTargetTab === col.id
                              ? "Pickup orders cannot be dropped in Out for Delivery"
                              : dropTargetTab === col.id
                              ? "Drop order here"
                              : col.empty}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={
                            kanbanFullscreen
                              ? "flex flex-col flex-wrap max-h-[calc(100vh-10rem)] gap-2"
                              : "grid grid-cols-1 gap-2"
                          }
                        >
                          {colOrders.map((order, index) => {
                            const rawStatus = getStatus(order);
                            const status =
                              col.id === "completed" &&
                              getOrderType(order) === "Pickup" &&
                              String(rawStatus).toLowerCase() === "picked_up"
                                ? "completed"
                                : rawStatus;
                            const idShort = getOrderIdShort(order);
                            const itemCount = getItemCount(order);
                            const total = Number(
                              order?.totalAmount ?? order?.totalPrice ?? 0
                            ).toFixed(2);
                            const orderId = getOrderId(order);
                            const isDraggedCard =
                              draggedOrder?.id === orderId;

                            const showInsertLine =
                              dropIndicator?.tabId === col.id &&
                              dropIndicator?.index === index &&
                              !isDraggedCard;

                            const preparingUrgencyBgOn =
                              col.id === "preparing" &&
                              highlightDelayedPreparing;
                            const preparingCardPulse =
                              preparingUrgencyBgOn &&
                              isOrderDelayed(order);

                            return (
                              <React.Fragment key={getOrderKey(order)}>
                                {showInsertLine && <DropLine />}

                                <button
                                  type="button"
                                  draggable
                                  onDragStart={(e) => {
                                    if (selectOrderClickTimerRef.current != null) {
                                      clearTimeout(selectOrderClickTimerRef.current);
                                      selectOrderClickTimerRef.current = null;
                                    }
                                    onCardDragStart(e, order, col.id);
                                  }}
                                  onDragOver={(e) =>
                                    onCardDragOver(e, col.id, orderId)
                                  }
                                  onDrop={(e) => onCardDrop(e, col.id)}
                                  onDragEnd={() => {
                                    stopAutoScroll();
                                    setDraggedOrder(null);
                                    setDropTargetTab(null);
                                    setDropIndicator(null);
                                    restoreDragExpandedColumns();
                                  }}
                                  onClick={() => {
                                    if (selectOrderClickTimerRef.current != null) {
                                      clearTimeout(selectOrderClickTimerRef.current);
                                    }
                                    selectOrderClickTimerRef.current = setTimeout(
                                      () => {
                                        setSelectedOrder(order);
                                        selectOrderClickTimerRef.current = null;
                                      },
                                      280
                                    );
                                  }}
                                  onDoubleClick={(e) => {
                                    e.preventDefault();
                                    if (selectOrderClickTimerRef.current != null) {
                                      clearTimeout(selectOrderClickTimerRef.current);
                                      selectOrderClickTimerRef.current = null;
                                    }
                                    const next =
                                      getKanbanDoubleClickNextStatus(order);
                                    if (next) {
                                      handleFinishOrder(orderId, next);
                                    } else if (
                                      isDeliveryReadyWithoutDriver(order)
                                    ) {
                                      setDriverPickerBump((b) => ({
                                        id: orderId,
                                        seq: b.seq + 1,
                                      }));
                                    }
                                  }}
                                  style={
                                    preparingCardPulse
                                      ? kanbanCardUrgencyCssVars(
                                          orderElapsedSeconds(order)
                                        )
                                      : undefined
                                  }
                                  className={[
                                    "relative text-left rounded-2xl border hover:border-[#283618] hover:shadow-sm cursor-grab active:cursor-grabbing",
                                    preparingCardPulse
                                      ? "transition-none"
                                      : "transition-[border-color,box-shadow] duration-150 ease-out",
                                    isDraggedCard
                                      ? "opacity-60 border-[#283618] bg-white"
                                      : preparingUrgencyBgOn
                                        ? preparingCardPulse
                                          ? "kanban-card-urgency-snap border-2"
                                          : `${kanbanCardUrgencyClasses(orderElapsedSeconds(order))} border-2`
                                        : "border-[#E5E7EB] bg-white",
                                  ].join(" ")}
                                >
                                  <OrderInfoCard
                                    orderId={orderId}
                                    status={status}
                                    orderType={getOrderType(order)}
                                    idShort={idShort}
                                    customer={getCustomer(order)}
                                    order={order}
                                    itemCount={itemCount}
                                    total={total}
                                    shippingAddress={order?.shippingAddress}
                                    compact={kanbanFullscreen}
                                    neutralTimerUrgency={preparingUrgencyBgOn}
                                    urgencyBlinkTextSync={preparingCardPulse}
                                    driverPickerOpenSignal={
                                      driverPickerBump.id === orderId
                                        ? driverPickerBump.seq
                                        : 0
                                    }
                                    driverEmails={DRIVERS}
                                    onSetOrderDriver={(o, email) => {
                                      const oid = o?._id || o?.id;
                                      void patchOrderDriver(oid, email);
                                    }}
                                    onUpdateStatus={handleFinishOrder}
                                    onPreparingProgressCommit={
                                      handlePreparingProgressCommit
                                    }
                                  />
                                </button>
                              </React.Fragment>
                            );
                          })}

                          {dropIndicator?.tabId === col.id &&
                            dropIndicator?.index === colOrders.length && (
                              <DropLine />
                            )}
                        </div>
                      )}
                    </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          </div>

          {selectedOrder && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-[85] bg-black/40 lg:hidden cursor-pointer border-0 p-0"
                aria-label="Dismiss order details"
                onClick={() => setSelectedOrder(null)}
              />
              <div className="fixed inset-x-0 bottom-0 top-[7%] z-[90] flex flex-col lg:hidden rounded-t-2xl border border-[#E5E7EB] border-b-0 bg-white shadow-2xl overflow-hidden max-h-[93vh]">
                <OrderDetailPanel
                  order={selectedOrder}
                  onClose={() => setSelectedOrder(null)}
                  variant="modal"
                  onPreparingProgressCommit={handlePreparingProgressCommit}
                />
              </div>
              <div
                className={
                  kanbanFullscreen
                    ? "absolute right-4 top-4 z-[80] w-[420px] flex-none min-h-0 hidden lg:flex flex-col rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden max-h-[calc(100%-2rem)]"
                    : "hidden h-full min-h-0 lg:flex lg:w-[340px] xl:w-[420px] flex-none flex-col rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden"
                }
              >
                <OrderDetailPanel
                  order={selectedOrder}
                  onClose={() => setSelectedOrder(null)}
                  variant="sidebar"
                  onPreparingProgressCommit={handlePreparingProgressCommit}
                />
              </div>
            </>
          )}
        </div>
          {/* {kanbanFullscreen && <div className="fixed inset-0 z-[40] bg-black/40" onClick={() => setKanbanFullscreen(false)} aria-hidden />} */}
        {bulkConfirm && (
          <Alert
            variant="warning"
            title={bulkConfirmTitle}
            onDismiss={() => setBulkConfirm(null)}
            overlayClassName="z-[100]"
          >
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setBulkConfirm(null)}
                className="px-3 py-1.5 rounded-lg border border-[#C2410C] text-[#C2410C] font-medium text-[14px] hover:bg-[#FFF7ED]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  void executeConfirmedBulk();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#283618] text-white font-medium text-[14px] hover:bg-[#1F2714]"
              >
                Confirm
              </button>
            </div>
          </Alert>
        )}
        {assignModalOpen && (
          <>
            <div
              className="fixed inset-0 z-[80] bg-black/40"
              onClick={closeAssignModal}
              aria-hidden
            />
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-[#E5E7EB] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
                  <p className="font-semibold text-[#111827]">
                    Assign driver (bulk)
                  </p>
                  <button
                    type="button"
                    onClick={closeAssignModal}
                    className="p-2 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6]"
                    aria-label="Close"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 5L5 15M5 5l10 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="px-4 py-4 space-y-3">
                  <p className="text-sm text-[#6B7280]">
                    Applies to{" "}
                    {
                      ordersByTab("ready").filter(
                        (o) => getOrderType(o) === "Delivery"
                      ).length
                    }{" "}
                    ready delivery order(s). Pickup orders are skipped.
                  </p>
                  <select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#283618]"
                  >
                    <option value="">Select driver</option>
                    {DRIVERS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    disabled={
                      !!bulkActionKey ||
                      ordersByTab("ready").filter(
                        (o) => getOrderType(o) === "Delivery"
                      ).length === 0
                    }
                    onClick={() => {
                      if (!selectedDriver) return;
                      const targets = ordersByTab("ready").filter(
                        (o) => getOrderType(o) === "Delivery"
                      );
                      if (!targets.length) {
                        closeAssignModal();
                        return;
                      }
                      setBulkConfirm({
                        type: "readyBulkAssign",
                        count: targets.length,
                        driverEmail: selectedDriver,
                      });
                    }}
                    className="w-full rounded-xl bg-[#283618] text-white text-sm font-semibold py-2 hover:bg-[#1F2714] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Assign to all
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OrderNotifications;