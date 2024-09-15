import React from "react";

const DriverOrderCard = ({ id }) => {
  return (
    <button className="transiton ease-in-out duration-300 delay-200 hover:-translate-y-1 hover:scale-110 w-40 bg-white shadow-lg rounded-lg p-4">
      <p className="text-center font-[800]">{id}</p>
    </button>
  );
};

export default DriverOrderCard;
