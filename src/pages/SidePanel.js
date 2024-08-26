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
            <div className="flex space-x-2 px-[24px] py-[20px] items-center ">
              {/* <img src={Logo} alt="RS Logo" className="w-[60px] h-[45px]"></img>
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="34" height="34" rx="10" fill="#283618" />
                    </svg> */}
            </div>
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
            <Link
              to={"/"}
              className="hover:text-stone-100 hover:bg-rs-green text-rs-green flex items-center space-x-2 justify-left hover:text-stone-100 hover:bg-rs-green w-[264px] h-[48] px-[24px] py-[12px] leading-[20px] font-semibold text-14px tracking-[0.005em]"
            >
              {/* <svg
                class="w-[24px] h-[24px]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 12C9.06087 12 10.0783 11.5786 10.8284 10.8284C11.5786 10.0783 12 9.06087 12 8C12 6.93913 11.5786 5.92172 10.8284 5.17157C10.0783 4.42143 9.06087 4 8 4C6.93913 4 5.92172 4.42143 5.17157 5.17157C4.42143 5.92172 4 6.93913 4 8C4 9.06087 4.42143 10.0783 5.17157 10.8284C5.92172 11.5786 6.93913 12 8 12ZM17 12C17.7956 12 18.5587 11.6839 19.1213 11.1213C19.6839 10.5587 20 9.79565 20 9C20 8.20435 19.6839 7.44129 19.1213 6.87868C18.5587 6.31607 17.7956 6 17 6C16.2044 6 15.4413 6.31607 14.8787 6.87868C14.3161 7.44129 14 8.20435 14 9C14 9.79565 14.3161 10.5587 14.8787 11.1213C15.4413 11.6839 16.2044 12 17 12ZM4.5 14C3.12 14 2 15.12 2 16.5C2 16.5 2 21 8 21C12.756 21 13.742 18.172 13.946 17C14 16.694 14 16.5 14 16.5C14 15.12 12.88 14 11.5 14H4.5ZM15.992 17.2C15.969 17.5626 15.9087 17.9218 15.812 18.272C15.686 18.718 15.478 19.252 15.128 19.802C15.7417 19.9395 16.3691 20.0059 16.998 20C21.998 20 21.998 16.5 21.998 16.5C21.998 15.12 20.878 14 19.498 14H15.24C15.72 14.716 15.998 15.574 15.998 16.5V17L15.992 17.2Z"
                  fill="currentColor"
                />
              </svg> */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                <rect
                  width="24"
                  height="24"
                  stroke="none"
                  fill="currentColor"
                  opacity="0"
                />

                <g transform="matrix(0.4 0 0 0.4 12 12)">
                  <path
                    transform=" translate(-26, -25)"
                    d="M 6 1 L 6 50 L 13 50 L 24 30.9 L 18.5 23.4 L 14.5 27.4 C 14 27.8 13.5 28 13 28 L 8 28 L 8 24 L 12.2 24 L 18.2 18.1 C 19.5 16.8 21.3 16 23.1 16 L 33.1 16 C 33.9 16 34.6 16.4 34.9 17.1 L 39.5 26.1 C 40 27.1 39.6 28.3 38.6 28.8 C 38.3 28.9 38 29 37.7 29 C 37 29 36.300000000000004 28.6 35.900000000000006 27.9 L 31.900000000000006 20 L 27.600000000000005 20 L 31.700000000000003 29 C 32 29.6 32.2 30.2 32.2 30.7 C 32.2 30.7 32.2 30.7 32.2 30.7 C 32.2 31.2 32.1 31.599999999999998 31.900000000000002 32.1 C 31.900000000000002 32.1 31.900000000000002 32.1 31.900000000000002 32.2 C 31.700000000000003 32.6 31.400000000000002 33 31.1 33.400000000000006 L 25.1 40.50000000000001 C 25.1 40.50000000000001 25.1 40.50000000000001 25.1 40.50000000000001 L 16.8 50 L 44 50 L 44 43 L 46 43 C 46 43 46 43 46 41 C 46 38.4 45.1 36.9 44 36.1 L 44 1 C 44 0.4 43.6 0 43 0 L 7 0 C 6.4 0 6 0.4 6 1 z M 41 37 C 42.2 37 43.3 37.7 43.7 38.7 C 43.7 38.800000000000004 43.800000000000004 38.900000000000006 43.800000000000004 39 C 43.800000000000004 39 43.800000000000004 39 43.800000000000004 39 C 43.900000000000006 39.2 43.900000000000006 39.4 43.900000000000006 39.5 C 43.900000000000006 39.6 43.900000000000006 39.8 43.900000000000006 39.9 L 43.900000000000006 40.9 L 39.900000000000006 40.9 L 30.500000000000007 40.9 C 29.700000000000006 40.9 29.10000000000001 40.4 28.700000000000006 39.5 L 28.500000000000007 39.1 L 32.300000000000004 34.7 L 33 37 L 41 37 z M 13 10 C 13 7.2 15.2 5 18 5 C 20.8 5 23 7.2 23 10 C 23 12.8 20.8 15 18 15 C 15.2 15 13 12.8 13 10 z"
                    stroke-linecap="round"
                    fill="currentColor"
                  />
                </g>
              </svg>
              <p>Logout</p>
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
