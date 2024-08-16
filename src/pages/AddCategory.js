import Path from "../components/Path"
import Input from "../components/Input"
import TextArea from "../components/TextArea"
import ImageDropzone from "../components/ImageDropzone"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { PageContext } from "../context/PageContext"


export default function AddCategoryPage() {
    const {changePage} = useContext(PageContext)

    return (
        <div className="">
            {changePage('categories')}
            <div className="ml-4">
                <div className="flex items-center">
                    <div>
                        <p className='text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]'>Add Category</p>
                        <Path pages={[{name: 'Dashboard', link: 'dashboard'}, {name: 'Categories', link: 'categories'}, {name: 'Add Category', link: 'add-category'}]} />
                    </div>
                    <div className='flex ml-auto'>
                        <Link to={'/categories'}>
                            <button className='flex items-center border border-[#858D9D] rounded-xl mr-2 px-[14px] py-[10px] text-[#858D9D] font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>
                                <svg className="mr-2" width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_503_3949)">
                                        <path d="M8.94252 7.99999L15.8045 1.13799C15.926 1.01225 15.9932 0.84385 15.9916 0.669052C15.9901 0.494255 15.92 0.327046 15.7964 0.203441C15.6728 0.0798355 15.5056 0.00972286 15.3308 0.00820391C15.156 0.00668497 14.9876 0.0738812 14.8619 0.19532L7.99986 7.05732L1.13786 0.19532C1.01212 0.0738812 0.843721 0.00668497 0.668923 0.00820391C0.494126 0.00972286 0.326917 0.0798355 0.203312 0.203441C0.0797065 0.327046 0.00959389 0.494255 0.00807494 0.669052C0.00655599 0.84385 0.0737523 1.01225 0.195191 1.13799L7.05719 7.99999L0.195191 14.862C0.0702103 14.987 0 15.1565 0 15.3333C0 15.5101 0.0702103 15.6796 0.195191 15.8047C0.320209 15.9296 0.489748 15.9998 0.666524 15.9998C0.8433 15.9998 1.01284 15.9296 1.13786 15.8047L7.99986 8.94265L14.8619 15.8047C14.9869 15.9296 15.1564 15.9998 15.3332 15.9998C15.51 15.9998 15.6795 15.9296 15.8045 15.8047C15.9295 15.6796 15.9997 15.5101 15.9997 15.3333C15.9997 15.1565 15.9295 14.987 15.8045 14.862L8.94252 7.99999Z" fill="#858D9D" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_503_3949">
                                            <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>

                                Cancel
                            </button>
                        </Link>
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
                            <p className='ml-2'>Add Category</p>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className='w-[30%] p-3'>
                    <div className="mt-8 rounded-xl bg-white p-4">
                        <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Thumbnail</p>
                        <p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#777980]">Photo</p>
                        <ImageDropzone description={'Drag and drop image here, or click add image'} />
                    </div>
                </div>
                <div className="w-[70%] p-3">
                    <div className="mt-8 rounded-xl bg-white p-4">
                        <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">General Information</p>
                        <Input label={'Category Name'} placeholder={'Type category name here'} />
                        <div className="mt-3" />
                        <TextArea label={'Description'} placeholder={'Type category description here'} />
                    </div>
                </div>
            </div>
            <div className='bg-[#F9F9FC] w-full h-[500px]'/>
        </div>
    )
}