export default function TableCustomerListing({name, email}){
    return (
        <div className="flex  items-center w-full h-[80px]  py-[18px] px-[22px]">
            <div className="pl-2 w-full items-center">
                <p className="text-[14px] font-bold leading-[20px] tracking-[0.005em] text-[#333333] text-container whitespace-nowrap truncate">{name}</p>
                <p className='font-extrabold text-[12px] leading-[18px] tracking-[0.005em] text-customGrey text-container whitespace-nowrap truncate'>{email}</p>
            </div>
        </div>
    )
}