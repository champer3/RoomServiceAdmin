import { useState } from "react";
export default function Customers() {
    const [isClicked, setIsClicked] = useState(false)
    const handleClick = () => {
        setIsClicked(true)
    }

    return (
        <button onClick={handleClick} class={`${isClicked ? 'text-stone-100 bg-rs-green' : 'text-rs-green'} flex items-center space-x-2 justify-left hover:text-stone-100 hover:bg-rs-green w-[264px] h-[48] px-[24px] py-[12px] leading-[20px] font-semibold text-14px tracking-[0.005em]`}>
            <svg class="w-[24px] h-[24px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12C9.06087 12 10.0783 11.5786 10.8284 10.8284C11.5786 10.0783 12 9.06087 12 8C12 6.93913 11.5786 5.92172 10.8284 5.17157C10.0783 4.42143 9.06087 4 8 4C6.93913 4 5.92172 4.42143 5.17157 5.17157C4.42143 5.92172 4 6.93913 4 8C4 9.06087 4.42143 10.0783 5.17157 10.8284C5.92172 11.5786 6.93913 12 8 12ZM17 12C17.7956 12 18.5587 11.6839 19.1213 11.1213C19.6839 10.5587 20 9.79565 20 9C20 8.20435 19.6839 7.44129 19.1213 6.87868C18.5587 6.31607 17.7956 6 17 6C16.2044 6 15.4413 6.31607 14.8787 6.87868C14.3161 7.44129 14 8.20435 14 9C14 9.79565 14.3161 10.5587 14.8787 11.1213C15.4413 11.6839 16.2044 12 17 12ZM4.5 14C3.12 14 2 15.12 2 16.5C2 16.5 2 21 8 21C12.756 21 13.742 18.172 13.946 17C14 16.694 14 16.5 14 16.5C14 15.12 12.88 14 11.5 14H4.5ZM15.992 17.2C15.969 17.5626 15.9087 17.9218 15.812 18.272C15.686 18.718 15.478 19.252 15.128 19.802C15.7417 19.9395 16.3691 20.0059 16.998 20C21.998 20 21.998 16.5 21.998 16.5C21.998 15.12 20.878 14 19.498 14H15.24C15.72 14.716 15.998 15.574 15.998 16.5V17L15.992 17.2Z" fill="currentColor" />
            </svg>


            <p>Customers</p>
        </button>


    )
}