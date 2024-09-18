import React from "react";

import { forwardRef } from "react";

const OrderModal = forwardRef(function OrderModal({ onConfirm, operation }, ref) {
  return (
    <dialog ref={ref} className="rounded-lg p-5 shadow-xl">
      <div className="ml-5 flex flex-col justify-center items-center bg-white p-5 ">
        <p className="font-[700] text-xl text-rs-green">
          {`Are you sure you want to ${operation} this order?`}
        </p>
        <form className="space-x-4 p-5" method="dialog">
          <button
            className="bg-green-800 w-20 p-3 rounded-lg text-white text-xl font-[700] hover:bg-green-400 shadow-xl"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button className="bg-red-800 w- p-3 rounded-lg text-white text-xl font-[700] hover:bg-red-400 shadow-xl">
            Cancel
          </button>
        </form>
      </div>
    </dialog>
  );
});
export default OrderModal;
