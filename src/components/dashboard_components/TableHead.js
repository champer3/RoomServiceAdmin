import { useState } from "react"
export default function TableHead({ canOrder, heading, ascend, descend, active }) {
    const [arrowDirection, setArrowDirection] = useState('down')

    function handleAscend() {
        setArrowDirection('up')
        ascend()
    }

    function handleDescend() {
        setArrowDirection('down')
        descend()
    }
    return (
        <div className=" w-full flex py-[18px] items-center">
            {canOrder && <p className="text-[14px] font-bold leading-[20px] mr-auto tracking-[0.005em] text-[#333333]">{heading}</p>}
            {!canOrder && <p className="text-[14px] font-bold leading-[20px] tracking-[0.005em] text-[#333333]">{heading}</p>}
            {((canOrder && (arrowDirection === 'down')) || (canOrder && !active)) &&
                // this button is arrow down
                <button onClick={handleAscend}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.27602 6H11.724C11.8559 6.00003 11.9847 6.03914 12.0943 6.1124C12.2039 6.18565 12.2894 6.28976 12.3398 6.41156C12.3903 6.53336 12.4035 6.66738 12.3777 6.79669C12.352 6.92599 12.2886 7.04476 12.1954 7.138L8.47135 10.862C8.34634 10.987 8.1768 11.0572 8.00002 11.0572C7.82325 11.0572 7.65371 10.987 7.52869 10.862L3.80469 7.138C3.71148 7.04476 3.64801 6.92599 3.6223 6.79669C3.59659 6.66738 3.60979 6.53336 3.66024 6.41156C3.71068 6.28976 3.79611 6.18565 3.90572 6.1124C4.01532 6.03914 4.14419 6.00003 4.27602 6Z" fill="#A3A9B6" />

                    </svg>
                </button>
            }
            {canOrder && arrowDirection === 'up' && active &&
                <button onClick={handleDescend} className="ml-auto">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g transform="rotate(180 8 8)">
                            <path d="M4.27602 6H11.724C11.8559 6.00003 11.9847 6.03914 12.0943 6.1124C12.2039 6.18565 12.2894 6.28976 12.3398 6.41156C12.3903 6.53336 12.4035 6.66738 12.3777 6.79669C12.352 6.92599 12.2886 7.04476 12.1954 7.138L8.47135 10.862C8.34634 10.987 8.1768 11.0572 8.00002 11.0572C7.82325 11.0572 7.65371 10.987 7.52869 10.862L3.80469 7.138C3.71148 7.04476 3.64801 6.92599 3.6223 6.79669C3.59659 6.66738 3.60979 6.53336 3.66024 6.41156C3.71068 6.28976 3.79611 6.18565 3.90572 6.1124C4.01532 6.03914 4.14419 6.00003 4.27602 6Z" fill="#A3A9B6" />
                        </g>
                    </svg>

                </button>
            }




        </div>
    )
}