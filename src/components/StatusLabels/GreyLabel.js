export default function GreyLabel({children}){
    return(
        <span className="h-[28px]  in-line-block text-[#4A4C56] font-semibold text-[14px] leading-[20px] tracking-[0.005em] text-center py-[4px] px-[10px] bg-[#F0F1F3] rounded-lg">
            {children}
        </span>
    )
}