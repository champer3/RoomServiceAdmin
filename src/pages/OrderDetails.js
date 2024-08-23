import Path from "../components/Path"
import OrangeLabel from "../components/StatusLabels/OrangeLabel"
import GreenLabel from "../components/StatusLabels/GreenLabel"
import RedLabel from "../components/StatusLabels/RedLabel"
import BlueLabel from "../components/StatusLabels/BlueLabel"
import TableHead from "../components/dashboard_components/TableHead"
import { ORDER_DETAILS_LIST } from "../assets/data"
import { useContext } from "react"
import { PageContext } from "../context/PageContext"

export default function OrderDetailsPage() {
    let subTotal = 0
    let VAT = 0
    let deliveryFee = 5

    const { order, changePage } = useContext(PageContext)

    const { id, status, dateAdded, paymentMethod, shippingMethod, customer, customerEmail, customerPhone, customerAddress } = order

    function formatNumberWithCommas(number) {
        const formattedNumber = parseFloat(number.toFixed(2)).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return formattedNumber;
    }

    return (
        <>
            {changePage('orders')}
            <div className='items-center'>
                <p className='text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]'>Order Details</p>
                <div className='flex items-center'>
                    <Path pages={[{name: 'Dashboard', link: 'dashboard'}, {name: 'Order List', link: 'orders'}, {name: 'Order Details', link: 'order-details'}]} />
                    <button className='flex ml-auto border border-[#283618] rounded-xl mr-2 px-[14px] py-[10px] text-[#283618] font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>
                        <svg className='mr-2' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_499_3317)">
                                <path d="M6.5854 12.0813C7.36621 12.8627 8.63253 12.8631 9.41384 12.0822C9.41415 12.0819 9.41443 12.0817 9.41474 12.0813L11.5554 9.94069C11.8023 9.66759 11.7811 9.246 11.508 8.99906C11.2537 8.76916 10.8666 8.76956 10.6127 9L8.66209 10.9513L8.66674 0.666687C8.66671 0.298469 8.36824 0 8.00006 0C7.63187 0 7.3334 0.298469 7.3334 0.666656L7.3274 10.9387L5.3874 9C5.1269 8.73969 4.70471 8.73984 4.4444 9.00034C4.18409 9.26084 4.18424 9.68303 4.44474 9.94334L6.5854 12.0813Z" fill="#283618" />
                                <path d="M15.3333 10.6666C14.9652 10.6666 14.6667 10.9651 14.6667 11.3333V14C14.6667 14.3682 14.3682 14.6666 14 14.6666H2C1.63181 14.6666 1.33334 14.3682 1.33334 14V11.3333C1.33334 10.9651 1.03487 10.6667 0.666687 10.6667C0.298469 10.6666 0 10.9651 0 11.3333V14C0 15.1045 0.895437 16 2 16H14C15.1046 16 16 15.1045 16 14V11.3333C16 10.9651 15.7015 10.6666 15.3333 10.6666Z" fill="#283618" />
                            </g>
                            <defs>
                                <clipPath id="clip0_499_3317">
                                    <rect width="16" height="16" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        Export
                    </button>
                    <button className='flex items-center rounded-xl px-[14px] py-[10px] bg-[#283618] text-white font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_785_4288)">
                                <path d="M7.33333 2C6.4496 2.00106 5.60237 2.35259 4.97748 2.97748C4.35259 3.60237 4.00106 4.4496 4 5.33333V17.3333C4.00009 17.4546 4.03326 17.5735 4.09592 17.6773C4.15858 17.7811 4.24837 17.8659 4.35563 17.9225C4.46288 17.9791 4.58353 18.0053 4.70459 17.9984C4.82565 17.9915 4.94254 17.9517 5.04267 17.8833L6.44667 16.924L7.85067 17.8833C7.96159 17.9593 8.09289 17.9999 8.22733 17.9999C8.36177 17.9999 8.49307 17.9593 8.604 17.8833L10.004 16.924L11.404 17.8833C11.515 17.9594 11.6464 18.0002 11.781 18.0002C11.9156 18.0002 12.047 17.9594 12.158 17.8833L13.558 16.9247L14.958 17.8827C15.0581 17.9508 15.1748 17.9905 15.2957 17.9973C15.4166 18.0041 15.5371 17.9779 15.6442 17.9214C15.7514 17.865 15.8411 17.7804 15.9038 17.6768C15.9664 17.5732 15.9997 17.4544 16 17.3333V5.33333C15.9989 4.4496 15.6474 3.60237 15.0225 2.97748C14.3976 2.35259 13.5504 2.00106 12.6667 2L7.33333 2ZM11.3333 11.3333H7.33333C7.15652 11.3333 6.98695 11.2631 6.86193 11.1381C6.7369 11.013 6.66667 10.8435 6.66667 10.6667C6.66667 10.4899 6.7369 10.3203 6.86193 10.1953C6.98695 10.0702 7.15652 10 7.33333 10H11.3333C11.5101 10 11.6797 10.0702 11.8047 10.1953C11.9298 10.3203 12 10.4899 12 10.6667C12 10.8435 11.9298 11.013 11.8047 11.1381C11.6797 11.2631 11.5101 11.3333 11.3333 11.3333ZM13.3333 8C13.3333 8.17681 13.2631 8.34638 13.1381 8.4714C13.013 8.59643 12.8435 8.66667 12.6667 8.66667H7.33333C7.15652 8.66667 6.98695 8.59643 6.86193 8.4714C6.7369 8.34638 6.66667 8.17681 6.66667 8C6.66667 7.82319 6.7369 7.65362 6.86193 7.5286C6.98695 7.40357 7.15652 7.33333 7.33333 7.33333H12.6667C12.8435 7.33333 13.013 7.40357 13.1381 7.5286C13.2631 7.65362 13.3333 7.82319 13.3333 8Z" fill="white" />
                            </g>
                            <defs>
                                <clipPath id="clip0_785_4288">
                                    <rect width="16" height="16" fill="white" transform="translate(2 2)" />
                                </clipPath>
                            </defs>
                        </svg>

                        <p className='ml-2'>Invoice</p>
                    </button>
                </div>
            </div>
            <div className="flex w-full space-x-[24px] mt-4">
                <div className="w-[50%] space-y-4 bg-white h-[244px] p-[24px] rounded-lg">
                    <div className="flex">
                        <div className="w-full flex space-x-3">
                            <p className="text-[#333333] font-semibold text-[18px] leading-[28px] tracking-[0.01em]">Order {id}</p>
                            {status === 'Processing' &&
                                <td><OrangeLabel>{order.status}</OrangeLabel></td>
                            }
                            {status === 'Delivered' &&
                                <td><GreenLabel>{order.status}</GreenLabel></td>
                            }
                            {status === 'Canceled' &&
                                <td><RedLabel>{order.status}</RedLabel></td>
                            }
                            {status === 'Shipped' &&
                                <td><BlueLabel>{order.status}</BlueLabel></td>
                            }
                        </div>
                        <div className="">
                            <button >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_785_4299)">
                                        <path d="M0.781333 12.7457C0.281202 13.2456 0.000151033 13.9238 0 14.631L0 15.9997H1.36867C2.07585 15.9995 2.75402 15.7185 3.254 15.2183L12.1493 6.323L9.67667 3.85034L0.781333 12.7457Z" fill="#A3A9B6" />
                                        <path d="M15.4299 0.569995C15.2676 0.407485 15.0748 0.278565 14.8626 0.190606C14.6504 0.102647 14.423 0.057373 14.1933 0.057373C13.9636 0.057373 13.7361 0.102647 13.5239 0.190606C13.3117 0.278565 13.1189 0.407485 12.9566 0.569995L10.6193 2.90799L13.0919 5.38066L15.4299 3.04333C15.5924 2.88099 15.7214 2.68821 15.8093 2.47601C15.8973 2.26382 15.9426 2.03637 15.9426 1.80666C15.9426 1.57696 15.8973 1.34951 15.8093 1.13731C15.7214 0.925114 15.5924 0.732335 15.4299 0.569995Z" fill="#A3A9B6" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_785_4299">
                                            <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="w-full flex items-center">
                        <div className="flex items-center rounded-full w-[40px] h-[40px] bg-[#F0F1F3] p-[8px]">
                            <svg className="ml-auto mr-auto" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_785_4304)">
                                    <path d="M0 14.25C0.00119089 15.2442 0.396661 16.1973 1.09966 16.9003C1.80267 17.6033 2.7558 17.9988 3.75 18H14.25C15.2442 17.9988 16.1973 17.6033 16.9003 16.9003C17.6033 16.1973 17.9988 15.2442 18 14.25V7.5H0V14.25ZM12.75 10.875C12.9725 10.875 13.19 10.941 13.375 11.0646C13.56 11.1882 13.7042 11.3639 13.7894 11.5695C13.8745 11.775 13.8968 12.0012 13.8534 12.2195C13.81 12.4377 13.7028 12.6382 13.5455 12.7955C13.3882 12.9528 13.1877 13.06 12.9695 13.1034C12.7512 13.1468 12.525 13.1245 12.3195 13.0394C12.1139 12.9542 11.9382 12.81 11.8146 12.625C11.691 12.44 11.625 12.2225 11.625 12C11.625 11.7016 11.7435 11.4155 11.9545 11.2045C12.1655 10.9935 12.4516 10.875 12.75 10.875ZM9 10.875C9.2225 10.875 9.44001 10.941 9.62502 11.0646C9.81002 11.1882 9.95422 11.3639 10.0394 11.5695C10.1245 11.775 10.1468 12.0012 10.1034 12.2195C10.06 12.4377 9.95283 12.6382 9.7955 12.7955C9.63816 12.9528 9.43771 13.06 9.21948 13.1034C9.00125 13.1468 8.77505 13.1245 8.56948 13.0394C8.36391 12.9542 8.18821 12.81 8.0646 12.625C7.94098 12.44 7.875 12.2225 7.875 12C7.875 11.7016 7.99353 11.4155 8.2045 11.2045C8.41548 10.9935 8.70163 10.875 9 10.875ZM5.25 10.875C5.4725 10.875 5.69001 10.941 5.87502 11.0646C6.06002 11.1882 6.20422 11.3639 6.28936 11.5695C6.37451 11.775 6.39679 12.0012 6.35338 12.2195C6.30998 12.4377 6.20283 12.6382 6.0455 12.7955C5.88816 12.9528 5.68771 13.06 5.46948 13.1034C5.25125 13.1468 5.02505 13.1245 4.81948 13.0394C4.61391 12.9542 4.43821 12.81 4.3146 12.625C4.19098 12.44 4.125 12.2225 4.125 12C4.125 11.7016 4.24353 11.4155 4.4545 11.2045C4.66548 10.9935 4.95163 10.875 5.25 10.875Z" fill="#333333" fill-opacity="0.6" />
                                    <path d="M14.25 1.5H13.5V0.75C13.5 0.551088 13.421 0.360322 13.2803 0.21967C13.1397 0.0790176 12.9489 0 12.75 0C12.5511 0 12.3603 0.0790176 12.2197 0.21967C12.079 0.360322 12 0.551088 12 0.75V1.5H6V0.75C6 0.551088 5.92098 0.360322 5.78033 0.21967C5.63968 0.0790176 5.44891 0 5.25 0C5.05109 0 4.86032 0.0790176 4.71967 0.21967C4.57902 0.360322 4.5 0.551088 4.5 0.75V1.5H3.75C2.7558 1.50119 1.80267 1.89666 1.09966 2.59966C0.396661 3.30267 0.00119089 4.2558 0 5.25L0 6H18V5.25C17.9988 4.2558 17.6033 3.30267 16.9003 2.59966C16.1973 1.89666 15.2442 1.50119 14.25 1.5Z" fill="#333333" fill-opacity="0.6" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_785_4304">
                                        <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <p className="ml-2 font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">Added</p>
                        <p className="ml-auto font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">{dateAdded}</p>
                    </div>
                    <div className="w-full flex items-center">
                        <div className="flex items-center rounded-full w-[40px] h-[40px] bg-[#F0F1F3] p-[8px]">
                            <svg className="ml-auto mr-auto" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_785_4310)">
                                    <path d="M14.25 2.25H3.75C2.7558 2.25119 1.80267 2.64666 1.09966 3.34966C0.396661 4.05267 0.00119089 5.0058 0 6H18C17.9988 5.0058 17.6033 4.05267 16.9003 3.34966C16.1973 2.64666 15.2442 2.25119 14.25 2.25Z" fill="#333333" fill-opacity="0.6" />
                                    <path d="M0 12C0.00119089 12.9942 0.396661 13.9473 1.09966 14.6503C1.80267 15.3533 2.7558 15.7488 3.75 15.75H14.25C15.2442 15.7488 16.1973 15.3533 16.9003 14.6503C17.6033 13.9473 17.9988 12.9942 18 12V7.5H0V12ZM5.25 11.625C5.25 11.8475 5.18402 12.065 5.0604 12.25C4.93679 12.435 4.76109 12.5792 4.55552 12.6644C4.34995 12.7495 4.12375 12.7718 3.90552 12.7284C3.68729 12.685 3.48684 12.5778 3.3295 12.4205C3.17217 12.2632 3.06502 12.0627 3.02162 11.8445C2.97821 11.6262 3.00049 11.4 3.08564 11.1945C3.17078 10.9889 3.31498 10.8132 3.49998 10.6896C3.68499 10.566 3.9025 10.5 4.125 10.5C4.42337 10.5 4.70952 10.6185 4.9205 10.8295C5.13147 11.0405 5.25 11.3266 5.25 11.625Z" fill="#333333" fill-opacity="0.6" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_785_4310">
                                        <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>

                        </div>
                        <p className="ml-2 font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">Payment Method</p>
                        <p className="ml-auto font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">{paymentMethod}</p>
                    </div>
                    <div className="w-full flex items-center">
                        <div className="flex items-center rounded-full w-[40px] h-[40px] bg-[#F0F1F3] p-[8px]">
                            <svg className="ml-auto mr-auto" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_785_4316)">
                                    <path d="M11.25 13.4995H3C2.20435 13.4995 1.44129 13.1834 0.87868 12.6208C0.316071 12.0582 0 11.2952 0 10.4995V4.49951C0 3.50495 0.395088 2.55112 1.09835 1.84786C1.80161 1.1446 2.75544 0.749512 3.75 0.749512H7.5C7.99246 0.749512 8.48009 0.846508 8.93506 1.03496C9.39003 1.22342 9.80343 1.49964 10.1517 1.84786C10.4999 2.19608 10.7761 2.60948 10.9645 3.06445C11.153 3.51942 11.25 4.00705 11.25 4.49951V13.4995ZM18 8.24951V7.49951C18 7.00705 17.903 6.51942 17.7145 6.06445C17.5261 5.60948 17.2499 5.19608 16.9016 4.84786C16.5534 4.49964 16.14 4.22342 15.6851 4.03496C15.2301 3.84651 14.7425 3.74951 14.25 3.74951H12.75V8.24951H18ZM12.75 9.74951V13.4995H15C15.7956 13.4995 16.5587 13.1834 17.1213 12.6208C17.6839 12.0582 18 11.2952 18 10.4995V9.74951H12.75ZM3.0435 14.9995C3.01603 15.1227 3.00145 15.2483 3 15.3745C3 15.8718 3.19754 16.3487 3.54917 16.7003C3.90081 17.052 4.37772 17.2495 4.875 17.2495C5.37228 17.2495 5.84919 17.052 6.20083 16.7003C6.55246 16.3487 6.75 15.8718 6.75 15.3745C6.74855 15.2483 6.73397 15.1227 6.7065 14.9995H3.0435ZM11.2935 14.9995C11.266 15.1227 11.2514 15.2483 11.25 15.3745C11.25 15.8718 11.4475 16.3487 11.7992 16.7003C12.1508 17.052 12.6277 17.2495 13.125 17.2495C13.6223 17.2495 14.0992 17.052 14.4508 16.7003C14.8025 16.3487 15 15.8718 15 15.3745C14.9986 15.2483 14.984 15.1227 14.9565 14.9995H11.2935Z" fill="#333333" fill-opacity="0.6" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_785_4316">
                                        <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>

                        </div>
                        <p className="ml-2 font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">Shipping Method</p>
                        <p className="ml-auto font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">{shippingMethod}</p>
                    </div>
                </div>
                <div className="bg-white w-[50%] h-[244px] p-[24px] rounded-lg">
                    <div className="space-y-4">
                        <p className="text-[#333333] font-semibold text-[18px] leading-[28px] tracking-[0.01em]">Customer</p>
                        <div className="w-full flex items-center">
                            <div className="flex items-center rounded-full w-[40px] h-[40px] bg-[#F0F1F3] p-[8px]">
                                <svg className="ml-auto mr-auto" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 9C11.4853 9 13.5 6.98528 13.5 4.5C13.5 2.01472 11.4853 0 9 0C6.51472 0 4.5 2.01472 4.5 4.5C4.5 6.98528 6.51472 9 9 9Z" fill="#333333" fill-opacity="0.6" />
                                    <path d="M9 10.4993C5.27379 10.5034 2.25415 13.5231 2.25 17.2493C2.25 17.6635 2.58578 17.9993 2.99999 17.9993H15C15.4142 17.9993 15.75 17.6635 15.75 17.2493C15.7458 13.5231 12.7262 10.5034 9 10.4993Z" fill="#333333" fill-opacity="0.6" />
                                </svg>
                            </div>
                            <p className="ml-2 font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">Added</p>
                            <p className="ml-auto font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">{customer}</p>
                        </div>
                        <div className="w-full flex items-center">
                            <div className="flex items-center rounded-full w-[40px] h-[40px] bg-[#F0F1F3] p-[8px]">
                                <svg className="ml-auto mr-auto" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_785_4331)">
                                        <path d="M17.9655 4.15649L11.652 10.47C10.948 11.1722 9.99431 11.5665 9 11.5665C8.00569 11.5665 7.05197 11.1722 6.348 10.47L0.0345 4.15649C0.024 4.27499 0 4.38224 0 4.49999V13.5C0.00119089 14.4942 0.396661 15.4473 1.09966 16.1503C1.80267 16.8533 2.7558 17.2488 3.75 17.25H14.25C15.2442 17.2488 16.1973 16.8533 16.9003 16.1503C17.6033 15.4473 17.9988 14.4942 18 13.5V4.49999C18 4.38224 17.976 4.27499 17.9655 4.15649Z" fill="#333333" fill-opacity="0.6" />
                                        <path d="M10.5915 9.4095L17.442 2.55825C17.1101 2.00799 16.6421 1.55253 16.083 1.2358C15.5239 0.919067 14.8926 0.751755 14.25 0.75H3.74998C3.1074 0.751755 2.47611 0.919067 1.917 1.2358C1.3579 1.55253 0.889842 2.00799 0.557983 2.55825L7.40848 9.4095C7.83116 9.83048 8.40342 10.0669 8.99998 10.0669C9.59655 10.0669 10.1688 9.83048 10.5915 9.4095Z" fill="#333333" fill-opacity="0.6" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_785_4331">
                                            <rect width="18" height="18" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <p className="ml-2 font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">Email</p>
                            <p className="ml-auto font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">{customerEmail}</p>
                        </div>
                        <div className="w-full flex items-center">
                            <div className="flex items-center rounded-full w-[40px] h-[40px] bg-[#F0F1F3] p-[8px]">
                                <svg className="ml-auto mr-auto" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_785_4337)">
                                        <path d="M11.25 0H6.75C5.7558 0.00119089 4.80267 0.396661 4.09966 1.09966C3.39666 1.80267 3.00119 2.7558 3 3.75V12H15V3.75C14.9988 2.7558 14.6033 1.80267 13.9003 1.09966C13.1973 0.396661 12.2442 0.00119089 11.25 0V0Z" fill="#333333" fill-opacity="0.6" />
                                        <path d="M3 14.25C3.00119 15.2442 3.39666 16.1973 4.09966 16.9003C4.80267 17.6033 5.7558 17.9988 6.75 18H11.25C12.2442 17.9988 13.1973 17.6033 13.9003 16.9003C14.6033 16.1973 14.9988 15.2442 15 14.25V13.5H3V14.25ZM9 15C9.14834 15 9.29334 15.044 9.41668 15.1264C9.54001 15.2088 9.63614 15.3259 9.69291 15.463C9.74968 15.6 9.76453 15.7508 9.73559 15.8963C9.70665 16.0418 9.63522 16.1754 9.53033 16.2803C9.42544 16.3852 9.2918 16.4567 9.14632 16.4856C9.00083 16.5145 8.85003 16.4997 8.71299 16.4429C8.57594 16.3861 8.45881 16.29 8.3764 16.1667C8.29399 16.0433 8.25 15.8983 8.25 15.75C8.25 15.5511 8.32902 15.3603 8.46967 15.2197C8.61032 15.079 8.80109 15 9 15Z" fill="#333333" fill-opacity="0.6" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_785_4337">
                                            <rect width="18" height="18" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <p className="ml-2 font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">Phone</p>
                            <p className="ml-auto font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">{customerPhone}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex space-x-5 p-3">
                <div className="w-[70%]">
                    <div className='bg-white mt-8 w-full rounded-lg'>
                        <div className='rounded-lg w-full bg-white p-4 items-center flex'>
                            <p className='mr-2 font-semibold text-[20px] leading-[30px] tracking-[0.01em]'>Order List</p>
                            <GreenLabel>+2 Orders</GreenLabel>
                        </div>
                        <table className='w-full'>
                            <thead>
                                <tr className='border-t border-b bg-[#F9F9FC]'>
                                    <th className='pl-9 w-[180px]'><TableHead heading={'Product'} /></th>
                                    <th className='pl-16 w-[200px]'><TableHead heading={'SKU'} /></th>
                                    <th className='pl-12'><TableHead heading={'Quantity'} /></th>
                                    <th className='pl-20 w-[200px]'><TableHead heading={'Price'} /></th>
                                    <th className='pl-20'><TableHead heading={'Total'} /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {ORDER_DETAILS_LIST.map((order) => {
                                    subTotal += order.quantity * order.price

                                    return (
                                        <tr className='border-b'>
                                            <td className='flex ml-5 p-4'>
                                                <img src={order.image} alt="" />
                                                <div className="p-2 w-[200px] items-center ">
                                                    <p className="text-[14px] font-bold leading-[20px] tracking-[0.005em] text-[#333333] truncate">{order.name}</p>
                                                    <p className="text-[12px] leading-[18px] tracking-[0.005em] text-customGrey text-container">{order.category}</p>
                                                </div>
                                            </td>
                                            <td className='px-16'><p className="text-[#BC6C25] text-[14px], leading-[20px] tracking-[0.005em] font-semibold ">{order.SKU}</p></td>
                                            <td className='px-12'><p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-customGrey">{order.quantity} {order.quantity === 1 ? "pc" : "pcs"}</p></td>
                                            <td className='pl-20'><p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-customGrey ">${formatNumberWithCommas(order.price)}</p></td>
                                            <td className='pl-20'><p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-customGrey ">${formatNumberWithCommas(order.quantity * order.price)}</p></td>
                                        </tr>

                                    )
                                })

                                }
                                <tr className='border-t'>
                                    <td colSpan={3}></td>
                                    <td className="pl-20 py-8"><p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">Subtotal</p></td>
                                    <td className="pl-20"><p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">${formatNumberWithCommas(subTotal)}</p></td>
                                </tr>
                                <tr className='border-t'>
                                    <td colSpan={3}></td>
                                    <td className="pl-20 py-8"><p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">VAT(0)%</p></td>
                                    <td className="pl-20"><p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">${formatNumberWithCommas(0)}</p></td>
                                </tr>
                                <tr className='border-t'>
                                    <td colSpan={3}></td>
                                    <td className="pl-20 py-8"><p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">Delivery Fee</p></td>
                                    <td className="pl-20"><p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">${formatNumberWithCommas(deliveryFee)}</p></td>
                                </tr>
                                <tr className='border-t'>
                                    <td colSpan={3}></td>
                                    <td className="pl-20 py-8"><p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">Total</p></td>
                                    <td className="pl-20"><p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">${formatNumberWithCommas(subTotal + subTotal * VAT / 100 + deliveryFee)}</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="w-[30%] space-y-5">
                    <div className="mt-8 h-[154px] p-6 bg-white rounded-lg">
                        <p className="font-semibold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Address</p>
                        <div className="flex space-x-3 items-center">
                            <div className="flex rounded-full p-3 bg-[#F0F1F3] items-center">
                                <svg className="ml-auto mr-auto" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_785_4469)">
                                        <path d="M8.99991 0.0317383C7.01537 0.0339216 5.11272 0.823195 3.70936 2.22641C2.30601 3.62963 1.51654 5.53219 1.51416 7.51674C1.51416 9.44424 3.00666 12.4607 5.95041 16.4822C6.30086 16.9623 6.7597 17.3529 7.28961 17.6222C7.81952 17.8914 8.40552 18.0318 8.99991 18.0318C9.59431 18.0318 10.1803 17.8914 10.7102 17.6222C11.2401 17.3529 11.699 16.9623 12.0494 16.4822C14.9932 12.4607 16.4857 9.44424 16.4857 7.51674C16.4833 5.53219 15.6938 3.62963 14.2905 2.22641C12.8871 0.823195 10.9845 0.0339216 8.99991 0.0317383ZM8.99991 10.5002C8.40657 10.5002 7.82655 10.3243 7.3332 9.99465C6.83985 9.665 6.45533 9.19647 6.22827 8.64829C6.00121 8.10011 5.9418 7.49691 6.05755 6.91497C6.17331 6.33302 6.45903 5.79848 6.87859 5.37892C7.29815 4.95936 7.8327 4.67364 8.41464 4.55788C8.99658 4.44213 9.59978 4.50154 10.148 4.7286C10.6961 4.95566 11.1647 5.34018 11.4943 5.83353C11.824 6.32688 11.9999 6.90689 11.9999 7.50024C11.9999 8.29589 11.6838 9.05895 11.1212 9.62156C10.5586 10.1842 9.79556 10.5002 8.99991 10.5002Z" fill="#333333" fill-opacity="0.6" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_785_4469">
                                            <rect width="18" height="18" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>

                            </div>
                            <div>
                                <p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-customGrey ">Shipping Address</p>
                                <p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#333333] ">{customerAddress}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6">
                        <p className="mb-1 font-semibold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Order Status</p>
                        <div className="flex space-x-3">
                            <svg width="36" height="100" viewBox="0 0 36 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 36V98.7273" stroke="#E0E2E7" stroke-linecap="round" stroke-dasharray="4 4" />
                                <rect width="36" height="36" rx="18" fill="#F4ECFB" />
                                <g clip-path="url(#clip0_785_4479)">
                                    <path d="M22.5 18C21.7098 18.0009 20.9333 17.7935 20.2488 17.3986C19.5643 17.0038 18.996 16.4355 18.6012 15.751C18.2064 15.0664 17.999 14.2899 18 13.4997C18.001 12.7095 18.2103 11.9335 18.6068 11.25H12.1815L12.15 10.986C12.0854 10.4389 11.8223 9.93462 11.4106 9.56858C10.999 9.20254 10.4674 9.00023 9.9165 9H9.75C9.55109 9 9.36032 9.07902 9.21967 9.21967C9.07902 9.36032 9 9.55109 9 9.75C9 9.94891 9.07902 10.1397 9.21967 10.2803C9.36032 10.421 9.55109 10.5 9.75 10.5H9.9165C10.1002 10.5 10.2775 10.5675 10.4148 10.6895C10.5521 10.8116 10.6398 10.9798 10.6612 11.1623L11.6933 19.9373C11.8004 20.8498 12.2389 21.6913 12.9254 22.302C13.612 22.9127 14.4989 23.25 15.4178 23.25H23.25C23.4489 23.25 23.6397 23.171 23.7803 23.0303C23.921 22.8897 24 22.6989 24 22.5C24 22.3011 23.921 22.1103 23.7803 21.9697C23.6397 21.829 23.4489 21.75 23.25 21.75H15.4178C14.9534 21.7488 14.5008 21.6041 14.122 21.3355C13.7432 21.067 13.4568 20.6878 13.302 20.25H22.2428C23.122 20.2501 23.9733 19.9412 24.6479 19.3773C25.3225 18.8135 25.7775 18.0305 25.9335 17.1652L26.112 16.176C25.6948 16.7416 25.1506 17.2014 24.5232 17.5182C23.8959 17.835 23.2028 18 22.5 18Z" fill="#BC6C25" />
                                    <path d="M14.25 27.0005C15.0784 27.0005 15.75 26.3289 15.75 25.5005C15.75 24.6721 15.0784 24.0005 14.25 24.0005C13.4216 24.0005 12.75 24.6721 12.75 25.5005C12.75 26.3289 13.4216 27.0005 14.25 27.0005Z" fill="#BC6C25" />
                                    <path d="M21.75 27.0005C22.5784 27.0005 23.25 26.3289 23.25 25.5005C23.25 24.6721 22.5784 24.0005 21.75 24.0005C20.9216 24.0005 20.25 24.6721 20.25 25.5005C20.25 26.3289 20.9216 27.0005 21.75 27.0005Z" fill="#BC6C25" />
                                    <path d="M20.7998 15.7093C20.9288 15.8486 21.0847 15.9603 21.2581 16.0377C21.4315 16.115 21.6187 16.1564 21.8086 16.1593H21.8333C22.0194 16.1599 22.2037 16.1236 22.3756 16.0524C22.5474 15.9812 22.7035 15.8766 22.8346 15.7446L26.0386 12.5406C26.1799 12.3995 26.2594 12.2081 26.2596 12.0085C26.2598 11.8088 26.1807 11.6173 26.0397 11.4759C25.8987 11.3346 25.7073 11.2551 25.5076 11.2549C25.308 11.2547 25.1164 11.3338 24.9751 11.4748L21.8348 14.6203L20.9093 13.6273C20.7735 13.4818 20.5854 13.3962 20.3864 13.3894C20.1875 13.3826 19.994 13.4551 19.8485 13.5909C19.7029 13.7268 19.6174 13.9149 19.6105 14.1138C19.6037 14.3128 19.6762 14.5063 19.8121 14.6518L20.7998 15.7093Z" fill="#BC6C25" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_785_4479">
                                        <rect width="18" height="18" fill="white" transform="translate(9 9)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <div>
                                <p className="font-bold text-[16px] leading-[24px] tracking-[0.005em] text-[#333333]">Order Placed</p>
                                <p className="text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">An order has been placed.</p>
                                <p className="font-bold text-[12px] leading-[18px] tracking-[0.005em] text-[#858D9D]">12/12/2022, 03:00</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <svg width="36" height="100" viewBox="0 0 36 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 36V98.7273" stroke="#E0E2E7" stroke-linecap="round" stroke-dasharray="4 4" />
                                <rect width="36" height="36" rx="18" fill="#F4ECFB" />
                                <g clip-path="url(#clip0_785_4489)">
                                    <path d="M16.5 26.2495C16.5 26.4484 16.421 26.6392 16.2803 26.7798C16.1397 26.9205 15.9489 26.9995 15.75 26.9995H9.75C9.55109 26.9995 9.36032 26.9205 9.21967 26.7798C9.07902 26.6392 9 26.4484 9 26.2495C9 26.0506 9.07902 25.8598 9.21967 25.7192C9.36032 25.5785 9.55109 25.4995 9.75 25.4995H15.75C15.9489 25.4995 16.1397 25.5785 16.2803 25.7192C16.421 25.8598 16.5 26.0506 16.5 26.2495Z" fill="#BC6C25" />
                                    <path d="M9.75 24H14.25C14.4489 24 14.6397 23.921 14.7803 23.7803C14.921 23.6397 15 23.4489 15 23.25C15 23.0511 14.921 22.8603 14.7803 22.7197C14.6397 22.579 14.4489 22.5 14.25 22.5H9.75C9.55109 22.5 9.36032 22.579 9.21967 22.7197C9.07902 22.8603 9 23.0511 9 23.25C9 23.4489 9.07902 23.6397 9.21967 23.7803C9.36032 23.921 9.55109 24 9.75 24Z" fill="#BC6C25" />
                                    <path d="M9.75 21.0005H12.75C12.9489 21.0005 13.1397 20.9215 13.2803 20.7808C13.421 20.6402 13.5 20.4494 13.5 20.2505C13.5 20.0516 13.421 19.8608 13.2803 19.7202C13.1397 19.5795 12.9489 19.5005 12.75 19.5005H9.75C9.55109 19.5005 9.36032 19.5795 9.21967 19.7202C9.07902 19.8608 9 20.0516 9 20.2505C9 20.4494 9.07902 20.6402 9.21967 20.7808C9.36032 20.9215 9.55109 21.0005 9.75 21.0005Z" fill="#BC6C25" />
                                    <path d="M18 9C15.6131 9 13.3239 9.94821 11.636 11.636C9.94821 13.3239 9 15.6131 9 18C9 18.0457 9.006 18.09 9.00675 18.1357C9.24495 18.0484 9.49632 18.0025 9.75 18H12.75C13.1182 17.9988 13.481 18.0882 13.8064 18.2604C14.1318 18.4326 14.4099 18.6822 14.6159 18.9873C14.822 19.2924 14.9498 19.6436 14.988 20.0098C15.0262 20.376 14.9737 20.7459 14.835 21.087C15.1421 21.1676 15.4284 21.3128 15.6749 21.5129C15.9214 21.713 16.1224 21.9634 16.2643 22.2473C16.4063 22.5313 16.4861 22.8423 16.4983 23.1595C16.5104 23.4768 16.4548 23.793 16.335 24.087C16.6349 24.1635 16.9155 24.3021 17.1585 24.4939C17.4015 24.6856 17.6015 24.9263 17.7456 25.2002C17.8898 25.4741 17.9748 25.7753 17.9952 26.0841C18.0157 26.393 17.9711 26.7027 17.8643 26.9932C17.91 26.9932 17.9543 27 18 27C20.3869 27 22.6761 26.0518 24.364 24.364C26.0518 22.6761 27 20.3869 27 18C27 15.6131 26.0518 13.3239 24.364 11.636C22.6761 9.94821 20.3869 9 18 9V9ZM20.7802 20.7802C20.6396 20.9209 20.4489 20.9998 20.25 20.9998C20.0511 20.9998 19.8604 20.9209 19.7198 20.7802L17.4698 18.5302C17.3291 18.3896 17.25 18.1989 17.25 18V14.25C17.25 14.0511 17.329 13.8603 17.4697 13.7197C17.6103 13.579 17.8011 13.5 18 13.5C18.1989 13.5 18.3897 13.579 18.5303 13.7197C18.671 13.8603 18.75 14.0511 18.75 14.25V17.6895L20.7802 19.7198C20.9209 19.8604 20.9998 20.0511 20.9998 20.25C20.9998 20.4489 20.9209 20.6396 20.7802 20.7802Z" fill="#BC6C25" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_785_4489">
                                        <rect width="18" height="18" fill="white" transform="translate(9 9)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <div>
                                <p className="font-bold text-[16px] leading-[24px] tracking-[0.005em] text-[#333333]">Processing</p>
                                <p className="text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]">Seller has processed your order.</p>
                                <p className="font-bold text-[12px] leading-[18px] tracking-[0.005em] text-[#858D9D]">12/12/2022, 03:15</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <svg width="36" height="70" viewBox="0 0 36 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 36V69.4545" stroke="#E0E2E7" stroke-linecap="round" stroke-dasharray="4 4" />
                                <rect width="36" height="36" rx="18" fill="#F0F1F3" />
                                <g clip-path="url(#clip0_785_4499)">
                                    <path d="M16.5 13.5V9H19.5V13.5C19.5 13.8978 19.342 14.2794 19.0607 14.5607C18.7794 14.842 18.3978 15 18 15C17.6022 15 17.2206 14.842 16.9393 14.5607C16.658 14.2794 16.5 13.8978 16.5 13.5ZM21 12.75H27C26.9988 11.7558 26.6033 10.8027 25.9003 10.0997C25.1973 9.39666 24.2442 9.00119 23.25 9H21V12.75ZM15 9H12.75C11.7558 9.00119 10.8027 9.39666 10.0997 10.0997C9.39666 10.8027 9.00119 11.7558 9 12.75H15V9ZM27 14.25V23.25C26.9988 24.2442 26.6033 25.1973 25.9003 25.9003C25.1973 26.6033 24.2442 26.9988 23.25 27H12.75C11.7558 26.9988 10.8027 26.6033 10.0997 25.9003C9.39666 25.1973 9.00119 24.2442 9 23.25V14.25H15.1065C15.2702 14.8932 15.6435 15.4635 16.1675 15.8708C16.6915 16.2782 17.3363 16.4993 18 16.4993C18.6637 16.4993 19.3085 16.2782 19.8325 15.8708C20.3565 15.4635 20.7298 14.8932 20.8935 14.25H27ZM24 23.25C24 23.0511 23.921 22.8603 23.7803 22.7197C23.6397 22.579 23.4489 22.5 23.25 22.5H21C20.8011 22.5 20.6103 22.579 20.4697 22.7197C20.329 22.8603 20.25 23.0511 20.25 23.25C20.25 23.4489 20.329 23.6397 20.4697 23.7803C20.6103 23.921 20.8011 24 21 24H23.25C23.4489 24 23.6397 23.921 23.7803 23.7803C23.921 23.6397 24 23.4489 24 23.25Z" fill="#333333" fill-opacity="0.6" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_785_4499">
                                        <rect width="18" height="18" fill="white" transform="translate(9 9)" />
                                    </clipPath>
                                </defs>
                            </svg>

                            <div>
                                <p className="font-bold text-[16px] leading-[24px] tracking-[0.005em] text-[#333333]">Packed</p>
                                <p className="text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]"></p>
                                <p className="font-bold text-[12px] leading-[18px] tracking-[0.005em] text-[#858D9D]">DD/MM/YYY, 00:00</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <svg width="36" height="70" viewBox="0 0 36 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 36V69.4545" stroke="#E0E2E7" stroke-linecap="round" stroke-dasharray="4 4" />
                                <rect width="36" height="36" rx="18" fill="#F0F1F3" />
                                <g clip-path="url(#clip0_785_4509)">
                                    <path d="M20.25 22.4995H12C11.2044 22.4995 10.4413 22.1834 9.87868 21.6208C9.31607 21.0582 9 20.2952 9 19.4995V13.4995C9 12.5049 9.39509 11.5511 10.0983 10.8479C10.8016 10.1446 11.7554 9.74951 12.75 9.74951H16.5C16.9925 9.74951 17.4801 9.84651 17.9351 10.035C18.39 10.2234 18.8034 10.4996 19.1517 10.8479C19.4999 11.1961 19.7761 11.6095 19.9645 12.0644C20.153 12.5194 20.25 13.0071 20.25 13.4995V22.4995ZM27 17.2495V16.4995C27 16.0071 26.903 15.5194 26.7145 15.0644C26.5261 14.6095 26.2499 14.1961 25.9016 13.8479C25.5534 13.4996 25.14 13.2234 24.6851 13.035C24.2301 12.8465 23.7425 12.7495 23.25 12.7495H21.75V17.2495H27ZM21.75 18.7495V22.4995H24C24.7956 22.4995 25.5587 22.1834 26.1213 21.6208C26.6839 21.0582 27 20.2952 27 19.4995V18.7495H21.75ZM12.0435 23.9995C12.016 24.1227 12.0014 24.2483 12 24.3745C12 24.8718 12.1975 25.3487 12.5492 25.7003C12.9008 26.052 13.3777 26.2495 13.875 26.2495C14.3723 26.2495 14.8492 26.052 15.2008 25.7003C15.5525 25.3487 15.75 24.8718 15.75 24.3745C15.7486 24.2483 15.734 24.1227 15.7065 23.9995H12.0435ZM20.2935 23.9995C20.266 24.1227 20.2514 24.2483 20.25 24.3745C20.25 24.8718 20.4475 25.3487 20.7992 25.7003C21.1508 26.052 21.6277 26.2495 22.125 26.2495C22.6223 26.2495 23.0992 26.052 23.4508 25.7003C23.8025 25.3487 24 24.8718 24 24.3745C23.9986 24.2483 23.984 24.1227 23.9565 23.9995H20.2935Z" fill="#333333" fill-opacity="0.6" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_785_4509">
                                        <rect width="18" height="18" fill="white" transform="translate(9 9)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <div>
                                <p className="font-bold text-[16px] leading-[24px] tracking-[0.005em] text-[#333333]">Shipping</p>
                                <p className="text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]"></p>
                                <p className="font-bold text-[12px] leading-[18px] tracking-[0.005em] text-[#858D9D]">DD/MM/YYY, 00:00</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="18" fill="#F0F1F3" />
                                <g clip-path="url(#clip0_785_4519)">
                                    <path d="M21 9.225C21.5293 9.40648 22.011 9.70487 22.4093 10.098L23.6512 11.3415C24.0448 11.7392 24.3435 12.2207 24.525 12.75H21V9.225ZM24.75 14.25V23.25C24.7488 24.2442 24.3533 25.1973 23.6503 25.9003C22.9473 26.6033 21.9942 26.9988 21 27H15C14.0058 26.9988 13.0527 26.6033 12.3497 25.9003C11.6467 25.1973 11.2512 24.2442 11.25 23.25V12.75C11.2512 11.7558 11.6467 10.8027 12.3497 10.0997C13.0527 9.39666 14.0058 9.00119 15 9H19.5V12.75C19.5 13.1478 19.658 13.5294 19.9393 13.8107C20.2206 14.092 20.6022 14.25 21 14.25H24.75ZM21.606 22.0597C21.5481 21.9797 21.475 21.9118 21.3909 21.8601C21.3067 21.8084 21.2132 21.7738 21.1156 21.7583C21.018 21.7429 20.9184 21.7468 20.8223 21.77C20.7263 21.7931 20.6358 21.835 20.556 21.8932C20.0521 22.244 19.4635 22.4535 18.8513 22.5C18.6114 22.4934 18.3817 22.4017 18.2032 22.2413C17.8118 21.9307 17.3288 21.758 16.8293 21.75C15.9973 21.8282 15.2048 22.142 14.5448 22.6545C14.4628 22.7129 14.3935 22.7872 14.3409 22.8729C14.2883 22.9587 14.2534 23.0541 14.2385 23.1536C14.2235 23.2531 14.2287 23.3545 14.2537 23.452C14.2788 23.5494 14.3232 23.6408 14.3843 23.7207C14.4454 23.8006 14.5219 23.8674 14.6094 23.9172C14.6968 23.9669 14.7934 23.9985 14.8933 24.0102C14.9932 24.0218 15.0945 24.0132 15.191 23.9849C15.2876 23.9567 15.3774 23.9092 15.4553 23.8455C15.8547 23.5326 16.3278 23.3276 16.8293 23.25C17.0138 23.25 17.1075 23.3085 17.3542 23.475C17.7816 23.8126 18.3097 23.9974 18.8542 24C19.7864 23.9574 20.6864 23.6467 21.4462 23.1052C21.6056 22.9874 21.7119 22.8114 21.7418 22.6155C21.7717 22.4196 21.7229 22.2198 21.606 22.0597ZM21.75 19.5C21.75 19.3011 21.671 19.1103 21.5303 18.9697C21.3897 18.829 21.1989 18.75 21 18.75H15C14.8011 18.75 14.6103 18.829 14.4697 18.9697C14.329 19.1103 14.25 19.3011 14.25 19.5C14.25 19.6989 14.329 19.8897 14.4697 20.0303C14.6103 20.171 14.8011 20.25 15 20.25H21C21.1989 20.25 21.3897 20.171 21.5303 20.0303C21.671 19.8897 21.75 19.6989 21.75 19.5ZM21.75 16.5C21.75 16.3011 21.671 16.1103 21.5303 15.9697C21.3897 15.829 21.1989 15.75 21 15.75H15C14.8011 15.75 14.6103 15.829 14.4697 15.9697C14.329 16.1103 14.25 16.3011 14.25 16.5C14.25 16.6989 14.329 16.8897 14.4697 17.0303C14.6103 17.171 14.8011 17.25 15 17.25H21C21.1989 17.25 21.3897 17.171 21.5303 17.0303C21.671 16.8897 21.75 16.6989 21.75 16.5Z" fill="#333333" fill-opacity="0.6" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_785_4519">
                                        <rect width="18" height="18" fill="white" transform="translate(9 9)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <div>
                                <p className="font-bold text-[16px] leading-[24px] tracking-[0.005em] text-[#333333]">Delivered</p>
                                <p className="text-[14px] leading-[20px] tracking-[0.005em] text-[#333333]"></p>
                                <p className="font-bold text-[12px] leading-[18px] tracking-[0.005em] text-[#858D9D]">DD/MM/YYY, 00:00</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}