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
import React, { useContext } from "react";
import PanelBar from "../components/Sidepanel/PanelBar";

const icon = (
  <svg
    width="24"
    height="24"
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

export default function DriversSidePanel() {
  const { page, changePage } = useContext(PageContext);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <>
      {role !== "driver" && <Navigate to={"/"}></Navigate>}
      {token.length > 0 && (
        <div className="flex h-full min-w-fit min-h-screen bg-stone-200">
          <div className="bg-white w-[264px]">
            <div className="flex space-x-2 px-[24px] py-[20px] items-center ">
              {/* <img src={Logo} alt="RS Logo" className="w-[60px] h-[45px]"></img>
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="34" height="34" rx="10" fill="#283618" />
                    </svg> */}
            </div>
            <Link to={"/drivers/drivers-dashboard"} onClick={() => changePage("drivers-home")}>
              <Dashboard active={page === "drivers-home"} />
            </Link>
            <Link
              to={"/"}
              className="hover:bg-red-800 text-red-500 flex items-center space-x-2 justify-left hover:text-stone-100 w-[264px] h-[48] px-[24px] py-[12px] leading-[20px] font-semibold text-14px tracking-[0.005em]"
            >
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
          <div className="px-8 pb-8 w-full ">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}
