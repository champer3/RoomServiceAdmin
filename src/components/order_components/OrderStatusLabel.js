export default function OrderStatusLabels({status, description, time}){
    return (
    <div className="w-full pb-[18px]">
        <p className="font-bold text-[16px] leading-[24px] tracking-[0.005em] text-[#333333]">{status}</p>
        <p className="font-extrabold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">{description}</p>
        <p className="font-bold text-[12px] leading-[18px] tracking-[0.005em] text-[#858D9D]">{time}</p>
    </div>
    )
}