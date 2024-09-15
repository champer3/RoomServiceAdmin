import React, { useContext } from "react";
import DriverOrderCard from "../components/DriverOrderCard";
import { PageContext } from "../context/PageContext";
import { Link } from "react-router-dom";
const DriversDashboard = () => {
  const { changePage } = useContext(PageContext);
  return (
    <>
      {changePage("drivers-home")}
      <div className="mt-7 p-3">
        <p className="text-rs-green text-4xl font-[700] mb-3">
          Assigned Orders
        </p>
        <Link to={`/drivers/drivers-order/${"66d8d1c618006ae8113ec2a5"}`}>
          <DriverOrderCard id={"#3ec2a5"} />
        </Link>
      </div>
    </>
  );
};

export default DriversDashboard;
