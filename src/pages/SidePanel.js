import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import Dashboard from "../components/Sidepanel/Dashboard";
import Products from "../components/Sidepanel/Products";
import Categories from "../components/Sidepanel/Categories";
import PromotionsNav from "../components/Sidepanel/Promotions";
import Orders from "../components/Sidepanel/Orders";
import Customers from "../components/Sidepanel/Customers";
import TopBar from "../components/TopBar";
import Logo from "../assets/Logo.png";
import { PageContext } from "../context/PageContext";

import React, { useContext, useEffect, useRef, useState } from "react";
import PanelBar from "../components/Sidepanel/PanelBar";
import { getSocket } from "../socketService";

const icon = (
  <svg
    width="16"
    height="16"
    fill="currentColor"
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 499.287 499.287"
  >
    <g>
      <g>
        <g>
          <path
            d="M191.653,446.918c3.153,29.396,27.771,52.369,58,52.369c30.233,0,54.819-22.977,57.985-52.369
     c-23.8,1.818-44.724,2.217-57.985,2.217C236.396,449.135,215.453,448.738,191.653,446.918z"
          />
          <path
            d="M399.103,278.842c-16.066-49.614-24.518-101.591-24.518-153.946C374.585,55.916,318.649,0,249.651,0
     c-68.994,0-124.929,55.916-124.929,124.896c0,52.795-8.335,104.479-24.421,153.979c37.55,10.553,88.397,18.087,149.35,18.087
     C310.641,296.961,361.521,289.413,399.103,278.842z"
          />
          <path
            d="M432.503,358.457c-8.208-15.592-15.409-31.659-21.927-47.973c-45.939,13.241-103.527,20.088-160.925,20.088
     c-57.392,0-114.948-6.826-160.87-20.07c-6.53,16.246-13.736,32.281-21.976,47.938c-3.002,5.698-4.794,9.259-4.794,9.603
     c0,26.212,84.016,47.479,187.64,47.479c103.628,0,187.625-21.269,187.625-47.479C437.278,367.697,435.49,364.137,432.503,358.457
     z"
          />
        </g>
      </g>
    </g>
  </svg>
);

const settingsIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" fill="currentColor" />
  </svg>
);

