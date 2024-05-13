export default function TotalRevenue({ label, amount, percent }) {
    const formattedNumber = Math.round(amount)
    const finalNumber = formattedNumber.toLocaleString()
    return (
        <section className="py-4 space-y-2 flex-col bg-section-bg bg-no-repeat w-full bg-rs-green  bg-cover rounded-xl">
            <div className="px-6 pt-6">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="36" height="36" rx="8" fill="white" fill-opacity="0.2" />
                    <g clip-path="url(#clip0_452_4680)">
                        <path d="M23.25 12.0002H12.75C11.7558 12.0014 10.8027 12.3969 10.0997 13.0999C9.39666 13.8029 9.00119 14.756 9 15.7502V20.2502C9.00119 21.2444 9.39666 22.1976 10.0997 22.9006C10.8027 23.6036 11.7558 23.9991 12.75 24.0002H23.25C24.2442 23.9991 25.1973 23.6036 25.9003 22.9006C26.6033 22.1976 26.9988 21.2444 27 20.2502V15.7502C26.9988 14.756 26.6033 13.8029 25.9003 13.0999C25.1973 12.3969 24.2442 12.0014 23.25 12.0002ZM12 21.7502C11.8517 21.7502 11.7067 21.7063 11.5833 21.6238C11.46 21.5414 11.3639 21.4243 11.3071 21.2873C11.2503 21.1502 11.2355 20.9994 11.2644 20.8539C11.2933 20.7084 11.3648 20.5748 11.4697 20.4699C11.5746 20.365 11.7082 20.2936 11.8537 20.2647C11.9992 20.2357 12.15 20.2506 12.287 20.3073C12.4241 20.3641 12.5412 20.4602 12.6236 20.5836C12.706 20.7069 12.75 20.8519 12.75 21.0002C12.75 21.1992 12.671 21.3899 12.5303 21.5306C12.3897 21.6712 12.1989 21.7502 12 21.7502ZM12 15.7502C11.8517 15.7502 11.7067 15.7063 11.5833 15.6238C11.46 15.5414 11.3639 15.4243 11.3071 15.2873C11.2503 15.1502 11.2355 14.9994 11.2644 14.8539C11.2933 14.7084 11.3648 14.5748 11.4697 14.4699C11.5746 14.365 11.7082 14.2936 11.8537 14.2647C11.9992 14.2357 12.15 14.2506 12.287 14.3073C12.4241 14.3641 12.5412 14.4602 12.6236 14.5836C12.706 14.7069 12.75 14.8519 12.75 15.0002C12.75 15.1992 12.671 15.3899 12.5303 15.5306C12.3897 15.6712 12.1989 15.7502 12 15.7502ZM18 21.0002C17.4067 21.0002 16.8266 20.8243 16.3333 20.4947C15.8399 20.165 15.4554 19.6965 15.2284 19.1483C15.0013 18.6001 14.9419 17.9969 15.0576 17.415C15.1734 16.833 15.4591 16.2985 15.8787 15.8789C16.2982 15.4594 16.8328 15.1736 17.4147 15.0579C17.9967 14.9421 18.5999 15.0015 19.1481 15.2286C19.6962 15.4557 20.1648 15.8402 20.4944 16.3335C20.8241 16.8269 21 17.4069 21 18.0002C21 18.7959 20.6839 19.559 20.1213 20.1216C19.5587 20.6842 18.7956 21.0002 18 21.0002ZM24 21.7502C23.8517 21.7502 23.7067 21.7063 23.5833 21.6238C23.46 21.5414 23.3639 21.4243 23.3071 21.2873C23.2503 21.1502 23.2355 20.9994 23.2644 20.8539C23.2934 20.7084 23.3648 20.5748 23.4697 20.4699C23.5746 20.365 23.7082 20.2936 23.8537 20.2647C23.9992 20.2357 24.15 20.2506 24.287 20.3073C24.4241 20.3641 24.5412 20.4602 24.6236 20.5836C24.706 20.7069 24.75 20.8519 24.75 21.0002C24.75 21.1992 24.671 21.3899 24.5303 21.5306C24.3897 21.6712 24.1989 21.7502 24 21.7502ZM24 15.7502C23.8517 15.7502 23.7067 15.7063 23.5833 15.6238C23.46 15.5414 23.3639 15.4243 23.3071 15.2873C23.2503 15.1502 23.2355 14.9994 23.2644 14.8539C23.2934 14.7084 23.3648 14.5748 23.4697 14.4699C23.5746 14.365 23.7082 14.2936 23.8537 14.2647C23.9992 14.2357 24.15 14.2506 24.287 14.3073C24.4241 14.3641 24.5412 14.4602 24.6236 14.5836C24.706 14.7069 24.75 14.8519 24.75 15.0002C24.75 15.1992 24.671 15.3899 24.5303 15.5306C24.3897 15.6712 24.1989 15.7502 24 15.7502ZM19.5 18.0002C19.5 18.2969 19.412 18.5869 19.2472 18.8336C19.0824 19.0803 18.8481 19.2725 18.574 19.3861C18.2999 19.4996 17.9983 19.5293 17.7074 19.4714C17.4164 19.4135 17.1491 19.2707 16.9393 19.0609C16.7296 18.8511 16.5867 18.5839 16.5288 18.2929C16.4709 18.0019 16.5006 17.7003 16.6142 17.4262C16.7277 17.1521 16.92 16.9179 17.1666 16.753C17.4133 16.5882 17.7033 16.5002 18 16.5002C18.3978 16.5002 18.7794 16.6583 19.0607 16.9396C19.342 17.2209 19.5 17.6024 19.5 18.0002Z" fill="white" />
                    </g>
                    <defs>
                        <clipPath id="clip0_452_4680">
                            <rect width="18" height="18" fill="white" transform="translate(9 9)" />
                        </clipPath>
                    </defs>
                </svg>
            </div>
            <p className="pt-3 px-6 leading-[24px] text-[18px] font-bold text-customWhite tracking-[0.005em]">{label}</p>
            <div className="flex items-center ">
                <p className="pl-5 pr-2 leading-[42px] text-[28px] font-semibold text-[#ffffff] tracking-[0.01em]">${finalNumber}</p>
                <div className="text-[12px] font-semibold text-[#ffffff] bg-transparent py-[2px] px-[6px] w-[43px] h-[22px] rounded-md">
                    <p>{percent >= 0 ? '+' : ''}{percent}%</p>
                </div>
            </div>
        </section>
    )
}