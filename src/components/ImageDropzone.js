import { useCallback, useContext, useState, } from 'react'
import { useDropzone } from 'react-dropzone'
import { PageContext } from '../context/PageContext'


const styling = 'w-full rounded-lg border border-dashed border-2 border-[#F0F1F3] bg-[#F9F9FC] py-[24px] px-[12px]'
export default function ImageDropzone({ description, image }) {
    const [initialImageRendered, setInitialImageRendered] = useState(false)
    const { category, file, changeFile } = useContext(PageContext)
    const initialFile = {
        name: file ? file.name:category.imageURL.split('/').pop(),
        type: 'image/*',
    }

    if (!initialImageRendered) {
        changeFile(initialFile)
        setInitialImageRendered(true)
    }




    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length) {
            changeFile(Object.assign(acceptedFiles[0], { preview: URL.createObjectURL(acceptedFiles[0]) })); // Create preview URL
        }
    }, [changeFile])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false,
    })
    function removeFile() {
        URL.revokeObjectURL(file.preview)
        changeFile(null)

    }









    return (<>
        <div {...getRootProps({
            className: styling
        })}>
            <input {...getInputProps()} />
            {
                <>
                    {!file &&
                        <>
                            <svg className="ml-auto mr-auto" width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="44" height="44" rx="8" fill="#283618" />
                                <g clip-path="url(#clip0_503_3978)">
                                    <path d="M21.3416 22.4021C21.1326 22.1931 20.8845 22.0272 20.6114 21.914C20.3384 21.8009 20.0457 21.7426 19.7501 21.7426C19.4545 21.7426 19.1618 21.8009 18.8887 21.914C18.6156 22.0272 18.3675 22.1931 18.1586 22.4021L13.0286 27.5321C13.0979 28.4727 13.5197 29.3524 14.2097 29.9954C14.8997 30.6384 15.8069 30.9972 16.7501 31.0001H27.2501C27.9849 31 28.7032 30.7826 29.3148 30.3754L21.3416 22.4021Z" fill="white" />
                                    <path d="M26.5 19.0002C27.3284 19.0002 28 18.3287 28 17.5002C28 16.6718 27.3284 16.0002 26.5 16.0002C25.6716 16.0002 25 16.6718 25 17.5002C25 18.3287 25.6716 19.0002 26.5 19.0002Z" fill="white" />
                                    <path d="M27.25 13H16.75C15.7558 13.0012 14.8027 13.3967 14.0997 14.0997C13.3967 14.8027 13.0012 15.7558 13 16.75L13 25.4395L17.098 21.3415C17.4462 20.9932 17.8597 20.7169 18.3147 20.5283C18.7697 20.3398 19.2575 20.2428 19.75 20.2428C20.2425 20.2428 20.7303 20.3398 21.1853 20.5283C21.6403 20.7169 22.0538 20.9932 22.402 21.3415L30.3752 29.3148C30.7825 28.7031 30.9999 27.9848 31 27.25V16.75C30.9988 15.7558 30.6033 14.8027 29.9003 14.0997C29.1973 13.3967 28.2442 13.0012 27.25 13V13ZM26.5 20.5C25.9067 20.5 25.3266 20.3241 24.8333 19.9944C24.3399 19.6648 23.9554 19.1962 23.7284 18.6481C23.5013 18.0999 23.4419 17.4967 23.5576 16.9147C23.6734 16.3328 23.9591 15.7982 24.3787 15.3787C24.7982 14.9591 25.3328 14.6734 25.9147 14.5576C26.4967 14.4419 27.0999 14.5013 27.6481 14.7284C28.1962 14.9554 28.6648 15.3399 28.9944 15.8333C29.3241 16.3266 29.5 16.9067 29.5 17.5C29.5 18.2956 29.1839 19.0587 28.6213 19.6213C28.0587 20.1839 27.2956 20.5 26.5 20.5Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_503_3978">
                                        <rect width="18" height="18" fill="white" transform="translate(13 13)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <p className="p-8 text-center font-extrabold text-[14px] leading-[20px] tracking-[0.005em] text-[#858D9D]">{isDragActive ? 'Drop the image here ...' : description}</p>
                            <div className="w-full flex justify-center items-center">
                                <button className="border border-[1px] border-[#283618] px-[14px] py-[10px] font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#283618] rounded-lg hover:text-white hover:bg-[#283618]">Add Image</button>
                            </div>
                        </>}
                    {file &&
                        <>
                            <div class="relative ml-auto bg-[#E0E2E7] rounded-lg px-2 py-2 mr-auto w-[100px]">
                                <img className='ml-auto mr-auto object-cover' src={file.preview ? file.preview : image ? image : ""} alt='' />
                                <span className="absolute top-0 right-0 transform -translate-y-[10px]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="24" height="24" rx="12" fill="#D3F4EF" />
                                        <g clip-path="url(#clip0_578_3741)">
                                            <path d="M16.2995 8.84625L10.5416 14.6038C10.5029 14.6426 10.4569 14.6735 10.4062 14.6945C10.3556 14.7155 10.3012 14.7264 10.2464 14.7264C10.1915 14.7264 10.1372 14.7155 10.0866 14.6945C10.0359 14.6735 9.98989 14.6426 9.95118 14.6038L7.72451 12.375C7.6858 12.3361 7.63979 12.3053 7.58913 12.2843C7.53848 12.2632 7.48416 12.2524 7.4293 12.2524C7.37445 12.2524 7.32013 12.2632 7.26947 12.2843C7.21881 12.3053 7.17281 12.3361 7.1341 12.375C7.09523 12.4137 7.06439 12.4597 7.04335 12.5104C7.02231 12.561 7.01147 12.6154 7.01147 12.6702C7.01147 12.7251 7.02231 12.7794 7.04335 12.83C7.06439 12.8807 7.09523 12.9267 7.1341 12.9654L9.3616 15.1925C9.59657 15.427 9.91501 15.5588 10.247 15.5588C10.579 15.5588 10.8975 15.427 11.1324 15.1925L16.8899 9.43625C16.9287 9.39755 16.9595 9.35157 16.9805 9.30095C17.0015 9.25033 17.0123 9.19606 17.0123 9.14125C17.0123 9.08645 17.0015 9.03218 16.9805 8.98156C16.9595 8.93094 16.9287 8.88496 16.8899 8.84625C16.8512 8.80739 16.8052 8.77655 16.7546 8.75551C16.7039 8.73446 16.6496 8.72363 16.5947 8.72363C16.5399 8.72363 16.4855 8.73446 16.4349 8.75551C16.3842 8.77655 16.3382 8.80739 16.2995 8.84625Z" fill="#116557" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_578_3741">
                                                <rect width="10" height="10" fill="white" transform="translate(7 7)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </span>
                            </div>

                            <p className="p-6 text-center font-extrabold text-[14px] leading-[20px] tracking-[0.005em] text-[#858D9D]">{isDragActive ? 'Drop the image here ...' : 'Drag and drop image here, or click change image'}</p>
                            <div className="w-full flex justify-center">
                                <button className="border border-[1px] border-[#283618] px-[14px] py-[10px] font-bold text-[14px] leading-[20px] tracking-[0.005em] text-[#283618] rounded-lg hover:text-white hover:bg-[#283618]">Change Image</button>
                            </div>
                        </>}
                </>
            }
        </div>
        {file && <div className='flex'>
            <p className='pr-2 text-center font-extrabold text-[16px] leading-[20px] tracking-[0.005em] text-[#333333]'>{file.name}</p>
            <button className='' onClick={removeFile}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="12px" height="12px"><linearGradient id="wRKXFJsqHCxLE9yyOYHkza" x1="9.858" x2="38.142" y1="9.858" y2="38.142" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f44f5a" /><stop offset=".443" stop-color="#ee3d4a" /><stop offset="1" stop-color="#e52030" /></linearGradient><path fill="url(#wRKXFJsqHCxLE9yyOYHkza)" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z" /><path d="M33.192,28.95L28.243,24l4.95-4.95c0.781-0.781,0.781-2.047,0-2.828l-1.414-1.414	c-0.781-0.781-2.047-0.781-2.828,0L24,19.757l-4.95-4.95c-0.781-0.781-2.047-0.781-2.828,0l-1.414,1.414	c-0.781,0.781-0.781,2.047,0,2.828l4.95,4.95l-4.95,4.95c-0.781,0.781-0.781,2.047,0,2.828l1.414,1.414	c0.781,0.781,2.047,0.781,2.828,0l4.95-4.95l4.95,4.95c0.781,0.781,2.047,0.781,2.828,0l1.414-1.414	C33.973,30.997,33.973,29.731,33.192,28.95z" opacity=".05" /><path d="M32.839,29.303L27.536,24l5.303-5.303c0.586-0.586,0.586-1.536,0-2.121l-1.414-1.414	c-0.586-0.586-1.536-0.586-2.121,0L24,20.464l-5.303-5.303c-0.586-0.586-1.536-0.586-2.121,0l-1.414,1.414	c-0.586,0.586-0.586,1.536,0,2.121L20.464,24l-5.303,5.303c-0.586,0.586-0.586,1.536,0,2.121l1.414,1.414	c0.586,0.586,1.536,0.586,2.121,0L24,27.536l5.303,5.303c0.586,0.586,1.536,0.586,2.121,0l1.414-1.414	C33.425,30.839,33.425,29.889,32.839,29.303z" opacity=".07" /><path fill="#fff" d="M31.071,15.515l1.414,1.414c0.391,0.391,0.391,1.024,0,1.414L18.343,32.485	c-0.391,0.391-1.024,0.391-1.414,0l-1.414-1.414c-0.391-0.391-0.391-1.024,0-1.414l14.142-14.142	C30.047,15.124,30.681,15.124,31.071,15.515z" /><path fill="#fff" d="M32.485,31.071l-1.414,1.414c-0.391,0.391-1.024,0.391-1.414,0L15.515,18.343	c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414c0.391-0.391,1.024-0.391,1.414,0l14.142,14.142	C32.876,30.047,32.876,30.681,32.485,31.071z" /></svg></button>

        </div>}
    </>
    )
}