export default function SidePanel() {
  const { page, changePage } = useContext(PageContext);
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [liveOrdersBadgeCount, setLiveOrdersBadgeCount] = useState(0);
  const isLiveOrdersRef = useRef(false);

  const userName = localStorage.getItem("userName") || "Admin";
  const displayRole = role === "owner" ? "Owner" : "Admin";

  const routeIs = (basePath) =>
    location.pathname === basePath || location.pathname.startsWith(`${basePath}/`);
  const isDashboard = routeIs("/dashboard") || page === "dashboard";
  const isProducts = routeIs("/products") || page === "products";
  const isCategories = routeIs("/categories") || page === "categories";
  const isPromotions = routeIs("/promotions") || routeIs("/coupons") || page === "promotions" || page === "coupons";
  const isOrders = routeIs("/orders") || page === "orders";
  const isLiveOrders = routeIs("/order-notifications") || page === "notifications";
  const isCustomers = routeIs("/customers") || page === "customers";
  const isSettings = routeIs("/settings") || page === "settings";

  useEffect(() => {
    isLiveOrdersRef.current = isLiveOrders;
    if (isLiveOrders) {
      setLiveOrdersBadgeCount(0);
    }
  }, [isLiveOrders]);

  useEffect(() => {
    let socket = null;
    let pollId = null;

    const onNewOrder = () => {
      if (isLiveOrdersRef.current) return;
      setLiveOrdersBadgeCount((prev) => prev + 1);
    };

    const onStatusUpdate = () => {
      if (isLiveOrdersRef.current) return;
      setLiveOrdersBadgeCount((prev) => prev + 1);
    };

    const attach = () => {
      socket = getSocket();
      if (!socket) return false;
      socket.off("order", onNewOrder);
      socket.off("orderStatusUpdate", onStatusUpdate);
      socket.on("order", onNewOrder);
      socket.on("orderStatusUpdate", onStatusUpdate);
      return true;
    };

    if (!attach()) {
      pollId = window.setInterval(() => {
        if (attach() && pollId) {
          clearInterval(pollId);
          pollId = null;
        }
      }, 2000);
    }

    return () => {
      if (pollId) clearInterval(pollId);
      if (socket) {
        socket.off("order", onNewOrder);
        socket.off("orderStatusUpdate", onStatusUpdate);
      }
    };
  }, []);

  return (
    <>
      {(role !== "admin" && role !== "owner") && <Navigate to={"/"} />}
      {token && token.length > 0 && (
        <div className="flex h-screen min-w-fit bg-panel-bg overflow-hidden">
          {/* Sidebar: rigid, fixed height */}
          <aside className="flex flex-col w-[264px] h-full shrink-0 bg-panel-bg border-r border-panel-border overflow-hidden">
            {/* Brand: logo + app name — same height as top bar (h-16) so bottom border aligns */}
            <div className="flex items-center gap-2 h-20 px-6 shrink-0 border-b border-panel-border">
              <img src={Logo} alt="Room Service" className="h-9 w-auto object-contain" />
              <div className="flex flex-col justify-center min-w-0">
                <span className="font-semibold text-lg text-base leading-tight tracking-tight">
                  RoomService
                </span>
                <span className="text-nav-inactive text-xs font-medium">Admin</span>
              </div>
            </div>
            {/* Nav — scrollable if needed */}
            <nav className="flex flex-col gap-0.5 pt-2 pr-5 flex-1 min-h-0 overflow-y-auto">
              <Link to="/dashboard" onClick={() => changePage("dashboard")}>
                <Dashboard active={isDashboard} />
              </Link>
              <Link to="/products" onClick={() => changePage("products")}>
                <Products active={isProducts} />
              </Link>
              <Link to="/categories" onClick={() => changePage("categories")}>
                <Categories active={isCategories} />
              </Link>
              <Link to="/promotions" onClick={() => changePage("promotions")}>
                <PromotionsNav active={isPromotions} />
              </Link>
              <Link to="/orders" onClick={() => changePage("orders")}>
                <Orders active={isOrders} />
              </Link>
              <Link
                to="/order-notifications"
                onClick={() => {
                  setLiveOrdersBadgeCount(0);
                  changePage("notifications");
                }}
              >
                <PanelBar
                  active={isLiveOrders}
                  title="Live Orders"
                  icon={icon}
                  badgeCount={liveOrdersBadgeCount}
                />
              </Link>
              <Link to="/customers" onClick={() => changePage("customers")}>
                <Customers active={isCustomers} />
              </Link>
              <Link to="/settings" onClick={() => changePage("settings")}>
                <PanelBar active={isSettings} title="Settings" icon={settingsIcon} />
              </Link>
            </nav>
            {/* User profile — at bottom of sidebar */}
            <div className="px-4 py-4 border-t border-panel-border/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-nav-inactive/20 flex items-center justify-center shrink-0">
                  <span className="text-user-name font-semibold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-user-name font-medium text-sm truncate">{userName}</p>
                  <p className="text-nav-inactive text-xs">{displayRole}</p>
                </div>
              </div>
            </div>
            {/* Logout */}
            <Link
              to="/"
              onClick={() => {
                localStorage.setItem("token", "");
                localStorage.setItem("role", "");
                localStorage.removeItem("userName");
              }}
              className="flex items-center space-x-3 w-full h-12 px-6 py-3 text-sm font-medium text-nav-inactive hover:bg-red-50 hover:text-red-600 rounded-r-lg transition-colors mb-2"
            >
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </Link>
          </aside>
          {/* Main: top bar + content — same bg and border */}
          <main className="flex-1 flex flex-col min-h-0 min-w-0 bg-panel-bg border-l border-panel-border overflow-hidden">
            <TopBar messages={11} notifications={11} />
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col px-8 pt-4 pb-4 bg-panel-bg">
              <div className="flex-1 min-h-0 flex flex-col">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
