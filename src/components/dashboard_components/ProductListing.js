
export default function ProductListing({image, name, category, amount}){
    const formattedNumber = Math.round(amount)
    const finalNumber = formattedNumber.toLocaleString()
    return(
        <div className="flex items-center w-full h-auto">
            <img src={image} alt="" />
            <div className='pl-[8px] flex-col h-full'>
                <p className="text-[14px] font-bold leading-[20px] tracking-[0.005em] text-[#333333]">{name}</p>
                <p className='font-extrabold text-[12px] leading-[18px] tracking-[0.005em] text-customGrey'>{category}</p>
            </div>
            <p className="ml-auto text-[14px] font-bold leading-[20px] tracking-[0.005em] text-[#333333]">${finalNumber}</p>
        </div>
    )
}