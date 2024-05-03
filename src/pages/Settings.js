
import { FilledButton } from '../components/Buttons/FilledButton';
import TopBar from '../components/TopBar';
import Select from '../components/Select';
import Path from '../components/Path';

function Settings() {
  return (
    <div className='bg-[#F9F9FC] w-full px-4 py-5 '>
      <div className='space-x-8 w-full flex mt-5'>
        <h1 className='font-black text-[20px] leading-[30px] tracking-[0.01em] text-[#333333]'>Settings</h1>
      </div>
      <div className='my-3 space-x-8 w-full flex justify-between items-center'>
        <Path pages={['Dashboard', 'Settings']} />
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.3333 17.5V15.8333C13.3333 14.2617 13.3333 13.4767 12.845 12.9883C12.3566 12.5 11.5716 12.5 9.99998 12.5H9.16665C7.59498 12.5 6.80998 12.5 6.32165 12.9883C5.83331 13.4767 5.83331 14.2617 5.83331 15.8333V17.5" stroke="white"/>
        <path d="M5.83331 6.6665H9.99998" stroke="white" stroke-linecap="round"/>
        <path d="M2.5 7.5C2.5 5.14333 2.5 3.96417 3.2325 3.2325C3.96417 2.5 5.14333 2.5 7.5 2.5H13.4767C13.8167 2.5 13.9875 2.5 14.14 2.56333C14.2933 2.62667 14.4142 2.74667 14.655 2.98833L17.0117 5.345C17.2533 5.58667 17.3733 5.70667 17.4367 5.86C17.5 6.0125 17.5 6.18333 17.5 6.52333V12.5C17.5 14.8567 17.5 16.0358 16.7675 16.7675C16.0358 17.5 14.8567 17.5 12.5 17.5H7.5C5.14333 17.5 3.96417 17.5 3.2325 16.7675C2.5 16.0358 2.5 14.8567 2.5 12.5V7.5Z" stroke="white"/>
        </svg>
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
      </div>
    </div>
  );
}

export default Settings;
