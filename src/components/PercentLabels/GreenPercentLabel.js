export default function GreenPercentLabel({children}){
    return(
        <span className="h-[22px]  in-line-block text-[#1A9882] font-semibold text-[12px] leading-[18px] tracking-[0.005em] text-center py-[2px] px-[6px] bg-[#E9FAF7] rounded-lg">
            {children > 0 ? '+' : children < 0 ? '-': ''}{children}%
        </span>
    )
}