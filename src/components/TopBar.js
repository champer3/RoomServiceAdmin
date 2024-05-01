export default function TopBar() {
    return (
        <div className="flex items-center w-full h-[40px] pb-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.7801 19.7203L16.3033 15.2436C17.5233 13.7515 18.1231 11.8476 17.9787 9.92574C17.8343 8.00384 16.9567 6.21097 15.5275 4.91796C14.0983 3.62495 12.2268 2.93074 10.3001 2.97891C8.37336 3.02709 6.53886 3.81396 5.17605 5.17678C3.81323 6.5396 3.02635 8.37409 2.97818 10.3008C2.93001 12.2275 3.62422 14.099 4.91723 15.5283C6.21023 16.9575 8.00311 17.8351 9.92501 17.9795C11.8469 18.1239 13.7508 17.524 15.2428 16.3041L19.7196 20.7808C19.861 20.9174 20.0505 20.993 20.2471 20.9913C20.4438 20.9896 20.6319 20.9107 20.771 20.7717C20.91 20.6326 20.9889 20.4445 20.9906 20.2479C20.9923 20.0512 20.9167 19.8618 20.7801 19.7203ZM10.4998 16.5006C9.31315 16.5006 8.15311 16.1487 7.16642 15.4894C6.17972 14.8301 5.41069 13.893 4.95656 12.7967C4.50243 11.7003 4.38361 10.4939 4.61512 9.33003C4.84664 8.16614 5.41808 7.09704 6.2572 6.25793C7.09631 5.41881 8.16541 4.84737 9.3293 4.61586C10.4932 4.38435 11.6996 4.50317 12.7959 4.95729C13.8923 5.41142 14.8294 6.18045 15.4887 7.16715C16.1479 8.15384 16.4998 9.31388 16.4998 10.5006C16.4981 12.0913 15.8653 13.6164 14.7405 14.7412C13.6157 15.8661 12.0906 16.4988 10.4998 16.5006Z" fill="#4A4C56" />
            </svg>
            <input className="bg-transparent w-[100%] ml-1 text-[#858D9D] font-bold text-[14px] leading-[20px] tracking-[0.005em]" placeholder='Search'></input>
            <button>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1207_312)">
                    <path d="M11 25.2501C11.0012 26.2443 11.3967 27.1974 12.0997 27.9004C12.8027 28.6034 13.7558 28.9989 14.75 29.0001H25.25C26.2442 28.9989 27.1973 28.6034 27.9003 27.9004C28.6033 27.1974 28.9988 26.2443 29 25.2501V18.5001H11V25.2501ZM23.75 21.8751C23.9725 21.8751 24.19 21.941 24.375 22.0647C24.56 22.1883 24.7042 22.364 24.7894 22.5695C24.8745 22.7751 24.8968 23.0013 24.8534 23.2195C24.81 23.4378 24.7028 23.6382 24.5455 23.7956C24.3882 23.9529 24.1877 24.06 23.9695 24.1034C23.7512 24.1469 23.525 24.1246 23.3195 24.0394C23.1139 23.9543 22.9382 23.8101 22.8146 23.6251C22.691 23.4401 22.625 23.2226 22.625 23.0001C22.625 22.7017 22.7435 22.4155 22.9545 22.2046C23.1655 21.9936 23.4516 21.8751 23.75 21.8751ZM20 21.8751C20.2225 21.8751 20.44 21.941 20.625 22.0647C20.81 22.1883 20.9542 22.364 21.0394 22.5695C21.1245 22.7751 21.1468 23.0013 21.1034 23.2195C21.06 23.4378 20.9528 23.6382 20.7955 23.7956C20.6382 23.9529 20.4377 24.06 20.2195 24.1034C20.0012 24.1469 19.775 24.1246 19.5695 24.0394C19.3639 23.9543 19.1882 23.8101 19.0646 23.6251C18.941 23.4401 18.875 23.2226 18.875 23.0001C18.875 22.7017 18.9935 22.4155 19.2045 22.2046C19.4155 21.9936 19.7016 21.8751 20 21.8751ZM16.25 21.8751C16.4725 21.8751 16.69 21.941 16.875 22.0647C17.06 22.1883 17.2042 22.364 17.2894 22.5695C17.3745 22.7751 17.3968 23.0013 17.3534 23.2195C17.31 23.4378 17.2028 23.6382 17.0455 23.7956C16.8882 23.9529 16.6877 24.06 16.4695 24.1034C16.2512 24.1469 16.025 24.1246 15.8195 24.0394C15.6139 23.9543 15.4382 23.8101 15.3146 23.6251C15.191 23.4401 15.125 23.2226 15.125 23.0001C15.125 22.7017 15.2435 22.4155 15.4545 22.2046C15.6655 21.9936 15.9516 21.8751 16.25 21.8751Z" fill="#858D9D" />
                    <path d="M25.25 12.5H24.5V11.75C24.5 11.5511 24.421 11.3603 24.2803 11.2197C24.1397 11.079 23.9489 11 23.75 11C23.5511 11 23.3603 11.079 23.2197 11.2197C23.079 11.3603 23 11.5511 23 11.75V12.5H17V11.75C17 11.5511 16.921 11.3603 16.7803 11.2197C16.6397 11.079 16.4489 11 16.25 11C16.0511 11 15.8603 11.079 15.7197 11.2197C15.579 11.3603 15.5 11.5511 15.5 11.75V12.5H14.75C13.7558 12.5012 12.8027 12.8967 12.0997 13.5997C11.3967 14.3027 11.0012 15.2558 11 16.25L11 17H29V16.25C28.9988 15.2558 28.6033 14.3027 27.9003 13.5997C27.1973 12.8967 26.2442 12.5012 25.25 12.5Z" fill="#858D9D" />
                </g>
                <defs>
                    <clipPath id="clip0_1207_312">
                        <rect width="18" height="18" fill="white" transform="translate(11 11)" />
                    </clipPath>
                </defs>
            </svg>
            </button>
            <button>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1207_317)">
                    <path d="M16.568 26.75C16.8587 27.4185 17.3384 27.9876 17.9481 28.3873C18.5578 28.787 19.271 29 20 29C20.729 29 21.4422 28.787 22.0519 28.3873C22.6616 27.9876 23.1412 27.4185 23.432 26.75H16.568Z" fill="#858D9D" />
                    <path d="M27.794 20.4118L26.492 16.1195C26.0751 14.6183 25.1686 13.2993 23.9164 12.3721C22.6643 11.4449 21.1383 10.9626 19.5807 11.0017C18.0231 11.0408 16.5233 11.5992 15.3193 12.5881C14.1152 13.577 13.2761 14.9397 12.935 16.46L11.924 20.6128C11.7897 21.1646 11.7824 21.7397 11.9027 22.2947C12.0231 22.8498 12.268 23.3702 12.6189 23.8168C12.9697 24.2634 13.4175 24.6245 13.9283 24.8727C14.4391 25.121 14.9996 25.25 15.5675 25.25H24.2053C24.7908 25.25 25.3683 25.1129 25.8913 24.8497C26.4143 24.5864 26.8685 24.2044 27.2173 23.7341C27.5661 23.2638 27.8 22.7183 27.9002 22.1414C28.0003 21.5645 27.964 20.9721 27.794 20.4118Z" fill="#858D9D" />
                </g>
                <defs>
                    <clipPath id="clip0_1207_317">
                        <rect width="18" height="18" fill="white" transform="translate(11 11)" />
                    </clipPath>
                </defs>
            </svg>
            </button>
            <svg className="h-[35px] mr-3 w-[2px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0V40" stroke="#F0F1F3" />
            </svg>
            <button className="flex items-center w-[140px] h-[40px]">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="16" fill="#E0E2E7" />
                <circle cx="27" cy="27" r="6" fill="#22CAAD" stroke="white" stroke-width="2" />
            </svg>
            <div className="items-start w-[60px] text-[#333333] flex-col">
                <p className="h-[20px] font-bold text-[14px] leading-[20px] tracking-[0.0005em]">Stephen</p>
                <p className="font-bold text-[#4A4C56] text-[12px] leading-[18px] tracking-[0.0005em]">Manager</p>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.81051 9.75H16.1895C16.3378 9.75003 16.4828 9.79404 16.6061 9.87645C16.7294 9.95886 16.8255 10.076 16.8823 10.213C16.939 10.35 16.9539 10.5008 16.9249 10.6463C16.896 10.7917 16.8246 10.9254 16.7198 11.0302L12.5303 15.2197C12.3896 15.3603 12.1989 15.4393 12 15.4393C11.8011 15.4393 11.6104 15.3603 11.4698 15.2197L7.28026 11.0302C7.1754 10.9254 7.104 10.7917 7.07507 10.6463C7.04615 10.5008 7.061 10.35 7.11775 10.213C7.1745 10.076 7.27061 9.95886 7.39392 9.87645C7.51722 9.79404 7.6622 9.75003 7.81051 9.75Z" fill="#858D9D" />
            </svg>
            </button>
        </div>
    )
}