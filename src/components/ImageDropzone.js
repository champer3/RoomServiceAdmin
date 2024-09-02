import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const styling = 'w-full rounded-lg border border-dashed border-2 border-[#F0F1F3] bg-[#F9F9FC] py-[24px] px-[12px]';

export default function ImageDropzone({ description, files, onFilesChange, onRemoveFile }) {
    const onDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map(file =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        );
        onFilesChange([...files, ...newFiles]);
    }, [files, onFilesChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: true, // Allow multiple files
    });

    return (
        <>
            <div {...getRootProps({ className: styling })}>
                <input {...getInputProps()} />
                    <div className={`text-center ${!files.length ? '' : 'mb-5'}`}>
                        <p>{isDragActive ? 'Drop the images here ...' : description}</p>
                    </div>
                {files.length > 0 && (
                    <>
                        <div className="grid grid-cols-3 gap-4">
                            {files.map((file, index) => (
                                <div key={index} className="relative">
                                    <img
                                        className="object-cover h-24 w-full rounded-lg"
                                        src={file.preview ?? file}
                                        alt=""
                                    />
                                    <button
                                        className="absolute top-[-16px] right-[-12px]  bg-red-500 text-white rounded-full p-1"
                                        onClick={(e) => onRemoveFile(file,e)}
                                    >
                                        <i class="fa-solid fa-xl fa-circle-xmark"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
