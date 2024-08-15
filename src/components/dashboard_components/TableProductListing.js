export default function TableProductListing({ image, mainProduct, remProducts }) {
    return (
        <div className="flex items-center h-[80px] py-[18px] px-[22px]">
            <img src={image} alt="" />
            <div className="pl-2 w-[106px] items-center ">
                <p className="text-[14px] font-bold leading-[20px] tracking-[0.005em] text-[#333333] text-container whitespace-nowrap truncate">{mainProduct}</p>
                <p className='font-extrabold text-[12px] leading-[18px] tracking-[0.005em] text-customGrey text-container whitespace-nowrap truncate'>{remProducts}</p>
            </div>
        </div>
    )
}