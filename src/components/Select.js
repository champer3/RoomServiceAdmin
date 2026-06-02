import { useState } from "react";

function isChoiceObject(c) {
  return c != null && typeof c === "object" && ("value" in c || "label" in c);
}

export default function Select({ label, placeholder, choices, value, handleOptionSelected, required }) {
  const [isClicked, setIsClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState(placeholder);

  const options = (choices || []).map((c) =>
    isChoiceObject(c) ? { value: c.value, label: c.label ?? c.value } : { value: c, label: c }
  );
  const isControlled = value !== undefined && value !== null;
  const displayText = isControlled
    ? (value === "" ? placeholder : options.find((o) => String(o.value) === String(value))?.label ?? placeholder)
    : selectedOption;

  function handleClick() {
    setIsClicked((prev) => !prev);
  }

  function handleSelect(selectedValue) {
    if (!isControlled) setSelectedOption(selectedValue);
    setIsClicked(false);
    if (handleOptionSelected) handleOptionSelected(selectedValue);
  }

  return (
    <div className="w-full">
      <label className="text-[#777980] font-bold text-[14px] leading-[20px] tracking-[0.005em]">
        {label}
        {required ? <span className="ml-1 text-[#DC2626]">*</span> : null}
      </label>
      <div className="flex items-center h-[40px] rounded-lg border-[1px] border-[#E0E2E7] w-full bg-[#F9F9FC] px-2">
        <p className="font-extrabold text-[14px] leading-[20px] tracking-[0.005em] text-[#858D9D]">{displayText}</p>
        <button type="button" onClick={handleClick} className="ml-auto">
          {isClicked ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g transform="rotate(180 8 8)">
                <path d="M4.27602 6H11.724C11.8559 6.00003 11.9847 6.03914 12.0943 6.1124C12.2039 6.18565 12.2894 6.28976 12.3398 6.41156C12.3903 6.53336 12.4035 6.66738 12.3777 6.79669C12.352 6.92599 12.2886 7.04476 12.1954 7.138L8.47135 10.862C8.34634 10.987 8.1768 11.0572 8.00002 11.0572C7.82325 11.0572 7.65371 10.987 7.52869 10.862L3.80469 7.138C3.71148 7.04476 3.64801 6.92599 3.6223 6.79669C3.59659 6.66738 3.60979 6.53336 3.66024 6.41156C3.71068 6.28976 3.79611 6.18565 3.90572 6.1124C4.01532 6.03914 4.14419 6.00003 4.27602 6Z" fill="#A3A9B6" />
              </g>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.27349 6H11.7268C11.8587 6.00055 11.9874 6.04019 12.0967 6.1139C12.206 6.18761 12.2911 6.29208 12.341 6.4141C12.391 6.53612 12.4036 6.67021 12.3773 6.79942C12.3511 6.92863 12.2871 7.04715 12.1935 7.14L8.47349 10.86C8.41152 10.9225 8.33778 10.9721 8.25654 11.0059C8.1753 11.0398 8.08817 11.0572 8.00016 11.0572C7.91215 11.0572 7.82501 11.0398 7.74377 11.0059C7.66253 10.9721 7.5888 10.9225 7.52682 10.86L3.80682 7.14C3.71321 7.04715 3.64923 6.92863 3.62297 6.79942C3.59672 6.67021 3.60936 6.53612 3.65931 6.4141C3.70926 6.29208 3.79427 6.18761 3.9036 6.1139C4.01292 6.04019 4.14164 6.00055 4.27349 6Z" fill="#858D9D" />
            </svg>
          )}
        </button>
      </div>
      {options.length > 0 && isClicked && (
        <div className="rounded-lg border-[1px] border-[#E0E2E7] w-full bg-[#F9F9FC] p-[2px]">
          <button
            type="button"
            onClick={() => handleSelect(isControlled ? "" : placeholder)}
            className="w-full rounded p-[2px] hover:bg-[#858D9D] hover:text-white font-extrabold text-[14px] leading-[20px] tracking-[0.005em] text-[#858D9D] text-left"
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="w-full rounded p-[2px] hover:bg-[#858D9D] hover:text-white font-extrabold text-[14px] leading-[20px] tracking-[0.005em] text-[#858D9D] text-left"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}