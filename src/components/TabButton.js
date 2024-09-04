export default function TabButton({
  handleSelect,
  isSelected,
  children,
  disabled,
}) {
  return (
    <button
      onClick={handleSelect}
      disabled={disabled}
      className={`px-[12px] ${
        isSelected
          ? "text-[#ffffff] font-semibold"
          : "text-customGrey font-bold"
      } py-[6px] text-[14px]  leading-[20px] rounded-lg tracking-[0.005em]  bg-[${
        isSelected ? "#283618" : ""
      }]`}
    >
      {children}
    </button>
  );
}
