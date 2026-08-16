import DashboardSection from "./DashboardSection";

import type {
  SystemAlertsProps,
  AlertSeverity,
} from "./SystemAlerts.types";

const severityStyles: Record<
  AlertSeverity,
  {
    dot: string;
    badge: string;
    badgeClass: string;
  }
> = {
  success: {
    dot: "bg-green-500",
    badge: "Healthy",
    badgeClass: "bg-green-100 text-green-700",
  },

  warning: {
    dot: "bg-amber-500",
    badge: "Warning",
    badgeClass: "bg-amber-100 text-amber-700",
  },

  critical: {
    dot: "bg-red-500",
    badge: "Critical",
    badgeClass: "bg-red-100 text-red-700",
  },
};

export default function SystemAlerts({
  alerts,
}: SystemAlertsProps) {
  return (
    <DashboardSection title="System Alerts">

      <div className="divide-y divide-slate-200">

        {alerts.map((alert) => {
          const style =
            severityStyles[alert.severity];

          return (
            <div
              key={alert.id}
              className="flex items-start justify-between py-4"
            >
              <div className="flex gap-3">

                <span
                  className={`mt-2 h-2.5 w-2.5 rounded-full ${style.dot}`}
                />

                <div>

                  <p className="font-medium text-slate-900">
                    {alert.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {alert.description}
                  </p>

                </div>

              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badgeClass}`}
              >
                {style.badge}
              </span>
            </div>
          );
        })}

      </div>

    </DashboardSection>
  );
}