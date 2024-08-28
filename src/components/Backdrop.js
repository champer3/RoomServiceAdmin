import React from "react";
import ReactDOM from "react-dom";
const Backdrop = ({ onClick }) => {
  const content = (
    <div
      onClick={onClick}
      className="fixed min-h-screen w-[100%] bg-[#000000] opacity-10"
    ></div>
  );
  return ReactDOM.createPortal(
    content,
    document.getElementById("backdrop-hook")
  );
};
export default Backdrop;
