import React, { useState, useEffect } from "react";
import axios from "axios";

import OrderInfoCard from "../components/order_components/OrderInfoCard";
import TabButton from "../components/TabButton";
import { getSocket } from "../socketService";



function findIndexIn2DArray(array, id) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j].id === id) {
        return [i, j];
      }
    }
  }
  // return [-1, -1];
}

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
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const todaysOrders = orders.data.data.orders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= startOfDay && orderDate < new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    });
    
    return todaysOrders.reverse();
  } catch (err) {
    console.log(err);
    return [];
  }
};

const OrderNotifications = () => {
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrders();
      setOrderList(orders);
    };
    fetchOrders();
  }, []);

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
  const [filter, setFilter] = useState("all");

  const handleFinishOrder = (id, newStatus) => {
    setOrderList((prevState) =>
      prevState.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = orderList.filter(order =>
    filter === "all" ? true : order.orderStatus === filter
  );

  
  return (
    <>
      {!orderList && <p>Loading...</p>}
      {orderList && (
        <div>
          <h1 className="mx-4 text-2xl font-semibold leading-1 tracking-0.5 p-3 text-rs-green">
            Recent Order Activity
          </h1>
          <div className="w-[330px] border border-[#E0E2E7] bg-white rounded-lg p-1">
            <TabButton
              handleSelect={() => setFilter("all")}
              isSelected={filter === "all"}
            >
              All
            </TabButton>
            <TabButton
              handleSelect={() => setFilter("In Progress")}
              isSelected={filter === "In Progress"}
            >
              In Progress
            </TabButton>
            <TabButton
              handleSelect={() => setFilter("Completed")}
              isSelected={filter === "Completed"}
            >
              Completed
            </TabButton>
            <TabButton
              handleSelect={() => setFilter("Cancelled")}
              isSelected={filter === "Cancelled"}
            >
              Cancelled
            </TabButton>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-2">
            {orderList.map((order, index) => {
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
          {/* <table className="mx-auto w-full">
            <tbody>
              {orderList.map((orderRow, index) => {
                return (
                  <tr className="" key={index}>
                    {orderRow
                      .filter((order) => {
                        return filter === "all"
                          ? true
                          : order.status === filter;
                      })
                      .map((order, index) => {
                        return (
                          <td key={index} className="w-auto p-2">
                            <OrderInfoCard
                              key={index}
                              id={order.id}
                              customer={order.userName}
                              time={new Date(order.date).getTime()}
                              status={order.orderStatus}
                              orderDetails={order.orderDetails}
                              total={order.totalPrice}
                              onComplete={handleFinishOrder}
                            />
                          </td>
                        );
                      })}
                  </tr>
                );
              })}
            </tbody>
          </table> */}
        </div>
      )}
    </>
  );
};

export default OrderNotifications;
