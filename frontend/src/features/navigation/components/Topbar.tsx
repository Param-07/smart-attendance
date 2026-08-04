import {
  ChevronDown,
  GraduationCap,
  UserCircle2,
} from "lucide-react";

import type { TopbarProps } from "../navigation.types";

export default function Topbar({
  schoolName,
  userName,
  userRole,
}: TopbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-end border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-8">
        {/* School */}

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <GraduationCap size={18} />

          <span>{schoolName}</span>
        </div>

        {/* User */}

        <button
          type="button"
          className="flex items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-slate-100"
        >
          <UserCircle2
            size={34}
            className="text-slate-500"
          />

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