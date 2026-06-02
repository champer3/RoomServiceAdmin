export default function PanelBar({ title, active, icon, badgeCount = 0 }) {
  return (
    <button
      className={`flex items-center space-x-3 w-full h-12 px-6 py-3 text-sm font-medium tracking-[0.005em] rounded-r-lg transition-colors ${
        active
          ? "bg-nav-active-bg text-nav-active"
          : "text-nav-inactive hover:bg-nav-active-bg/50 hover:text-nav-active"
      }`}
    >
      <span className="[&_svg]:w-6 [&_svg]:h-6 [&_svg]:shrink-0" style={{ color: 'inherit' }}>{icon}</span>
      <p className="truncate">{title}</p>
      {badgeCount > 0 ? (
        <span className="ml-auto inline-flex min-w-[20px] h-5 px-1.5 items-center justify-center rounded-full bg-[#BC6C25] text-white text-[11px] font-semibold leading-none">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      ) : null}
    </button>
  );
}
