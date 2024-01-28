import Path from "../components/Path"
import Input from "../components/Input"
import TextArea from "../components/TextArea"
import ImageDropzone from "../components/ImageDropzone"
import Select from "../components/Select"
import GreenLabel from "../components/StatusLabels/GreenLabel"
import GreyLabel from "../components/StatusLabels/GreyLabel"
import OrangeLabel from "../components/StatusLabels/OrangeLabel"
import { useState } from "react"

export default function AddProjectsPage() {
    const [isTicked, setIsTicked] = useState(false)
    const [status, setStatus] = useState()
    function handleIsTicked() {
        setIsTicked((prevState) => !prevState)
    }

    function handleSelectStatus(status) {
        setStatus(status)
    }

    return (
        <>
            <div className="ml-4">
                <p className='text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]'>Add Product</p>
                <Path pages={['Dashboard', 'Product List', 'Add Product']} />
            </div>
            <div className="flex">
                <div className='w-[70%] p-3'>
                    <div className="mt-8 rounded-xl bg-white p-4">
                        <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">General Information</p>
                        <Input label={'Product Name'} placeholder={'Type product name here'} />
                        <div className="mt-3" />
                        <TextArea label={'Description'} placeholder={'Type product description here'} />
                    </div>
                    <div className="mt-8 rounded-xl bg-white p-4">
                        <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Media</p>
                        <ImageDropzone description={'Drag and drop image here, or click add image'} />
                    </div>
                    <div className="mt-8 rounded-xl bg-white p-4">
                        <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Pricing</p>
                        <Input label={'Base Price ($)'} placeholder={'Type base price here'} />
                        <div className="w-full mt-3 flex space-x-3">
                            <div className="w-[50%]">
                                <Select label={'Discount Type'} placeholder={'Select a discount type'} choices={['Discount A', 'Discount B', 'Discount C']} />
                            </div>
                            <div className="w-[50%] h-[40px]">
                                <Input label={'Discount Percentage (%)'} placeholder={'Type discount percentage'} />
                            </div>
                        </div>
                        <div className="w-full mt-3 flex space-x-3">
                            <div className="w-[50%]">
                                <Select label={'Tax Class'} placeholder={'Select a discount type'} choices={['Class A', 'Class B', 'Class C']} />
                            </div>
                            <div className="w-[50%] h-[40px]">
                                <Input label={'VAT Amount (%)'} placeholder={'Type VAT amount'} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 rounded-xl bg-white h-[140px] p-4">
                        <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Inventory</p>
                        <div className="flex space-x-3">
                            <div className="w-full h-[40px]">
                                <Input label={'SKU'} placeholder={'Type product SKU here'} />
                            </div>
                            <div className="w-full h-[40px]">
                                <Input label={'Barcode'} placeholder={'Type product barcode here'} />
                            </div>
                            <div className="w-full h-[40px]">
                                <Input label={'Quantity'} placeholder={'Type product quantity here'} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 rounded-xl bg-white p-4 h-[160px]">
                        <p className="font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Shipping</p>
                        <div className="my-2 flex items-center">
                            <button onClick={handleIsTicked}>
                                {!isTicked ?
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="1" y="1" width="18" height="18" rx="5" fill="white" stroke="#858D9D" stroke-width="2" />
                                    </svg> :
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="20" height="20" rx="6" fill="#283618" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9471 4.77386C16.3021 5.06675 16.3525 5.59197 16.0596 5.94699L8.91046 14.6126C8.76057 14.7943 8.49 14.8157 8.31338 14.6598L4.44874 11.2499C4.10364 10.9454 4.07072 10.4188 4.37523 10.0737C4.67973 9.72855 5.20634 9.69563 5.55144 10.0001L8.44716 12.5552L14.7739 4.88635C15.0668 4.53134 15.5921 4.48097 15.9471 4.77386Z" fill="white" />
                                    </svg>

                                }
                            </button>
                            <p className="ml-1 text-[14px] font-semibold text-[#283618] ">This is a physical product</p>
                        </div>

                        <div className="flex space-x-3">
                            <div className="w-full h-[40px]">
                                <Input label={'Weight'} placeholder={'Product weight'} />
                            </div>
                            <div className="w-full h-[40px]">
                                <Input label={'Height'} placeholder={'Product height (cm)'} />
                            </div>
                            <div className="w-full h-[40px]">
                                <Input label={'Length'} placeholder={'Product length (cm)'} />
                            </div>
                            <div className="w-full h-[40px]">
                                <Input label={'Width'} placeholder={'Product width (cm)'} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[30%] p-3">
                    <div className="mt-8 rounded-xl bg-white p-4">
                        <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Category</p>
                        <Select label={'Product Category'} placeholder={'Select a category'} choices={['Category A', 'Category B', 'Category C']} />
                        <div className="mt-3" />
                        <Select label={'Product Tags'} placeholder={'Select tags'} choices={['Tag A', 'Tag B', 'Tag C']} />
                    </div>
                    <div className="mt-8 rounded-xl bg-white p-4">
                        <div className="flex">
                            <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Status</p>
                            <div className="ml-auto"/>
                            {status === 'Draft' && <GreyLabel>Draft</GreyLabel>}
                            {status === 'Published' && <GreenLabel>Published</GreenLabel>}
                            {status === 'Low Stock' && <OrangeLabel>Low Stock</OrangeLabel>}
                        </div>
                        <Select label={'Product Status'} placeholder={'Select status'} choices={['Published', 'Draft', 'Low Stock']} handleOptionSelected={handleSelectStatus} />
                    </div>
                </div>
            </div>
        </>
    )
}