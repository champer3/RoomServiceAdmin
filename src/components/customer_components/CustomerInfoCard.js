import { useState } from "react";
import GreenLabel from "../StatusLabels/GreenLabel";
import RedLabel from "../StatusLabels/RedLabel";

export default function CustomerInfoCard({ name, status, labelColor, leftData, leftDetail, rightData, rightDetail, isRightMoney }) {
    const [isClicked, setIsClicked] = useState(false)
    function handleClick() {
        setIsClicked((prevState) => !prevState)
    }
    return (
        <div className={`w-full rounded-lg ${isClicked ? 'border border-[#283618]' : ''} bg-white`}>
            <div className="w-full items-center p-2">
                <div className="flex items-center border-dotted p-2">
                    <button onClick={handleClick}>
                        {isClicked ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="20" height="20" rx="6" fill="#283618" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.947 4.77404C16.302 5.06693 16.3524 5.59216 16.0595 5.94717L8.91037 14.6128C8.76048 14.7944 8.4899 14.8159 8.31329 14.66L4.44865 11.2501C4.10355 10.9455 4.07063 10.4189 4.37514 10.0738C4.67964 9.72873 5.20625 9.69582 5.55135 10.0003L8.44707 12.5554L14.7739 4.88653C15.0667 4.53152 15.592 4.48115 15.947 4.77404Z" fill="white" />
                        </svg> : <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1.39999" y="1" width="18" height="18" rx="5" fill="white" stroke="#858D9D" stroke-width="2" />
                        </svg>
                        }

                    </button>
                    <p className="font-semibold ml-auto mr-auto text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">{name}</p>
                    <button className="ml-auto">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 2.66669C8.73639 2.66669 9.33335 2.06973 9.33335 1.33334C9.33335 0.596958 8.73639 0 8 0C7.26361 0 6.66665 0.596958 6.66665 1.33334C6.66665 2.06973 7.26361 2.66669 8 2.66669Z" fill="#858D9D" />
                            <path d="M8 9.3332C8.73639 9.3332 9.33335 8.73624 9.33335 7.99985C9.33335 7.26346 8.73639 6.6665 8 6.6665C7.26361 6.6665 6.66665 7.26346 6.66665 7.99985C6.66665 8.73624 7.26361 9.3332 8 9.3332Z" fill="#858D9D" />
                            <path d="M8 16.0002C8.73639 16.0002 9.33335 15.4032 9.33335 14.6669C9.33335 13.9305 8.73639 13.3335 8 13.3335C7.26361 13.3335 6.66665 13.9305 6.66665 14.6669C6.66665 15.4032 7.26361 16.0002 8 16.0002Z" fill="#858D9D" />
                        </svg>
                    </button>
                </div>
                <div className="flex justify-center">
                    {labelColor && labelColor.toLowerCase() === 'green' && <GreenLabel>{status}</GreenLabel>}
                    {labelColor && labelColor.toLowerCase() === 'red' && <RedLabel>{status}</RedLabel>}
                </div>
                <svg className="mt-3 ml-auto mr-auto" width="175" height="2" viewBox="0 0 175 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 1H174.4" stroke="#C2C6CE" stroke-dasharray="2 5" />
                </svg>
            </div>
            <div className="flex pb-3 justify-center space-x-6">
                <div>
                    <p className="mb-1 font-bold text-[12px] leading-[18px] tracking-[0.005em] text-customGrey text-center">{leftDetail}</p>
                    <p className="font-bold text-[16px] leading-[20px] tracking-[0.005em] text-[#333333] text-center">{leftData}</p>
                </div>
                <div>
                    <p className="mb-1 font-bold text-[12px] leading-[18px] tracking-[0.005em] text-customGrey text-center">{rightDetail}</p>
                    <p className="font-bold text-[16px] leading-[20px] tracking-[0.005em] text-[#333333] text-center">{isRightMoney ? "$": ""}{rightData}</p>
                </div>

            </div>
        </div>
    )
}