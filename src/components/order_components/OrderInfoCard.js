import { useState, useEffect, useRef } from "react";
import GreenLabel from "../StatusLabels/GreenLabel";
import OrangeLabel from "../StatusLabels/OrangeLabel";
import RedLabel from "../StatusLabels/RedLabel";
import OrderModal from "../OrderModal";

export default function OrderInfoCard({
  id,
  customer,
  orderDetails,
  time,
  total,
  status,
  onComplete,
}) {
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

  const initialWaitingTime = ((Date.now() - time) / 1000) | 0;

  const [seconds, setSeconds] = useState(initialWaitingTime);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmOperation, setConfirmOperation] = useState();

  const modalRef = useRef();
  const intervalRef = useRef();

  useEffect(() => {
    if (status !== "Completed" && status !== "Cancelled") {
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
    <div className="relative bg-white rounded-lg p-5 shadow-lg w-[200px]">
      <OrderModal
        ref={modalRef}
        operation={confirmOperation}
        onConfirm={() => {
          onComplete(
            id,
            confirmOperation === "cancel" ? "Cancelled" : "Completed"
          );
          setIsMenuOpen(false);
        }}
      />
      {isMenuOpen && (
        <div className="absolute border border-stone-200 top-3 right-9 w-30 px-1 py-2 shadow-xl bg-stone-100 flex flex-col">
          <button
            onClick={() => {
              handleOpenModal("complete");
              stopTimer();
            }}
            className="p-1 hover:bg-stone-200 text-sm font-bold"
          >
            Complete Order
          </button>
          <button
            onClick={() => handleOpenModal("cancel")}
            className="p-1 hover:bg-stone-200 text-sm font-bold"
          >
            Cancel Order
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
        <p className="font-bold text-xl text-center text-amber-700 p-5">
          Order {id.slice(id.length - 5, id.length)}
        </p>
        {status === "Completed" && <GreenLabel>Completed</GreenLabel>}
        {status === "Cancelled" && <RedLabel>Cancelled</RedLabel>}
        {status === "In Progress" && <OrangeLabel>In Progress</OrangeLabel>}
      </div>
      <hr className="p-2 border-dotted border-t-4 border-stone-800 " />
      <div className="flex flex-col justify-center items-center">
        <p className="font-bold">Ordered by</p>
        <p>{customer}</p>
        <p className="mt-2 font-bold">In this order</p>
        <p>One Fish</p>
        <p>Two Garri</p>
        <p className="font-bold">Total Order Price</p>
        <p>${total}</p>
        {status === "Ready" && (
          <>
            <p className="mt-2 font-bold">Time Since Order:</p>
            <p className="animate-pulse font-bold text-red-700 text-md">
              {((seconds / 3600) | 0) < 10
                ? `0${(seconds / 3600) | 0}h `
                : ` ${(seconds / 3600) | 0}h `}
              :
              {((seconds / 60) | 0) % 60 < 10
                ? ` 0${((seconds / 60) | 0) % 60}m `
                : ` ${((seconds / 60) | 0) % 60}m `}
              : {seconds % 60 < 10 ? `0${seconds % 60}s` : `${seconds % 60}s`}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
