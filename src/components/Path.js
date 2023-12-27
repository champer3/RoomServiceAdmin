export default function Path({ pages }) {
    const currentPage = pages[pages.length - 1]
    return (
        <div className="flex w-full">
            {pages.map((page) => {
                if (page !== currentPage)
                return( <div className="items-center flex ml-4">
                    <p className="pr-4 font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#BC6C25]">{page}</p>
                    <svg  width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 11.9193V4.47133C6.00003 4.3395 6.03914 4.21064 6.1124 4.10103C6.18565 3.99142 6.28976 3.906 6.41156 3.85555C6.53336 3.8051 6.66738 3.7919 6.79669 3.81761C6.92599 3.84332 7.04476 3.90679 7.138 4L10.862 7.724C10.987 7.84902 11.0572 8.01856 11.0572 8.19533C11.0572 8.37211 10.987 8.54165 10.862 8.66667L7.138 12.3907C7.04476 12.4839 6.92599 12.5473 6.79669 12.5731C6.66738 12.5988 6.53336 12.5856 6.41156 12.5351C6.28976 12.4847 6.18565 12.3992 6.1124 12.2896C6.03914 12.18 6.00003 12.0512 6 11.9193Z" fill="#C2C6CE" />
                    </svg>
                </div>)
                else
            return <p className="px-4 font-bold text-[14px] leading-[20px] tracking-[0.005em] text-customGrey">{page}</p>
            })}
        </div>
    )
}