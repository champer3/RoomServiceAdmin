import TotalCustomers from '../components/dashboard_components/TotalCustomers'
import TotalRevenue from '../components/dashboard_components/TotalRevenue'
import TotalOrder from '../components/dashboard_components/TotalOrder'
import TotalProducts from '../components/dashboard_components/TotalProducts'
import SelectDatesButton from '../components/SelectDatesButton'
import ContentContainer from '../components/ContentContainer'
import ProductListing from '../components/dashboard_components/ProductListing'
import CategoryListing from '../components/dashboard_components/CategoryListing'
import GreenLabel from '../components/StatusLabels/GreenLabel'
import mapImg from '../assets/Map.png'
import FilterButton from '../components/FilterButton'
import StyledDashboardButton from '../components/dashboard_components/StyledDashboardButton'
import TableHead from '../components/dashboard_components/TableHead'
import TableActionListing from '../components/dashboard_components/TableActionListing'
import TableCustomerListing from '../components/dashboard_components/TableCustomerListing'
import TableProductListing from '../components/dashboard_components/TableProductListing'
import TableTotalListing from '../components/dashboard_components/TableTotalListing'
import TableStatusListing from '../components/dashboard_components/TableStatusListing'
import StateListing from '../components/dashboard_components/StateListing'
import ProgressBar from '../components/dashboard_components/ProgressBar'
import { CATEGORY_DATA, PRODUCT_DATA, TABLE_DATA, STATES_DATA, graphData } from '../assets/data'
import { useState } from 'react'
import Graph from '../components/Graph'



