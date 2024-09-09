export default function TabButton({
  handleSelect,
  isSelected,
  children,
  disabled,
}) {
  let bg;
  if (children === "In Progress" || children === "Ready") bg = "bg-orange-500";
  else if (children === "Completed") bg = "bg-green-800";
  else if (children === "Cancelled") bg = "bg-red-500";
  else bg = "bg-rs-green";
  return (
    <button
      onClick={handleSelect}
      disabled={disabled}
      className={`px-[12px] ${
        isSelected
          ? "text-[#ffffff] font-semibold"
          : "text-customGrey font-bold"
      } py-[6px] text-[14px]  leading-[20px] rounded-lg tracking-[0.005em]
        ${isSelected ? bg : ""}`}
    >
      {children}
    </button>
  );
}
