import { useState, useEffect, useRef } from "react";
import Backdrop from "../Backdrop";
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
  instructions,
  total,
  count,
  status,
  index,
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
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => {
      return new window.bootstrap.Popover(popoverTriggerEl);
    });
  }, []);
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
  let color = "#ffc107";
  if (seconds > 800){
    color = '#A52A2A'
  }else if (seconds > 600){
    color = '#BC6C25'
  }
  return (
    <div className="relative">
      {isMenuOpen && (
        <>
          <Backdrop onClick={() => setIsMenuOpen(false)} />
          <div className="absolute animate-none border border-stone-200 -top-3 -right-9 w-30 px-1 py-2 shadow-xl bg-stone-100 flex flex-col z-50">
            <button
              onClick={() => {
                onComplete(id, "Ready for Delivery");
                stopTimer();
              }}
              className="p-1 hover:bg-stone-200 text-sm font-bold"
            >
              Complete Order
            </button>
            <button
              onClick={() => {
                onComplete(id, "Cancelled");
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
        </>
      )}
      <div   onDoubleClick={() => {
          onComplete(id, "Ready for Delivery");
          stopTimer();
        }} className="w-[200px]"><div className={`card  shadow-sm ${
          status === "Ordered" ? "" : "bg-yellow-100"
        } `}>
  <div class={`card-header `} style={count % 2 == 0 ? {backgroundColor:  '#ffc107' } : {backgroundColor: color, color: color == '#ffc107' ? 'black' : 'white'  }}>
    <div className="justify-between flex">
    <p className="text-sm">
            #{index}
          </p>
          {status === "Ordered"  && (
            <div className="flex justify-between gap-1">
              <p className="text-sm">
                {Math.floor(seconds / 3600) < 10?`0${Math.floor(seconds / 3600)}`:Math.floor(seconds / 3600)}:{""}{Math.floor((seconds % 3600) / 60) < 10?`0${Math.floor((seconds % 3600) / 60)}`:Math.floor((seconds % 3600) / 60)}:{seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
              </p>
             
            </div>
            
          )} <button
          onClick={() => {
            setIsMenuOpen((prevState) => !prevState);
          }}
          className={`${
            status === "Completed" || status === "Cancelled" ? "hidden" : ""
          }  right-5 flex flex-col justify-between h-4`}
        >
          <span className="block w-1 bg-dark h-1 rounded-full" />
          <span className="block w-1 bg-dark h-1 rounded-full" />
          <span className="block w-1 bg-dark h-1 rounded-full" />
        </button>
          </div>
    <div className="justify-between flex">
    <p className="text-sm font-bold">{customer}</p>
          {instructions.length > 0 &&  <button type="button" class="bg-white rounded-lg p-[3px]" data-bs-toggle="popover" data-bs-title="Instructions" data-bs-content={instructions}><svg width={'14px'} height={'14px'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#0dcaf0" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0-24 0 0-48 24 0 48 0 24 0 0 24 0 88 8 0 24 0 0 48-24 0-80 0-24 0 0-48 24 0zm72-144l-64 0 0-64 64 0 0 64z"/></svg></button>}
    </div>
  </div>
  {orderDetails.map((order, index) => <div key={index} class="card-body m-0 p-[3px]">
              <div  className="flex justify-between items-center">
                <div className="w-[8%] flex items-center">{status === "Ready for Delivery" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#507615" class="fa-secondary" d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zm126.1 0L160 222.1c.3 .3 .6 .6 1 1c5.3 5.3 10.7 10.7 16 16c15.7 15.7 31.4 31.4 47 47c37-37 74-74 111-111c5.3-5.3 10.7-10.7 16-16c.3-.3 .6-.6 1-1L385.9 192c-.3 .3-.6 .6-1 1l-16 16L241 337l-17 17-17-17-64-64c-5.3-5.3-10.7-10.7-16-16l-1-1z"/><path fill="#5c9a2c" opacity=".4" class="fa-primary" d="M385 193L241 337l-17 17-17-17-80-80L161 223l63 63L351 159 385 193z"/></svg>}</div>
                <div><p className="text-sm ">{order?.dressing?.length}</p></div>
                <div className="w-[75%]"><p className="text-sm ">
                {order.productName} {order.component ?'('+order.component+')': ''}
              </p>
              </div>
              </div>
              {order?.flavor?.map((product) => <div  className="flex justify-between items-center px-3">
                <div></div>
                <div className="w-[75%]">{JSON.parse(product).values.length > 0 && <p className="text-[10px] text-secondary italic">{JSON.parse(product).name} : {JSON.parse(product).values.map(val=>val.name).join(', ')}</p>}
              </div>
              </div>)}
              {order?.sides?.map((product) => <div  className="flex justify-between items-center">
                <div className="w-[8%] flex items-center">{status === "Ready for Delivery" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#507615" class="fa-secondary" d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zm126.1 0L160 222.1c.3 .3 .6 .6 1 1c5.3 5.3 10.7 10.7 16 16c15.7 15.7 31.4 31.4 47 47c37-37 74-74 111-111c5.3-5.3 10.7-10.7 16-16c.3-.3 .6-.6 1-1L385.9 192c-.3 .3-.6 .6-1 1l-16 16L241 337l-17 17-17-17-64-64c-5.3-5.3-10.7-10.7-16-16l-1-1z"/><path fill="#5c9a2c" opacity=".4" class="fa-primary" d="M385 193L241 337l-17 17-17-17-80-80L161 223l63 63L351 159 385 193z"/></svg>}</div>
                <div></div>
                <div className="w-[75%]"><p className="text-[12px] text-secondary italic">
                {JSON.parse(product).name}
              </p></div>
              </div>)}
  </div> )}
</div></div>
      
    </div>
  );
}
