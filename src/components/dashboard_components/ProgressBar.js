
export default function ProgressBar({ color, progress }) {
    return (
        <div className="flex items-center h-[40px] space-x-2"> 
            <div className="w-[66px] rounded-full h-[8px] bg-[#E0E2E7]">
                <div className={`bg-[${color}] w-[${progress}%] h-full  rounded-full`} />
            </div>
            <p className="font-semibold text-[12px] leading-[18px] tracking-[0.005em] text-[#858D9D]">{progress}%</p>
        </div>
    )
}