function formatNumberWithCommas(number) {
    const formattedNumber = parseFloat(number.toFixed(2)).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  
    return formattedNumber;
  }
export default function TableTotalListing({amount}){ 
    return (
        <div className="flex items-center px[22px] py-[18px] text-customGrey font-bold text-[14px] h-[80px] leading-[20px] tracking[0.005em]">
           <p className="ml-auto mr-auto">${formatNumberWithCommas(amount)}</p>
        </div>
    )
}