export default function HomePage() {
    const [tableList, setTableList] = useState(TABLE_DATA)
    const [activeColumn, setActiveColumn] = useState('')
    function handleAscendingSort(criteria) {
        setActiveColumn(criteria)
        if (criteria === 'product' || criteria === 'status') {
            setTableList((prevList) => {
                prevList.sort((a, b) => a[criteria].localeCompare(b[criteria]))
                return [...prevList]
            })
        }
        else {
            setTableList((prevList) => {
                prevList.sort((a, b) => a[criteria] - b[criteria])
                return [...prevList]
            })
        }
    }

    function handleDescendingSort(criteria) {
        setActiveColumn(criteria)
        if (criteria === 'status' || criteria === 'product') {
            setTableList((prevList) => {
                prevList.sort((a, b) => b[criteria].localeCompare(a[criteria]))
                return [...prevList]
            })
        }
        else {
            setTableList((prevList) => {
                prevList.sort((a, b) => b[criteria] - a[criteria])
                return [...prevList]
            })
        }
    }
    console.log(graphData)
    return (
        <div className='ml-4'>
            <div className='flex items-center'>
                <div>
                    <p className='text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]'>Welcome Back, Stephen</p>
                    <p className='text-customAsh mb-4 font-extrabold text-[18px] leading-[28px] tracking-[0.01em]'>See statistics, manage products and orders.</p>
                </div>
                <div className='ml-auto'>
                    <SelectDatesButton />
                </div>
            </div>
            <div className='flex w-full space-x-4 h-[200px]'>
                <TotalRevenue label={'Total Revenue'} amount={75000} percent={10} />
                <TotalOrder label={'Total Orders'} amount={31500} percent={-7} />
                <TotalCustomers label={'Total Customers'} amount={24500} percent={0} />
                <TotalProducts label='Total Products' amount={1247} percent={15} />
            </div>
            <div className='my-4 rounded-lg w-full bg-white p-4'>
                <p className='font-semibold text-[20px] leading-[30px] tracking=[0.01em] text-[#333333]'>Statistic</p>
                <p className='font-extrabold text-[14px] leading-[20px] tracking-[0.005em] text-[#777980]'>Revenue and Sales</p>
                <div className=''>
                    <svg className='ml-auto' width="138" height="18" viewBox="0 0 138 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="6" cy="9" r="6" fill="#BC6C25" />
                        <path d="M23.232 13L21.312 9.664H20.268V13H18.9V4.66H21.78C22.42 4.66 22.96 4.772 23.4 4.996C23.848 5.22 24.18 5.52 24.396 5.896C24.62 6.272 24.732 6.692 24.732 7.156C24.732 7.7 24.572 8.196 24.252 8.644C23.94 9.084 23.456 9.384 22.8 9.544L24.864 13H23.232ZM20.268 8.572H21.78C22.292 8.572 22.676 8.444 22.932 8.188C23.196 7.932 23.328 7.588 23.328 7.156C23.328 6.724 23.2 6.388 22.944 6.148C22.688 5.9 22.3 5.776 21.78 5.776H20.268V8.572ZM32.602 9.532C32.602 9.78 32.586 10.004 32.554 10.204H27.502C27.542 10.732 27.738 11.156 28.09 11.476C28.442 11.796 28.874 11.956 29.386 11.956C30.122 11.956 30.642 11.648 30.946 11.032H32.422C32.222 11.64 31.858 12.14 31.33 12.532C30.81 12.916 30.162 13.108 29.386 13.108C28.754 13.108 28.186 12.968 27.682 12.688C27.186 12.4 26.794 12 26.506 11.488C26.226 10.968 26.086 10.368 26.086 9.688C26.086 9.008 26.222 8.412 26.494 7.9C26.774 7.38 27.162 6.98 27.658 6.7C28.162 6.42 28.738 6.28 29.386 6.28C30.01 6.28 30.566 6.416 31.054 6.688C31.542 6.96 31.922 7.344 32.194 7.84C32.466 8.328 32.602 8.892 32.602 9.532ZM31.174 9.1C31.166 8.596 30.986 8.192 30.634 7.888C30.282 7.584 29.846 7.432 29.326 7.432C28.854 7.432 28.45 7.584 28.114 7.888C27.778 8.184 27.578 8.588 27.514 9.1H31.174ZM36.5643 11.776L38.4363 6.388H39.8883L37.3683 13H35.7363L33.2283 6.388H34.6923L36.5643 11.776ZM47.0423 9.532C47.0423 9.78 47.0263 10.004 46.9943 10.204H41.9423C41.9823 10.732 42.1783 11.156 42.5303 11.476C42.8823 11.796 43.3143 11.956 43.8263 11.956C44.5623 11.956 45.0823 11.648 45.3863 11.032H46.8623C46.6623 11.64 46.2983 12.14 45.7703 12.532C45.2503 12.916 44.6023 13.108 43.8263 13.108C43.1943 13.108 42.6263 12.968 42.1223 12.688C41.6263 12.4 41.2343 12 40.9463 11.488C40.6663 10.968 40.5263 10.368 40.5263 9.688C40.5263 9.008 40.6623 8.412 40.9343 7.9C41.2143 7.38 41.6023 6.98 42.0983 6.7C42.6023 6.42 43.1783 6.28 43.8263 6.28C44.4503 6.28 45.0063 6.416 45.4943 6.688C45.9823 6.96 46.3623 7.344 46.6343 7.84C46.9063 8.328 47.0423 8.892 47.0423 9.532ZM45.6143 9.1C45.6063 8.596 45.4263 8.192 45.0743 7.888C44.7223 7.584 44.2863 7.432 43.7663 7.432C43.2943 7.432 42.8903 7.584 42.5543 7.888C42.2183 8.184 42.0183 8.588 41.9543 9.1H45.6143ZM51.7846 6.28C52.3046 6.28 52.7686 6.388 53.1766 6.604C53.5926 6.82 53.9166 7.14 54.1486 7.564C54.3806 7.988 54.4966 8.5 54.4966 9.1V13H53.1406V9.304C53.1406 8.712 52.9926 8.26 52.6966 7.948C52.4006 7.628 51.9966 7.468 51.4846 7.468C50.9726 7.468 50.5646 7.628 50.2606 7.948C49.9646 8.26 49.8166 8.712 49.8166 9.304V13H48.4486V6.388H49.8166V7.144C50.0406 6.872 50.3246 6.66 50.6686 6.508C51.0206 6.356 51.3926 6.28 51.7846 6.28ZM62.2896 6.388V13H60.9216V12.22C60.7056 12.492 60.4216 12.708 60.0696 12.868C59.7256 13.02 59.3576 13.096 58.9656 13.096C58.4456 13.096 57.9776 12.988 57.5616 12.772C57.1536 12.556 56.8296 12.236 56.5896 11.812C56.3576 11.388 56.2416 10.876 56.2416 10.276V6.388H57.5976V10.072C57.5976 10.664 57.7456 11.12 58.0416 11.44C58.3376 11.752 58.7416 11.908 59.2536 11.908C59.7656 11.908 60.1696 11.752 60.4656 11.44C60.7696 11.12 60.9216 10.664 60.9216 10.072V6.388H62.2896ZM70.2145 9.532C70.2145 9.78 70.1985 10.004 70.1665 10.204H65.1145C65.1545 10.732 65.3505 11.156 65.7025 11.476C66.0545 11.796 66.4865 11.956 66.9985 11.956C67.7345 11.956 68.2545 11.648 68.5585 11.032H70.0345C69.8345 11.64 69.4705 12.14 68.9425 12.532C68.4225 12.916 67.7745 13.108 66.9985 13.108C66.3665 13.108 65.7985 12.968 65.2945 12.688C64.7985 12.4 64.4065 12 64.1185 11.488C63.8385 10.968 63.6985 10.368 63.6985 9.688C63.6985 9.008 63.8345 8.412 64.1065 7.9C64.3865 7.38 64.7745 6.98 65.2705 6.7C65.7745 6.42 66.3505 6.28 66.9985 6.28C67.6225 6.28 68.1785 6.416 68.6665 6.688C69.1545 6.96 69.5345 7.344 69.8065 7.84C70.0785 8.328 70.2145 8.892 70.2145 9.532ZM68.7865 9.1C68.7785 8.596 68.5985 8.192 68.2465 7.888C67.8945 7.584 67.4585 7.432 66.9385 7.432C66.4665 7.432 66.0625 7.584 65.7265 7.888C65.3905 8.184 65.1905 8.588 65.1265 9.1H68.7865Z" fill="#333333" fill-opacity="0.6" />
                        <circle cx="93" cy="9" r="6" fill="#F86624" />
                        <path d="M108.648 13.084C108.088 13.084 107.584 12.988 107.136 12.796C106.688 12.596 106.336 12.316 106.08 11.956C105.824 11.596 105.696 11.176 105.696 10.696H107.16C107.192 11.056 107.332 11.352 107.58 11.584C107.836 11.816 108.192 11.932 108.648 11.932C109.12 11.932 109.488 11.82 109.752 11.596C110.016 11.364 110.148 11.068 110.148 10.708C110.148 10.428 110.064 10.2 109.896 10.024C109.736 9.848 109.532 9.712 109.284 9.616C109.044 9.52 108.708 9.416 108.276 9.304C107.732 9.16 107.288 9.016 106.944 8.872C106.608 8.72 106.32 8.488 106.08 8.176C105.84 7.864 105.72 7.448 105.72 6.928C105.72 6.448 105.84 6.028 106.08 5.668C106.32 5.308 106.656 5.032 107.088 4.84C107.52 4.648 108.02 4.552 108.588 4.552C109.396 4.552 110.056 4.756 110.568 5.164C111.088 5.564 111.376 6.116 111.432 6.82H109.92C109.896 6.516 109.752 6.256 109.488 6.04C109.224 5.824 108.876 5.716 108.444 5.716C108.052 5.716 107.732 5.816 107.484 6.016C107.236 6.216 107.112 6.504 107.112 6.88C107.112 7.136 107.188 7.348 107.34 7.516C107.5 7.676 107.7 7.804 107.94 7.9C108.18 7.996 108.508 8.1 108.924 8.212C109.476 8.364 109.924 8.516 110.268 8.668C110.62 8.82 110.916 9.056 111.156 9.376C111.404 9.688 111.528 10.108 111.528 10.636C111.528 11.06 111.412 11.46 111.18 11.836C110.956 12.212 110.624 12.516 110.184 12.748C109.752 12.972 109.24 13.084 108.648 13.084ZM112.746 9.664C112.746 9 112.882 8.412 113.154 7.9C113.434 7.388 113.81 6.992 114.282 6.712C114.762 6.424 115.29 6.28 115.866 6.28C116.386 6.28 116.838 6.384 117.222 6.592C117.614 6.792 117.926 7.044 118.158 7.348V6.388H119.538V13H118.158V12.016C117.926 12.328 117.61 12.588 117.21 12.796C116.81 13.004 116.354 13.108 115.842 13.108C115.274 13.108 114.754 12.964 114.282 12.676C113.81 12.38 113.434 11.972 113.154 11.452C112.882 10.924 112.746 10.328 112.746 9.664ZM118.158 9.688C118.158 9.232 118.062 8.836 117.87 8.5C117.686 8.164 117.442 7.908 117.138 7.732C116.834 7.556 116.506 7.468 116.154 7.468C115.802 7.468 115.474 7.556 115.17 7.732C114.866 7.9 114.618 8.152 114.426 8.488C114.242 8.816 114.15 9.208 114.15 9.664C114.15 10.12 114.242 10.52 114.426 10.864C114.618 11.208 114.866 11.472 115.17 11.656C115.482 11.832 115.81 11.92 116.154 11.92C116.506 11.92 116.834 11.832 117.138 11.656C117.442 11.48 117.686 11.224 117.87 10.888C118.062 10.544 118.158 10.144 118.158 9.688ZM122.763 4.12V13H121.395V4.12H122.763ZM130.679 9.532C130.679 9.78 130.663 10.004 130.631 10.204H125.579C125.619 10.732 125.815 11.156 126.167 11.476C126.519 11.796 126.951 11.956 127.463 11.956C128.199 11.956 128.719 11.648 129.023 11.032H130.499C130.299 11.64 129.935 12.14 129.407 12.532C128.887 12.916 128.239 13.108 127.463 13.108C126.831 13.108 126.263 12.968 125.759 12.688C125.263 12.4 124.871 12 124.583 11.488C124.303 10.968 124.163 10.368 124.163 9.688C124.163 9.008 124.299 8.412 124.571 7.9C124.851 7.38 125.239 6.98 125.735 6.7C126.239 6.42 126.815 6.28 127.463 6.28C128.087 6.28 128.643 6.416 129.131 6.688C129.619 6.96 129.999 7.344 130.271 7.84C130.543 8.328 130.679 8.892 130.679 9.532ZM129.251 9.1C129.243 8.596 129.063 8.192 128.711 7.888C128.359 7.584 127.923 7.432 127.403 7.432C126.931 7.432 126.527 7.584 126.191 7.888C125.855 8.184 125.655 8.588 125.591 9.1H129.251ZM134.485 13.108C133.965 13.108 133.497 13.016 133.081 12.832C132.673 12.64 132.349 12.384 132.109 12.064C131.869 11.736 131.741 11.372 131.725 10.972H133.141C133.165 11.252 133.297 11.488 133.537 11.68C133.785 11.864 134.093 11.956 134.461 11.956C134.845 11.956 135.141 11.884 135.349 11.74C135.565 11.588 135.673 11.396 135.673 11.164C135.673 10.916 135.553 10.732 135.313 10.612C135.081 10.492 134.709 10.36 134.197 10.216C133.701 10.08 133.297 9.948 132.985 9.82C132.673 9.692 132.401 9.496 132.169 9.232C131.945 8.968 131.833 8.62 131.833 8.188C131.833 7.836 131.937 7.516 132.145 7.228C132.353 6.932 132.649 6.7 133.033 6.532C133.425 6.364 133.873 6.28 134.377 6.28C135.129 6.28 135.733 6.472 136.189 6.856C136.653 7.232 136.901 7.748 136.933 8.404H135.565C135.541 8.108 135.421 7.872 135.205 7.696C134.989 7.52 134.697 7.432 134.329 7.432C133.969 7.432 133.693 7.5 133.501 7.636C133.309 7.772 133.213 7.952 133.213 8.176C133.213 8.352 133.277 8.5 133.405 8.62C133.533 8.74 133.689 8.836 133.873 8.908C134.057 8.972 134.329 9.056 134.689 9.16C135.169 9.288 135.561 9.42 135.865 9.556C136.177 9.684 136.445 9.876 136.669 10.132C136.893 10.388 137.009 10.728 137.017 11.152C137.017 11.528 136.913 11.864 136.705 12.16C136.497 12.456 136.201 12.688 135.817 12.856C135.441 13.024 134.997 13.108 134.485 13.108Z" fill="#333333" fill-opacity="0.6" />
                    </svg>
                </div>
                <Graph data={graphData} />
            </div>
            <div className='my-8 space-x-8 w-full flex'>
                <ContentContainer label={'Top Products'} subheading={'Top products in this month'}>
                    {PRODUCT_DATA.map((product) => {
                        return <div key={product.productName} className='mt-4 mb-6'>
                            <ProductListing image={product.productImg} name={product.productName} category={product.category} amount={product.amount} />
                        </div>
                    })}
                </ContentContainer>
                <ContentContainer label={'Top Categories'} subheading={'Top categories in this month'}>
                    {/* <CategoryListing percent={10} image={productImg} category={'Snacks'} imageBackground={'#F4ECFB'} amount={1509} /> */}
                    {CATEGORY_DATA.map((category) => {
                        return <div key={category.category} className='my-4'>
                            <CategoryListing percent={category.percent} image={category.productImg} category={category.category} imageBackground={category.imageBackground} amount={category.amount} />
                        </div>
                    })}
                </ContentContainer>
            </div>
            <div className='my-8 space-x-8 w-full flex'>
                <div className='bg-white w-[70%] rounded-lg'>
                    <div className='rounded-lg w-full bg-white p-4 items-center flex'>
                        <p className='mr-2 font-semibold text-[20px] leading-[30px] tracking-[0.01em]'>Recent Orders</p>
                        <GreenLabel>+2 Orders</GreenLabel>
                        <div className='ml-auto flex space-x-4'>
                            <SelectDatesButton />
                            <FilterButton />
                            <StyledDashboardButton>See All</StyledDashboardButton>
                        </div>
                    </div>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-t border-b bg-[#F9F9FC]'>
                                <th className='pl-5 w-[180px]'><TableHead heading={'Product'} canOrder={true} ascend={()=>handleAscendingSort('product')} descend={()=>handleDescendingSort('product')} active={activeColumn === 'product'}/></th>
                                <th className='pl-8 w-[200px]'><TableHead heading={'Customer'} /></th>
                                <th className='pl-8'><TableHead heading={'Total'} canOrder={true} ascend={()=> handleAscendingSort('total')} descend={()=> handleDescendingSort('total')} active={activeColumn === 'total'}/></th>
                                <th className='pl-[105px] w-[200px]'><TableHead heading={'Status'} canOrder={true} ascend={()=>handleAscendingSort('status')} descend={()=>handleDescendingSort('status')} active={activeColumn === 'status'}/></th>
                                <th className='pl-24'><TableHead heading={'Action'} /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableList.map((order) => {

                                return (
                                    <tr className='border-b'>
                                        <td className='p-0'>
                                            <TableProductListing
                                                image={order.image}
                                                mainProduct={order.product}
                                                remProducts={order.extra} />
                                        </td>
                                        <td className='p-0'><TableCustomerListing name={order.customerName} email={TABLE_DATA[0].customerEmail} /></td>
                                        <td className='p-0 w-[100px]'><TableTotalListing amount={order.total} /></td>
                                        <td className='pl-20'><TableStatusListing status={order.status} /></td>
                                        <td className='pl-24'><TableActionListing /></td>
                                    </tr>
                                )
                            })

                            }
                        </tbody>
                    </table>
                    <div className='rounded-lg w-full bg-white p-4 items-center flex'>
                        <p className='font-semibold text-[14px] text-customGrey leading-[20px] tracking-[0.005em]'>Showing 1-5 from 100</p>
                        <div className='ml-auto flex space-x-2'>
                            <StyledDashboardButton>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.86 14.3933L7.14003 10.6667C7.01586 10.5418 6.94617 10.3728 6.94617 10.1967C6.94617 10.0205 7.01586 9.85158 7.14003 9.72667L10.86 6.00001C10.9533 5.90599 11.0724 5.84187 11.2022 5.81582C11.3321 5.78977 11.4667 5.80298 11.589 5.85376C11.7113 5.90454 11.8157 5.99058 11.8889 6.10093C11.9621 6.21128 12.0008 6.34092 12 6.47334V13.92C12.0008 14.0524 11.9621 14.1821 11.8889 14.2924C11.8157 14.4028 11.7113 14.4888 11.589 14.5396C11.4667 14.5904 11.3321 14.6036 11.2022 14.5775C11.0724 14.5515 10.9533 14.4874 10.86 14.3933Z" fill="currentColor" />
                                </svg>
                            </StyledDashboardButton>
                            <StyledDashboardButton>1</StyledDashboardButton>
                            <StyledDashboardButton>2</StyledDashboardButton>
                            <StyledDashboardButton>3</StyledDashboardButton>
                            <StyledDashboardButton>...</StyledDashboardButton>
                            <StyledDashboardButton><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 11.9193V4.47133C6.00003 4.3395 6.03914 4.21064 6.1124 4.10103C6.18565 3.99142 6.28976 3.906 6.41156 3.85555C6.53336 3.8051 6.66738 3.7919 6.79669 3.81761C6.92599 3.84332 7.04476 3.90679 7.138 4L10.862 7.724C10.987 7.84902 11.0572 8.01856 11.0572 8.19533C11.0572 8.37211 10.987 8.54165 10.862 8.66667L7.138 12.3907C7.04476 12.4839 6.92599 12.5473 6.79669 12.5731C6.66738 12.5988 6.53336 12.5856 6.41156 12.5351C6.28976 12.4847 6.18565 12.3992 6.1124 12.2896C6.03914 12.18 6.00003 12.0512 6 11.9193Z" fill="currentColor" />
                            </svg>
                            </StyledDashboardButton>
                        </div>
                    </div>
                </div>
                <div className='w-[30%] rounded-lg bg-white'>
                    <ContentContainer label={'Customer Growth'} subheading={'Based on States'}>
                        <img src={mapImg} alt="" />
                    </ContentContainer>
                    <div class="w-full h-[350px] overflow-auto scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-[#BC6C25] scrollbar-track-gray-100">
                        {STATES_DATA.map((state) => {
                            return (<div key={state.name} className=' ml-auto mr-auto w-[312px] bg-[#FFFFFF] mt-3 p-2 flex items-center'>
                                <StateListing img={state.image} state={state.name} customerTotal={state.customers} />
                                <div className='ml-auto'>
                                    <ProgressBar color={state.color} progress={state.percent} />
                                </div>
                            </div>)
                        })
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}