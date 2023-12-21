import { useState } from "react";
export default function Categories() {
    const [isClicked, setIsClicked] = useState(false)
    const handleClick = () => {
        setIsClicked(true)
    }

    return (
        <button onClick={handleClick} class={`${isClicked ? 'text-stone-100 bg-rs-green' : 'text-rs-green'} flex items-center space-x-2 justify-left hover:text-stone-100 hover:bg-rs-green w-[264px] h-[48] px-[24px] py-[12px] leading-[20px] font-semibold text-14px tracking-[0.005em]`}>
            <svg  class="w-[24px] h-[24px]" viewBox="0 0 19 20" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor"d="M4.425 7.475L8.15 1.4C8.25 1.23333 8.375 1.11233 8.525 1.037C8.675 0.961663 8.83333 0.92433 9 0.924997C9.16667 0.924997 9.325 0.962663 9.475 1.038C9.625 1.11333 9.75 1.234 9.85 1.4L13.575 7.475C13.675 7.64166 13.725 7.81666 13.725 8C13.725 8.18333 13.6833 8.35 13.6 8.5C13.5167 8.65 13.4 8.771 13.25 8.863C13.1 8.955 12.925 9.00066 12.725 9H5.275C5.075 9 4.9 8.95433 4.75 8.863C4.6 8.77166 4.48333 8.65066 4.4 8.5C4.31667 8.35 4.275 8.18333 4.275 8C4.275 7.81666 4.325 7.64166 4.425 7.475ZM14.5 20C13.25 20 12.1877 19.5627 11.313 18.688C10.4383 17.8133 10.0007 16.7507 10 15.5C10 14.25 10.4377 13.1877 11.313 12.313C12.1883 11.4383 13.2507 11.0007 14.5 11C15.75 11 16.8127 11.4377 17.688 12.313C18.5633 13.1883 19.0007 14.2507 19 15.5C19 16.75 18.5627 17.8127 17.688 18.688C16.8133 19.5633 15.7507 20.0007 14.5 20ZM0 18.5V12.5C0 12.2167 0.0960001 11.9793 0.288 11.788C0.48 11.5967 0.717333 11.5007 1 11.5H7C7.28333 11.5 7.521 11.596 7.713 11.788C7.905 11.98 8.00067 12.2173 8 12.5V18.5C8 18.7833 7.904 19.021 7.712 19.213C7.52 19.405 7.28267 19.5007 7 19.5H1C0.716667 19.5 0.479333 19.404 0.288 19.212C0.0966668 19.02 0.000666667 18.7827 0 18.5Z"/>
            </svg>

            <p>Categories</p>
        </button>


    )
}