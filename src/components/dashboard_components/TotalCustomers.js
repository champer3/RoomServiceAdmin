export default function TotalCustomers({ label, amount, percent }) {
    const finalNumber = amount.toLocaleString()
    return (
        <section className="py-4 space-y-2 flex-col bg-customer-bg bg-no-repeat bg-[#3250FF] w-[25%] bg-cover rounded-xl aspect-w-16 aspect-h-9">
            <div className="px-6 pt-6">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="36" height="36" rx="8" fill="white" fill-opacity="0.2" />
                    <g clip-path="url(#clip0_452_4712)">
                        <path d="M26.25 17.2493H24.75V15.7493C24.75 15.3351 24.4143 14.9993 24 14.9993C23.5858 14.9993 23.2501 15.3351 23.2501 15.7493V17.2493H21.75C21.3358 17.2493 21.0001 17.5851 21.0001 17.9993C21.0001 18.4135 21.3358 18.7493 21.75 18.7493H23.2501V20.2493C23.2501 20.6635 23.5858 20.9993 24 20.9993C24.4143 20.9993 24.75 20.6635 24.75 20.2493V18.7493H26.25C26.6643 18.7493 27 18.4135 27 17.9993C27 17.5851 26.6643 17.2493 26.25 17.2493Z" fill="white" />
                        <path d="M15.75 18C18.2353 18 20.25 15.9853 20.25 13.5C20.25 11.0147 18.2353 9 15.75 9C13.2647 9 11.25 11.0147 11.25 13.5C11.25 15.9853 13.2647 18 15.75 18Z" fill="white" />
                        <path d="M15.75 19.4993C12.0238 19.5035 9.00415 22.5231 9 26.2493C9 26.6635 9.33578 26.9993 9.74999 26.9993H21.75C22.1642 26.9993 22.5 26.6635 22.5 26.2493C22.4958 22.5231 19.4762 19.5034 15.75 19.4993Z" fill="white" />
                    </g>
                    <defs>
                        <clipPath id="clip0_452_4712">
                            <rect width="18" height="18" fill="white" transform="translate(9 9)" />
                        </clipPath>
                    </defs>
                </svg>


            </div>
            <p className="pt-3 px-6 leading-[24px] text-[18px] font-bold text-customWhite tracking-[0.005em]">{label}</p>
            <div className="flex items-center">
                <p className="pl-5 pr-2 leading-[42px] text-[28px] font-semibold text-[#ffffff] tracking-[0.01em]">{finalNumber}</p>
                <div className="text-center text-[12px] font-semibold text-[#ffffff] bg-transparent py-[2px] px-[6px] w-[43px] h-[22px] rounded-md">
                    <p>{percent >= 0 ? '+' : ''}{percent}%</p>
                </div>
            </div>
        </section>
    )
}