export default function Products({active}) {
    return (
        <button className={`${active ? 'text-stone-100 bg-rs-green' : 'text-rs-green'} flex items-center space-x-2 justify-left hover:text-stone-100 hover:bg-rs-green w-[264px] h-[48] px-[24px] py-[12px] leading-[20px] font-semibold text-14px tracking-[0.005em]`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1178_536)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.41 3.71627C19.584 3.78572 19.7332 3.90572 19.8384 4.0608C19.9436 4.21587 19.9999 4.3989 20 4.58627V15.4138C19.9999 15.6011 19.9436 15.7842 19.8384 15.9392C19.7332 16.0943 19.584 16.2143 19.41 16.2838L10.3475 19.9088C10.124 19.9981 9.87473 19.9981 9.65125 19.9088L0.58875 16.2838C0.414961 16.2141 0.266007 16.094 0.161076 15.939C0.0561445 15.7839 4.35749e-05 15.601 0 15.4138L0 4.58627C4.35749e-05 4.39904 0.0561445 4.21612 0.161076 4.06106C0.266007 3.906 0.414961 3.78592 0.58875 3.71627L9.30375 0.230019L9.30875 0.228769L9.65125 0.0912686C9.8751 0.00155954 10.1249 0.00155954 10.3488 0.0912686L10.6913 0.228769L10.6962 0.230019L19.41 3.71627ZM17.6925 4.37502L10 7.45252L2.3075 4.37502L1.25 4.79877V5.29877L9.375 8.54877V18.4513L10 18.7013L10.625 18.4513V8.55002L18.75 5.30002V4.80002L17.6925 4.37502Z" fill="currentColor" />
                </g>
                <defs>
                    <clipPath id="clip0_1178_536">
                        <rect width="20" height="20" fill="white" />
                    </clipPath>
                </defs>
            </svg>

            <p>Products</p>
        </button>


    )
}