export default function TableProductListing({ image, mainProduct, remProducts }) {
    return (
        <div className="flex border-b-[1px] items-center w-full h-[80px] bg-[#F9F9FC] py-[18px] px-[22px]">
            <img src={image} alt="" />
            <div className="pl-2 w-[106px] items-center ">
                <p className="text-[14px] font-bold leading-[20px] tracking-[0.005em] text-[#333333] text-container whitespace-nowrap truncate">{mainProduct}</p>
                <p className='font-extrabold text-[12px] leading-[18px] tracking-[0.005em] text-customGrey text-container whitespace-nowrap truncate'>{remProducts}</p>
            </div>
        </div>
    )
}