
import { FilledButton } from '../components/Buttons/FilledButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'

function Settings() {
  return (
    <div className='bg-[#F9F9FC] w-full px-4 py-5 '>
      <div className='space-x-8 w-full flex mt-5'>
        <h1 className='font-black text-[20px] leading-[30px] tracking-[0.01em] text-[#333333]'>Settings</h1>
      </div>
      <div className='my-3 space-x-8 w-full flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <p className='text-[#F86624] font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>Dashboard</p>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 11.9192V4.47121C6.00003 4.33938 6.03914 4.21051 6.1124 4.10091C6.18565 3.9913 6.28976 3.90587 6.41156 3.85543C6.53336 3.80498 6.66738 3.79178 6.79669 3.81749C6.92599 3.8432 7.04476 3.90667 7.138 3.99988L10.862 7.72388C10.987 7.8489 11.0572 8.01844 11.0572 8.19521C11.0572 8.37199 10.987 8.54153 10.862 8.66655L7.138 12.3905C7.04476 12.4838 6.92599 12.5472 6.79669 12.5729C6.66738 12.5986 6.53336 12.5854 6.41156 12.535C6.28976 12.4846 6.18565 12.3991 6.1124 12.2895C6.03914 12.1799 6.00003 12.051 6 11.9192Z" fill="#C2C6CE"/></svg>
          <p className='text-[#858D9D] font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>Settings</p>
        </div>
        <FilledButton type='filled'><FontAwesomeIcon icon={faFloppyDisk} /> Save Changes</FilledButton>
      </div>
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
          <div className='bg-[#F9F9FC] border  w-full h-[65%] mb-3  rounded-lg flex-col items-center justify-center p-6 py-8' >
            <p className='text-center'><FontAwesomeIcon icon={faCloudArrowUp} color='#858D9D' /></p>
            <p className='text-[#858D9D] font-medium text-[12px] text-center'>Select Image</p>
          </div>
          
        </div>
      </div>
      <div className='flex gap-10'>
        <div className='w-[70%] rounded-xl my-3  p-3 bg-white'>
          <h2 className='font-semibold mb-3 text-[17px]  leading-[30px] tracking-[0.01em] text-[#333333]'>Role</h2>
          <p className='text-[#858D9D] mb-1  font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>Select Role</p>
          <select className="bg-[#F9F9FC] mb-2 w-[100%] rounded-xl border text-[#858D9D] font-bold text-[13px] p-2  tracking-[0.005em]"  id="role">
            <option value="Administrator">Administrator</option>
          </select>
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
      </div>
    </div>
  );
}

export default Settings;
