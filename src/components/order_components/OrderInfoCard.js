import { useState, useEffect, useRef } from "react";
import GreenLabel from "../StatusLabels/GreenLabel";
import OrangeLabel from "../StatusLabels/OrangeLabel";
import RedLabel from "../StatusLabels/RedLabel";
import OrderModal from "../OrderModal";

function formatNumberWithCommas(number) {
  const formattedNumber = parseFloat(number.toFixed(2)).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  return formattedNumber;
}

export default function OrderInfoCard({
  id,
  customer,
  orderDetails,
  time,
  total,
  status,
  onComplete,
}) {
  const now = new Date();
  const initialWaitingTime = Math.floor((now - time) / 1000);

  const [seconds, setSeconds] = useState(initialWaitingTime);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmOperation, setConfirmOperation] = useState();

  const modalRef = useRef();
  const intervalRef = useRef();

  useEffect(() => {
    if (status !== "Out for Delivery" && status !== "Cancelled") {
      intervalRef.current = setInterval(() => {
        setSeconds((prevState) => prevState + 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [status]);

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsMenuOpen(false);
  };

  function handleOpenModal(operation) {
    setConfirmOperation(operation);
    modalRef.current.showModal();
  }

  return (
    <div className="relative">
      {isMenuOpen && (
        <div className="absolute animate-none border border-stone-200 -top-3 -right-9 w-30 px-1 py-2 shadow-xl bg-stone-100 flex flex-col z-50">
          <button
            onClick={() => {
              onComplete(id, "Out for Delivery");
              stopTimer();
            }}
            className="p-1 hover:bg-stone-200 text-sm font-bold"
          >
            Complete Order
          </button>
          <button
            onClick={() => {
              onComplete(id, "Canceled");
              stopTimer();
            }}
            className="p-1 hover:bg-stone-200 text-sm font-bold"
          >
            Cancel Order
          </button>
          <button
            onClick={() => {
              onComplete(id, "Ordered");
              stopTimer();
            }}
            className="p-1 hover:bg-stone-200 text-sm font-bold"
          >
            Reset
          </button>
          <button
            className="p-1 hover:bg-stone-200 text-sm font-bold"
            onClick={() => {
              setIsMenuOpen(false);
            }}
          >
            Close Options
          </button>
        </div>
      )}
      <div
        onDoubleClick={() => {
          onComplete(id, "Out for Delivery");
          stopTimer();
        }}
        className={`relative bg-yellow-100 rounded-lg p-2 shadow-lg w-[200px] ${
          status === "Ordered" ? "animate-pulse" : ""
        } `}
      >
        <button
          onClick={() => {
            setIsMenuOpen((prevState) => !prevState);
          }}
          className={`${
            status === "Completed" || status === "Cancelled" ? "hidden" : ""
          } absolute right-5 flex flex-col justify-between h-4`}
        >
          <span className="block w-1 bg-stone-500 h-1 rounded-full" />
          <span className="block w-1 bg-stone-500 h-1 rounded-full" />
          <span className="block w-1 bg-stone-500 h-1 rounded-full" />
        </button>
        <div className="flex items-center justify-center">
          <p className="font-bold text-xl text-center text-amber-700">
            Order {id.slice(id.length - 5, id.length)}
          </p>
        </div>
        <hr className=" border-dotted border-t border-stone-800 " />
        <div className="flex flex-col justify-center items-center">
          <p className="font-bold text-[12px]">Ordered by</p>
          <p className="text-sm">{customer}</p>
          <p className="mt-1 font-bold text-[12px]">In this order</p>
          <p className="text-sm">One Fish</p>
          <p className="text-sm">Two Garri</p>
          <p className="font-bold text-[12px]">Total Order Price</p>
          <p className="text-sm">${total}</p>
          {status === "Ordered" && (
            <>
              <p className="mt-1 font-bold text-[12px]">Time Since Order:</p>
              <p className="font-bold text-red-700 text-md text-sm">
                {Math.floor(seconds / 3600) < 10
                  ? `0${Math.floor(seconds / 3600)}`
                  : Math.floor(seconds / 3600)}
                h :{" "}
                {Math.floor((seconds % 3600) / 60) < 10
                  ? `0${Math.floor((seconds % 3600) / 60)}`
                  : Math.floor((seconds % 3600) / 60)}
                m : {seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}s
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
