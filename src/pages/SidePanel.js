import { Outlet } from "react-router-dom";
import Dashboard from '../components/Sidepanel/Dashboard'
import Products from '../components/Sidepanel/Products'
import Categories from '../components/Sidepanel/Categories'
import Coupons from '../components/Sidepanel/Coupons'
import Orders from '../components/Sidepanel/Orders'
import Customers from '../components/Sidepanel/Customers'
import TopBar from '../components/TopBar';

import { Link } from "react-router-dom"
import { useState } from "react";


export default function SidePanel() {
    const [activePanel, setActivePanel] = useState('dashboard')
    return (
        <div className='flex'>
            <div className='bg-white w-[264px]'>
                <div className="flex space-x-2 px-[24px] py-[20px] items-center">
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="34" height="34" rx="10" fill="#283618" />
                    </svg>
                    <p className="ml-auto mr-auto font-semibold text-[24px] leading-[32px] tracking-[0.01em] text-[#333333]">LOGO HERE</p>
                </div>
                <Link to={'/'} onClick={() => setActivePanel('dashboard')}><Dashboard active={activePanel === 'dashboard'}/></Link>
                <Link to={'/products'} onClick={() => setActivePanel('products')}><Products active={activePanel === 'products'}/></Link>
                <Categories />
                <Coupons />
                <Orders />
                <Customers />
            </div>
            <div className="px-8 w-full bg-[#F9F9FC]">
                <TopBar messages={11} notifications={11} />
                <Outlet />
            </div>

        </div>
    )
}