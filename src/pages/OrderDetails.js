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

export const getOrder = async (id) => {
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

function arrayToObject(arrays) {
  let result = [];

  arrays.forEach((innerArray) => {
    const res = {};
    const [key, ...values] = innerArray;
    res[key] = values;
    result = [...result, { ...res }];
  });

  return result;
}

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
  const [assignedDriver, setAssignedDriver] = useState("");
  const [options, setOptions] = useState();
  const [flag, setFlag] = useState(false);
  const [message, setMessage] = useState();
  const optionsRef = useRef();
  const [order, setOrder] = useState();
  const { orderId } = useParams();

  const updateOrder = async (id, email) => {
    let driverID;
    let assigned;
    const authToken = localStorage.getItem("token");
    // console.log(oldEmail ? oldEmail : "No old driver");
    // https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/
    //find old driver; in case of new assignment
    if (true) {
      // get old driver
      let oldDriver;
      // to find old driver's email from order
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
        oldDriver = order.data.data.order.driver;
        console.log(oldDriver);
      } catch (err) {
        console.log(err);
      }

      // get old driver's current assigned order
      let assigned;
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
        assigned = driver.data.data.user[0].assignedOrder;
      } catch (err) {
        console.log(err);
        return;
      }

      // remove order from old driver's assigned orders
      const newAssigned = assigned.filter((order) => order !== id);
      // console.log(newAssigned);
      // // console.log(newAssigned);
      // // console.log(assigned);
      // console.log(oldDriver);

      // patch old Driver to not include order anymore
      try {
        const user = await axios.patch(
          `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/${oldDriver}`,
          JSON.stringify({
            assignedOrder: [...newAssigned],
          }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        //   // Do something with successful status update
      } catch (err) {
        console.log(err);
        return;
      }
    }
    //find new driver
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
      setAssignedDriver(email);
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
          driver: email,
          orderStatus: "Out for Delivery",
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Do something with successful status update
      setFlag((prevState) => !prevState);
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

  const updateStatus = async (id, newStatus) => {
    console.log("id", id);
    console.log("newStatus", newStatus);
    const authToken = localStorage.getItem("token");
    console.log("authToken", authToken);
  };

  useEffect(() => {
    getOrder(orderId).then((data) => setOrder(data));
  }, [flag, orderId]);

  useEffect(() => {
    setTimeout(() => {
      setMessage();
    }, 4000);
  }, [message]);

  const { changePage } = useContext(PageContext);

  const handleAssignDriver = () => {
    updateOrder(order.id, optionsRef.current.value);
  };


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
          </div>
        </div>
        <div className="w-full flex flex-col items-center space-y-3 lg:space-y-0 lg:flex-row lg:items-start lg:justify-between space-x-4 mt-4 p-5">
          <div className="lg:w-[50%] w-[100%] bg-white rounded-lg shadow-md p-3">
            <div className="flex">
              <div className="w-full flex space-x-3 justify-between">
                <p className="text-[#333333] font-semibold text-[18px] leading-[28px] tracking-[0.01em]">
                  Order {order.id.slice(-5)}
                </p>
                <div>
                  {order.orderStatus === "Ordered" && (
                    <OrangeLabel>{order.orderStatus}</OrangeLabel>
                  )}
                  {order.orderStatus === "Delivered" && (
                    <GreenLabel>{order.orderStatus}</GreenLabel>
                  )}
                  {order.orderStatus === "Cancelled" && (
                    <RedLabel>{order.orderStatus}</RedLabel>
                  )}
                  {order.orderStatus === "Ready for Delivery" && (
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
              <p className="ml-auto font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333] w-60 text-right truncate">
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
          <div className="lg:w-[50%] w-[100%] bg-white w-full rounded-lg shadow-md p-3">
            <div className="rounded-lg w-full bg-white px-2 py-2 items-center flex">
              <p className="mr-2 font-semibold text-[20px] leading-[30px] tracking-[0.01em]">
                Order List
              </p>
            </div>
            <div className="w-full items-center  px-2">
              {order.orderDetails.map((order, index) => (
                <div key={index} class="card-body m-0 p-[3px]">
                  <div className="flex justify-between items-center">
                    <div className="w-[8%] flex items-center"></div>
                    <div>
                      <p className="text-sm ">{order?.dressing?.length}</p>
                    </div>
                    <div className="w-[75%]">
                      <p className="text-sm font-bold ">
                        {order.productName}{" "}
                        {order.component ? "(" + order.component + ")" : ""}
                      </p>
                    </div>
                  </div>
                  {order?.flavor?.map((product) => (
                    <div className="flex justify-between items-center px-3">
                      <div></div>
                      <div className="w-[75%]">
                        {JSON.parse(product).values.length > 0 && (
                          <p className="text-[10px] text-secondary italic">
                            {JSON.parse(product).name} :{" "}
                            {JSON.parse(product)
                              .values.map((val) => val.name)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {order?.sides?.map((product) => (
                    <div className="flex justify-between items-center">
                      <div className="w-[8%] flex items-center"></div>
                      <div></div>
                      <div className="w-[75%]">
                        <p className="text-[12px] text-secondary italic">
                          {JSON.parse(product).name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="w-full flex items-center  px-2">
              <p className="font-[800] text-[14px] text-left w-full leading-[20px] tracking-[0.005em] text-[#333333]">
                Order Total
              </p>
              <p className="font-[800] text-[14px] text-right w-full leading-[20px] tracking-[0.005em] text-[#333333]">
                {formatNumberWithCommas(order.totalPrice)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-[24px] w-[90%] mx-auto shadow-lg flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <p className="mr-2 font-semibold text-[20px] leading-[30px] tracking-[0.01em]">
              Assign Driver
            </p>

            <select ref={optionsRef} className="rounded-lg">
              {drivers
                .filter((driver) => driver !== assignedDriver)
                .map((driver, index) => {
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
            disabled={
              order.orderStatus === "Ordered" ||
              order.orderStatus === "Cancelled" ||
              order.orderStatus === "Delivered"
            }
            className="mx-auto rounded-lg p-1 w-40 border bg-rs-green text-white font-bold disabled:bg-stone-500"
          >
            {order.orderStatus !== "Out for Delivery"
              ? "Assign Driver"
              : "Assign Another Driver"}
          </button>
        </div>
      </>
    )
  );
}

// {order?.flavor?.map((product) => <div  className="flex justify-between items-center px-3">
//   <div></div>
//   <div className="w-[75%]">{JSON.parse(product).values.length > 0 && <p className="text-[10px] text-secondary italic">{JSON.parse(product).name} : {JSON.parse(product).values.map(val=>val.name).join(', ')}</p>}
// </div>
// </div>)}
// {order?.sides?.map((product) => <div  className="flex justify-between items-center">
//   <div className="w-[8%] flex items-center">{status === "Ready for Delivery" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#507615" class="fa-secondary" d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zm126.1 0L160 222.1c.3 .3 .6 .6 1 1c5.3 5.3 10.7 10.7 16 16c15.7 15.7 31.4 31.4 47 47c37-37 74-74 111-111c5.3-5.3 10.7-10.7 16-16c.3-.3 .6-.6 1-1L385.9 192c-.3 .3-.6 .6-1 1l-16 16L241 337l-17 17-17-17-64-64c-5.3-5.3-10.7-10.7-16-16l-1-1z"/><path fill="#5c9a2c" opacity=".4" class="fa-primary" d="M385 193L241 337l-17 17-17-17-80-80L161 223l63 63L351 159 385 193z"/></svg>}</div>
//   <div></div>
//   <div className="w-[75%]"><p className="text-[12px] text-secondary italic">
//   {JSON.parse(product).name}
// </p></div>
// </div>)}
