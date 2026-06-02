import { forwardRef } from "react"


// const Input = forwardRef(function Input({label, placeholder, text}, ref) {
const TextArea = forwardRef(function TextArea({label, placeholder, text, onInputChange}, ref) {
    return (
        <div className="w-full">
            <label className="block text-[14px] font-semibold text-[#374151] tracking-[0.005em] mb-1.5">{label}</label>
            <textarea ref={ref} defaultValue={text ? text : ''} placeholder={placeholder ? `${placeholder}...` : ''} onChange={onInputChange} className="w-full min-h-[88px] px-3 py-2.5 bg-[#F9F9FC] rounded-lg border border-[#E5E7EB] text-[14px] leading-[20px] text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#283618]/20 focus:border-[#283618] resize-y" />
        </div>
    )

}
)
export default TextArea