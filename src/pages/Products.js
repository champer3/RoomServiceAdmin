import moment from 'moment'
import { PRODUCT_LIST } from '../assets/data'
import Path from '../components/Path'
import TabButton from '../components/TabButton'
import TableHead from '../components/dashboard_components/TableHead'
import { useContext, useState } from 'react'
import OrangeLabel from '../components/StatusLabels/OrangeLabel'
import StyledDashboardButton from '../components/dashboard_components/StyledDashboardButton'
import MiniSearch from '../components/MiniSearch'
import FilterButton from '../components/FilterButton'
import SelectDatesButton from '../components/SelectDatesButton'
import { Link } from 'react-router-dom'
import GreenLabel from '../components/StatusLabels/GreenLabel'
import GreyLabel from '../components/StatusLabels/GreyLabel'
import { PageContext } from '../context/PageContext'


function formatNumberWithCommas(number) {
    const formattedNumber = parseFloat(number.toFixed(2)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return formattedNumber;
}

function formatDate(dateObject) {
    return moment(dateObject).format("D MMM YYYY")
}

// With this function you can access all the products in the database
// Todo: We need to implement something in the backend that only sends out 20 products at a time, for buffer reasons
const getAllProducts = async () => {
    try {
        const products = await axios.get(
            `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/products`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return products
    } catch (err) {
        console.log(err)
    }
}

export default function ProductsPage() {
    const itemsPerPage = 10
    const [activePage, setActivePage] = useState('all')
    const [selectedRows, setSelectedRows] = useState([])
    const [activeColumn, setActiveColumn] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [productList, setProductList] = useState(PRODUCT_LIST)
    const [shownItems, setShownItems] = useState((productList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)))

    const lastPage = (productList.length % itemsPerPage === 0 ? productList.length / itemsPerPage : Math.floor(productList.length / itemsPerPage) + 1)


    const arr = [];
    for (let i = 1; i <= lastPage; i++) {
        arr.push(i);
    }
    const { changePage } = useContext(PageContext)

    // const shownItems = productList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    // productList.sort((a,b) => a['name'].localeCompare(b['name']))

    function handlePageClick(pageNum) {
        setCurrentPage(pageNum)
        setShownItems((productList.slice((pageNum - 1) * itemsPerPage, pageNum * itemsPerPage)))
    }

    function handleAscendingSort(criteria) {
        setActiveColumn(criteria)
        if (criteria === 'status' || criteria === 'name') {
            setShownItems((prevList) => {
                prevList.sort((a, b) => a[criteria].localeCompare(b[criteria]))
                return [...prevList]
            })
        }
        else {
            setShownItems((prevList) => {
                prevList.sort((a, b) => a[criteria] - b[criteria])
                return [...prevList]
            })
        }
    }

    function handleDescendingSort(criteria) {
        setActiveColumn(criteria)
        if (criteria === 'status' || criteria === 'name') {
            setShownItems((prevList) => {
                prevList.sort((a, b) => b[criteria].localeCompare(a[criteria]))
                return [...prevList]
            })
        }
        else {
            setShownItems((prevList) => {
                prevList.sort((a, b) => b[criteria] - a[criteria])
                return [...prevList]
            })
        }
    }

    function handleSelectTabButton(page) {
        setActivePage(page)
        if (page === 'all') {
            setProductList(() => PRODUCT_LIST)
            setShownItems((PRODUCT_LIST.slice(0, 10)))
            setCurrentPage(1)
            return
        }
        setProductList(() => {
            const result = PRODUCT_LIST.filter((item) => {
                return (item.status).toLowerCase() === page
            })
            setShownItems((result.slice(0, 10)))
            return result

        })
        setCurrentPage(1)
    }

    function handleIsSelected(row) {
        setSelectedRows((prevState) => {
            return [
                ...prevState,
                row
            ]
        })
    }


    function handleIsRemoved(row) {
        setSelectedRows((prevState) => {
            return prevState.filter((item => item !== row))
        })
    }

    return (
        <>
            {changePage('products')}
            <div className='ml-4'>
                <div className='flex items-center'>
                    <div>
                        <p className='text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]'>Product</p>
                        <Path pages={[{ name: 'Dashboard', link: 'dashboard' }, { name: 'Product List', link: 'products' }]} />
                    </div>
                    <div className='flex ml-auto'>
                        <button className='flex border border-[#283618] rounded-xl mr-2 px-[14px] py-[10px] text-[#283618] font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>
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
                        <Link to={'/add-products'}>
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
                                <p className='ml-2'>Add Product</p>
                            </button>
                        </Link>
                    </div>
                </div>
                <div className='flex items-center'>
                    <div className='mt-8 flex border border-[#E0E2E7] bg-white rounded-lg p-[2px] w-[255px]'>
                        <TabButton handleSelect={() => handleSelectTabButton('all')} isSelected={activePage === 'all'} >All Products</TabButton>
                        <TabButton handleSelect={() => handleSelectTabButton('published')} isSelected={activePage === 'published'} >Published</TabButton>
                        <TabButton handleSelect={() => handleSelectTabButton('draft')} isSelected={activePage === 'draft'} >Draft</TabButton>
                    </div>
                    <div className='flex space-x-4 mt-8 ml-auto'>
                        <MiniSearch />
                        <SelectDatesButton />

                        <FilterButton />
                    </div>
                </div>

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
                            <th className='pl-6 w-[105px]'><TableHead heading={'Product'} active={activeColumn === 'name'} canOrder={true} ascend={() => handleAscendingSort('name')} descend={() => handleDescendingSort('name')} /></th>
                            <th className='pl-7 w-[100px]'><TableHead heading={'SKU'} /></th>
                            <th className='pl- w-[100px]'><TableHead heading={'Category'} /></th>
                            <th className='pl- w-[100px]'><TableHead heading={'Stock'} active={activeColumn === 'stock'} canOrder={true} ascend={() => handleAscendingSort('stock')} descend={() => handleDescendingSort('stock')} /></th>
                            <th className='pl-6 w-[100px]'><TableHead heading={'Price'} active={activeColumn === 'price'} canOrder={true} ascend={() => handleAscendingSort('price')} descend={() => handleDescendingSort('price')} /></th>
                            <th className='pl-12 w-[100px]'><TableHead heading={'Status'} active={activeColumn === 'status'} canOrder={true} ascend={() => handleAscendingSort('status')} descend={() => handleDescendingSort('status')} /></th>
                            <th className='pl-5 w-[70px]'><TableHead heading={'Added'} active={activeColumn === 'dateAdded'} canOrder={true} ascend={() => handleAscendingSort('dateAdded')} descend={() => handleDescendingSort('dateAdded')} /></th>
                        </tr>
                        <tbody>
                            {shownItems.map((product) => {
                                return (
                                    <tr className={`${selectedRows.indexOf(product.SKU) !== -1 ? 'bg-[#F9F9FC]' : ''} border-b`}>
                                        <th className='w-[30px] pt-3'>

                                            {selectedRows.indexOf(product.SKU) === -1 ?
                                                <button onClick={() => handleIsSelected(product.SKU)} className='ml-4'>
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect x="1" y="1" width="18" height="18" rx="5" fill="white" stroke="#858D9D" stroke-width="2" />
                                                    </svg>
                                                </button> :
                                                <button onClick={() => handleIsRemoved(product.SKU)} className='ml-4'>
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="20" height="20" rx="6" fill="#BC6C25" />
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.947 4.77386C16.302 5.06675 16.3523 5.59197 16.0594 5.94699L8.91034 14.6126C8.76045 14.7943 8.48987 14.8157 8.31326 14.6598L4.44862 11.2499C4.10351 10.9454 4.0706 10.4188 4.3751 10.0737C4.67961 9.72855 5.20622 9.69563 5.55132 10.0001L8.44704 12.5552L14.7738 4.88635C15.0667 4.53134 15.5919 4.48097 15.947 4.77386Z" fill="white" />
                                                    </svg>
                                                </button>

                                            }

                                        </th>
                                        <td className='flex ml-5 py-2'>
                                            <img src={product.image} alt="" />
                                            <div className="pl-2 w-[150px] items-center ">
                                                <p className="text-[14px] font-bold leading-[20px] tracking-[0.005em] text-[#333333] text-container line-clamp-2">{product.name}</p>
                                            </div>
                                        </td>
                                        <td className='pl-6'>
                                            <p className=' font-semibold text-[14px] text-[#BC6C25] leading-[20px] tracking[0.005em]'>{product.SKU}</p>
                                        </td>
                                        <td className=' p-0'>
                                            <p className=' font-semibold text-[14px] text-customGrey leading-[20px] tracking[0.005em]'>{product.category}</p>
                                        </td>
                                        <td className='p-0'>
                                            <p className='font-semibold text-[14px] text-customGrey leading-[20px] tracking[0.005em]'>{product.stock}</p>
                                        </td>
                                        <td className='pl-6'>
                                            <p className=' font-semibold text-[14px] text-customGrey leading-[20px] tracking[0.005em]'>${formatNumberWithCommas(product.price)}</p>
                                        </td>
                                        <td className='pl-12'>
                                            {product.status === 'Low Stock' && <OrangeLabel>{product.status}</OrangeLabel>}
                                            {product.status === 'Published' && <GreenLabel>{product.status}</GreenLabel>}
                                            {product.status === 'Draft' && <GreyLabel>{product.status}</GreyLabel>}

                                        </td>
                                        <td className='pl-4 '>
                                            <p className='font-semibold text-[14px] text-customGrey leading-[20px] tracking[0.005em]'>{formatDate(product.dateAdded)}</p>
                                        </td>
                                    </tr>
                                )
                            })}

                            <tr>
                                <th colSpan={8}>
                                    <div className='rounded-b-xl w-full p-4 items-center flex'>
                                        <p className='font-semibold text-[14px] text-customGrey leading-[20px] tracking-[0.005em]'>Showing {(currentPage - 1) * itemsPerPage + 1}-{(currentPage - 1) * itemsPerPage + itemsPerPage > productList.length ? productList.length : (currentPage - 1) * itemsPerPage + itemsPerPage} from {productList.length}</p>
                                        <div className='ml-auto flex space-x-2'>
                                            <button onClick={() => handlePageClick(Math.max(1, currentPage - 1))}>
                                                <StyledDashboardButton isDisabled={currentPage === 1}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10.86 14.3933L7.14003 10.6667C7.01586 10.5418 6.94617 10.3728 6.94617 10.1967C6.94617 10.0205 7.01586 9.85158 7.14003 9.72667L10.86 6.00001C10.9533 5.90599 11.0724 5.84187 11.2022 5.81582C11.3321 5.78977 11.4667 5.80298 11.589 5.85376C11.7113 5.90454 11.8157 5.99058 11.8889 6.10093C11.9621 6.21128 12.0008 6.34092 12 6.47334V13.92C12.0008 14.0524 11.9621 14.1821 11.8889 14.2924C11.8157 14.4028 11.7113 14.4888 11.589 14.5396C11.4667 14.5904 11.3321 14.6036 11.2022 14.5775C11.0724 14.5515 10.9533 14.4874 10.86 14.3933Z" fill="currentColor" />
                                                </svg>
                                                </StyledDashboardButton>
                                            </button>
                                            {arr.map((pageNum) => {
                                                return <StyledDashboardButton handleClick={() => (handlePageClick(pageNum))} isActive={currentPage === pageNum}>{pageNum}</StyledDashboardButton>
                                            })
                                            }
                                            <StyledDashboardButton handleClick={() => handlePageClick(Math.min(shownItems.length, currentPage + 1))} isDisabled={currentPage === lastPage}><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 11.9193V4.47133C6.00003 4.3395 6.03914 4.21064 6.1124 4.10103C6.18565 3.99142 6.28976 3.906 6.41156 3.85555C6.53336 3.8051 6.66738 3.7919 6.79669 3.81761C6.92599 3.84332 7.04476 3.90679 7.138 4L10.862 7.724C10.987 7.84902 11.0572 8.01856 11.0572 8.19533C11.0572 8.37211 10.987 8.54165 10.862 8.66667L7.138 12.3907C7.04476 12.4839 6.92599 12.5473 6.79669 12.5731C6.66738 12.5988 6.53336 12.5856 6.41156 12.5351C6.28976 12.4847 6.18565 12.3992 6.1124 12.2896C6.03914 12.18 6.00003 12.0512 6 11.9193Z" fill="currentColor" />
                                            </svg>
                                            </StyledDashboardButton>
                                        </div>

                                    </div>
                                </th>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div >
            
        </>
    )
}