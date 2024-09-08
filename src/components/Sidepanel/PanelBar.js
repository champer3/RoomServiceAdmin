export default function PanelBar({ title, active, icon }) {
  return (
    <button
      className={`${
        active ? "text-stone-100 bg-rs-green" : "text-rs-green"
      } flex items-center space-x-2 justify-left hover:text-stone-100 hover:bg-rs-green w-[264px] h-[48] px-[24px] py-[12px] leading-[20px] font-semibold text-14px tracking-[0.005em]`}
    >
      {icon}

      <p>{title}</p>
    </button>
  );
}
