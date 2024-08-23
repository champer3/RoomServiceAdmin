import { Navigate, Outlet } from "react-router-dom";
import Dashboard from "../components/Sidepanel/Dashboard";
import Products from "../components/Sidepanel/Products";
import Categories from "../components/Sidepanel/Categories";
import Coupons from "../components/Sidepanel/Coupons";
import Orders from "../components/Sidepanel/Orders";
import Customers from "../components/Sidepanel/Customers";
import TopBar from "../components/TopBar";
import Logo from "../assets/Logo.png";
import { PageContext } from "../context/PageContext";

import { Link } from "react-router-dom";
import { useContext } from "react";

export default function SidePanel() {
  const { page, changePage } = useContext(PageContext);
  const token = localStorage.getItem("token");
  return (
    <>
      {token.length === 0 && <Navigate to={"/"}></Navigate>}
      {token.length > 0 && (
        <div className="flex h-full min-w-fit min-h-screen bg-stone-200">
          <div className="bg-white w-[264px]">
            {/* <div className="flex space-x-2 px-[24px] py-[20px] items-center ">
              <img src={Logo} alt="RS Logo" className="w-[60px] h-[45px]"></img>
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="34" height="34" rx="10" fill="#283618" />
                    </svg>
            </div> */}
            <Link to={"/dashboard"} onClick={() => changePage("dashboard")}>
              <Dashboard active={page === "dashboard"} />
            </Link>
            <Link to={"/products"} onClick={() => changePage("products")}>
              <Products active={page === "products"} />
            </Link>
            <Link to={"/categories"} onClick={() => changePage("categories")}>
              <Categories active={page === "categories"} />
            </Link>
            <Link to={"/coupons"} onClick={() => changePage("coupons")}>
              <Coupons active={page === "coupons"} />
            </Link>
            <Link to={"/orders"} onClick={() => changePage("orders")}>
              <Orders active={page === "orders"} />
            </Link>
            <Link to={"/customers"} onClick={() => changePage("customers")}>
              <Customers active={page === "customers"} />
            </Link>
          </div>
          <div className="px-8 pb-8 w-full">
            <TopBar messages={11} notifications={11} />
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}
