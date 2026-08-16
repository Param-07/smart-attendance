import Card from "@/shared/components/Card";

import type { DashboardSectionProps } from "./DashboardSection.types";

export default function DashboardSection({
  title,
  action,
  children,
}: DashboardSectionProps) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        {action}
      </div>

      {children}
    </Card>
  );
}