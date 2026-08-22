import {
  ChevronDown,
  GraduationCap,
  Menu,
} from "lucide-react";

import type { TopbarProps } from "../navigation.types";

export default function Topbar({
  schoolName,
  userName,
  userRole,
  onMenuClick,
}: TopbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-4 lg:justify-end lg:px-6">
      {/* Mobile / Tablet Header */}
      <div className="flex w-full items-center justify-between lg:hidden">
        {/* Menu */}

        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            text-slate-600
            transition-colors
            hover:bg-slate-100
          "
        >
          <Menu size={22} />
        </button>

        {/* Application Name */}

        <h1 className="text-base font-semibold tracking-tight text-slate-900">
          Smart Attendance
        </h1>

        {/* User */}

        <button
          type="button"
          aria-label="Open user menu"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            transition-colors
            hover:bg-slate-100
          "
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
            {userName?.charAt(0).toUpperCase()}
          </div>
        </button>
      </div>

      {/* Desktop Header */}

      <div className="hidden items-center gap-8 lg:flex">
        {/* School */}

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <GraduationCap size={18} />

          <span className="max-w-48 truncate">
            {schoolName}
          </span>
        </div>

        {/* User */}

        <button
          type="button"
          className="
            flex
            items-center
            gap-3
            rounded-lg
            px-2
            py-1
            transition-colors
            hover:bg-slate-100
          "
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
            {userName?.charAt(0).toUpperCase()}
          </div>

          <div className="text-left">
            <p className="text-sm font-medium text-slate-900">
              {userName}
            </p>

            <p className="text-xs text-slate-500">
              {userRole}
            </p>
          </div>

          <ChevronDown
            size={18}
            className="text-slate-500"
          />
        </button>
      </div>
    </header>
  );
}