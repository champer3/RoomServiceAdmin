import React, { useState, useEffect } from "react";
import axios from "axios";

import OrderInfoCard from "../components/order_components/OrderInfoCard";
import TabButton from "../components/TabButton";
import { getSocket } from "../socketService";

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
    return orders;
  } catch (err) {
    console.log(err);
  }
};

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

const specificDate = new Date(2024, 7, 23, 15, 30, 45);
const date2 = new Date(2024, 7, 24, 1, 10, 0);
const date3 = new Date(2024, 7, 24, 1, 0, 0);
const date4 = new Date(2024, 7, 24, 0, 0, 0);
const date5 = new Date(2024, 7, 23, 23, 0, 0);

const ms = specificDate.getTime();
const ms2 = date2.getTime();
const ms3 = date3.getTime();
const ms4 = date4.getTime();
const ms5 = date5.getTime();

const OrderNotifications = () => {
  const [orderList, setOrderList] = useState();
  useEffect(() => {
    getAllOrders()
      .then((data) => data)
      .then((data) => {
        const today = new Date().toISOString().split("T")[0];
        const todayOrders = data.data.data.orders.filter(
          (order) => order.date.split("T")[0] === today
        );
        return setOrderList(
          todayOrders
          //   () => {
          //   let j = 1;
          //   const result = [];
          //   let row = [];
          //   for (let i = 0; i < todayOrders.length; i++) {
          //     if (i <= j * 3 && i >= (j - 1) * 3) {
          //       row.push(todayOrders[i]);
          //     }
          //     if (row.length === 3) {
          //       result.push(row);
          //       row = [];
          //       j += 1;
          //     }
          //   }
          //   if (row) {
          //     result.push(row);
          //   }
          //   return result;
          // }
        );
      });
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on("order", (data) => {
      console.log("Received message:", data);
      getAllOrders()
        .then((data) => data)
        .then((data) => {
          const today = new Date().toISOString().split("T")[0];
          const todayOrders = data.data.data.orders.filter(
            (order) => order.date.split("T")[0] === today
          );
          return setOrderList(
            todayOrders
            //   () => {
            //   let j = 1;
            //   const result = [];
            //   let row = [];
            //   for (let i = 0; i < todayOrders.length; i++) {
            //     if (i < j * 3 && i > (j - 1) * 3) row.push(todayOrders[i]);
            //     if (row.length === 3) {
            //       result.push(row);
            //       row = [];
            //       j += 1;
            //     }
            //   }
            //   return result;
            // }
          );
        });
    });

    return () => {
      socket.off("order"); // Correct the event name
    };
  }, []);
  const [filter, setFilter] = useState("all");
  const [dummyData, setDummyData] = useState([
    [
      {
        id: "#111110",
        customer: "Semiu Ajayi",
        time: ms,
        status: "In Progress",
        orderDetails: ["One Lamp", "One Bed", "One Stew"],
        total: 44.44,
      },
      {
        id: "#111111",
        customer: "Fela K",
        time: ms2,
        status: "In Progress",
        orderDetails: ["One Lamp", "One Bed", "One Stew"],
        total: 44.44,
      },
      {
        id: "#111112",
        customer: "Nimi A",
        time: ms3,
        status: "In Progress",
        orderDetails: ["One Lamp", "One Bed", "One Stew"],
        total: 44.44,
      },
    ],
    [
      {
        id: "#111113",
        customer: "Asiwajku F",
        time: ms4,
        status: "In Progress",
        orderDetails: ["One Lamp", "One Bed", "One Stew"],
        total: 44.44,
      },
      {
        id: "#111114",
        customer: "Stephen K",
        time: ms5,
        status: "In Progress",
        orderDetails: ["One Lamp", "One Bed", "One Stew"],
        total: 44.44,
      },
    ],
  ]);
  // console.log(orderList ? new Date(orderList[0][0].date).getTime() : "null");

  const handleFinishOrder = (id, newStatus) => {
    const [r, c] = findIndexIn2DArray(orderList, id);
    setOrderList((prevState) => {
      const newState = [...prevState];
      newState[r][c] = { ...newState[r][c], status: newStatus };
      return newState;
    });
  };

  return (
    <>
      {!orderList && <p>Loading...</p>}
      {orderList && (
        <div>
          {console.log(orderList)}
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
                    time={new Date(order.date).getTime()}
                    status={order.orderStatus}
                    orderDetails={order.orderDetails}
                    total={order.totalPrice}
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
