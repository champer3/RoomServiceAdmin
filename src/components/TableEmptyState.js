export default function TableEmptyState({
  title = "No items found",
  description = "Try adjusting your search or filters.",
  compact = false,
}) {
  return (
    <div
      className={[
        "w-full  px-6 py-16 text-center",
        compact ? "px-4 py-8" : "px-6 py-12",
      ].join(" ")}
    >
       <p className="text-lg font-semibold text-[#111827]">{title}</p>
       <p className="text-sm text-[#6B7280] mt-1">{description}</p>
    </div>
  );
}
