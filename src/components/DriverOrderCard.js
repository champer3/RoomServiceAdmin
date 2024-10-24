import React from "react";

const DriverOrderCard = ({ id, customer, products, totalPrice }) => {
  return (
    <div className="transiton ease-in-out duration-300 delay-200 hover:-translate-y-1 hover:scale-110 w-40 bg-white shadow-lg rounded-lg hover:border-4 hover:border-rs-green hover:bg-rs-green">
      <p className="text-center font-[800] bg-rs-green text-white w-full">{id}</p>
      <p className="text-center font-[800]">{customer}</p>
      {Array.from(new Set(products)).map((product, index) => (
        <p className="text-center font-[500]" key={index}>
          {product}
        </p>
      ))}
      <p className="text-center font-[500]">${totalPrice}</p>
    </div>
  );
};

export default DriverOrderCard;
