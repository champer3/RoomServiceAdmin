export default function StyledDashboardButton({isActive,children, handleClick, isDisabled}){
    return (
        <button disabled={isDisabled} onClick={()=>handleClick()} className={`flex py-[10px] items-center px-[14px] rounded-lg ${!isActive ? 'bg-[#F4ECFB] text-[#BC6C25]':'text-stone-100 bg-[#BC6C25]'} font-semibold text-[14px] leading-[20px] tracking-[0.005em] hover:bg-[#BC6C25] hover:text-stone-100 disabled:bg-stone-200 disabled:text-white`}>
            {children}
        </button>
    )
}