import GreyPercentLabel from "../PercentLabels/GreyPercentLabel"
import GreenPercentLabel from "../PercentLabels/GreenPercentLabel"
import RedPercentLabel from "../PercentLabels/RedPercentLabel"
export default function CategoryListing({ image, category, amount, percent, imageBackground }) {
    const finalNumber = amount.toLocaleString()
    return (
        <div className="flex items-center w-full h-auto">
            <div className={ `p-[8px] rounded-full bg-[${imageBackground}]` }>
                <img src={image} alt="" />
            </div>

            <div className='items-center pl-[8px] flex w-full h-full'>
                <p className="text-[14px] font-bold leading-[20px] tracking-[0.005em] text-[#333333]">{category}</p>
                <p className="ml-auto text-[14px] font-bold leading-[20px] tracking-[0.005em] text-[#333333] px-[8px]">{finalNumber}</p>
                {percent > 0 ? <GreenPercentLabel>{percent}</GreenPercentLabel> : percent === 0 ? <GreyPercentLabel>{percent}</GreyPercentLabel> : <RedPercentLabel>{percent}</RedPercentLabel>}
            </div>
        </div>
    )
}