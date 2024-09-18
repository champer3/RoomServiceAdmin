import React from "react";

const DriverOrderCard = ({ id }) => {
  return (
    <div className="transiton ease-in-out duration-300 delay-200 hover:-translate-y-1 hover:scale-110 w-40 bg-white shadow-lg rounded-lg p-4 hover:border-4 hover:border-rs-green hover:bg-rs-green">
      <p className="text-center font-[800]">{id}</p>
    </div>
  );
};

export default DriverOrderCard;
