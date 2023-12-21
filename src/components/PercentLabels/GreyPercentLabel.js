export default function GreyPercentLabel({children}){
    return(
        <span className="h-[22px]  in-line-block text-[#4A4C56] font-semibold text-[12px] leading-[18px] tracking-[0.005em] text-center py-[2px] px-[6px] bg-[#F0F1F3] rounded-lg">
            {children > 0 ? '+' : ''}{children}%
        </span>
    )
}