import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import axios from "axios";
import { PageContext } from "../context/PageContext";
import OrderInfoCard from "../components/order_components/OrderInfoCard";
import TabButton from "../components/TabButton";
import { getSocket } from "../socketService";

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

    const todaysOrders = orders.data.data.orders.filter((order) => {
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
  // This is for the Epson Printer API
  const [printer, setPrinter] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const printerIP = "192.168.1.100"; // Replace with your printer's IP address
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
  }, [seconds]);
  const printReceipt = useCallback(() => {
    if (!printer) {
      console.error("Printer is not connected");
      return;
    }

    printer.addTextAlign(printer.ALIGN_CENTER);
    printer.addText("Hello, this is a test receipt!\n");
    printer.addFeedLine(1); // Add a line feed
    printer.addCut(printer.CUT_FEED); // Cut the paper after printing

    printer.send(
      () => {
        console.log("Receipt printed successfully!");
      },
      (errorCode) => {
        console.error("Print error:", errorCode);
      }
    );
  }, [printer]);

  // Connect to the printer when the component mounts
  // useEffect(() => {
  //   connectPrinter();
  // }, []);
  // ....... Epson Printer End ....................
  const [orderList, setOrderList] = useState([]);
  const [filter, setFilter] = useState("Ordered");
  // const { flag, setFlag } = useContext(PageContext);
  const [flag, setFlag] = useState(false);

  const updateStatus = async (id, orderStatus) => {
    const authToken = localStorage.getItem("token");
    const postData = {
      orderStatus,
    };
    try {
      await axios.patch(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/orders/deliver/${id}`,
        JSON.stringify(postData),
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
  // const updateStatus = async (id, newStatus) => {
  //   const authToken = localStorage.getItem("token");
  //   try {
  //     const order = await axios.patch(
  //       `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/orders/${id}`,
  //       JSON.stringify({
  //         orderStatus: newStatus,
  //       }),
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //       }
  //     );
  //     if (order) {

  //     }
  //     // Do something with successful status update
  //     setFlag((prevState) => !prevState);
  //   } catch (err) {
  //     console.log(err);
  //     return [];
  //   }
  // };

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrders();
      // console.log(orders);
      setOrderList(orders);
    };
    fetchOrders();
  }, [flag]);

  useEffect(() => {
    const socket = getSocket();
    socket.on("order", async (data) => {
      // printReceipt(); // For Epson receipt. Might work or might not
      const orders = await getAllOrders();
      setOrderList(orders);
    });

    return () => {
      socket.off("order");
    };
  }, [printReceipt]);

  const handleFinishOrder = (id, newStatus) => {
    console.log("Inside Handlefinish Order", newStatus)
    updateStatus(id, newStatus);
  };
console.log(orderList)
  return (
    <>
      {orderList.length > 0 && (
        <div>
          <h1 className="mx-4 text-2xl font-semibold leading-1 tracking-0.5 p-3 text-rs-green">
            Recent Order Activity
          </h1>
          <span className="bg-white p-1 rounded-lg flex w-[60%] items-center">
            <TabButton
              handleSelect={() => setFilter("Ordered")}
              isSelected={filter === "Ordered"}
            >
              Ordered
            </TabButton>
            <TabButton
              handleSelect={() => setFilter("Out for Delivery")}
              isSelected={filter === "Out for Delivery"}
            >
              Out for Delivery
            </TabButton>
            <TabButton
              handleSelect={() => setFilter("Ready for Delivery")}
              isSelected={filter === "Ready for Delivery"}
            >
              Ready for Delivery
            </TabButton>
            <TabButton
              handleSelect={() => setFilter("Delivered")}
              isSelected={filter === "Delivered"}
            >
              Delivered
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
          </span>
          <div className="d-flex flex-column gap-3" style={{height: '100vh', flexWrap: 'wrap', width: 'fit-content'}}>
            {orderList
              .filter((order) =>
                filter === "all" ? true : order.orderStatus === filter
              )
              .map((order, index) => {
                return (
                    <OrderInfoCard
                      key={index}
                      id={order.id}
                      index = {orderList.length - index}
                      customer={order.userName}
                      time={new Date(order.date)}
                      count = {seconds}
                      status={order.orderStatus}
                      instructions={order.orderInstruction}
                      orderDetails={order.orderDetails}
                      total={order.totalPrice.toFixed(2)}
                      onComplete={handleFinishOrder}
                    />
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderNotifications;
