import { ChevronRight } from "lucide-react";

import DashboardSection from "./DashboardSection";

import type { ActionCenterProps } from "./ActionCenter.types";

export default function ActionCenter({
  items,
}: ActionCenterProps) {
  return (
    <DashboardSection title="Action Center">

      <div className="divide-y divide-slate-200">

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              className="flex w-full items-center justify-between py-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </div>

                <div className="text-left">

                  <p className="font-medium text-slate-900">
                    {item.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.description}
                  </p>

                </div>
              </div>

              <div className="flex items-center gap-3">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClasses(
                    item.pendingCount,
                  )}`}
                >
                  {item.pendingCount} Pending
                </span>

                <ChevronRight
                  size={18}
                  className="text-slate-400"
                />

              </div>
            </button>
          );
        })}

      </div>

    </DashboardSection>
  );
}

const getBadgeClasses = (count: number) => {
  if (count === 0) {
    return "bg-green-100 text-green-700";
  }

  if (count <= 5) {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-red-100 text-red-700";
};