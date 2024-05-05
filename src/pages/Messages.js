
// import { FilledButton } from '../components/Buttons/FilledButton';
import TopBar from '../components/TopBar';
// import Select from '../components/Select';
import { useState } from 'react'
import { Link } from "react-router-dom"
import moment from 'moment'
import Path from '../components/Path';
import TabButton from '../components/TabButton'
import MiniSearch from '../components/MiniSearch'
import TableHead from '../components/dashboard_components/TableHead'
import FilterButton from '../components/FilterButton'
// import image from '../assets/HotPockets.png'
import OrangeLabel from '../components/StatusLabels/OrangeLabel'
import StyledDashboardButton from '../components/dashboard_components/StyledDashboardButton'
import SelectDatesButton from '../components/SelectDatesButton'
import { numbers } from '../assets/data'
import GreenLabel from '../components/StatusLabels/GreenLabel';

// function formatDate(dateObject) {
//   return moment(dateObject).format("D MMM YYYY")
// }
function isSameWeek(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
  
    const d1Year = d1.getFullYear();
    const d2Year = d2.getFullYear();
  
    const d1Week = getWeekNumber(d1);
    const d2Week = getWeekNumber(d2);
  
    return d1Year === d2Year && d1Week === d2Week;
  }
  
  function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const daysSinceFirstDay = Math.round((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((daysSinceFirstDay + firstDayOfYear.getDay() + 1) / 7);
    return weekNumber;
  }
  
  function formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (isSameWeek(date, today)) {
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return weekdays[date.getDay()];
    } else {
      const options = { day: 'numeric', month: 'short' , year: 'numeric'};
      return date.toLocaleDateString('en-US', options);
    }
  }

