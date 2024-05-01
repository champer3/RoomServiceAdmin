
import './App.css';
import { FilledButton } from './components/Buttons/FilledButton';
import Categories from './components/Categories';
import ContentContainer from './components/ContentContainer';
import Coupons from './components/Coupons';
import Customers from './components/Customers';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import GreenPercentLabel from './components/PercentLabels/GreenPercentLabel';
import GreyPercentLabel from './components/PercentLabels/GreyPercentLabel';
import RedPercentLabel from './components/PercentLabels/RedPercentLabel';
import Products from './components/Products';
import SelectDatesButton from './components/SelectDatesButton';
import BlueLabel from './components/StatusLabels/BlueLabel';
import GreenLabel from './components/StatusLabels/GreenLabel';
import OrangeLabel from './components/StatusLabels/OrangeLabel';
import RedLabel from './components/StatusLabels/RedLabel';
import TopBar from './components/TopBar';
import TotalCustomers from './components/dashboard_components/TotalCustomers';
import TotalOrder from './components/dashboard_components/TotalOrder';
import TotalProducts from './components/dashboard_components/TotalProducts';
import TotalRevenue from './components/dashboard_components/TotalRevenue';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import Settings from './pages/Settings';

function App() {
  return (
    <div className='bg-[#F9F9FC] w-full px-4 py-5 '>
      {/* <Dashboard />
      <Products />
      <Categories />
      <Coupons />
      <Orders />
      <Customers /> */}
      {/* <div className='flex space-x-4 w-full h-[166px]'>
        <TotalRevenue label={'Total Revenue'} amount={75000} percent={10} />
        <TotalOrder label={'Total Orders'} amount={31500} percent={-7} />
        <TotalCustomers label={'Total Customers'} amount={24500} percent={0} />
        <TotalProducts label='Total Products' amount={1247} percent={15} />
      </div> */}
      <Settings/>

      {/* <SelectDatesButton />
      <div className='p-8 space-x-8 w-full flex'>
        <ContentContainer label={'Top Products'} subheading={'Top products in this month'}></ContentContainer>
        <ContentContainer label={'Top Categories'} subheading={'Top categories in this month'}></ContentContainer>
      </div>
      <div className='p-4'>
        <GreenLabel>Delivered</GreenLabel>
      </div>
      <div className='p-4'>
        <OrangeLabel>Processing</OrangeLabel>
      </div>
      <div className='p-4'>
        <RedLabel>Cancelled</RedLabel>
      </div>
      <div className='p-4'>
        <BlueLabel>Shipped</BlueLabel>
      </div>
      <div className='p-4'>
        <GreenPercentLabel>10</GreenPercentLabel>
      </div>
      <div className='p-4'>
        <RedPercentLabel>-10</RedPercentLabel>
      </div>
      <div className='p-4'>
        <GreyPercentLabel>0</GreyPercentLabel>
      </div>
      <div className='p-4'>
        <FilledButton type='filled'><FontAwesomeIcon icon={faPlus} /> Add Order</FilledButton>
      </div>
      <div className='p-4'>
        <FilledButton type='default'><FontAwesomeIcon icon={faDownload} /> Export</FilledButton>
      </div> */}
    </div>
  );
}

export default App;
