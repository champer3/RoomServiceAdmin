import Path from "../components/Path"
import Input from "../components/Input"
import TextArea from "../components/TextArea"
import ImageDropzone from "../components/ImageDropzone"
import Select from "../components/Select"
import GreenLabel from "../components/StatusLabels/GreenLabel"
import GreyLabel from "../components/StatusLabels/GreyLabel"
import OrangeLabel from "../components/StatusLabels/OrangeLabel"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PageContext } from "../context/PageContext"

export default function AddProjectsPage() {
    const [product, setProduct] = useState({
        "availability": false,
        "category": "",
        "components": [],
        "description" : "",
        "extra": false,
        "images": [],
        "instructions" : false,
        "nutrients" : [],
        "oldPrice": 0,
        "options": [],
        "price": 0,
        "related": [],
        "stock": 0,
        "title": ""
    })
    const { productId } = useParams();
    const getProduct = async () => {
        try {
          const product = await axios.get(
            `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/products/${productId}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setProduct(product.data.data.product)
          setFiles(product.data.data.product.images)
          console.log(product.data.data.product)
          return product;
        } catch (err) {
          console.log(err);
        }
      };
    useEffect(()=>{getProduct()},[])
    
    const authToken = localStorage.getItem("token");
    const { changePage } = useContext(PageContext)
    const [files, setFiles] = useState([]);
    const [variation, setVariation] = useState('');
    const [optionName, setOptionName] = useState('');
    const [valueInput, setValueInput] = useState('');



    const handleFilesChange = (newFiles) => {
        setFiles(newFiles);
    };

    const handleRemoveFile = (fileToRemove, e) => {
        e.preventDefault()
        setFiles(files.filter(file => file.name !== fileToRemove.name));
    };
    
    const handleInputChange = (field) => (e) => {
        if (field === "price") {
            setProduct({
                ...product,
                [field]: parseFloat(e.target.value)
            })
        } else if (field === "stock") {
            setProduct({
                ...product,
                [field]: parseInt(e.target.value)
            })
        } else{
        setProduct({
            ...product,
            [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value
        });}
    };

    const handleAddVariation = () => {
        if (variation) {
            setProduct({
                ...product,
                components: [...product.components, variation]
            });
            setVariation('');
        }
    };
    
const [relatedInput, setRelatedInput] = useState("");
const [nutrientInput, setNutrientInput] = useState("");

// Function to add a related keyword
const handleAddRelated = () => {
    if (relatedInput.trim()) {
        setProduct((prevProduct) => ({
            ...prevProduct,
            related: [...prevProduct.related, relatedInput.trim()],
        }));
        setRelatedInput(""); // Clear the input field
    }
};

// Function to remove a related keyword
const handleRemoveRelated = (keyword) => {
    setProduct((prevProduct) => ({
        ...prevProduct,
        related: prevProduct.related.filter((item) => item !== keyword),
    }));
};

// Function to add a nutrient
const handleAddNutrient = () => {
    if (nutrientInput.trim()) {
        setProduct((prevProduct) => ({
            ...prevProduct,
            nutrients: [...prevProduct.nutrients, nutrientInput.trim()],
        }));
        setNutrientInput(""); // Clear the input field
    }
};

// Function to remove a nutrient
const handleRemoveNutrient = (nutrient) => {
    setProduct((prevProduct) => ({
        ...prevProduct,
        nutrients: prevProduct.nutrients.filter((item) => item !== nutrient),
    }));
};

    const handleRemoveVariation = (v) => {
        setProduct({
            ...product,
            components: product.components.filter(variation => variation !== v)
        });
    };

    const handleAddValue = () => {
        if (valueInput) {
            setProduct({
                ...product,
                options: [...product.options, valueInput]
            });
            setValueInput('');
        }
    };

    const handleRemoveValue = (value) => {
        setProduct({
            ...product,
            options: product.options.filter(val => val !== value)
        });
    };

    function handleSelectStatus(status) {
        setProduct({...product, availability: status == 'Available'})
    }
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };
    function isValidURL(str) {
        if (typeof str !== 'string') {
          str = String(str);
        }
        
        return str.startsWith("http://") || str.startsWith("https://");
      }

    const uploadImages = async (images) => {
        if (!images || images.length === 0) {
            alert('Please select images to upload!');
            return [];
        }

        const uploadedImageUrls = [];

        for (const image of images) {
            if (isValidURL(image)){ uploadedImageUrls.push(image) ;  console.log('Image URL:', image)}else{
            const formData = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', 'my_unsigned_preset'); // Replace with your preset
            formData.append('cloud_name', 'dvxcif0nt'); // Replace with your Cloudinary cloud name

            try {
                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/dvxcif0nt/image/upload',
                    formData
                );
                uploadedImageUrls.push(response.data.secure_url);
                console.log('Image URL:', response.data.secure_url);
            } catch (error) {
                console.error('Error uploading image:', error);
            }}
        }
        setProduct({...product, ["images"]: uploadedImageUrls})
        return uploadedImageUrls;
    };
    const handleSubmit = async () => {
        try {
            await uploadImages(files);
            console.log(product)
            const response = await axios.patch(`https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/products/${productId}`, JSON.stringify(product),
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MmY5MTQ1ZGEzYmQ3ZmUzMTU5YzU1MyIsImlhdCI6MTcyNTAzNDYxOCwiZXhwIjoxNzI1ODk4NjE4fQ.xcFoMC9joIY-ChhTZZBGsvyfGtgz-SSQxYDnMe_4kVI'}`,
                    },

                });

            if (response.data.status === 'success') {
            }
        } catch (error) {
            console.error('Error editing product:', error);
        }
    };

    return (
        <>
            {changePage('products')}
            <div className="ml-4">
                <div className="flex items-center">
                    <div>
                        <p className='text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]'>Edit Product</p>
                        <Path pages={[{ name: 'Dashboard', link: 'dashboard' }, { name: 'Product List', link: 'products' }, { name: 'Edit Product', link: `/edit-product/${productId}` }]} />
                    </div>
                    <div className='flex ml-auto'>
                        <Link to={'/products'}>
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
                        <button onClick={handleSubmit} className='flex items-center rounded-xl px-[14px] py-[10px] bg-[#283618] text-white font-semibold text-[14px] leading-[20px] tracking-[0.005em]'>
                          
                            <p className='ml-2'>Edit Product</p>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className='w-[70%] p-3'>
                    <div className="mt-8 rounded-xl bg-white p-4">
                        <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">General Information</p>
                        <Input
                        label="Product Name"
                        placeholder="Type product name here"
                        text={product.title}
                        onInputChange={handleInputChange('title')}
                    />
                    <div className="mt-3" />
                    <TextArea
                        label="Description"
                        placeholder="Type product description here"
                        text={product.description}
                        onInputChange={handleInputChange('description')}
                    />
                            <p className="text-[#777980] font-bold text-[14px] leading-[20px] tracking-[0.005em]">Related</p>
                            <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Enter related search keywords"
                            value={relatedInput}
                            onChange={(e) => setRelatedInput(e.target.value)}
                            className="w-full h-full px-[12px] bg-[#F9F9FC] rounded-lg border-[1px] border-[#E0E2E7] focus:border-none focus:ring-stone-200 w-full h-full font-extrabold text-[14px] leading-[20px] tracking-[0.005em] text-[#858D9D] "
                        />
                        <button
                            onClick={handleAddRelated}
                            className="ml-2 bg-[#283618] text-white rounded-lg px-4 py-2"
                        >
                            Add
                        </button>
                    </div>
                    <div className="mt-3 flex flex-wrap">
                        {product.related.map((v, idx) => (
                            <div
                                key={idx}
                                className="flex items-center bg-[#F0F1F3] rounded-full px-3 py-1 mr-2 mb-2"
                            >
                                <span className="text-[#333333]">{v}</span>
                                <button
                                    onClick={() => handleRemoveRelated(v)}
                                    className="ml-2 text-[#333333]"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                            </div>
                            <p className="text-[#777980] font-bold text-[14px] leading-[20px] tracking-[0.005em]">Nutrients</p>
                            <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Enter nutrients"
                            value={nutrientInput}
                            onChange={(e) => setNutrientInput(e.target.value)}
                            className="w-full h-full px-[12px] bg-[#F9F9FC] rounded-lg border-[1px] border-[#E0E2E7] focus:border-none focus:ring-stone-200 w-full h-full font-extrabold text-[14px] leading-[20px] tracking-[0.005em] text-[#858D9D] "
                        />
                        <button
                            onClick={handleAddNutrient}
                            className="ml-2 bg-[#283618] text-white rounded-lg px-4 py-2"
                        >
                            Add
                        </button>
                    </div>
                    <div className="mt-3 flex flex-wrap">
                        {product.nutrients.map((v, idx) => (
                            <div
                                key={idx}
                                className="flex items-center bg-[#F0F1F3] rounded-full px-3 py-1 mr-2 mb-2"
                            >
                                <span className="text-[#333333]">{v}</span>
                                <button
                                    onClick={() => handleRemoveNutrient(v)}
                                    className="ml-2 text-[#333333]"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                            </div>
                    </div>
                    <div className="mt-8 rounded-xl bg-white p-4">
                        <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Images</p>
                        <ImageDropzone
                            description="Drag and drop your images here or click to select"
                            files={files}
                            onFilesChange={handleFilesChange}
                            onRemoveFile={handleRemoveFile}
                        />
                    </div>
                    <div className="mt-8 rounded-xl bg-white p-4">
                    <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Pricing and Stock</p>
                    <Input
                        label="Base Price ($)"
                        placeholder="Type base price here"
                        text={product.price}
                        onInputChange={handleInputChange('price')}
                    />
                    {/* <div className="w-full mt-3 flex space-x-3">
                        <div className="w-[50%]">
                            <Select label={'Discount Type'} placeholder={'Select a discount type'} choices={['Discount A', 'Discount B', 'Discount C']} />
                        </div>
                        <div className="w-[50%] h-[40px]">
                            <Input
                                label={'Discount Percentage (%)'}
                                placeholder={'Type discount percentage'}
                                text={product.discountPercentage}
                                onInputChange={handleInputChange('discountPercentage')}
                            />
                        </div>
                    </div>
                    <div className="w-full mt-3 flex space-x-3">
                        <div className="w-[50%]">
                            <Select label={'Tax Class'} placeholder={'Select a tax class'} choices={['Class A', 'Class B', 'Class C']} />
                        </div>
                        <div className="w-[50%] h-[40px]">
                            <Input
                                label={'VAT Amount (%)'}
                                placeholder={'Type VAT amount'}
                                text={product.vatAmount}
                                onInputChange={handleInputChange('vatAmount')}
                            />
                        </div>
                    </div> */}
                    <div className="mt-3">
                        <Input
                            label="Stock Quantity"
                            placeholder="Type product stock quantity here"
                            text={product.stock}
                            onInputChange={handleInputChange('stock')}
                        />
                    </div>
                </div>
                    {/* <div className="mt-8 rounded-xl bg-white h-[140px] p-4">
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
                    </div> */}
                    <div className="mt-8 rounded-xl bg-white p-4 ">
                        <div className=" flex items-center space-x-3">
                        <button onClick={() => setProduct({ ...product, instructions: !product.instructions })}>
                            {product.instructions ? (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="20" height="20" rx="6" fill="#283618" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M15.9471 4.77386C16.3021 5.06675 16.3525 5.59197 16.0596 5.94699L8.91046 14.6126C8.76057 14.7943 8.49 14.8157 8.31338 14.6598L4.44874 11.2499C4.10364 10.9454 4.07072 10.4188 4.37523 10.0737C4.67973 9.72855 5.20634 9.69563 5.55144 10.0001L8.44716 12.5552L14.7739 4.88635C15.0668 4.53134 15.5921 4.48097 15.9471 4.77386Z" fill="white" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1" y="1" width="18" height="18" rx="5" fill="white" stroke="#858D9D" strokeWidth="2" />
                                </svg>
                            )}
                        </button>
                            <p className="ml-1 text-[14px] font-semibold text-[#283618] ">Include Instructions</p>
                            <button onClick={() => setProduct({ ...product, extra: !product.extra })}>
                            {product.extra ? (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="20" height="20" rx="6" fill="#283618" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M15.9471 4.77386C16.3021 5.06675 16.3525 5.59197 16.0596 5.94699L8.91046 14.6126C8.76057 14.7943 8.49 14.8157 8.31338 14.6598L4.44874 11.2499C4.10364 10.9454 4.07072 10.4188 4.37523 10.0737C4.67973 9.72855 5.20634 9.69563 5.55144 10.0001L8.44716 12.5552L14.7739 4.88635C15.0668 4.53134 15.5921 4.48097 15.9471 4.77386Z" fill="white" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1" y="1" width="18" height="18" rx="5" fill="white" stroke="#858D9D" strokeWidth="2" />
                                </svg>
                            )}
                        </button>
                            <p className="ml-1 text-[14px] font-semibold text-[#283618] ">Requires Sides</p>
                        </div>
                    </div>
                </div>
                <div className="w-[30%] p-3">
                    <div className="mt-8 rounded-xl bg-white p-4">
                        <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Category</p>
                        <input
                        type="text"
                        placeholder="Enter category"
                        className="w-full rounded-lg border border-[#F0F1F3] py-2 px-3 text-[#333333] leading-[28px]"
                        value={product.category}
                        onChange={handleInputChange('category')}
                    />

                        <div className=" rounded-xl bg-white p-4">
                            <p className="mb-3  text-[15px] leading-[28px] tracking-[0.01em] text-[#333333]">Product Variations</p>
                            <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Enter a variation"
                            value={variation}
                            onChange={(e) => setVariation(e.target.value)}
                            className="w-full rounded-lg border border-[#F0F1F3] py-2 px-3 text-[#333333] leading-[28px]"
                        />
                        <button
                            onClick={handleAddVariation}
                            className="ml-2 bg-[#283618] text-white rounded-lg px-4 py-2"
                        >
                            Add
                        </button>
                    </div>
                    <div className="mt-3 flex flex-wrap">
                        {product.components.map((v, idx) => (
                            <div
                                key={idx}
                                className="flex items-center bg-[#F0F1F3] rounded-full px-3 py-1 mr-2 mb-2"
                            >
                                <span className="text-[#333333]">{v}</span>
                                <button
                                    onClick={() => handleRemoveVariation(v)}
                                    className="ml-2 text-[#333333]"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                            </div>
                        </div>

                    </div>
                    <div className="mt-8 rounded-xl bg-white p-4">
                        <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Options</p>
                        <input
                            type="text"
                            placeholder="Enter option name"
                            value={optionName}
                            onChange={(e) => setOptionName(e.target.value)}
                            className="w-full rounded-lg border border-[#F0F1F3] py-2 px-3 text-[#333333] leading-[28px] mb-3"
                        />
                        <div>
                        <input
                            type="text"
                            placeholder="Enter an option value"
                            value={valueInput}
                            onChange={(e) => setValueInput(e.target.value)}
                            className="w-full rounded-lg border border-[#F0F1F3] py-2 px-3 text-[#333333] leading-[28px]"
                        />
                        <button
                            onClick={handleAddValue}
                            className="ml-2 bg-[#283618] text-white rounded-lg px-4 py-2"
                        >
                            Add
                        </button>
                    </div>
                    <div className="mt-3 flex flex-wrap">
                        {product.options.map((value, idx) => (
                            <div
                                key={idx}
                                className="flex items-center bg-[#F0F1F3] rounded-full px-3 py-1 mr-2 mb-2"
                            >
                                <span className="text-[#333333]">{value}</span>
                                <button
                                    onClick={() => handleRemoveValue(value)}
                                    className="ml-2 text-[#333333]"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        </div>
                    </div>
                    <div className="mt-8 rounded-xl bg-white p-4">
                        <div className="flex">
                            <p className="mb-3 font-bold text-[18px] leading-[28px] tracking-[0.01em] text-[#333333]">Status</p>
                            <div className="ml-auto" />
                            {product.availability && <GreenLabel>Available</GreenLabel>}
                            {!product.availability && <OrangeLabel>Out of Stock</OrangeLabel>}
                        </div>
                        <Select label={'Product Status'} placeholder={'Select status'} choices={['Available', 'Out of Stock']} handleOptionSelected={handleSelectStatus} />
                    </div>
                </div>
            </div>
        </>
    )
}