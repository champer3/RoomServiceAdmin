
export default function StateListing({ img, state, customerTotal }) {
    const finalNumber = customerTotal.toLocaleString()
    return (
        <div className='flex w-full'>
            <div className="h-[40px] w-[40px] overflow-hidden rounded-full">
                <img className="w-full h-full object-cover" src={img} alt="" />
            </div>
            <div className="pl-2 items-center ">
                <p className="text-[14px] font-bold leading-[20px] tracking-[0.005em] text-[#333333] text-container whitespace-nowrap truncate">{state}</p>
                <p className='font-extrabold text-[12px] leading-[18px] tracking-[0.005em] text-customGrey text-container whitespace-nowrap truncate'>{finalNumber} customers</p>
            </div>

        </div>
    )
}