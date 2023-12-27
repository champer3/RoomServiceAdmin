import { useState } from "react"
export default function SelectProductListing({ image, name}) {
    const [isTicked, setIsTicked] = useState(false)

    function handleTick() {
        setIsTicked((prevState) => {
            return !prevState
        })
    }
    return (
        <div className={`flex border-b-[1px] space-x-2 items-center w-full h-[80px] bg-[${isTicked ? '#F0F1F3' : '#F9F9FC'}] py-[18px] px-[22px]`}>
            <button onClick={handleTick}>
                {isTicked && <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="20" height="20" rx="6" fill="#BC6C25" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.947 4.77386C16.302 5.06675 16.3523 5.59197 16.0594 5.94699L8.91034 14.6126C8.76045 14.7943 8.48987 14.8157 8.31326 14.6598L4.44862 11.2499C4.10351 10.9454 4.0706 10.4188 4.3751 10.0737C4.67961 9.72855 5.20622 9.69563 5.55132 10.0001L8.44704 12.5552L14.7738 4.88635C15.0667 4.53134 15.5919 4.48097 15.947 4.77386Z" fill="white" />
                </svg>

                }
                {!isTicked && <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="18" height="18" rx="5" fill="white" stroke="#858D9D" stroke-width="2" />
                </svg>}
            </button>
            <img src={image} alt="" />
            <div className="pl-2 w-full items-center ">
                <p className="text-[14px] font-bold leading-[20px] tracking-[0.005em] text-[#333333] text-container line-clamp-2">{name}</p>
            </div>
        </div>
    )
}