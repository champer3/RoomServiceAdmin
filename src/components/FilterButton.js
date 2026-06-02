export default function FilterButton({ onClick, active, appliedCount = 0 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-lg border px-3 py-2 text-sm  transition-colors ${
        active
          ? "border-[#283618] bg-[#F4F9EE] text-[#283618]"
          : "border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F9FAFB]"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5">
        <path d="M2 2h12v2l-4 5v5l-4 2V9L2 4V2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Filters
      {appliedCount > 0 && (
        <span className="ml-1.5 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-[#283618] text-white text-xs font-semibold">
          {appliedCount}
        </span>
      )}
    </button>
  );
}
