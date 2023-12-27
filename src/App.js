
import productImg from './assets/Img.png'
import bottleImg from './assets/bottleImg.png'
import ohioImg from './assets/Ohio.png'
import hotPocketsImg from './assets/HotPockets.png'
import therafleuImg from './assets/Therafleu.png'
import ContentContainer from './components/ContentContainer';
import FilterButton from './components/FilterButton';
import Path from './components/Path';
import Dashboard from './components/Sidepanel/Dashboard'
import Products from './components/Sidepanel/Products'
import Categories from './components/Sidepanel/Categories'
import Customers from './components/Sidepanel/Customers'
import Coupons from './components/Sidepanel/Coupons'
import Orders from './components/Sidepanel/Orders'
import GreyPercentLabel from './components/PercentLabels/GreyPercentLabel';
import RedPercentLabel from './components/PercentLabels/RedPercentLabel';
import SelectDatesButton from './components/SelectDatesButton';
import BlueLabel from './components/StatusLabels/BlueLabel';
import GreenLabel from './components/StatusLabels/GreenLabel';
import GreyLabel from './components/StatusLabels/GreyLabel';
import OrangeLabel from './components/StatusLabels/OrangeLabel';
import RedLabel from './components/StatusLabels/RedLabel';
import TableHead from './components/dashboard_components/TableHead';
import TopBar from './components/TopBar';
import CategoryListing from './components/dashboard_components/CategoryListing';
import ProductListing from './components/dashboard_components/ProductListing';
import StyledDashboardButton from './components/dashboard_components/StyledDashboardButton';
import TotalCustomers from './components/dashboard_components/TotalCustomers';
import TotalOrder from './components/dashboard_components/TotalOrder';
import TotalProducts from './components/dashboard_components/TotalProducts';
import TotalRevenue from './components/dashboard_components/TotalRevenue';
import TableProductListing from './components/dashboard_components/TableProductListing';
import TableCustomerListing from './components/dashboard_components/TableCustomerListing';
import TableTotalListing from './components/dashboard_components/TableTotalListing';
import TableActionListing from './components/dashboard_components/TableActionListing';
import ProgressBar from './components/dashboard_components/ProgressBar';
import StateListing from './components/dashboard_components/StateListing'
import SelectTableHead from './components/SelectTableHead'
import SelectProductListing from './components/SelectProductListing'
import SKUListing from './components/SKUListing'
import TabButton from './components/TabButton'
import MiniSearch from './components/MiniSearch'
import Input from './components/Input'
import TextArea from './components/TextArea'
import Select from './components/Select'
import ImageDropzone from './components/ImageDropzone'
import OrderStatusLabels from './components/order_components/OrderStatusLabel'
import CustomerInfoCard from './components/customer_components/CustomerInfoCard'
import CustomerDetail from './components/customer_components/CustomerDetail'

const productData = [{ product: 'Chips Ahoy! Chewy Chocolate Chip', extra: '+3 other products', image: productImg },
{ product: 'Arizona Water', extra: '+1 other products', image: bottleImg },
{ product: 'Therafleu', extra: '', image: therafleuImg },
{ product: 'Hot Pockets Frozen Crispy Buttery Crusgcdjdjbhdcbkjdbdvh', extra: '', image: hotPocketsImg }]

