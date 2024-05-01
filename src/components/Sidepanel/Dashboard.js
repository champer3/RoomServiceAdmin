export default function Dashboard({active}) {

    return (

        <button className={`${active ? 'text-stone-100 bg-rs-green' : 'text-rs-green'} flex items-center space-x-2 justify-left hover:text-stone-100 hover:bg-rs-green w-[264px] h-[48] px-[24px] py-[12px] leading-[20px] font-semibold text-14px tracking-[0.005em]`}>
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1178_528)">
                    <path d="M8.25 3H6C4.34315 3 3 4.34315 3 6V8.25C3 9.90685 4.34315 11.25 6 11.25H8.25C9.90685 11.25 11.25 9.90685 11.25 8.25V6C11.25 4.34315 9.90685 3 8.25 3Z" fill="currentColor" />
                    <path d="M17.9999 3H15.7499C14.093 3 12.7499 4.34315 12.7499 6V8.25C12.7499 9.90686 14.093 11.25 15.7499 11.25H17.9999C19.6567 11.25 20.9999 9.90686 20.9999 8.25V6C20.9999 4.34315 19.6567 3 17.9999 3Z" fill="currentColor" />
                    <path d="M8.25 12.75H6C4.34315 12.75 3 14.0931 3 15.75V18C3 19.6569 4.34315 21 6 21H8.25C9.90685 21 11.25 19.6569 11.25 18V15.75C11.25 14.0931 9.90685 12.75 8.25 12.75Z" fill="currentColor" />
                    <path d="M17.9999 12.75H15.7499C14.093 12.75 12.7499 14.0931 12.7499 15.75V18C12.7499 19.6569 14.093 21 15.7499 21H17.9999C19.6567 21 20.9999 19.6569 20.9999 18V15.75C20.9999 14.0931 19.6567 12.75 17.9999 12.75Z" fill="currentColor" />
                </g>
                <defs>
                    <clipPath id="clip0_1178_528">
                        <rect width="18" height="18" transform="translate(3 3)" />
                    </clipPath>
                </defs>
            </svg>


            <p>Dashboard</p>
        </button>


    )
}