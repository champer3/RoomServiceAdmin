import Path from "../components/Path"
import Input from "../components/Input"
import TextArea from "../components/TextArea"
import ImageDropzone from "../components/ImageDropzone"
import { Link } from "react-router-dom"
import { PageContext } from "../context/PageContext"
import { useContext, useRef, useState } from "react"

export default function EditCategoryPage() {
    const [isDisabled, setIsDisabled] = useState(false)
    const inputRef = useRef(null)
    const textAreaRef = useRef(null)
    const { category, file, updateCategory } = useContext(PageContext)
    // console.log(file)
    // console.log(category.id)

    // console.log(category)
    const [inputValue, setInputValue] = useState({
        name: category.name,
        description: category.description,
    })





    const handleInputChange = () => {
        const newName = inputRef.current.value; // Get the current value from the input
        const newDescription = textAreaRef.current.value; // Get the current value from the input
        setIsDisabled(newDescription === '' || newName === '')
        setInputValue({ name: newName, description: newDescription })

    };



    function handleSaveChanges() {
        if (file.path) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Image = event.target.result; // Base64 encoded image data
                updateCategory(category.id, base64Image, inputValue.name, inputValue.description);
            };
            reader.readAsDataURL(file); // Read the file as data URL (base64)
        }
        else {
            updateCategory(category.id, category.image, inputValue.name, inputValue.description);
        }


    }

    return (
        <div className="">
            <div className="ml-4">
                <div className="flex items-center">
                    <div>
                        <p className='text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]'>Edit Category</p>
                        <Path pages={[{ name: 'Dashboard', link: 'dashboard' }, { name: 'Categories', link: 'categories' }, { name: 'Edit Category', link: 'edit-category' }]} />
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
                                Return
                            </button>
                        </Link>
                        
                            <button onClick={handleSaveChanges} disabled={isDisabled || !file} className='flex items-center rounded-xl px-[14px] py-[10px] bg-[#283618] text-white font-semibold text-[14px] leading-[20px] tracking-[0.005em] disabled:bg-stone-200 disabled:text-white'>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_578_3728)">
                                        <path d="M10.0001 12.6667C10.7365 12.6667 11.3334 12.0697 11.3334 11.3333C11.3334 10.597 10.7365 10 10.0001 10C9.26371 10 8.66675 10.597 8.66675 11.3333C8.66675 12.0697 9.26371 12.6667 10.0001 12.6667Z" fill="white" />
                                        <path d="M17.024 4.748L15.252 2.976C15.0747 2.80147 14.8783 2.64741 14.6667 2.51666V4C14.6644 5.84003 13.1733 7.33113 11.3333 7.33334H8.66666C6.82662 7.33113 5.33553 5.84003 5.33334 4V2C3.49331 2.00222 2.00222 3.49331 2 5.33334V14.6667C2.00222 16.5067 3.49331 17.9978 5.33334 18H14.6667C16.5067 17.9978 17.9978 16.5067 18 14.6667V7.10469C18.0025 6.22028 17.651 5.37166 17.024 4.748ZM10 14C8.52725 14 7.33334 12.8061 7.33334 11.3333C7.33334 9.86059 8.52725 8.66669 10 8.66669C11.4727 8.66669 12.6667 9.86059 12.6667 11.3333C12.6667 12.8061 11.4727 14 10 14Z" fill="white" />
                                        <path d="M8.66675 5.99997H11.3334C12.438 5.99997 13.3334 5.10453 13.3334 3.99997V2.04266C13.1885 2.01903 13.0421 2.00478 12.8954 2H6.66675V4C6.66675 5.10453 7.56218 5.99997 8.66675 5.99997Z" fill="white" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_578_3728">
                                            <rect width="16" height="16" fill="white" transform="translate(2 2)" />
                                        </clipPath>
                                    </defs>
                                </svg>

                                <p className='ml-2'>Save Category</p>
                            </button>
                        

                    </div>
                </div>
            </div>
            <div className="flex">
                <div className='w-[30%] p-3'>
                    <div className="mt-8 rounded-xl bg-white p-4">
                        <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Thumbnail</p>
                        <p className="font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#777980]">Photo</p>
                        <ImageDropzone description={'Drag and drop image here, or click add image'} image={category.image} />
                    </div>
                </div>
                <div className="w-[70%] p-3">
                    <div className="mt-8 rounded-xl bg-white p-4">
                        <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">General Information</p>
                        <Input ref={inputRef} label={'Category Name'} placeholder={'Type category name here'} text={category.name} onInputChange={handleInputChange} />
                        <div className="mt-3" />
                        <TextArea ref={textAreaRef} label={'Description'} placeholder={'Type category description here'} text={category.description} onInputChange={handleInputChange} />
                    </div>
                </div>
            </div>
            <div className='bg-[#F9F9FC] w-full h-[500px]' />
        </div>
    )
}