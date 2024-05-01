
export default function GreenPercentLabel({children}){
    return(
        <div className="h-auto  inline-block text-[#1A9882] font-semibold text-[12px] leading-[18px] tracking-[0.005em] text-center py-[2px] px-[4px] bg-[#E9FAF7] rounded-lg">
            {children > 0 ? '+' : children < 0 ? '-': ''}{children}%
        </div>
    )
}