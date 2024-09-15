import React, { useState, useEffect } from "react";
import axios from "axios";

import OrderInfoCard from "../components/order_components/OrderInfoCard";
import TabButton from "../components/TabButton";
import { getSocket } from "../socketService";

const updateStatus = async (id, newStatus) => {
  const authToken = localStorage.getItem("token");
  try {
    const orders = await axios.patch(
      `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/orders/${id}`,
      JSON.stringify({
        orderStatus: newStatus === "Completed" ? "Delivered" : newStatus === "Cancelled" ? "Canceled" : "Ready",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    // Do something with successful status update
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getAllOrders = async () => {
  const authToken = localStorage.getItem("token");
  try {
    const orders = await axios.get(
      `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/orders`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const targetMidnight = new Date();
    targetMidnight.setHours(0, 0, 0, 0);

    const todaysOrders = orders.data.data.orders.filter(order => {
      const orderDate = new Date(order.date);
      orderDate.setHours(orderDate.getHours() + 6);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === targetMidnight.getTime();
    });
    // const todaysOrders = orders.data.data.orders.filter((order) => {
    //   const orderDate = new Date(order.date);
    //   return (
    //     orderDate >= startOfDay &&
    //     orderDate < new Date(startOfDay.getTime())
    //     // orderDate < new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
    //   );
    // });
    return todaysOrders.reverse();
  } catch (err) {
    console.log(err);
    return [];
  }
};

const OrderNotifications = () => {
  const [orderList, setOrderList] = useState([]);
  const [filter, setFilter] = useState("Ready");
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrders();
      console.log(orders)
      setOrderList(orders);
    };
    fetchOrders();
  }, [flag]);

  useEffect(() => {
    const socket = getSocket();
    socket.on("order", async (data) => {
      const orders = await getAllOrders();
      setOrderList(orders);
    });

    return () => {
      socket.off("order");
    };
  }, []);

  const handleFinishOrder = (id, newStatus) => {
    updateStatus(id, newStatus);
    setFlag((prevState) => !prevState);
  };

  return (
    <>
      {/* {orderList.length <= 0 && <p>Loading...</p>} */}
      {console.log(orderList)}
      {orderList.length > 0 && (
        <div>
          <h1 className="mx-4 text-2xl font-semibold leading-1 tracking-0.5 p-3 text-rs-green">
            Recent Order Activity
          </h1>
          <div className="w-[330px] border border-[#E0E2E7] bg-white rounded-lg p-1">
            <TabButton
              handleSelect={() => setFilter("Ready")}
              isSelected={filter === "Ready"}
            >
              In Progress
            </TabButton>
            <TabButton
              handleSelect={() => setFilter("Delivered")}
              isSelected={filter === "Delivered"}
            >
              Completed
            </TabButton>
            <TabButton
              handleSelect={() => setFilter("Canceled")}
              isSelected={filter === "Canceled"}
            >
              Cancelled
            </TabButton>
            <TabButton
              handleSelect={() => setFilter("all")}
              isSelected={filter === "all"}
            >
              All
            </TabButton>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {orderList
              .filter((order) =>
                filter === "all" ? true : order.orderStatus === filter
              )
              .map((order, index) => {
                return (
                  <div key={index}>
                    <OrderInfoCard
                      key={index}
                      id={order.id}
                      customer={order.userName}
                      time={new Date(order.date)}
                      status={order.orderStatus}
                      orderDetails={order.orderDetails}
                      total={order.totalPrice.toFixed(2)}
                      onComplete={handleFinishOrder}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderNotifications;
