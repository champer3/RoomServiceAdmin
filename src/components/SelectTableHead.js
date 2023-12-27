import { useState } from "react"
export default function SelectTableHead({ canOrder, heading }) {
    const [isClicked, setIsClicked] = useState(false)
    const [isTicked, setIsTicked] = useState(false)

    function handleClick() {
        setIsClicked((prevState) => {
            return !prevState
        })
    }
    function handleTick() {
        setIsTicked((prevState) => {
            return !prevState
        })
    }
    return (
        <div className="border-t-[1px] border-b-[1px] w-full flex py-[18px] items-center px-[22px] bg-[#F9F9FC]">
            <button onClick={handleTick}>
                {isTicked && <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="20" height="20" rx="6" fill="#BC6C25" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 10C3.75 9.53978 4.1231 9.16669 4.58333 9.16669H15.4167C15.8769 9.16669 16.25 9.53978 16.25 10C16.25 10.4603 15.8769 10.8334 15.4167 10.8334H4.58333C4.1231 10.8334 3.75 10.4603 3.75 10Z" fill="white" />
                </svg>
                }
                {!isTicked && <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="18" height="18" rx="5" fill="white" stroke="#858D9D" stroke-width="2" />
                </svg>}
            </button>

            <p className="text-[14px] font-bold leading-[20px] tracking-[0.005em] text-[#333333] pl-2">{heading}</p>
            {canOrder && <button onClick={handleClick} className="ml-auto">
                {isClicked && <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g transform="rotate(180 8 8)">
                        <path d="M4.27602 6H11.724C11.8559 6.00003 11.9847 6.03914 12.0943 6.1124C12.2039 6.18565 12.2894 6.28976 12.3398 6.41156C12.3903 6.53336 12.4035 6.66738 12.3777 6.79669C12.352 6.92599 12.2886 7.04476 12.1954 7.138L8.47135 10.862C8.34634 10.987 8.1768 11.0572 8.00002 11.0572C7.82325 11.0572 7.65371 10.987 7.52869 10.862L3.80469 7.138C3.71148 7.04476 3.64801 6.92599 3.6223 6.79669C3.59659 6.66738 3.60979 6.53336 3.66024 6.41156C3.71068 6.28976 3.79611 6.18565 3.90572 6.1124C4.01532 6.03914 4.14419 6.00003 4.27602 6Z" fill="#A3A9B6" />
                    </g>
                </svg>}
                {!isClicked && <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.27602 6H11.724C11.8559 6.00003 11.9847 6.03914 12.0943 6.1124C12.2039 6.18565 12.2894 6.28976 12.3398 6.41156C12.3903 6.53336 12.4035 6.66738 12.3777 6.79669C12.352 6.92599 12.2886 7.04476 12.1954 7.138L8.47135 10.862C8.34634 10.987 8.1768 11.0572 8.00002 11.0572C7.82325 11.0572 7.65371 10.987 7.52869 10.862L3.80469 7.138C3.71148 7.04476 3.64801 6.92599 3.6223 6.79669C3.59659 6.66738 3.60979 6.53336 3.66024 6.41156C3.71068 6.28976 3.79611 6.18565 3.90572 6.1124C4.01532 6.03914 4.14419 6.00003 4.27602 6Z" fill="#A3A9B6" />

                </svg>}
            </button>}

        </div>
    )
}