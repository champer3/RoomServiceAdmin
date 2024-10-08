export default function RedPercentLabel({children}){
    return(
        <div className="h-[22px]  inline-block text-[#EB3D4D] font-semibold text-[12px] leading-[18px] tracking-[0.005em] text-center py-[2px] px-[6px] bg-[#FEECEE] rounded-lg">
            {children > 0 ? '+' : ''}{children}%
        </div>
    )
}