import { useState } from "react"
export default function TabButton({children}){
    const [isClicked, setIsClicked] = useState(false)
    function handleClick() {
        setIsClicked((prevState) => {
            return !prevState
        })
    }
    return (
        <button onClick={handleClick} className={`px-[12px] ${isClicked ? 'text-[#ffffff] font-semibold' : 'text-customGrey font-bold'} py-[6px] text-[14px]  leading-[20px] rounded-lg tracking-[0.005em]  bg-[${isClicked? '#283618': ''}]`}>
            {children}
        </button>
    )
}