import React, { useContext, useEffect, useState } from "react";
import DriverOrderCard from "../components/DriverOrderCard";
import axios from "axios";
import { PageContext } from "../context/PageContext";
import { Link } from "react-router-dom";
import { getOrder } from "./OrderDetails";
const DriversDashboard = () => {
  const driverEmail = sessionStorage.getItem("email");
  const [assignedOrders, setAssignedOrders] = useState();

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
      setAssignedOrders(driver.data.data.user[0].assignedOrder);
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
        <div className="mt-7 p-3">
          <p className="text-rs-green text-4xl font-[700] mb-3">
            Assigned Orders
          </p>
          {assignedOrders.length === 0 && <p>No orders yet...</p>}
          {assignedOrders.map((order, index) => {
            return (
              <Link key={index} to={`/drivers/drivers-order/${order}`}>
                <DriverOrderCard id={`#${order.slice(-5)}`} />
              </Link>
            );
          })}
        </div>
      </>
    )
  );
};

export default DriversDashboard;
