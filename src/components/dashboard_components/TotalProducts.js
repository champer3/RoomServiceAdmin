export default function TotalProducts({ label, amount, percent }) {
    const finalNumber = amount.toLocaleString()
    return (
        <section class="flex-col bg-product-bg bg-no-repeat bg-[#2BB2FE] w-[264px] h-[166px] bg-cover rounded-xl">
            <div className="px-6 pt-6">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="36" height="36" rx="8" fill="white" fill-opacity="0.2" />
                    <g clip-path="url(#clip0_452_4728)">
                        <path d="M23.25 9H12.75C11.7554 9 10.8016 9.39509 10.0983 10.0983C9.39509 10.8016 9 11.7554 9 12.75V12.75C9 13.3467 9.23705 13.919 9.65901 14.341C10.081 14.7629 10.6533 15 11.25 15H24.75C25.3204 15.007 25.8717 14.7948 26.2904 14.4073C26.709 14.0198 26.963 13.4865 27 12.9173C27.0221 12.411 26.9414 11.9056 26.7629 11.4314C26.5844 10.9572 26.3118 10.524 25.9614 10.158C25.611 9.79195 25.1901 9.50066 24.7241 9.30165C24.2581 9.10263 23.7567 9.00003 23.25 9V9Z" fill="white" />
                        <path d="M25.4999 16.4999H10.4999C10.301 16.4999 10.1102 16.579 9.96955 16.7196C9.8289 16.8603 9.74988 17.051 9.74988 17.2499V23.2499C9.75107 24.2441 10.1465 25.1973 10.8495 25.9003C11.5525 26.6033 12.5057 26.9987 13.4999 26.9999H22.4999C23.4941 26.9987 24.4472 26.6033 25.1502 25.9003C25.8532 25.1973 26.2487 24.2441 26.2499 23.2499V17.2499C26.2499 17.051 26.1709 16.8603 26.0302 16.7196C25.8896 16.579 25.6988 16.4999 25.4999 16.4999ZM20.2499 20.2499H15.7499C15.551 20.2499 15.3602 20.1709 15.2195 20.0303C15.0789 19.8896 14.9999 19.6989 14.9999 19.4999C14.9999 19.301 15.0789 19.1103 15.2195 18.9696C15.3602 18.829 15.551 18.7499 15.7499 18.7499H20.2499C20.4488 18.7499 20.6396 18.829 20.7802 18.9696C20.9209 19.1103 20.9999 19.301 20.9999 19.4999C20.9999 19.6989 20.9209 19.8896 20.7802 20.0303C20.6396 20.1709 20.4488 20.2499 20.2499 20.2499Z" fill="white" />
                    </g>
                    <defs>
                        <clipPath id="clip0_452_4728">
                            <rect width="18" height="18" fill="white" transform="translate(9 9)" />
                        </clipPath>
                    </defs>
                </svg>


            </div>
            <p class="pt-3 px-6 leading-[24px] text-[16px] font-bold text-customWhite tracking-[0.005em]">{label}</p>
            <div class="flex items-center">
                <p className="pl-5 pr-2 leading-[42px] text-[28px] font-semibold text-[#ffffff] tracking-[0.01em]">{finalNumber}</p>
                <div className="text-[12px] font-semibold text-[#ffffff] bg-transparent py-[2px] px-[6px] w-[43px] h-[22px] rounded-md">
                    <p>{percent >= 0 ? '+' : ''}{percent}%</p>
                </div>
            </div>
        </section>
    )
}