import React, { useContext, useEffect, useState } from "react";
import DriverOrderCard from "../components/DriverOrderCard";
import axios from "axios";
import { PageContext } from "../context/PageContext";
import { Link } from "react-router-dom";
import { getOrder } from "./OrderDetails";
const DriversDashboard = () => {
  const driverEmail = sessionStorage.getItem("email");
  const [assignedOrders, setAssignedOrders] = useState();
  const [orderDetails, setOrderDetails] = useState([]);

  const getAssignedOrders = async () => {
    const authToken = localStorage.getItem("token");
    try {
      const driver = await axios.get(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/users/${driverEmail}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Do something with successful status update
      const orders = driver.data.data.user[0].assignedOrder;
      setAssignedOrders(orders);
      const res = [];
      for (const item in orders) {
        let currOrder = await getOrder(orders[item]);
        const check = orderDetails.find((order) => order.id === currOrder[0].id);
        if (!check) {
          res.push(currOrder[0]);
        }
      }
      setOrderDetails(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAssignedOrders();
  }, []);

  return (
    assignedOrders && (
      <>
        <p className="mt-7 text-rs-green text-4xl font-[700] mb-3">
          Assigned Orders
        </p>
        <div className="p-3 grid grid-cols-2 gap-1">
          {assignedOrders.length === 0 && <p>No orders yet...</p>}
          {assignedOrders.map((order, index) => {
            return (
              <Link key={index} to={`/drivers/drivers-order/${order}`}>
                {orderDetails.length > 0 && (
                  <DriverOrderCard
                    id={`#${order.slice(-5)}`}
                    customer={orderDetails[index].userName}
                    totalPrice={orderDetails[index].totalPrice}
                    products={orderDetails[index].orderDetails.map(
                      (order) => order.productName
                    )}
                  />
                )}
                <p></p>
              </Link>
            );
          })}
        </div>
      </>
    )
  );
};

export default DriversDashboard;
