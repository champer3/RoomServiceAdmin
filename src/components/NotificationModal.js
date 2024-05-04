import { forwardRef, useState } from "react"
import { NOTIFICATIONS_LIST } from "../assets/data"

const NotificationModal = forwardRef(function NotificationModal({props},ref) {
    const [readMsgs, setReadMsgs] = useState([])

    const createArray = (n) => [...Array(n + 1).keys()].map(i => i)

    function handleRead(index) {
        setReadMsgs((prevState) => {
            return [...prevState, index]
        })
    }

    function handleReadAll() {
        setReadMsgs(createArray(NOTIFICATIONS_LIST.length - 1))
    }

    return (
        <dialog ref={ref} className="">
            <div className="flex items-center space-x-5 p-6">
                <h2 className="font-semibold text-[24px] leading-[33px] tracking-[0.25px] text-[#000000]">Notifications</h2>
                <div className="flex items-center w-full justify-end">
                    <form method="dialog">
                        <button>
                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.7383 10.7383L19.4767 19.4767M2 19.4767L10.7383 10.7383L2 19.4767ZM19.4767 2L10.7367 10.7383L19.4767 2ZM10.7367 10.7383L2 2L10.7367 10.7383Z" stroke="#2D2D2D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
            <button onClick={() => handleReadAll()} className="flex px-6 py-4 space-x-2">
                <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 9L9 16L20.6667 2" stroke="#283618" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p>Mark All As Read</p>
            </button>
            {NOTIFICATIONS_LIST.map((item, index) => {
                return (
                    // className={`${selectedRows.indexOf(product.SKU) !== -1 ? 'bg-[#F9F9FC]' : ''} border-b`}
                    <div className={`px-6 py-4 border-b-2 ${readMsgs.indexOf(index) !== -1 ? 'opacity-50' : ''}`}>
                        <div className="flex space-x-3  items-center">
                            <svg width="42" height="43" viewBox="0 0 42 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="21" cy="21.5" r="20.5" fill="white" stroke="#D9D9D9" />
                                <path d="M25.5833 27C26.0695 27 26.5358 27.1931 26.8797 27.537C27.2235 27.8808 27.4166 28.3471 27.4166 28.8333C27.4166 29.3195 27.2235 29.7859 26.8797 30.1297C26.5358 30.4735 26.0695 30.6666 25.5833 30.6666C25.0971 30.6666 24.6307 30.4735 24.2869 30.1297C23.9431 29.7859 23.75 29.3195 23.75 28.8333C23.75 27.8158 24.5658 27 25.5833 27ZM10.9166 12.3333H13.9141L14.7758 14.1666H28.3333C28.5764 14.1666 28.8096 14.2632 28.9815 14.4351C29.1534 14.607 29.25 14.8402 29.25 15.0833C29.25 15.2391 29.2041 15.395 29.14 15.5416L25.8583 21.4725C25.5466 22.0316 24.9416 22.4166 24.2541 22.4166H17.425L16.6 23.9108L16.5725 24.0208C16.5725 24.0816 16.5966 24.1399 16.6396 24.1829C16.6826 24.2258 16.7408 24.25 16.8016 24.25H27.4166V26.0833H16.4166C15.9304 26.0833 15.4641 25.8902 15.1203 25.5463C14.7764 25.2025 14.5833 24.7362 14.5833 24.25C14.5833 23.9291 14.6658 23.6266 14.8033 23.37L16.05 21.1241L12.75 14.1666H10.9166V12.3333ZM16.4166 27C16.9029 27 17.3692 27.1931 17.713 27.537C18.0568 27.8808 18.25 28.3471 18.25 28.8333C18.25 29.3195 18.0568 29.7859 17.713 30.1297C17.3692 30.4735 16.9029 30.6666 16.4166 30.6666C15.9304 30.6666 15.4641 30.4735 15.1203 30.1297C14.7764 29.7859 14.5833 29.3195 14.5833 28.8333C14.5833 27.8158 15.3991 27 16.4166 27ZM24.6666 20.5833L27.215 16H15.6283L17.7916 20.5833H24.6666Z" fill="#333333" />
                            </svg>
                            <div>
                                <p className="font-bold text-[14px] leading-[21px] tracking-[0.025px] text-[#BC6C25]">New Order!</p>
                                <p className="font-bold text-[10px] leading-[15px] tracking-[0.25px] text-customGrey">{item.time}</p>
                            </div>
                            <div className="flex pl-8 space-x-2">
                                <button onClick={() => handleRead(index)}>
                                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 8L8 14L18 2" stroke="#283618" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                                <button>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.99989 10.6656C9.4721 10.6656 10.6656 9.4721 10.6656 7.99989C10.6656 6.52769 9.4721 5.33423 7.99989 5.33423C6.52769 5.33423 5.33423 6.52769 5.33423 7.99989C5.33423 9.4721 6.52769 10.6656 7.99989 10.6656Z" fill="#A3A9B6" />
                                        <path d="M15.5112 6.28001C14.4776 4.59663 12.1265 1.77234 7.99998 1.77234C3.87352 1.77234 1.52239 4.59663 0.488772 6.28001C-0.162924 7.33409 -0.162924 8.66597 0.488772 9.72008C1.52239 11.4035 3.87352 14.2277 7.99998 14.2277C12.1265 14.2277 14.4776 11.4035 15.5112 9.72008C16.1629 8.66597 16.1629 7.33409 15.5112 6.28001ZM7.99998 11.9985C5.79168 11.9985 4.00147 10.2083 4.00147 8.00003C4.00147 5.79172 5.79168 4.00151 7.99998 4.00151C10.2083 4.00151 11.9985 5.79172 11.9985 8.00003C11.9963 10.2074 10.2074 11.9963 7.99998 11.9985Z" fill="#A3A9B6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <p className="w-[250px] ml-2 font-bold text-[14px] leading-[21px] tracking-[0.25px] text-[#333333] text-container line-clamp-2">{item.message}</p>
                    </div>
                )
            })
            }
        </dialog>
    )
}
)
export default NotificationModal