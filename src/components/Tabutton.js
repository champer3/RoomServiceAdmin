export default function Tabutton({handleSelect, isSelected, children}){
    const className="h-[28px] inline-block text-[#EB3D4D] font-semibold text-[14px] leading-[20px] tracking-[0.005em] text-center py-[4px] px-[10px] bg-[#FEECEE] rounded-lg"
    return (
        <button onClick={handleSelect} className={`px-[12px] ${isSelected ? 'text-[#EB3D4D] font-semibold' : 'text-customGrey font-bold'} py-[6px] text-[14px]  leading-[20px] rounded-lg tracking-[0.005em]  bg-[${isSelected? '#FEECEE': ''}]`}>
            {children}
        </button>
    )
}