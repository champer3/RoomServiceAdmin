export default function StyledDashboardButton({children}){
    return (
        <button className="flex py-[10px] items-center px-[14px] rounded-lg bg-[#F4ECFB] text-[#BC6C25] font-semibold text-[14px] leading-[20px] tracking-[0.005em] hover:bg-[#BC6C25] hover:text-stone-100">
            {children}
        </button>
    )
}