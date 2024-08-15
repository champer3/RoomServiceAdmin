import GreenLabel from "../StatusLabels/GreenLabel"
import BlueLabel from "../StatusLabels/BlueLabel"
import OrangeLabel from "../StatusLabels/OrangeLabel"
export default function TableStatusListing({status}) {
    return (
        <div className=" flex items-center h-[80px] py-[18px] px-[22px]">
            {status.toLowerCase() === 'processing' && <OrangeLabel>{status}</OrangeLabel>}
            {status.toLowerCase() === 'delivered' && <GreenLabel>{status}</GreenLabel>}
            {status.toLowerCase() === 'shipped' && <BlueLabel>{status}</BlueLabel>}
        </div>
    )
}