
export default function TextArea({label, placeholder}) {
    return (
        <>
            <label className="text-[#777980] font-bold text-[14px] leading-[20px] tracking-[0.005em]">{label}</label>
            <textarea placeholder={`${placeholder? placeholder + '. . .': ''}`} className="w-full h-full px-[12px] bg-[#F9F9FC] rounded-lg border-[1px] border-[#E0E2E7] outline-none  focus:border-[#F9F9FC] focus:ring-stone-200 w-full h-full font-extrabold text-[14px] leading-[20px] tracking-[0.005em] text-[#858D9D] "/>
        </>
    )

}