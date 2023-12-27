export default function CustomerDetail({label, value}) {
    return (
        <div>
            <p className="mb-1 font-bold text-[14px] leading-[20px] tracking-[0.005em] text-customGrey">{label}</p>
            <p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">{value}</p>
        </div>
    )
}