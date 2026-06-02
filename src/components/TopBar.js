import { Link } from "react-router-dom";
import { useRef } from "react";
import NotificationModal from "./NotificationModal";

const TOPBAR_HEIGHT = "h-20";

export default function TopBar({ messages, notifications }) {
  const dialog = useRef();
  const userName = localStorage.getItem("userName") || "Admin";
  const displayRole = localStorage.getItem("role") === "owner" ? "Owner" : "Admin";
  const notifBadge = notifications > 99 ? "99+" : notifications;
  const messageBadge = messages > 99 ? "99+" : messages;

  return (
    <header
      className={`flex items-center w-full ${TOPBAR_HEIGHT} shrink-0 bg-panel-bg border-b border-panel-border`}
    >
      {/* Search — left */}
      <div className="flex items-center pl-4 pr-4 min-w-0 flex-1">
        <div className="flex items-center ml-5 w-full max-w-md bg-surface rounded-lg px-3 border border-panel-border">
          <svg
            className="w-4 h-4 text-nav-inactive shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            placeholder="Search"
            className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 w-full text-sm text-user-name placeholder:text-nav-inactive"
          />
        </div>
      </div>

      {/* Right: Messages, Notifications, Settings, User */}
      <div className="flex items-center gap-1 pr-4 pl-2 shrink-0">
        <Link
          to="/messages"
          className="relative p-2 rounded-lg text-nav-inactive hover:bg-surface hover:text-user-name transition-colors"
        >
          {messages > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold px-1">
              {messageBadge}
            </span>
          )}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </Link>

        <button
          onClick={() => dialog.current?.showModal()}
          className="relative p-2 rounded-lg text-nav-inactive hover:bg-surface hover:text-user-name transition-colors"
        >
          {notifications > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold px-1">
              {notifBadge}
            </span>
          )}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        <Link
          to="/settings"
          className="p-2 rounded-lg text-nav-inactive hover:bg-surface hover:text-user-name transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Link>

        <div className="w-px h-8 bg-panel-border/30 mx-1" aria-hidden />
        <button className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-lg hover:bg-surface transition-colors">
          <div className="w-9 h-9 rounded-full bg-nav-inactive/20 flex items-center justify-center shrink-0">
            <span className="text-user-name font-semibold text-sm">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="hidden sm:block text-left min-w-0">
            <p className="text-user-name font-medium text-sm truncate leading-tight">{userName}</p>
            <p className="text-nav-inactive text-xs leading-tight">{displayRole}</p>
          </div>
        </button>
      </div>

      <NotificationModal ref={dialog} />
    </header>
  );
}
