import moment from "moment";
import Path from "../components/Path";
import OrangeLabel from "../components/StatusLabels/OrangeLabel";
import GreenLabel from "../components/StatusLabels/GreenLabel";
import RedLabel from "../components/StatusLabels/RedLabel";
import BlueLabel from "../components/StatusLabels/BlueLabel";
import TableHead from "../components/dashboard_components/TableHead";
import { ORDER_DETAILS_LIST } from "../assets/data";
import { useContext, useEffect, useState, useRef } from "react";
import { PageContext } from "../context/PageContext";
import Logo from "../assets/Logo.png";

import YellowLabel from "../components/StatusLabels/YellowLabel";
import axios from "axios";
import { useParams } from "react-router-dom";

const drivers = [
  "testuser1@rs.com",
  "testuser11@rs.com",
  "testuser12@rs.com",
  "testuser13@rs.com",
  "testuser14@rs.com",
];

function formatDate(dateObject) {
  return moment(dateObject).format("D MMM YYYY");
}

const getOrder = async (id) => {
  const authToken = localStorage.getItem("token");
  try {
    const order = await axios.get(
      `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/orders/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    // console.log(order.data.data.order);
    return order.data.data.order;
  } catch (err) {
    console.log(err);
  }
};

function formatNumberWithCommas(number) {
  const formattedNumber = parseFloat(number.toFixed(2)).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  return formattedNumber;
}

export default function OrderDetailsPage() {
  const [message, setMessage] = useState();
  const optionsRef = useRef();
  const [order, setOrder] = useState();
  const { orderId } = useParams();

  const updateOrder = async (id, email) => {
    let driverID;
    let assigned;
    const authToken = localStorage.getItem("token");
    // https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/
    //find driver
    try {
      const driver = await axios.get(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/${email}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Do something with successful status update
      driverID = driver.data.data.user[0].id;
      assigned = driver.data.data.user[0].assignedOrder;
    } catch (err) {
      console.log(err);
      setMessage({
        status: "Error",
        text: `Error finding driver with this email ${email}`,
        color: "warning",
      });
      return;
    }
    // patch order
    try {
      const order = await axios.patch(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/orders/${id}`,
        JSON.stringify({
          driver: driverID,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Do something with successful status update
      setMessage({
        status: "Success",
        text: "Driver assigned successfully!",
        color: "success",
      });
    } catch (err) {
      console.log(err);
      setMessage({
        status: "Error",
        text: "Error assigning driver",
        color: "warning",
      });
      return;
    }
    // patch driver
    try {
      const user = await axios.patch(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/${email}`,
        JSON.stringify({
          assignedOrder: [...assigned, id],
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Do something with successful status update
      console.log("success");
    } catch (err) {
      console.log(err);
      return;
    }
  };

  useEffect(() => {
    getOrder(orderId).then((data) => setOrder(data));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setMessage();
    }, 4000);
  }, [message]);

  const { changePage } = useContext(PageContext);

  const handleAssignDriver = () => {
    updateOrder(order.id, optionsRef.current.value);
  };
  // console.log(order);

  return (
    order && (
      <>
        {message && (
          <div
            class={`bg-${message.color} toast text-white absolute show  right-0`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div class="toast-header">
              <img src={Logo} class="rounded me-2 w-4 h-4" alt="..." />
              <strong class="me-auto">{message.status}</strong>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
            <div class="toast-body">{message.text}</div>
          </div>
        )}
        {changePage("orders")}
        <div className="items-center">
          <p className="text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]">
            Order Details
          </p>
          <div className="flex items-center">
            <Path
              pages={[
                { name: "Dashboard", link: "dashboard" },
                { name: "Order List", link: "orders" },
                { name: "Order Details", link: "order-details" },
              ]}
            />
            {/* <button className="flex ml-auto border border-[#283618] rounded-xl mr-2 px-[14px] py-[10px] text-[#283618] font-semibold text-[14px] leading-[20px] tracking-[0.005em]">
              <svg
                className="mr-2"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_499_3317)">
                  <path
                    d="M6.5854 12.0813C7.36621 12.8627 8.63253 12.8631 9.41384 12.0822C9.41415 12.0819 9.41443 12.0817 9.41474 12.0813L11.5554 9.94069C11.8023 9.66759 11.7811 9.246 11.508 8.99906C11.2537 8.76916 10.8666 8.76956 10.6127 9L8.66209 10.9513L8.66674 0.666687C8.66671 0.298469 8.36824 0 8.00006 0C7.63187 0 7.3334 0.298469 7.3334 0.666656L7.3274 10.9387L5.3874 9C5.1269 8.73969 4.70471 8.73984 4.4444 9.00034C4.18409 9.26084 4.18424 9.68303 4.44474 9.94334L6.5854 12.0813Z"
                    fill="#283618"
                  />
                  <path
                    d="M15.3333 10.6666C14.9652 10.6666 14.6667 10.9651 14.6667 11.3333V14C14.6667 14.3682 14.3682 14.6666 14 14.6666H2C1.63181 14.6666 1.33334 14.3682 1.33334 14V11.3333C1.33334 10.9651 1.03487 10.6667 0.666687 10.6667C0.298469 10.6666 0 10.9651 0 11.3333V14C0 15.1045 0.895437 16 2 16H14C15.1046 16 16 15.1045 16 14V11.3333C16 10.9651 15.7015 10.6666 15.3333 10.6666Z"
                    fill="#283618"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_499_3317">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Export
            </button> */}
            {/* <button className="flex items-center rounded-xl px-[14px] py-[10px] bg-[#283618] text-white font-semibold text-[14px] leading-[20px] tracking-[0.005em]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_785_4288)">
                  <path
                    d="M7.33333 2C6.4496 2.00106 5.60237 2.35259 4.97748 2.97748C4.35259 3.60237 4.00106 4.4496 4 5.33333V17.3333C4.00009 17.4546 4.03326 17.5735 4.09592 17.6773C4.15858 17.7811 4.24837 17.8659 4.35563 17.9225C4.46288 17.9791 4.58353 18.0053 4.70459 17.9984C4.82565 17.9915 4.94254 17.9517 5.04267 17.8833L6.44667 16.924L7.85067 17.8833C7.96159 17.9593 8.09289 17.9999 8.22733 17.9999C8.36177 17.9999 8.49307 17.9593 8.604 17.8833L10.004 16.924L11.404 17.8833C11.515 17.9594 11.6464 18.0002 11.781 18.0002C11.9156 18.0002 12.047 17.9594 12.158 17.8833L13.558 16.9247L14.958 17.8827C15.0581 17.9508 15.1748 17.9905 15.2957 17.9973C15.4166 18.0041 15.5371 17.9779 15.6442 17.9214C15.7514 17.865 15.8411 17.7804 15.9038 17.6768C15.9664 17.5732 15.9997 17.4544 16 17.3333V5.33333C15.9989 4.4496 15.6474 3.60237 15.0225 2.97748C14.3976 2.35259 13.5504 2.00106 12.6667 2L7.33333 2ZM11.3333 11.3333H7.33333C7.15652 11.3333 6.98695 11.2631 6.86193 11.1381C6.7369 11.013 6.66667 10.8435 6.66667 10.6667C6.66667 10.4899 6.7369 10.3203 6.86193 10.1953C6.98695 10.0702 7.15652 10 7.33333 10H11.3333C11.5101 10 11.6797 10.0702 11.8047 10.1953C11.9298 10.3203 12 10.4899 12 10.6667C12 10.8435 11.9298 11.013 11.8047 11.1381C11.6797 11.2631 11.5101 11.3333 11.3333 11.3333ZM13.3333 8C13.3333 8.17681 13.2631 8.34638 13.1381 8.4714C13.013 8.59643 12.8435 8.66667 12.6667 8.66667H7.33333C7.15652 8.66667 6.98695 8.59643 6.86193 8.4714C6.7369 8.34638 6.66667 8.17681 6.66667 8C6.66667 7.82319 6.7369 7.65362 6.86193 7.5286C6.98695 7.40357 7.15652 7.33333 7.33333 7.33333H12.6667C12.8435 7.33333 13.013 7.40357 13.1381 7.5286C13.2631 7.65362 13.3333 7.82319 13.3333 8Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_785_4288">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(2 2)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <p className="ml-2">Invoice</p>
            </button> */}
          </div>
        </div>
        <div className="flex w-full justify-between mt-4 items-start p-5">
          <div className="lg:w-[60%] w-[50%] space-y-4 bg-white p-[24px] rounded-lg shadow-lg">
            <div className="flex">
              <div className="w-full flex space-x-3 justify-between">
                <p className="text-[#333333] font-semibold text-[18px] leading-[28px] tracking-[0.01em]">
                  Order {order.id.slice(-5)}
                </p>
                {/* ['Ordered', 'Preparing', 'Out for Delivery', 'Delivered'] */}
                <div>
                  {order.orderStatus === "Preparing" && (
                    <OrangeLabel>{order.orderStatus}</OrangeLabel>
                  )}
                  {order.orderStatus === "Delivered" && (
                    <GreenLabel>{order.orderStatus}</GreenLabel>
                  )}
                  {order.orderStatus === "Canceled" && (
                    <RedLabel>{order.orderStatus}</RedLabel>
                  )}
                  {order.orderStatus === "Ready" && (
                    <YellowLabel>{order.orderStatus}</YellowLabel>
                  )}
                  {order.orderStatus === "Out for Delivery" && (
                    <BlueLabel>{order.orderStatus}</BlueLabel>
                  )}
                </div>
              </div>
              <div className=""></div>
            </div>
            <div className="w-full flex items-center">
              <div className="flex items-center rounded-full w-[40px] h-[40px] bg-[#F0F1F3] p-[8px]">
                <svg
                  className="ml-auto mr-auto"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_785_4304)">
                    <path
                      d="M0 14.25C0.00119089 15.2442 0.396661 16.1973 1.09966 16.9003C1.80267 17.6033 2.7558 17.9988 3.75 18H14.25C15.2442 17.9988 16.1973 17.6033 16.9003 16.9003C17.6033 16.1973 17.9988 15.2442 18 14.25V7.5H0V14.25ZM12.75 10.875C12.9725 10.875 13.19 10.941 13.375 11.0646C13.56 11.1882 13.7042 11.3639 13.7894 11.5695C13.8745 11.775 13.8968 12.0012 13.8534 12.2195C13.81 12.4377 13.7028 12.6382 13.5455 12.7955C13.3882 12.9528 13.1877 13.06 12.9695 13.1034C12.7512 13.1468 12.525 13.1245 12.3195 13.0394C12.1139 12.9542 11.9382 12.81 11.8146 12.625C11.691 12.44 11.625 12.2225 11.625 12C11.625 11.7016 11.7435 11.4155 11.9545 11.2045C12.1655 10.9935 12.4516 10.875 12.75 10.875ZM9 10.875C9.2225 10.875 9.44001 10.941 9.62502 11.0646C9.81002 11.1882 9.95422 11.3639 10.0394 11.5695C10.1245 11.775 10.1468 12.0012 10.1034 12.2195C10.06 12.4377 9.95283 12.6382 9.7955 12.7955C9.63816 12.9528 9.43771 13.06 9.21948 13.1034C9.00125 13.1468 8.77505 13.1245 8.56948 13.0394C8.36391 12.9542 8.18821 12.81 8.0646 12.625C7.94098 12.44 7.875 12.2225 7.875 12C7.875 11.7016 7.99353 11.4155 8.2045 11.2045C8.41548 10.9935 8.70163 10.875 9 10.875ZM5.25 10.875C5.4725 10.875 5.69001 10.941 5.87502 11.0646C6.06002 11.1882 6.20422 11.3639 6.28936 11.5695C6.37451 11.775 6.39679 12.0012 6.35338 12.2195C6.30998 12.4377 6.20283 12.6382 6.0455 12.7955C5.88816 12.9528 5.68771 13.06 5.46948 13.1034C5.25125 13.1468 5.02505 13.1245 4.81948 13.0394C4.61391 12.9542 4.43821 12.81 4.3146 12.625C4.19098 12.44 4.125 12.2225 4.125 12C4.125 11.7016 4.24353 11.4155 4.4545 11.2045C4.66548 10.9935 4.95163 10.875 5.25 10.875Z"
                      fill="#333333"
                      fill-opacity="0.6"
                    />
                    <path
                      d="M14.25 1.5H13.5V0.75C13.5 0.551088 13.421 0.360322 13.2803 0.21967C13.1397 0.0790176 12.9489 0 12.75 0C12.5511 0 12.3603 0.0790176 12.2197 0.21967C12.079 0.360322 12 0.551088 12 0.75V1.5H6V0.75C6 0.551088 5.92098 0.360322 5.78033 0.21967C5.63968 0.0790176 5.44891 0 5.25 0C5.05109 0 4.86032 0.0790176 4.71967 0.21967C4.57902 0.360322 4.5 0.551088 4.5 0.75V1.5H3.75C2.7558 1.50119 1.80267 1.89666 1.09966 2.59966C0.396661 3.30267 0.00119089 4.2558 0 5.25L0 6H18V5.25C17.9988 4.2558 17.6033 3.30267 16.9003 2.59966C16.1973 1.89666 15.2442 1.50119 14.25 1.5Z"
                      fill="#333333"
                      fill-opacity="0.6"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_785_4304">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <p className="ml-2 font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">
                Ordered on
              </p>
              <p className="ml-auto font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">
                {formatDate(order.date)}
              </p>
            </div>
            <div className="w-full flex items-center">
              <div className="flex items-center rounded-full w-[40px] h-[40px] bg-[#F0F1F3] p-[8px]">
                <svg
                  className="ml-auto mr-auto"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_785_4310)">
                    <path
                      d="M14.25 2.25H3.75C2.7558 2.25119 1.80267 2.64666 1.09966 3.34966C0.396661 4.05267 0.00119089 5.0058 0 6H18C17.9988 5.0058 17.6033 4.05267 16.9003 3.34966C16.1973 2.64666 15.2442 2.25119 14.25 2.25Z"
                      fill="#333333"
                      fill-opacity="0.6"
                    />
                    <path
                      d="M0 12C0.00119089 12.9942 0.396661 13.9473 1.09966 14.6503C1.80267 15.3533 2.7558 15.7488 3.75 15.75H14.25C15.2442 15.7488 16.1973 15.3533 16.9003 14.6503C17.6033 13.9473 17.9988 12.9942 18 12V7.5H0V12ZM5.25 11.625C5.25 11.8475 5.18402 12.065 5.0604 12.25C4.93679 12.435 4.76109 12.5792 4.55552 12.6644C4.34995 12.7495 4.12375 12.7718 3.90552 12.7284C3.68729 12.685 3.48684 12.5778 3.3295 12.4205C3.17217 12.2632 3.06502 12.0627 3.02162 11.8445C2.97821 11.6262 3.00049 11.4 3.08564 11.1945C3.17078 10.9889 3.31498 10.8132 3.49998 10.6896C3.68499 10.566 3.9025 10.5 4.125 10.5C4.42337 10.5 4.70952 10.6185 4.9205 10.8295C5.13147 11.0405 5.25 11.3266 5.25 11.625Z"
                      fill="#333333"
                      fill-opacity="0.6"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_785_4310">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <p className="ml-2 font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">
                Payment Method
              </p>
              <p className="ml-auto font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">
                {order.paymentMethod}
              </p>
            </div>
            <div className="w-full flex items-center">
              <div className="flex items-center rounded-full w-[40px] h-[40px] bg-[#F0F1F3] p-[8px]">
                <svg
                  className="ml-auto mr-auto"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_785_4316)">
                    <path
                      d="M11.25 13.4995H3C2.20435 13.4995 1.44129 13.1834 0.87868 12.6208C0.316071 12.0582 0 11.2952 0 10.4995V4.49951C0 3.50495 0.395088 2.55112 1.09835 1.84786C1.80161 1.1446 2.75544 0.749512 3.75 0.749512H7.5C7.99246 0.749512 8.48009 0.846508 8.93506 1.03496C9.39003 1.22342 9.80343 1.49964 10.1517 1.84786C10.4999 2.19608 10.7761 2.60948 10.9645 3.06445C11.153 3.51942 11.25 4.00705 11.25 4.49951V13.4995ZM18 8.24951V7.49951C18 7.00705 17.903 6.51942 17.7145 6.06445C17.5261 5.60948 17.2499 5.19608 16.9016 4.84786C16.5534 4.49964 16.14 4.22342 15.6851 4.03496C15.2301 3.84651 14.7425 3.74951 14.25 3.74951H12.75V8.24951H18ZM12.75 9.74951V13.4995H15C15.7956 13.4995 16.5587 13.1834 17.1213 12.6208C17.6839 12.0582 18 11.2952 18 10.4995V9.74951H12.75ZM3.0435 14.9995C3.01603 15.1227 3.00145 15.2483 3 15.3745C3 15.8718 3.19754 16.3487 3.54917 16.7003C3.90081 17.052 4.37772 17.2495 4.875 17.2495C5.37228 17.2495 5.84919 17.052 6.20083 16.7003C6.55246 16.3487 6.75 15.8718 6.75 15.3745C6.74855 15.2483 6.73397 15.1227 6.7065 14.9995H3.0435ZM11.2935 14.9995C11.266 15.1227 11.2514 15.2483 11.25 15.3745C11.25 15.8718 11.4475 16.3487 11.7992 16.7003C12.1508 17.052 12.6277 17.2495 13.125 17.2495C13.6223 17.2495 14.0992 17.052 14.4508 16.7003C14.8025 16.3487 15 15.8718 15 15.3745C14.9986 15.2483 14.984 15.1227 14.9565 14.9995H11.2935Z"
                      fill="#333333"
                      fill-opacity="0.6"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_785_4316">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <p className="ml-2 font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">
                Shipping Address
              </p>
              <p className="ml-auto font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333] w-20 lg:w-full text-right truncate">
                {order.shippingAddress}
              </p>
            </div>
            <div className="w-full flex items-center">
              <div className="flex items-center rounded-full w-[40px] h-[40px] bg-[#F0F1F3] p-[8px] ">
                <svg
                  className="ml-auto mr-auto"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_785_4337)">
                    <path
                      d="M11.25 0H6.75C5.7558 0.00119089 4.80267 0.396661 4.09966 1.09966C3.39666 1.80267 3.00119 2.7558 3 3.75V12H15V3.75C14.9988 2.7558 14.6033 1.80267 13.9003 1.09966C13.1973 0.396661 12.2442 0.00119089 11.25 0V0Z"
                      fill="#333333"
                      fill-opacity="0.6"
                    />
                    <path
                      d="M3 14.25C3.00119 15.2442 3.39666 16.1973 4.09966 16.9003C4.80267 17.6033 5.7558 17.9988 6.75 18H11.25C12.2442 17.9988 13.1973 17.6033 13.9003 16.9003C14.6033 16.1973 14.9988 15.2442 15 14.25V13.5H3V14.25ZM9 15C9.14834 15 9.29334 15.044 9.41668 15.1264C9.54001 15.2088 9.63614 15.3259 9.69291 15.463C9.74968 15.6 9.76453 15.7508 9.73559 15.8963C9.70665 16.0418 9.63522 16.1754 9.53033 16.2803C9.42544 16.3852 9.2918 16.4567 9.14632 16.4856C9.00083 16.5145 8.85003 16.4997 8.71299 16.4429C8.57594 16.3861 8.45881 16.29 8.3764 16.1667C8.29399 16.0433 8.25 15.8983 8.25 15.75C8.25 15.5511 8.32902 15.3603 8.46967 15.2197C8.61032 15.079 8.80109 15 9 15Z"
                      fill="#333333"
                      fill-opacity="0.6"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_785_4337">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <p className="ml-2 font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">
                Ordered by
              </p>
              <p className="ml-auto font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">
                {order.userName}
              </p>
            </div>
          </div>
          <div className="lg:w-[30%] w-[40%]">
            <div className="bg-white w-full rounded-lg shadow-lg p-3">
              <div className="rounded-lg w-full bg-white px-2 py-2 items-center flex">
                <p className="mr-2 font-semibold text-[20px] leading-[30px] tracking-[0.01em]">
                  Order List
                </p>
              </div>
              <div className="w-full flex items-center px-2">
                <p className="font-[800] text-[14px] text-left w-full leading-[20px] tracking-[0.005em] text-[#333333]">
                  Item
                </p>
                <p className="font-[800] text-[14px] text-center w-full  leading-[20px] tracking-[0.005em] text-[#333333]">
                  Quantity
                </p>
                <p className="font-[800] text-[14px] text-right w-full leading-[20px] tracking-[0.005em] text-[#333333]">
                  Price($)
                </p>
              </div>
              <div className="w-full flex items-center  px-2">
                <p className="font-bold text-[14px] text-left w-full leading-[20px] tracking-[0.005em] text-[#333333]">
                  Order Total
                </p>
                <p className="font-bold text-[14px] text-center w-full leading-[20px] tracking-[0.005em] text-[#333333]">
                  -
                </p>
                <p className="font-bold text-[14px] text-right w-full leading-[20px] tracking-[0.005em] text-[#333333]">
                  {formatNumberWithCommas(order.totalPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-[24px] w-[90%] mx-auto shadow-lg flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <p className="mr-2 font-semibold text-[20px] leading-[30px] tracking-[0.01em]">
              Assign Driver
            </p>

            <select ref={optionsRef} className="rounded-lg">
              {drivers.map((driver, index) => {
                return (
                  <option key={index} value={driver}>
                    {driver}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            onClick={handleAssignDriver}
            className="mx-auto rounded-lg p-1 w-40 border bg-rs-green text-white font-bold"
          >
            Assign Driver
          </button>
        </div>
      </>
    )
  );
}
