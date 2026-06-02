import { forwardRef } from "react"


const Input = forwardRef(function Input(
  { label, placeholder, text, onInputChange, onBlur, type = "text", inputMode, hint, required },
  ref
) {
   
    return (
        <div className="w-full">
            <label className="block text-[14px] font-semibold text-[#374151] tracking-[0.005em] mb-1.5">
              {label}
              {required ? <span className="ml-1 text-[#DC2626]">*</span> : null}
            </label>
            <input
              ref={ref}
              value={text ?? ""}
              type={type}
              inputMode={inputMode}
              placeholder={placeholder ? `${placeholder}...` : ""}
              onChange={onInputChange}
              onBlur={onBlur}
              className="w-full px-3 py-2.5 bg-[#F9F9FC] rounded-lg border border-[#E5E7EB] text-[14px] leading-[20px] text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#283618]/20 focus:border-[#283618]"
            />
            {hint ? <p className="mt-1 text-[11px] text-[#6B7280]">{hint}</p> : null}
        </div>
    )
}
)
export default Input