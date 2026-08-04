import clsx from "clsx";
import { LogOut, ScanFace } from "lucide-react";
import { NavLink } from "react-router-dom";

import type {
  NavigationItem,
  SidebarProps,
} from "../navigation.types";

export default function Sidebar({
  navigation,
  bottomNavigation,
  onLogout,
}: SidebarProps) {
  const renderNavigationItem = (
    item: NavigationItem,
  ) => {
    const {
      label,
      path,
      icon: Icon,
      variant = "default",
    } = item;

    const isDanger = variant === "danger";

    return (
      <li key={path}>
        <NavLink
          to={path}
          className={({ isActive }) =>
            clsx(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
              {
                "bg-blue-50 text-blue-700":
                  isActive && !isDanger,

                "text-slate-600 hover:bg-slate-100 hover:text-slate-900":
                  !isActive && !isDanger,

                "text-red-600 hover:bg-red-50":
                  isDanger,
              },
            )
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={clsx(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                  {
                    "bg-blue-100":
                      isActive && !isDanger,

                    "bg-transparent group-hover:bg-slate-200":
                      !isActive && !isDanger,

                    "bg-transparent group-hover:bg-red-100":
                      isDanger,
                  },
                )}
              >
                <Icon size={20} />
              </div>

              <span>{label}</span>
            </>
          )}
        </NavLink>
      </li>
    );
  };

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}

      <div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <ScanFace size={24} />
        </div>

        <div className="ml-3">
          <h1 className="text-base font-semibold tracking-tight text-slate-900">
            Smart Attendance
          </h1>

          <p className="text-xs text-slate-500">
            Teacher Management
          </p>
        </div>
      </div>

      {/* Main Navigation */}

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map(renderNavigationItem)}
        </ul>
      </nav>

      {/* Bottom Navigation */}

      <div className="border-t border-slate-200 px-4 py-4">
        <ul className="space-y-2">
          {bottomNavigation.map(
            renderNavigationItem,
          )}
        </ul>

        {/* Logout */}

        <button
          type="button"
          onClick={onLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-red-100">
            <LogOut size={20} />
          </div>

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}