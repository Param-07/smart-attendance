import clsx from "clsx";
import { LogOut, ScanFace, X } from "lucide-react";
import { NavLink } from "react-router-dom";

import type {
  NavigationItem,
  SidebarProps,
} from "../navigation.types";

export default function Sidebar({
  navigation,
  bottomNavigation,
  onLogout,
  isOpen,
  onClose,
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
          title={label}
          onClick={onClose}
          className={({ isActive }) =>
            clsx(
              "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
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
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
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

              <span className="truncate">
                {label}
              </span>
            </>
          )}
        </NavLink>
      </li>
    );
  };

  return (
    <>
      {/* Backdrop */}

      <div
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-200 lg:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      />

      {/* Sidebar */}

      <aside
        className={clsx(
          `
            fixed
            inset-y-0
            left-0
            z-50

            flex
            w-64
            shrink-0
            flex-col

            border-r
            border-slate-200
            bg-white

            shadow-xl

            transition-transform
            duration-200
            ease-out

            lg:relative
            lg:z-auto
            lg:w-60
            lg:shadow-none
            lg:translate-x-0
          `,
          isOpen
            ? "translate-x-0"
            : "-translate-x-full",
        )}
      >
        {/* Header / Logo */}

        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex min-w-0 items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ScanFace size={24} />
            </div>

            <div className="ml-3 min-w-0">
              <h1 className="truncate text-base font-semibold tracking-tight text-slate-900">
                Smart Attendance
              </h1>

              <p className="truncate text-xs text-slate-500">
                Teacher Management
              </p>
            </div>
          </div>

          {/* Close */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="
              ml-3
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-500
              hover:bg-slate-100
              lg:hidden
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Navigation */}

        <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-2">
            {navigation.map(renderNavigationItem)}
          </ul>
        </nav>

        {/* Bottom Navigation */}

        <div className="shrink-0 border-t border-slate-200 px-4 py-4">
          <ul className="space-y-2">
            {bottomNavigation.map(renderNavigationItem)}
          </ul>

          {/* Logout */}

          <button
            type="button"
            onClick={onLogout}
            className="
              mt-2
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              text-red-600
              transition-colors
              hover:bg-red-50
            "
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
              <LogOut size={20} />
            </div>

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}