const date = new Date(2023, 0, 16)
function Messages() {
  const [activePage, setActivePage] = useState('all')
  const [selectedRows, setSelectedRows] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20
    const [messages, setMessages] = useState([
        {id: 302002, message:['Hello, I want to make an enquiry'],customer: 'Stephen Okunola', date: new Date(2023, 0, 16), status: 'Active'},
        {id: 302002, message:['Hello, I want to make an enquiry'],customer: 'Stephen Okunola', date: new Date(2023, 0, 16), status: 'Active'},
        {id: 302002, message:['Hello, I want to make an enquiry'],customer: 'Stephen Okunola', date: new Date(2023, 0, 16), status: 'Active'},
        {id: 302002, message:['Hello, I want to make an enquiry'],customer: 'Stephen Okunola', date: new Date(2023, 0, 16), status: 'Closed'},
        {id: 302002, message:['Hello, I want to make an enquiry'],customer: 'Stephen Okunola', date: new Date(2023, 0, 16), status: 'Closed'},
        {id: 302002, message:['Hello, I want to make an enquiry'],customer: 'Stephen Okunola', date: new Date(2023, 0, 16), status: 'Closed'},
        {id: 302002, message:['Hello, I want to make an enquiry'],customer: 'Stephen Okunola', date: new Date(2023, 0, 16), status: 'Closed'},
    ])

    const shownItems = numbers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    function filterDataByStatus(status) {
        if (status === 'all') {
          return messages; // Return all data if status is 'all'
        } else {
          return messages.filter(item => item.status === status); // Filter based on the chosen status
        }
      }
      
    function selectAll(){
        var arr = []
        for (var i = 0; i < messages.length; i++){
            arr.push(i)
        }
        setSelectedRows(arr)
    }
    function deselectAll(){
        setSelectedRows([])
    }
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
    function displayMessage(messages){
        return(
            <tbody>
                {messages.map(({id, message, date, customer, status}, idx)=> 
                                <tr className={`${selectedRows.indexOf(idx) !== -1 ? 'bg-[#F9F9FC]' : ''} border-b` }>
                                    <th className='pt-3'>
    
                                        {selectedRows.indexOf(idx) === -1 ?
                                            <button onClick={() => handleIsSelected(idx)} className='ml-4'>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="1" y="1" width="18" height="18" rx="5" fill="white" stroke="#858D9D" stroke-width="2" />
                                                </svg>
                                            </button> :
                                            <button onClick={() => handleIsRemoved(idx)} className='ml-4'>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="20" height="20" rx="6" fill="#BC6C25" />
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.947 4.77386C16.302 5.06675 16.3523 5.59197 16.0594 5.94699L8.91034 14.6126C8.76045 14.7943 8.48987 14.8157 8.31326 14.6598L4.44862 11.2499C4.10351 10.9454 4.0706 10.4188 4.3751 10.0737C4.67961 9.72855 5.20622 9.69563 5.55132 10.0001L8.44704 12.5552L14.7738 4.88635C15.0667 4.53134 15.5919 4.48097 15.947 4.77386Z" fill="white" />
                                                </svg>
                                            </button>
    
                                        }
    
                                    </th>
                                    <td className='p-0 py-5'>
                                        {status ==='Active' ?<p className='ml-0 font-semibold text-[14px] text-[#BC6C25] leading-[20px] tracking[0.005em]'>{id}</p>:<p className='ml-0 font-semibold text-[14px] text-customGrey leading-[20px] tracking[0.005em]'>{id}</p> }
                                    </td>
                                    <td className='p-0'>
                                    {status ==='Active' ?<p className='ml-0 font-semibold text-[14px] text-[#BC6C25] leading-[20px] tracking[0.005em]'>{message[message.length-1]}</p>:<p className='ml-0 font-semibold text-[14px] text-customGrey leading-[20px] tracking[0.005em]'>{message[message.length-1]}</p> }
                                    </td>
                                    <td className='p-0'>
                                    <p className='ml-0 font-semibold text-[14px] text-customGrey leading-[20px] tracking[0.005em]'>{formatDate(date)}</p>
                                    </td>
                                    <td className='p-0'>
                                        <p className='ml-0 font-semibold text-[14px] text-customGrey leading-[20px] tracking[0.005em]'>{customer}</p>
                                    </td>
                                    <td className='pl-0'>
                                        {status ==='Active' ? <OrangeLabel>{status}</OrangeLabel> : <GreenLabel>{status}</GreenLabel>}
                                    </td>
                                    <td className=''>
                                        <div className='"ml-auto mr-auto"'>
                                            <Link to="/viewmessage">
                                            <button className='ml-4'>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.15623 8C7.15623 8.22378 7.24512 8.43839 7.40336 8.59662C7.56159 8.75486 7.7762 8.84375 7.99998 8.84375C8.22375 8.84375 8.43836 8.75486 8.5966 8.59662C8.75483 8.43839 8.84373 8.22378 8.84373 8C8.84373 7.77622 8.75483 7.56161 8.5966 7.40338C8.43836 7.24514 8.22375 7.15625 7.99998 7.15625C7.7762 7.15625 7.56159 7.24514 7.40336 7.40338C7.24512 7.56161 7.15623 7.77622 7.15623 8ZM10.6719 8C10.6719 8.22378 10.7607 8.43839 10.919 8.59662C11.0772 8.75486 11.2918 8.84375 11.5156 8.84375C11.7394 8.84375 11.954 8.75486 12.1122 8.59662C12.2705 8.43839 12.3594 8.22378 12.3594 8C12.3594 7.77622 12.2705 7.56161 12.1122 7.40338C11.954 7.24514 11.7394 7.15625 11.5156 7.15625C11.2918 7.15625 11.0772 7.24514 10.919 7.40338C10.7607 7.56161 10.6719 7.77622 10.6719 8ZM3.6406 8C3.6406 8.22378 3.7295 8.43839 3.88773 8.59662C4.04596 8.75486 4.26058 8.84375 4.48435 8.84375C4.70813 8.84375 4.92274 8.75486 5.08097 8.59662C5.23921 8.43839 5.3281 8.22378 5.3281 8C5.3281 7.77622 5.23921 7.56161 5.08097 7.40338C4.92274 7.24514 4.70813 7.15625 4.48435 7.15625C4.26058 7.15625 4.04596 7.24514 3.88773 7.40338C3.7295 7.56161 3.6406 7.77622 3.6406 8ZM15.2633 4.94844C14.866 4.00449 14.2965 3.15723 13.5705 2.42949C12.8496 1.70597 11.9938 1.13086 11.0515 0.736719C10.0847 0.330664 9.05818 0.125 7.99998 0.125H7.96482C6.89959 0.130273 5.86775 0.341211 4.89744 0.756055C3.96326 1.15424 3.11548 1.73037 2.40134 2.45234C1.6824 3.17832 1.11814 4.02207 0.727907 4.9625C0.323611 5.93633 0.119704 6.97168 0.124978 8.03691C0.130942 9.25766 0.419748 10.4604 0.968728 11.5508V14.2227C0.968728 14.4371 1.05392 14.6428 1.20556 14.7944C1.3572 14.9461 1.56287 15.0312 1.77732 15.0312H4.45095C5.54132 15.5802 6.74407 15.869 7.96482 15.875H8.00174C9.05466 15.875 10.076 15.6711 11.0375 15.2721C11.975 14.8826 12.8276 14.3142 13.5476 13.5986C14.2736 12.8797 14.8449 12.0395 15.2439 11.1025C15.6588 10.1322 15.8697 9.10039 15.875 8.03516C15.8803 6.96465 15.6728 5.92578 15.2633 4.94844ZM12.6072 12.6477C11.375 13.8676 9.74021 14.5391 7.99998 14.5391H7.97009C6.91013 14.5338 5.8572 14.2701 4.92732 13.7744L4.77966 13.6953H2.30467V11.2203L2.22556 11.0727C1.72986 10.1428 1.46619 9.08984 1.46092 8.02988C1.45388 6.27734 2.12361 4.63203 3.35232 3.39277C4.57927 2.15352 6.21931 1.46797 7.97185 1.46094H8.00174C8.88064 1.46094 9.73318 1.63145 10.5365 1.96895C11.3205 2.29766 12.0236 2.77051 12.6283 3.3752C13.2312 3.97812 13.7058 4.68301 14.0345 5.46699C14.3756 6.2791 14.5461 7.14043 14.5426 8.02988C14.532 9.78066 13.8447 11.4207 12.6072 12.6477Z" fill="#A3A9B6"/>
                                            </svg>
                                            </button>
                                            </Link>
                                            <button className='ml-4'>
                                            <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 2.65625C2.46599 2.65625 2.84375 2.27849 2.84375 1.8125C2.84375 1.34651 2.46599 0.96875 2 0.96875C1.53401 0.96875 1.15625 1.34651 1.15625 1.8125C1.15625 2.27849 1.53401 2.65625 2 2.65625Z" stroke="#A3A9B6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M2 8.84375C2.46599 8.84375 2.84375 8.46599 2.84375 8C2.84375 7.53401 2.46599 7.15625 2 7.15625C1.53401 7.15625 1.15625 7.53401 1.15625 8C1.15625 8.46599 1.53401 8.84375 2 8.84375Z" stroke="#A3A9B6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M2 15.0312C2.46599 15.0312 2.84375 14.6535 2.84375 14.1875C2.84375 13.7215 2.46599 13.3438 2 13.3438C1.53401 13.3438 1.15625 13.7215 1.15625 14.1875C1.15625 14.6535 1.53401 15.0312 2 15.0312Z" stroke="#A3A9B6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        
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
         
        )
    }
    function handleChangePage(newPage) {
      setCurrentPage(newPage)
    }

    function handleIsRemoved(row) {
      setSelectedRows((prevState) => {
          return prevState.filter((item => item !== row))
      })
    }
    function handleAscendingSort(criteria) {
        if (criteria === 'customer') {
            setMessages((prevList) => {
                prevList.sort((a, b) => a[criteria].localeCompare(b[criteria]))
                return [...prevList]
            })
        }
        else {
            setMessages((prevList) => {
                prevList.sort((a, b) => a[criteria] - b[criteria])
                return [...prevList]
            })
        }
    }

    function handleDescendingSort(criteria) {
        if (criteria === 'customer') {
            setMessages((prevList) => {
                prevList.sort((a, b) => b[criteria].localeCompare(a[criteria]))
                return [...prevList]
            })
        }
        else {
            setMessages((prevList) => {
                prevList.sort((a, b) => b[criteria] - a[criteria])
                return [...prevList]
            })
        }
    }
  return (
    <div className='bg-[#F9F9FC] w-full px-4 py-5 '>
      <div className='space-x-8 w-full flex mt-5'>
        <h1 className='font-black text-[20px] leading-[30px] tracking-[0.01em] text-[#333333]'>Messages</h1>
      </div>
      <div className='my-3 space-x-8 w-full flex justify-between items-center'>
        <Path pages={['Dashboard', 'Messages']} />

        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.3333 17.5V15.8333C13.3333 14.2617 13.3333 13.4767 12.845 12.9883C12.3566 12.5 11.5716 12.5 9.99998 12.5H9.16665C7.59498 12.5 6.80998 12.5 6.32165 12.9883C5.83331 13.4767 5.83331 14.2617 5.83331 15.8333V17.5" stroke="white"/>
        <path d="M5.83331 6.6665H9.99998" stroke="white" stroke-linecap="round"/>
        <path d="M2.5 7.5C2.5 5.14333 2.5 3.96417 3.2325 3.2325C3.96417 2.5 5.14333 2.5 7.5 2.5H13.4767C13.8167 2.5 13.9875 2.5 14.14 2.56333C14.2933 2.62667 14.4142 2.74667 14.655 2.98833L17.0117 5.345C17.2533 5.58667 17.3733 5.70667 17.4367 5.86C17.5 6.0125 17.5 6.18333 17.5 6.52333V12.5C17.5 14.8567 17.5 16.0358 16.7675 16.7675C16.0358 17.5 14.8567 17.5 12.5 17.5H7.5C5.14333 17.5 3.96417 17.5 3.2325 16.7675C2.5 16.0358 2.5 14.8567 2.5 12.5V7.5Z" stroke="white"/>
        </svg>
        </div>
        <div className='flex items-center'>
                <div className='mt-8 flex border border-[#E0E2E7] bg-white rounded-lg p-[2px] w-[fit]'>
                    <TabButton handleSelect={() => handleSelectTabButton('all')} isSelected={activePage === 'all'} >All Status</TabButton>
                    <TabButton handleSelect={() => handleSelectTabButton('Active')} isSelected={activePage === 'Active'} >Active</TabButton>
                    <TabButton handleSelect={() => handleSelectTabButton('Closed')} isSelected={activePage === 'Closed'} >Closed</TabButton>
                </div>
                <div className='flex space-x-4 mt-8 ml-auto'>
                    <MiniSearch searchItem={'messages'} />
                    <SelectDatesButton />

                    <FilterButton />
                </div>
        </div>
                <div className='mt-5'>
                    {/* <div className=''></div> */}
                    <table className='w-full bg-white rounded-xl'>
                        <tr className='border-b'>
                            <th className='pt-3'>
                                   {selectedRows.length !== messages.length ?
                                            <button onClick={() => selectAll()} className='ml-4'>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="1" y="1" width="18" height="18" rx="5" fill="white" stroke="#858D9D" stroke-width="2" />
                                                </svg>
                                            </button> :
                                            <button onClick={() => deselectAll()} className='ml-4'>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="20" height="20" rx="6" fill="#BC6C25" />
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.947 4.77386C16.302 5.06675 16.3523 5.59197 16.0594 5.94699L8.91034 14.6126C8.76045 14.7943 8.48987 14.8157 8.31326 14.6598L4.44862 11.2499C4.10351 10.9454 4.0706 10.4188 4.3751 10.0737C4.67961 9.72855 5.20622 9.69563 5.55132 10.0001L8.44704 12.5552L14.7738 4.88635C15.0667 4.53134 15.5919 4.48097 15.947 4.77386Z" fill="white" />
                                                </svg>
                                            </button>}
                            </th>
                            <th className='w-[10%]'><TableHead heading={'Message ID'}/></th>
                            <th className='w-[50%]'><TableHead heading={'Last Message'} canOrder={true} ascend={()=>handleAscendingSort('message')} descend={()=> handleDescendingSort('message')}/></th>
                            <th className=''><TableHead heading={'Date'}  canOrder={true} ascend={()=>handleAscendingSort('date')} descend={()=> handleDescendingSort('date')}/></th>
                            <th className=''><TableHead heading={'Customer'}/></th>
                            <th className=''><TableHead heading={'Status'} canOrder={true} ascend={()=>handleAscendingSort('status')} descend={()=> handleDescendingSort('status')} /></th>
                            <th className=''><TableHead heading={'Action'} /></th>
                        </tr>
                        {displayMessage(filterDataByStatus(activePage))}
                    </table>

                </div>
{/*             
      <div className='flex gap-10'>
        <div className='w-[70%] rounded-xl my-3  p-3 bg-white'>
          <h2 className='font-semibold mb-3 text-[17px]  leading-[30px] tracking-[0.01em] text-[#333333]'>Account Information</h2>
          <p className='text-[#858D9D] mb-1  font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>Full Name</p>
          <input className="bg-[#F9F9FC] mb-2 w-[100%] rounded-xl border text-[#858D9D] font-bold text-[13px] p-2  tracking-[0.005em]" placeholder='Stephen M'></input>
          <p className='text-[#858D9D] mb-1 font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>Email Address</p>
          <input className="bg-[#F9F9FC] mb-2 w-[100%] rounded-xl border text-[#858D9D] font-bold text-[13px] p-2  tracking-[0.005em]" placeholder='stephen@gmail.com'></input>
        </div>
        <div className='rounded-xl my-3 w-[30%]  p-3  bg-white'>
          <h2 className='font-semibold mb-3 text-[17px]  leading-[30px] tracking-[0.01em] text-[#333333]'>Display Picture</h2>
          <p className='text-[#858D9D] mb-1  font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>Upload picture</p>
          <div className='bg-[#F9F9FC] border  w-full h-[65%] mb-3  rounded-lg flex-col items-center text-center justify-center p-6 py-8'>
            <p className='text-center items-center'>
                <svg className="ml-auto mr-auto" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C10.9389 2.99988 9.90049 3.30662 9.00979 3.88327C8.1191 4.45991 7.41418 5.28184 6.98 6.25C6.91932 6.38726 6.85732 6.52394 6.794 6.66C6.77267 6.70467 6.74999 6.74869 6.726 6.792C6.69276 6.84617 6.64969 6.89365 6.599 6.932C6.54311 6.96232 6.48208 6.98199 6.419 6.99C6.383 6.997 6.309 7 6 7C5.07174 7 4.1815 7.36875 3.52513 8.02513C2.86875 8.6815 2.5 9.57174 2.5 10.5C2.5 11.4283 2.86875 12.3185 3.52513 12.9749C4.1815 13.6313 5.07174 14 6 14H6.672L7.672 13H6C5.33696 13 4.70107 12.7366 4.23223 12.2678C3.76339 11.7989 3.5 11.163 3.5 10.5C3.5 9.83696 3.76339 9.20107 4.23223 8.73223C4.70107 8.26339 5.33696 8 6 8H6.054C6.28 8 6.467 8 6.616 7.97C6.796 7.934 6.974 7.88 7.142 7.77C7.31 7.662 7.432 7.522 7.54 7.372C7.598 7.292 7.65 7.188 7.697 7.089C7.747 6.983 7.81 6.842 7.89 6.665L7.892 6.66C8.24694 5.8673 8.82364 5.19422 9.55256 4.72195C10.2815 4.24968 11.1315 3.99839 12 3.99839C12.8685 3.99839 13.7185 4.24968 14.4474 4.72195C15.1764 5.19422 15.7531 5.8673 16.108 6.66L16.11 6.666C16.19 6.842 16.253 6.983 16.303 7.089C16.35 7.188 16.402 7.291 16.46 7.372C16.567 7.522 16.69 7.662 16.858 7.771C17.026 7.88 17.204 7.934 17.384 7.971C17.533 8.001 17.72 8.001 17.946 8H18C18.663 8 19.2989 8.26339 19.7678 8.73223C20.2366 9.20107 20.5 9.83696 20.5 10.5C20.5 11.163 20.2366 11.7989 19.7678 12.2678C19.2989 12.7366 18.663 13 18 13H16.328L17.328 14H18C18.4596 14 18.9148 13.9095 19.3394 13.7336C19.764 13.5577 20.1499 13.2999 20.4749 12.9749C20.7999 12.6499 21.0577 12.264 21.2336 11.8394C21.4095 11.4148 21.5 10.9596 21.5 10.5C21.5 10.0404 21.4095 9.58525 21.2336 9.16061C21.0577 8.73597 20.7999 8.35013 20.4749 8.02513C20.1499 7.70012 19.764 7.44231 19.3394 7.26642C18.9148 7.09053 18.4596 7 18 7C17.691 7 17.617 6.997 17.582 6.99C17.5189 6.98168 17.4578 6.96167 17.402 6.931C17.351 6.89275 17.3075 6.84526 17.274 6.791L17.258 6.764C17.2398 6.72942 17.2225 6.69441 17.206 6.659C17.1427 6.52327 17.0807 6.38693 17.02 6.25C16.5858 5.28184 15.8809 4.45991 14.9902 3.88327C14.0995 3.30662 13.0611 2.99988 12 3Z" fill="#333333" fill-opacity="0.5"/>
                <path d="M12 12.5L11.646 12.146L12 11.793L12.354 12.146L12 12.5ZM12.5 21.5C12.5 21.6326 12.4473 21.7598 12.3535 21.8535C12.2598 21.9473 12.1326 22 12 22C11.8674 22 11.7402 21.9473 11.6464 21.8535C11.5527 21.7598 11.5 21.6326 11.5 21.5H12.5ZM7.646 16.146L11.646 12.146L12.354 12.854L8.354 16.854L7.646 16.146ZM12.354 12.146L16.354 16.146L15.646 16.854L11.646 12.854L12.354 12.146ZM12.5 12.5V21.5H11.5V12.5H12.5Z" fill="#333333" fill-opacity="0.5"/>
                </svg>
            </p>
            <p className='text-[#858D9D] font-medium text-[12px]'>Select Image</p>
          </div>
          
        </div>
      </div>
      <div className='flex gap-10'>
        <div className='w-[70%] rounded-xl my-3  p-3 bg-white'>
          <h2 className='font-semibold mb-3 text-[17px]  leading-[30px] tracking-[0.01em] text-[#333333]'>Role</h2>
          <Select label={'Select Role'} placeholder={'Administrator'} choices={['Category A', 'Category B', 'Category C']} />
        </div>
        <div className='rounded-xl my-3 w-[30%]  p-3 '>
         
        </div>
      </div>
      <div className='flex gap-10'>
        <div className='w-[70%] rounded-xl my-3  p-3 bg-white'>
          <h2 className='font-semibold mb-3 text-[17px]  leading-[30px] tracking-[0.01em] text-[#333333]'>Change Password</h2>
          <div className='flex justify-between gap-3'>
            <div className='w-full'> 
              <p className='text-[#858D9D] mb-1  font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>Old Password</p>
              <input className="bg-[#F9F9FC] mb-2 w-[100%] rounded-xl border text-[#858D9D] font-bold text-[13px] p-2  tracking-[0.005em]" placeholder=''></input>
            </div>
            <div  className='w-full'> 
              <p className='text-[#858D9D] mb-1  font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>New Password</p>
              <input className="bg-[#F9F9FC] mb-2 w-[100%] rounded-xl border text-[#858D9D] font-bold text-[13px] p-2  tracking-[0.005em]" placeholder=''></input>
            </div>
            <div className='w-full'> 
              <p className='text-[#858D9D] mb-1  font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>Confirm New Password</p>
              <input className="bg-[#F9F9FC] mb-2 w-[100%] rounded-xl border text-[#858D9D] font-bold text-[13px] p-2  tracking-[0.005em]" placeholder=''></input>
            </div>
          </div>
         </div>
        <div className='rounded-xl my-3 w-[30%]  p-3'>
         
        </div>
      </div> */}
    </div>
  );
}

export default Messages;