function App() {
  return (
    <div className='flex'>
      <div className='bg-white'>
        <Dashboard />
        <Products />
        <Categories />
        <Coupons />
        <Orders />
        <Customers />
      </div>
      <div className='pl-4 bg-[#ffefff]'>
        <div className='flex space-x-4 ml-4 h-[166px]'>
          <TotalRevenue label={'Total Revenue'} amount={75000} percent={10} />
          <TotalOrder label={'Total Orders'} amount={31500} percent={-7} />
          <TotalCustomers label={'Total Customers'} amount={24500} percent={0} />
          <TotalProducts label='Total Products' amount={1247} percent={15} />
        </div>
        <TopBar />
        <div className='space-x-4 flex items-center p-4 \w-[792px]'>
          <div className='w-[137px] h-[40px]'>
            <SelectDatesButton />
          </div>
          <div className='w-[98px] h-[40px]'>
            <FilterButton />
          </div>
          <div className='w-[200px] h-[40px]'>
            <MiniSearch searchItem={'products'} />
          </div>
        </div>

        <div className='flex space-x-4 bg-white p-4 rounded-lg'>
          <StyledDashboardButton>See All</StyledDashboardButton>
          <StyledDashboardButton>1</StyledDashboardButton>
          <StyledDashboardButton>...</StyledDashboardButton>
          <StyledDashboardButton>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 11.9193V4.47133C6.00003 4.3395 6.03914 4.21064 6.1124 4.10103C6.18565 3.99142 6.28976 3.906 6.41156 3.85555C6.53336 3.8051 6.66738 3.7919 6.79669 3.81761C6.92599 3.84332 7.04476 3.90679 7.138 4L10.862 7.724C10.987 7.84902 11.0572 8.01856 11.0572 8.19533C11.0572 8.37211 10.987 8.54165 10.862 8.66667L7.138 12.3907C7.04476 12.4839 6.92599 12.5473 6.79669 12.5731C6.66738 12.5988 6.53336 12.5856 6.41156 12.5351C6.28976 12.4847 6.18565 12.3992 6.1124 12.2896C6.03914 12.18 6.00003 12.0512 6 11.9193Z" fill="currentColor" />
            </svg>
          </StyledDashboardButton>
        </div>
        <div className='p-8 space-x-8 w-full flex'>
          <ContentContainer label={'Top Products'} subheading={'Top products in this month'}><ProductListing image={productImg} name={'Chips Ahoy! Chewy Chip Cookies'} category={'Snacks'} amount={11240} /></ContentContainer>
          <ContentContainer label={'Top Categories'} subheading={'Top categories in this month'}><CategoryListing percent={10} image={productImg} category={'Snacks'} imageBackground={'#F4ECFB'} amount={1509} /></ContentContainer>
        </div>
        <div className='p-4'>
          <GreenLabel>Delivered</GreenLabel>
        </div>
        <div className='p-4'>
          <RedLabel>Cancelled</RedLabel>
        </div>
        <div className='p-4'>
          <GreyLabel>Draft</GreyLabel>
        </div>
        <div className='p-4'>
          <RedPercentLabel>-10</RedPercentLabel>
        </div>
        <div className='p-4'>
          <GreyPercentLabel>0</GreyPercentLabel>
        </div>
        <Path pages={['Dashboard', 'Product List', 'Add Product']} />
        <div className='flex'>
          <div className='w-[209px]'>
            <TableHead canOrder={true} heading={'Product'} />
            {productData.map((item) => {
              return <TableProductListing image={item.image} mainProduct={item.product} remProducts={item.extra} />
            })}
          </div>
          <div className='w-[184px]'>
            <TableHead heading={'Customer'} />
            <TableCustomerListing name={'John Bushmill'} email={'Johnb@mail.com'} />
            <TableCustomerListing name={'Nimi Henderson'} email={'Hendo5@mail.com'} />
            <TableCustomerListing name={'Tati Jakes'} email={'tjmax@mail.com'} />
            <TableCustomerListing name={'Romelu Lukaku'} email={'rlok@mail.com'} />
          </div>
          <div className='w-[110px]'>
            <TableHead canOrder={true} heading={'Total'} />
            <TableTotalListing amount={120} />
            <TableTotalListing amount={590.45} />
            <TableTotalListing amount={348.45} />
            <TableTotalListing amount={125.45} />
          </div>
          <div className='w-[143px]'>
            <TableHead canOrder={true} heading={'Status'} />
            <div className="flex w- justify-center items-center px[22px] py-[18px] border-b-[1px] bg-[#F9F9FC] text-customGrey font-bold text-[14px] h-[80px] leading-[20px] tracking[0.005em]">
              <OrangeLabel>Processing</OrangeLabel>
            </div>
            <div className="flex justify-center items-center px[22px] py-[18px] border-b-[1px] bg-[#F9F9FC] text-customGrey font-bold text-[14px] h-[80px] leading-[20px] tracking[0.005em]">
              <OrangeLabel>Processing</OrangeLabel>
            </div>
            <div className="flex justify-center items-center px[22px] py-[18px] border-b-[1px] bg-[#F9F9FC] text-customGrey font-bold text-[14px] h-[80px] leading-[20px] tracking[0.005em]">
              <BlueLabel>Shipped</BlueLabel>
            </div>
            <div className="flex justify-center items-center px[22px] py-[18px] border-b-[1px] bg-[#F9F9FC] text-customGrey font-bold text-[14px] h-[80px] leading-[20px] tracking[0.005em]">
              <BlueLabel>Shipped</BlueLabel>
            </div>
          </div>
          <div className='w-[143px]'>
            <TableHead canOrder={false} heading={'Action'} />
            <TableActionListing />
            <TableActionListing />
            <TableActionListing />
            <TableActionListing />
          </div>
        </div>
        <div className='w-[312px] bg-[#FFFFFF] mt-3 p-2 flex items-center'>
          <StateListing img={ohioImg} state={'Ohio'} customerTotal={1240} />
          <div className='ml-auto'>
            <ProgressBar color={'#22CAAD'} progress={'25'} />
          </div>
        </div>
        <div className='flex'>
          <div className='w-[272px]'>
            <SelectTableHead canOrder={true} heading={'Product'} />
            {productData.map((item) => {
              return <SelectProductListing image={item.image} name={item.product} />
            })}
          </div>
          <div className='w-[96px]'>
            <TableHead heading={'SKU'} />
            <SKUListing>302012</SKUListing>
          </div>
        </div>
        <div className='mt-9 p-6 w-[792px] '>
          <ImageDropzone label={'Photo'} description={'Drag and drop image here, or click add image'} />
        </div>
        <div className='mt-2 p-[4px] bg-white border border-[#E0E2E7] rounded-lg flex w-[263px] items-center h-[40px]'>
          <TabButton>All Products</TabButton>
          <TabButton>Published</TabButton>
          <TabButton>Draft</TabButton>
        </div>
        <div className="my-8 w-[216px] bg-[#ffefff]">
          <Select placeholder={'Select category here'} choices={['Pig', 'Banana', 'Goat', 'Cricket']} label={'Test'} />
        </div>
        <div className="my-8 w-[792px] h-[40px] bg-[#ffefff]">
          <Input placeholder={'Type product name here'} label={'Test'} />
        </div>
        <div className="my-4 py-2 w-[792px] h-[200px] bg-[#ffefff]">
          <TextArea placeholder={'Type product name here'} label={'Test'} />
        </div>
        <OrderStatusLabels status={'Order Placed'} description={'An order has been placed'} time={'12/12/2023, 03:30'} />
        <div className='w-[207px] my-4'>
          <CustomerInfoCard name={'John Bushmill'} status={'Expired'} labelColor={'red'} leftDetail={'Orders'} leftData={'1,200'} rightDetail={'Spent'} rightData={'$14,024'} />
        </div>
        <CustomerDetail label={'Address'} value={'ID-011221'} />
      </div>
    </div>
  );
}

export default App;
