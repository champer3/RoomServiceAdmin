
// import { FilledButton } from '../components/Buttons/FilledButton';
// import TopBar from '../components/TopBar';
import Select from '../components/Select';
import Path from '../components/Path';
import DisplayPhotoDropzone from '../components/DisplayPhotoDropzone';

function Settings() {
  return (
    <div className='bg-[#F9F9FC] w-full px-4 py-5 '>
      <div className='space-x-8 w-full flex mt-5'>
        <h1 className='font-black text-[20px] leading-[30px] tracking-[0.01em] text-[#333333]'>Settings</h1>
      </div>
      <div className='my-3 space-x-8 w-full flex justify-between items-center'>
        <Path pages={[{name: 'Dashboard', link: 'dashboard'}, {name: 'Settings', link: 'settings'}]} />
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.3333 17.5V15.8333C13.3333 14.2617 13.3333 13.4767 12.845 12.9883C12.3566 12.5 11.5716 12.5 9.99998 12.5H9.16665C7.59498 12.5 6.80998 12.5 6.32165 12.9883C5.83331 13.4767 5.83331 14.2617 5.83331 15.8333V17.5" stroke="white" />
          <path d="M5.83331 6.6665H9.99998" stroke="white" stroke-linecap="round" />
          <path d="M2.5 7.5C2.5 5.14333 2.5 3.96417 3.2325 3.2325C3.96417 2.5 5.14333 2.5 7.5 2.5H13.4767C13.8167 2.5 13.9875 2.5 14.14 2.56333C14.2933 2.62667 14.4142 2.74667 14.655 2.98833L17.0117 5.345C17.2533 5.58667 17.3733 5.70667 17.4367 5.86C17.5 6.0125 17.5 6.18333 17.5 6.52333V12.5C17.5 14.8567 17.5 16.0358 16.7675 16.7675C16.0358 17.5 14.8567 17.5 12.5 17.5H7.5C5.14333 17.5 3.96417 17.5 3.2325 16.7675C2.5 16.0358 2.5 14.8567 2.5 12.5V7.5Z" stroke="white" />
        </svg>
      </div>
      <div className='flex items-center gap-10'>
        <div className='w-[70%] rounded-xl my-3 p-3 bg-white'>
          <h2 className='font-semibold mb-3 text-[17px]  leading-[30px] tracking-[0.01em] text-[#333333]'>Account Information</h2>
          <p className='text-[#858D9D] mb-1  font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>Full Name</p>
          <input className="bg-[#F9F9FC] mb-2 w-[100%] rounded-xl border text-[#858D9D] font-bold text-[13px] p-2  tracking-[0.005em]" placeholder='Stephen M'></input>
          <p className='text-[#858D9D] mb-1 font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>Email Address</p>
          <input className="bg-[#F9F9FC] mb-2 w-[100%] rounded-xl border text-[#858D9D] font-bold text-[13px] p-2  tracking-[0.005em]" placeholder='stephen@gmail.com'></input>
        </div>
        <div className='w-[30%]'>
          <div className="mt-3 rounded-xl bg-white p-4">
            <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Display Picture</p>
            <p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#777980]">Upload Picture</p>
            <DisplayPhotoDropzone />
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
            <div className='w-full'>
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
