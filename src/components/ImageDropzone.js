import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const styling =
  "w-full rounded-lg border border-dashed border-2 border-[#F0F1F3] bg-[#F9F9FC] py-[24px] px-[12px]";

export default function ImageDropzone({
  description,
  files,
  onFilesChange,
  onRemoveFile,
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      onFilesChange([...files, ...newFiles]);
    },
    [files, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true, // Allow multiple files
  });

  return (
    <>
      <div {...getRootProps({ className: styling })}>
        <input {...getInputProps()} />
        <div className={`text-center ${!files.length ? "" : "mb-5"}`}>
          <svg
            className="mx-auto"
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="44" height="44" rx="8" fill="#283618" />
            <g clip-path="url(#clip0_503_3978)">
              <path
                d="M21.3416 22.4021C21.1326 22.1931 20.8845 22.0272 20.6114 21.914C20.3384 21.8009 20.0457 21.7426 19.7501 21.7426C19.4545 21.7426 19.1618 21.8009 18.8887 21.914C18.6156 22.0272 18.3675 22.1931 18.1586 22.4021L13.0286 27.5321C13.0979 28.4727 13.5197 29.3524 14.2097 29.9954C14.8997 30.6384 15.8069 30.9972 16.7501 31.0001H27.2501C27.9849 31 28.7032 30.7826 29.3148 30.3754L21.3416 22.4021Z"
                fill="white"
              />
              <path
                d="M26.5 19.0002C27.3284 19.0002 28 18.3287 28 17.5002C28 16.6718 27.3284 16.0002 26.5 16.0002C25.6716 16.0002 25 16.6718 25 17.5002C25 18.3287 25.6716 19.0002 26.5 19.0002Z"
                fill="white"
              />
              <path
                d="M27.25 13H16.75C15.7558 13.0012 14.8027 13.3967 14.0997 14.0997C13.3967 14.8027 13.0012 15.7558 13 16.75L13 25.4395L17.098 21.3415C17.4462 20.9932 17.8597 20.7169 18.3147 20.5283C18.7697 20.3398 19.2575 20.2428 19.75 20.2428C20.2425 20.2428 20.7303 20.3398 21.1853 20.5283C21.6403 20.7169 22.0538 20.9932 22.402 21.3415L30.3752 29.3148C30.7825 28.7031 30.9999 27.9848 31 27.25V16.75C30.9988 15.7558 30.6033 14.8027 29.9003 14.0997C29.1973 13.3967 28.2442 13.0012 27.25 13V13ZM26.5 20.5C25.9067 20.5 25.3266 20.3241 24.8333 19.9944C24.3399 19.6648 23.9554 19.1962 23.7284 18.6481C23.5013 18.0999 23.4419 17.4967 23.5576 16.9147C23.6734 16.3328 23.9591 15.7982 24.3787 15.3787C24.7982 14.9591 25.3328 14.6734 25.9147 14.5576C26.4967 14.4419 27.0999 14.5013 27.6481 14.7284C28.1962 14.9554 28.6648 15.3399 28.9944 15.8333C29.3241 16.3266 29.5 16.9067 29.5 17.5C29.5 18.2956 29.1839 19.0587 28.6213 19.6213C28.0587 20.1839 27.2956 20.5 26.5 20.5Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_503_3978">
                <rect
                  width="18"
                  height="18"
                  fill="white"
                  transform="translate(13 13)"
                />
              </clipPath>
            </defs>
          </svg>

          <p>{isDragActive ? "Drop the images here ..." : description}</p>
        </div>
        {files.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    className=" w-full object-cover h-24 rounded-lg"
                    src={file.preview ?? file}
                    alt=""
                  />
                  <button
                    className="absolute top-[-16px] right-[-12px]  bg-red-500 text-white rounded-full p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(file, e);
                    }}
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
