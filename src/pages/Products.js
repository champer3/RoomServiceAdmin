import moment from 'moment'
import { numbers } from '../assets/data'
import Path from '../components/Path'
import TabButton from '../components/TabButton'
import TableHead from '../components/dashboard_components/TableHead'
import { useState } from 'react'
import image from '../assets/HotPockets.png'
import OrangeLabel from '../components/StatusLabels/OrangeLabel'
import StyledDashboardButton from '../components/dashboard_components/StyledDashboardButton'
import MiniSearch from '../components/MiniSearch'
import FilterButton from '../components/FilterButton'
import SelectDatesButton from '../components/SelectDatesButton'
import { Link } from 'react-router-dom'



function formatDate(dateObject) {
    return moment(dateObject).format("D MMM YYYY")
}
const date = new Date(2023, 0, 16)
export default function ProductsPage() {
    const [activePage, setActivePage] = useState('all')
    const [selectedRows, setSelectedRows] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20

    const shownItems = numbers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    function handleSelectTabButton(page) {
        setActivePage(page)
    }

    function handleIsSelected(row) {
        setSelectedRows((prevState) => {
            return [
                ...prevState,
                row
            ]
        })
    }

    function handleChangePage(newPage) {
        setCurrentPage(newPage)
    }

    function handleIsRemoved(row) {
        setSelectedRows((prevState) => {
            return prevState.filter((item => item !== row))
        })
    }
    return (
        <div className='ml-4'>
            <p className='text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]'>Product</p>
            <Path pages={['Dashboard', 'Product List']} />
            <div className='flex items-center'>
                <div className='mt-8 flex border border-[#E0E2E7] bg-white rounded-lg p-[2px] w-[255px]'>
                    <TabButton handleSelect={() => handleSelectTabButton('all')} isSelected={activePage === 'all'} >All Products</TabButton>
                    <TabButton handleSelect={() => handleSelectTabButton('published')} isSelected={activePage === 'published'} >Published</TabButton>
                    <TabButton handleSelect={() => handleSelectTabButton('draft')} isSelected={activePage === 'draft'} >Draft</TabButton>
                </div>
                <div className='flex space-x-4 mt-8 ml-auto'>
                    <MiniSearch />
                    <SelectDatesButton />
                    <Link to={'/add-products'}>Add Products</Link> 
                    <FilterButton />
                </div>
            </div>
            {activePage === 'all' &&
                <div className='mt-5'>
                    {/* <div className=''></div> */}
                    <table className='w-full bg-white rounded-xl'>
                        <tr className='border-b'>
                            <th className='pt-3'>
                                <button className='ml-4'>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="20" height="20" rx="6" fill="#BC6C25" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 10C3.75 9.53978 4.1231 9.16669 4.58333 9.16669H15.4167C15.8769 9.16669 16.25 9.53978 16.25 10C16.25 10.4603 15.8769 10.8334 15.4167 10.8334H4.58333C4.1231 10.8334 3.75 10.4603 3.75 10Z" fill="white" />
                                    </svg>


                                </button>
                            </th>
                            <th className='w-[272px]'><TableHead heading={'Product'} canOrder={true} /></th>
                            <th className='pl-2 w-[153px]'><TableHead heading={'SKU'} /></th>
                            <th className='w-[153px]'><TableHead heading={'Category'} /></th>
                            <th className=''><TableHead heading={'Stock'} canOrder={true} /></th>
                            <th className=''><TableHead heading={'Price'} canOrder={true} /></th>
                            <th className=''><TableHead heading={'Status'} canOrder={true} /></th>
                            <th className=''><TableHead heading={'Added'} canOrder={true} /></th>
                        </tr>
                        <tbody>
                            <tr className={`${selectedRows.indexOf('302012') !== -1 ? 'bg-[#F9F9FC]' : ''}`}>
                                <th className='pt-3'>

                                    {selectedRows.indexOf('302012') === -1 ?
                                        <button onClick={() => handleIsSelected('302012')} className='ml-4'>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="1" y="1" width="18" height="18" rx="5" fill="white" stroke="#858D9D" stroke-width="2" />
                                            </svg>
                                        </button> :
                                        <button onClick={() => handleIsRemoved('302012')} className='ml-4'>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="20" height="20" rx="6" fill="#BC6C25" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.947 4.77386C16.302 5.06675 16.3523 5.59197 16.0594 5.94699L8.91034 14.6126C8.76045 14.7943 8.48987 14.8157 8.31326 14.6598L4.44862 11.2499C4.10351 10.9454 4.0706 10.4188 4.3751 10.0737C4.67961 9.72855 5.20622 9.69563 5.55132 10.0001L8.44704 12.5552L14.7738 4.88635C15.0667 4.53134 15.5919 4.48097 15.947 4.77386Z" fill="white" />
                                            </svg>
                                        </button>

                                    }

                                </th>
                                <td className='flex ml-5 py-2'>
                                    <img src={image} alt="" />
                                    <div className="pl-2 w-[150px] items-center ">
                                        <p className="text-[14px] font-bold leading-[20px] tracking-[0.005em] text-[#333333] text-container line-clamp-2">Chips Ahoy! Chewy Chocolate Chip...</p>
                                    </div>
                                </td>
                                <td className='p-0'>
                                    <p className='ml-7 font-semibold text-[14px] text-[#BC6C25] leading-[20px] tracking[0.005em]'>302012</p>
                                </td>
                                <td className='p-0'>
                                    <p className='ml-6 font-semibold text-[14px] text-customGrey leading-[20px] tracking[0.005em]'>Snacks</p>
                                </td>
                                <td className='p-0'>
                                    <p className='ml-6 font-semibold text-[14px] text-customGrey leading-[20px] tracking[0.005em]'>10</p>
                                </td>
                                <td className='p-0'>
                                    <p className='ml-6 font-semibold text-[14px] text-customGrey leading-[20px] tracking[0.005em]'>$3.99</p>
                                </td>
                                <td className='pl-6'>
                                    <OrangeLabel>Low Stock</OrangeLabel>
                                </td>
                                <td className=''>
                                    <p className='ml-6 font-semibold text-[14px] text-customGrey leading-[20px] tracking[0.005em]'>{formatDate(date)}</p>
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={8}>
                                    <div className='rounded-b-xl w-full bg-white p-4 border-t items-center flex'>
                                        <p className='font-semibold text-[14px] text-customGrey leading-[20px] tracking-[0.005em]'>Showing 1-10 from 100</p>
                                        <div className='ml-auto flex space-x-2'>
                                            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                                                <StyledDashboardButton><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10.86 14.3933L7.14003 10.6667C7.01586 10.5418 6.94617 10.3728 6.94617 10.1967C6.94617 10.0205 7.01586 9.85158 7.14003 9.72667L10.86 6.00001C10.9533 5.90599 11.0724 5.84187 11.2022 5.81582C11.3321 5.78977 11.4667 5.80298 11.589 5.85376C11.7113 5.90454 11.8157 5.99058 11.8889 6.10093C11.9621 6.21128 12.0008 6.34092 12 6.47334V13.92C12.0008 14.0524 11.9621 14.1821 11.8889 14.2924C11.8157 14.4028 11.7113 14.4888 11.589 14.5396C11.4667 14.5904 11.3321 14.6036 11.2022 14.5775C11.0724 14.5515 10.9533 14.4874 10.86 14.3933Z" fill="currentColor" />
                                                </svg>
                                                </StyledDashboardButton>
                                            </button>
                                            <StyledDashboardButton>1</StyledDashboardButton>
                                            <StyledDashboardButton>2</StyledDashboardButton>
                                            <StyledDashboardButton>3</StyledDashboardButton>
                                            <StyledDashboardButton>...</StyledDashboardButton>
                                            <button onClick={() => setCurrentPage(Math.min(numbers.length, currentPage + 1))}>
                                                <StyledDashboardButton><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6 11.9193V4.47133C6.00003 4.3395 6.03914 4.21064 6.1124 4.10103C6.18565 3.99142 6.28976 3.906 6.41156 3.85555C6.53336 3.8051 6.66738 3.7919 6.79669 3.81761C6.92599 3.84332 7.04476 3.90679 7.138 4L10.862 7.724C10.987 7.84902 11.0572 8.01856 11.0572 8.19533C11.0572 8.37211 10.987 8.54165 10.862 8.66667L7.138 12.3907C7.04476 12.4839 6.92599 12.5473 6.79669 12.5731C6.66738 12.5988 6.53336 12.5856 6.41156 12.5351C6.28976 12.4847 6.18565 12.3992 6.1124 12.2896C6.03914 12.18 6.00003 12.0512 6 11.9193Z" fill="currentColor" />
                                                </svg>
                                                </StyledDashboardButton>
                                            </button>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </tbody>
                    </table>

                </div>} {

                activePage === 'published' &&
                <>
                    {shownItems.map((item) =>
                        <li>{item}</li>)}
                    <div className='flex'>
                        <StyledDashboardButton isDisabled={currentPage === 1} handleClick={() => handleChangePage(Math.max(1, currentPage - 1))}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.86 14.3933L7.14003 10.6667C7.01586 10.5418 6.94617 10.3728 6.94617 10.1967C6.94617 10.0205 7.01586 9.85158 7.14003 9.72667L10.86 6.00001C10.9533 5.90599 11.0724 5.84187 11.2022 5.81582C11.3321 5.78977 11.4667 5.80298 11.589 5.85376C11.7113 5.90454 11.8157 5.99058 11.8889 6.10093C11.9621 6.21128 12.0008 6.34092 12 6.47334V13.92C12.0008 14.0524 11.9621 14.1821 11.8889 14.2924C11.8157 14.4028 11.7113 14.4888 11.589 14.5396C11.4667 14.5904 11.3321 14.6036 11.2022 14.5775C11.0724 14.5515 10.9533 14.4874 10.86 14.3933Z" fill="currentColor" />
                            </svg>
                        </StyledDashboardButton>
                        <StyledDashboardButton handleClick={() => handleChangePage(1)} isActive={currentPage === 1}>1</StyledDashboardButton>
                        <StyledDashboardButton handleClick={() => handleChangePage(2)} isActive={currentPage === 2}>2</StyledDashboardButton>
                        <StyledDashboardButton handleClick={() => handleChangePage(3)} isActive={currentPage === 3}>3</StyledDashboardButton>
                        <StyledDashboardButton handleClick={() => handleChangePage(4)} isActive={currentPage === 4}>4</StyledDashboardButton>
                        <StyledDashboardButton handleClick={() => handleChangePage(5)} isActive={currentPage === 5}>5</StyledDashboardButton>
                        <StyledDashboardButton isDisabled={currentPage === 5} handleClick={() => handleChangePage(Math.min(numbers.length / itemsPerPage, currentPage + 1))}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 11.9193V4.47133C6.00003 4.3395 6.03914 4.21064 6.1124 4.10103C6.18565 3.99142 6.28976 3.906 6.41156 3.85555C6.53336 3.8051 6.66738 3.7919 6.79669 3.81761C6.92599 3.84332 7.04476 3.90679 7.138 4L10.862 7.724C10.987 7.84902 11.0572 8.01856 11.0572 8.19533C11.0572 8.37211 10.987 8.54165 10.862 8.66667L7.138 12.3907C7.04476 12.4839 6.92599 12.5473 6.79669 12.5731C6.66738 12.5988 6.53336 12.5856 6.41156 12.5351C6.28976 12.4847 6.18565 12.3992 6.1124 12.2896C6.03914 12.18 6.00003 12.0512 6 11.9193Z" fill="currentColor" />
                            </svg>
                        </StyledDashboardButton>
                    </div>


                </>}
        </div >
    )
}