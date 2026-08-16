import clsx from "clsx";

import Card from "../Card";

import type { StatCardProps } from "./StatCard.types";

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card
      className={clsx(
        "rounded-2xl p-6 transition-shadow duration-200 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

          {trend && (
            <div className="mt-3 text-sm">
              {trend}
            </div>
          )}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );
}