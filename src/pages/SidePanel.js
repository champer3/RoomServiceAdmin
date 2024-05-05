import { Outlet } from "react-router-dom";
import Dashboard from '../components/Sidepanel/Dashboard'
import Products from '../components/Sidepanel/Products'
import Categories from '../components/Sidepanel/Categories'
import Coupons from '../components/Sidepanel/Coupons'
import Orders from '../components/Sidepanel/Orders'
import Customers from '../components/Sidepanel/Customers'
import TopBar from '../components/TopBar';
import Logo from '../assets/Logo.png'
import { Link } from "react-router-dom"
import { useState } from "react";


export default function SidePanel() {
    const [activePanel, setActivePanel] = useState('dashboard')
    return (
        <div className='flex h-full min-w-fit bg-[#F9F9FC]'>
            <div className='bg-white w-[264px]'>
                <div className="flex space-x-2 px-[24px] py-[20px] items-center ">
                    <img src={Logo} className="w-[60px] h-[40px]"></img>
                    {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="34" height="34" rx="10" fill="#283618" />
                    </svg> */}
                </div>
                <Link to={'/'} onClick={() => setActivePanel('dashboard')}><Dashboard active={activePanel === 'dashboard'} /></Link>
                <Link to={'/products'} onClick={() => setActivePanel('products')}><Products active={activePanel === 'products'} /></Link>
                <Link to={'/categories'} onClick={() => setActivePanel('categories')}><Categories active={activePanel === 'categories'} /></Link>
                <Link to={'/coupons'} onClick={() => setActivePanel('coupons')}><Coupons active={activePanel === 'coupons'} /></Link>
                <Link to={'/orders'} onClick={() => setActivePanel('orders')}><Orders active={activePanel === 'orders'} /></Link>
                <Link to={'/customers'} onClick={() => setActivePanel('customers')}><Customers active={activePanel === 'customers'}/></Link>
            </div>
            <div className="px-8 pb-8 w-full">
                <TopBar messages={11} notifications={11} />
                <Outlet />
            </div>

        </div>
    )
}