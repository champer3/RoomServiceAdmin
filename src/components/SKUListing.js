export default function SKUListing({children}){
    return(
        <div className="flex justify-center items-center px[22px] py-[18px] border-b-[1px] bg-[#F9F9FC] h-[80px]">
            <p className="font-semibold text-[14px] text-[#BC6C25] leading-[20px] tracking[0.005em]">{children}</p>
          </div>
    )
}