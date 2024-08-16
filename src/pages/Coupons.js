import { useContext, useState } from "react"
import Path from "../components/Path"
import { Link } from "react-router-dom"
// import TabButton from "../components/TabButton"
import MiniSearch from "../components/MiniSearch"
import FilterButton from "../components/FilterButton"
// import { CUSTOMER_LIST } from "../assets/data"
// import CustomerInfoCard from "../components/customer_components/CustomerInfoCard"
import StyledDashboardButton from "../components/dashboard_components/StyledDashboardButton"
import Tabutton from "../components/Tabutton"
import CouponsInfoCard from "../components/CouponsInfoCard"
import { PageContext } from "../context/PageContext"
export default function CouponsPage() {
    const COUPONS_LIST = [
        { name: "NEWUSER2025", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2025", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2025", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2025", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2025", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2025", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2025", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2025", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2025", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2025", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2025", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2025", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2025", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2025", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2025", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2024", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Expired", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Active", value: 10, used: 267 },
        { name: "NEWUSER2023", status: "Expired", value: 10, used: 267 },
    ]
        

    const [activePage, setActivePage] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(COUPONS_LIST)
    const { changePage } = useContext(PageContext)

    const itemsPerPage = 15
    const lastPage = totalItems.length % itemsPerPage === 0 ? totalItems.length / itemsPerPage : Math.floor(totalItems.length / itemsPerPage) + 1
    const shownItems = (totalItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage))

    const arr = [];
    for (let i = 1; i <= lastPage; i++) {
        arr.push(i);
    }

    function handleSelectTabButton(page) {
        setActivePage(page)
        if (page === 'all') {
            setTotalItems(COUPONS_LIST)
            setCurrentPage(1)
            return
        }

        const filtered = COUPONS_LIST.filter((item) => {
            return (item.status).toLowerCase() === page
        })
        setTotalItems(filtered)
        setCurrentPage(1)

    }

    function formatNumberWithCommas(number) {
        const formattedNumber = parseFloat(number.toFixed(2)).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        return formattedNumber;
    }

    function displayRow(row) {
        // CustomerInfoCard({ name, status, labelColor, leftData, leftDetail, rightData, rightDetail })
        return (
            <tr className="">
                {row.map((item) => {
                    return <td className="p-2">
                        <CouponsInfoCard name={item.name} status={item.status} labelColor={(item.status).toLowerCase() === 'active' ? 'green' : 'red'} leftData={formatNumberWithCommas(item.value)} leftDetail={"Value"} rightData={formatNumberWithCommas(item.used)} rightDetail={"Used"} />
                    </td>
                }
                )
                }
            </tr >
        )
    }

    function displayRows(itemList) {
        const res = []
        for (let i = 0; i < itemList.length; i += 5) {
            const row = itemList.slice(i, i + 5)
            res.push(displayRow(row))
        }
        return res
    }

    return (
        <>
            {changePage('coupons')}
            <div className="flex w-full items-center">
                <div>
                    <p className='text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]'>Coupons</p>
                    <Path pages={[{ name: 'Dashboard', link: 'dashboard' }, { name: 'Coupons', link: 'coupons' }]} />
                </div>
                <div className='flex ml-auto'>
                    <button className='flex border-none bg-white hover:border-[#283618] rounded-xl mr-2 px-[14px] py-[10px] text-[#283618] font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>
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
                    <Link to={'/add-coupons'}>
                        <button className='flex items-center rounded-xl px-[14px] py-[10px] bg-[#283618] text-white font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_499_3320)">
                                    <path d="M17.3333 9.33333H10.6667V2.66667C10.6667 2.48986 10.5964 2.32029 10.4714 2.19526C10.3464 2.07024 10.1768 2 10 2V2C9.82319 2 9.65362 2.07024 9.5286 2.19526C9.40357 2.32029 9.33333 2.48986 9.33333 2.66667V9.33333H2.66667C2.48986 9.33333 2.32029 9.40357 2.19526 9.5286C2.07024 9.65362 2 9.82319 2 10V10C2 10.1768 2.07024 10.3464 2.19526 10.4714C2.32029 10.5964 2.48986 10.6667 2.66667 10.6667H9.33333V17.3333C9.33333 17.5101 9.40357 17.6797 9.5286 17.8047C9.65362 17.9298 9.82319 18 10 18C10.1768 18 10.3464 17.9298 10.4714 17.8047C10.5964 17.6797 10.6667 17.5101 10.6667 17.3333V10.6667H17.3333C17.5101 10.6667 17.6797 10.5964 17.8047 10.4714C17.9298 10.3464 18 10.1768 18 10C18 9.82319 17.9298 9.65362 17.8047 9.5286C17.6797 9.40357 17.5101 9.33333 17.3333 9.33333Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_499_3320">
                                        <rect width="16" height="16" fill="white" transform="translate(2 2)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <p className='ml-2'>Add Coupon</p>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="mt-5 flex w-full items-center">
                <div className='flex border border-[#E0E2E7] bg-white rounded-lg p-[2px]'>
                    <Tabutton handleSelect={() => handleSelectTabButton('all')} isSelected={activePage === 'all'} >All Status</Tabutton>
                    <Tabutton handleSelect={() => handleSelectTabButton('active')} isSelected={activePage === 'active'} >Active</Tabutton>
                    <Tabutton handleSelect={() => handleSelectTabButton('expired')} isSelected={activePage === 'expired'} >Expired</Tabutton>
                </div>
                <div className="flex items-center h-[50px] ml-auto space-x-3">
                    <MiniSearch searchItem={'customers'} />
                    <FilterButton />
                </div>
            </div>

            <table className="w-full">
                {displayRows(shownItems)}
            </table>

            <div className='rounded-b-xl w-full p-4 items-center flex'>
                <p className='font-semibold text-[14px] text-customGrey leading-[20px] tracking-[0.005em]'>Showing {(currentPage - 1) * itemsPerPage + 1}-{(currentPage - 1) * itemsPerPage + itemsPerPage > totalItems.length ? totalItems.length : (currentPage - 1) * itemsPerPage + itemsPerPage} from {totalItems.length}</p>
                <div className='ml-auto flex space-x-2'>
                    <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                        <StyledDashboardButton isDisabled={currentPage === 1}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.86 14.3933L7.14003 10.6667C7.01586 10.5418 6.94617 10.3728 6.94617 10.1967C6.94617 10.0205 7.01586 9.85158 7.14003 9.72667L10.86 6.00001C10.9533 5.90599 11.0724 5.84187 11.2022 5.81582C11.3321 5.78977 11.4667 5.80298 11.589 5.85376C11.7113 5.90454 11.8157 5.99058 11.8889 6.10093C11.9621 6.21128 12.0008 6.34092 12 6.47334V13.92C12.0008 14.0524 11.9621 14.1821 11.8889 14.2924C11.8157 14.4028 11.7113 14.4888 11.589 14.5396C11.4667 14.5904 11.3321 14.6036 11.2022 14.5775C11.0724 14.5515 10.9533 14.4874 10.86 14.3933Z" fill="currentColor" />
                        </svg>
                        </StyledDashboardButton>
                    </button>
                    {arr.map((pageNum) => {
                        return <StyledDashboardButton handleClick={() => (setCurrentPage(pageNum))} isActive={currentPage === pageNum}>{pageNum}</StyledDashboardButton>
                    })
                    }
                    <StyledDashboardButton handleClick={() => setCurrentPage(Math.min(shownItems.length, currentPage + 1))} isDisabled={currentPage === lastPage}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 11.9193V4.47133C6.00003 4.3395 6.03914 4.21064 6.1124 4.10103C6.18565 3.99142 6.28976 3.906 6.41156 3.85555C6.53336 3.8051 6.66738 3.7919 6.79669 3.81761C6.92599 3.84332 7.04476 3.90679 7.138 4L10.862 7.724C10.987 7.84902 11.0572 8.01856 11.0572 8.19533C11.0572 8.37211 10.987 8.54165 10.862 8.66667L7.138 12.3907C7.04476 12.4839 6.92599 12.5473 6.79669 12.5731C6.66738 12.5988 6.53336 12.5856 6.41156 12.5351C6.28976 12.4847 6.18565 12.3992 6.1124 12.2896C6.03914 12.18 6.00003 12.0512 6 11.9193Z" fill="currentColor" />
                        </svg>
                    </StyledDashboardButton>
                </div>

            </div>

        </>
    )
}