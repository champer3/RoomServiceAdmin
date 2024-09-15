import React, {
  useState,
  // useEffect,
  // useRef
} from "react";
import axios from "axios";

const OrderStatus = ({ status, id }) => {
  const [selectedChoice, setSelectedChoice] = useState();
  //   const [selectedStatus, setSelectedStatus] = useState(order);
  //   const [isOpen, setIsOpen] = useState(false);
  //   const dropdownRef = useRef(null);
  //   const [selectedOption, setSelectedOption] = useState(order);
  // console.log(selectedChoice)
  //   const statusOptions = [
  //     { label: "Processing", value: "Processing", color: "bg-[#FFF0EA]" },
  //     { label: "Delivered", value: "Delivered", color: "bg-[#039F0330]" },
  //     { label: "Ready", value: "Ready", color: "bg-yellow-200" },
  //     { label: "Canceled", value: "Canceled", color: "bg-[#FEECEE]" },
  //     { label: "Shipped", value: "Shipped", color: "bg-[#EAF8FF]" },
  //   ];

  const statusOptions = [
    { label: "Processing", value: "Processing", color: "bg-orange-400" },
    { label: "Preparing", value: "Preparing", color: "bg-orange-400" },
    { label: "Ordered", value: "Ordered", color: "bg-yellow-400" },
    { label: "Out for Delivery", value: "Out for Delivery", color: "bg-blue-400" },
    { label: "Delivered", value: "Delivered", color: "bg-green-200" },
    { label: "Ready", value: "Ready", color: "bg-yellow-200" },
    { label: "Canceled", value: "Canceled", color: "bg-red-200" },
    { label: "Shipped", value: "Shipped", color: "bg-blue-200" },
  ];

  const updateOrder = async (orderStatus) => {
    const authToken = localStorage.getItem("token");
    const postData = {
      orderStatus,
    };
    try {
      await axios.patch(
        `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/orders/deliver/${id}`,
        JSON.stringify(postData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  //   const handleSelect = (option) => {
  //     console.log(option.value);
  //     setSelectedStatus(option.value);
  //     setIsOpen(false);
  //     updateOrder(option.value);
  //   };

  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsOpen(false);
  //     }
  //   };

  //   useEffect(() => {
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => document.removeEventListener("mousedown", handleClickOutside);
  //   }, []);

  //   const renderLabel = () => {
  //     const selectedOption = statusOptions.find(
  //       (option) => option.value === selectedStatus
  //     );
  //     const labelClass = `inline-block mt-2 text-sm font-bold px-2 py-1 rounded text-white ${selectedOption?.color}`;
  //     return <span className={labelClass}>{selectedStatus}</span>;
  //   };

  const handleSelectChange = (event) => {
    setSelectedChoice(event.target.value);
    updateOrder(event.target.value);
  };
  //   ref={dropdownRef}
  return (
    <td className="p-2 relative w-80">
      <select
        value={selectedChoice || status}
        onChange={handleSelectChange}
        className={`block w-full px-4 py-2 pr-8 text-stone-900 font-bold ${
          selectedChoice
            ? statusOptions.find((option) => option.value === selectedChoice)
                .color
            : statusOptions.find((option) => option.value === status).color
        } border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-0 focus:border-0`}
      >
        {statusOptions.map((option, index) => (
          <option
            key={index}
            value={option.value}
            className={`${option.color}`}
          >
            {option.label}
          </option>
        ))}
      </select>
      {/* <div className="inline-block"> */}
      {/* <button */}
      {/* className={`w-full max-w-xs p-2 border-0 border-gray-300 rounded-md text-gray-900 focus:outline-none ${selectedOption?.color} flex items-center justify-between`} */}
      {/* onClick={() => setIsOpen(!isOpen)} */}
      {/* > */}
      {/* {selectedStatus} */}
      {/* <i className="fas fa-chevron-down ml-2"></i> Font Awesome icon */}
      {/* </button> */}
      {/* {isOpen && ( */}
      {/* <ul className="absolute z-10 mt-2 w-full max-w-xs bg-white border border-gray-300 rounded-md shadow-lg"> */}
      {/* {statusOptions.map((option) => ( */}
      {/* <li */}
      {/* key={option.value} */}
      {/* className={`p-2 cursor-pointer hover:bg-gray-100 ${option.color} text-gray-900`} */}
      {/* onClick={() => handleSelect(option)} */}
      {/* > */}
      {/* {option.label} */}
      {/* </li> */}
      {/* ))} */}
      {/* </ul> */}
      {/* )} */}
      {/* </div> */}
    </td>
  );
};

export default OrderStatus;
