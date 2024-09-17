import React from "react";
import ReactDOM from "react-dom";
const Backdrop = ({ onClick }) => {
  const content = (
    <div
      onClick={onClick}
      className="fixed min-h-screen w-[100%]  opacity-10 z-50"
    ></div>
  );
  return ReactDOM.createPortal(
    content,
    document.getElementById("backdrop-hook")
  );
};
export default Backdrop;
