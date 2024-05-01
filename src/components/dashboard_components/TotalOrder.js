export default function TotalOrder({ label, amount, percent }) {
    const finalNumber = amount.toLocaleString()
    return (
        <section className="py-4 space-y-2 flex-col bg-order-bg bg-no-repeat bg-[#BC6C25] w-[25%] bg-cover rounded-xl">
            <div className="px-6 pt-6">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="36" height="36" rx="8" fill="white" fill-opacity="0.2" />
                    <g clip-path="url(#clip0_452_4696)">
                        <path d="M23.25 11.25H12.75C11.7558 11.2512 10.8027 11.6467 10.0997 12.3497C9.39665 13.0527 9.00118 14.0058 8.99999 15H27C26.9988 14.0058 26.6033 13.0527 25.9003 12.3497C25.1973 11.6467 24.2442 11.2512 23.25 11.25Z" fill="white" />
                        <path d="M8.99999 20.9999C9.00118 21.9941 9.39665 22.9472 10.0997 23.6502C10.8027 24.3532 11.7558 24.7487 12.75 24.7499H23.25C24.2442 24.7487 25.1973 24.3532 25.9003 23.6502C26.6033 22.9472 26.9988 21.9941 27 20.9999V16.4999H8.99999V20.9999ZM14.25 20.6249C14.25 20.8474 14.184 21.0649 14.0604 21.2499C13.9368 21.4349 13.7611 21.5791 13.5555 21.6642C13.3499 21.7494 13.1237 21.7717 12.9055 21.7283C12.6873 21.6848 12.4868 21.5777 12.3295 21.4204C12.1722 21.263 12.065 21.0626 12.0216 20.8443C11.9782 20.6261 12.0005 20.3999 12.0856 20.1944C12.1708 19.9888 12.315 19.8131 12.5 19.6895C12.685 19.5659 12.9025 19.4999 13.125 19.4999C13.4234 19.4999 13.7095 19.6184 13.9205 19.8294C14.1315 20.0404 14.25 20.3265 14.25 20.6249Z" fill="white" />
                    </g>
                    <defs>
                        <clipPath id="clip0_452_4696">
                            <rect width="18" height="18" fill="white" transform="translate(9 9)" />
                        </clipPath>
                    </defs>
                </svg>

            </div>
            <p className="pt-3 px-6 leading-[24px] text-[18px] font-bold text-customWhite tracking-[0.005em]">{label}</p>
            <div className="flex items-center">
                <p className="pl-5 pr-2 leading-[42px] text-[28px] font-semibold text-[#ffffff] tracking-[0.01em]">{finalNumber}</p>
                <div className="text-[12px] text-center font-semibold text-[#ffffff] bg-transparent py-[2px] px-[6px] w-[43px] h-[22px] rounded-md">
                    <p>{percent >= 0 ? '+' : ''}{percent}%</p>
                </div>
            </div>
        </section>
    )
}