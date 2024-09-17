export default function TabButton({
  handleSelect,
  isSelected,
  children,
  disabled,
}) {
  let bg;
  if (children === "Preparing") bg = "bg-yellow-500";
  else if (children === "Out for Delivery") bg = "bg-blue-500";
  else if (children === "Ordered") bg = "bg-orange-500";
  else if (children === "Delivered") bg = "bg-green-600";
  else if (children === "Cancelled") bg = "bg-red-500";
  else bg = "bg-rs-green";
  return (
    <button
      onClick={handleSelect}
      disabled={disabled}
      className={`${
        isSelected
          ? "text-[#ffffff] font-bold"
          : "text-customGrey font-bold"
      } py-[6px] px-[12px] text-[14px]  leading-[20px] rounded-lg tracking-[0.005em]
        ${isSelected ? bg : ""}`}
    >
      {children}
    </button>
  );
}
