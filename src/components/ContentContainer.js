

export default function ContentContainer({ label, subheading, children }) {
    return (
        <div className="w-full ml-auto px-8 py-8 flex mr-auto bg-[#ffffff] rounded-xl">
            <div className="w-full">
                <h1 className="px-4 font-semibold text-[20px] leading-[30px] tracking-[0.01em] text-[#333333]">{label}</h1>
                <p className="px-4 font-extrabold text-[14px] text-[#777980] leading-[20px] tracking-[0.005em]">{subheading}</p>
                <div className="px-4">
                    {children}
                </div>

            </div>
            <div>
                <button>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.99999 2.66669C8.73638 2.66669 9.33334 2.06973 9.33334 1.33334C9.33334 0.596958 8.73638 0 7.99999 0C7.2636 0 6.66664 0.596958 6.66664 1.33334C6.66664 2.06973 7.2636 2.66669 7.99999 2.66669Z" fill="#858D9D" />
                        <path d="M7.99999 9.33334C8.73638 9.33334 9.33334 8.73638 9.33334 7.99999C9.33334 7.2636 8.73638 6.66664 7.99999 6.66664C7.2636 6.66664 6.66664 7.2636 6.66664 7.99999C6.66664 8.73638 7.2636 9.33334 7.99999 9.33334Z" fill="#858D9D" />
                        <path d="M7.99999 16C8.73638 16 9.33334 15.403 9.33334 14.6667C9.33334 13.9303 8.73638 13.3333 7.99999 13.3333C7.2636 13.3333 6.66664 13.9303 6.66664 14.6667C6.66664 15.403 7.2636 16 7.99999 16Z" fill="#858D9D" />
                    </svg>
                </button>
            </div>

        </div>
    )
}