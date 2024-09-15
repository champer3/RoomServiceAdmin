export default function YellowLabel({children}){
    return(
        <div className="h-[28px] inline-block text-yellow-600 font-semibold text-[14px] leading-[20px] tracking-[0.005em] text-center py-[4px] px-[10px] bg-yellow-200 rounded-lg">
            {children}
        </div>
    )
}