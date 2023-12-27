import { useState } from "react";

export default function Select({ label, placeholder, choices }) {
    const [isClicked, setIsClicked] = useState(false)
    const [selectedOption, setSelectedOption] = useState(placeholder)
    function handleClick() {
        setIsClicked((prevState) => !prevState)
    }
    function handleSelect(value){
        setSelectedOption(value)
        setIsClicked((prevState) => !prevState)
    }

    return (
        <>
            <label className="text-[#777980] font-bold text-[14px] leading-[20px] tracking-[0.005em]">{label}</label>
            <div className="flex items-center h-[40px] rounded-lg border-[1px] border-[#E0E2E7] w-full bg-[#F9F9FC] px-2">
                <p className="font-extrabold text-[14px] leading-[20px] tracking-[0.005em] text-[#858D9D] ">{selectedOption}</p>
                <button onClick={handleClick} className="ml-auto">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M4.27349 6H11.7268C11.8587 6.00055 11.9874 6.04019 12.0967 6.1139C12.206 6.18761 12.2911 6.29208 12.341 6.4141C12.391 6.53612 12.4036 6.67021 12.3773 6.79942C12.3511 6.92863 12.2871 7.04715 12.1935 7.14L8.47349 10.86C8.41152 10.9225 8.33778 10.9721 8.25654 11.0059C8.1753 11.0398 8.08817 11.0572 8.00016 11.0572C7.91215 11.0572 7.82501 11.0398 7.74377 11.0059C7.66253 10.9721 7.5888 10.9225 7.52682 10.86L3.80682 7.14C3.71321 7.04715 3.64923 6.92863 3.62297 6.79942C3.59672 6.67021 3.60936 6.53612 3.65931 6.4141C3.70926 6.29208 3.79427 6.18761 3.9036 6.1139C4.01292 6.04019 4.14164 6.00055 4.27349 6Z" fill="#858D9D" />

                    </svg>
                </button>
            </div>
            {isClicked && <div className="items-center rounded-lg border-[1px] border-[#E0E2E7] w-full h-full bg-[#F9F9FC] p-[2px]">
            <button  onClick={() => handleSelect(placeholder)} className="w-full rounded- p-[2px] hover:text-white hover:bg-[#858D9D] font-extrabold text-[14px] leading-[20px] tracking-[0.005em] text-[#858D9D] text-left">{placeholder}</button>
                {choices.map((choice) => <button  onClick={() => handleSelect(choice)} className="w-full rounded- p-[2px] hover:text-white hover:bg-[#858D9D] font-extrabold text-[14px] leading-[20px] tracking-[0.005em] text-[#858D9D] text-left">{choice}</button>)}
            </div>}
        </>
    );
}