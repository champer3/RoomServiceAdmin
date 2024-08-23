import { forwardRef } from "react"


const Input = forwardRef(function Input({label, placeholder, text, onInputChange}, ref) {
   
    return (
        <>
            <label className="text-[#777980] font-bold text-[14px] leading-[20px] tracking-[0.005em]">{label}</label>
            <input ref={ref} defaultValue={text ? text : ''} placeholder={`${placeholder? placeholder + '. . .': ''}`} onChange={onInputChange} className="w-full h-full px-[12px] bg-[#F9F9FC] rounded-lg border-[1px] border-[#E0E2E7] focus:border-none focus:ring-stone-200 w-full h-full font-extrabold text-[14px] leading-[20px] tracking-[0.005em] text-[#858D9D] "/>
        </>
    )
}
)
export default Input