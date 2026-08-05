import DashboardSection from "./DashboardSection";

import type {
  ActivityItem,
  ActivityType,
  RecentActivityProps,
} from "./RecentActivity.types";

const activityStyles: Record<ActivityType, string> = {
  attendance: "bg-green-500",
  leave: "bg-amber-500",
  correction: "bg-red-500",
  teacher: "bg-blue-500",
};

export default function RecentActivity({
  activities,
}: RecentActivityProps) {
  return (
    <DashboardSection title="Recent Activity">
      {activities.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-500">
            No activity recorded yet.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Today's events will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {activities.map((activity: ActivityItem) => (
            <div
              key={activity.id}
              className="flex items-start justify-between py-4"
            >
              <div className="flex items-start gap-4">
                <span
                  className={`mt-2 h-3 w-3 rounded-full ${
                    activityStyles[activity.type]
                  }`}
                />

                <div>
                  <p className="font-medium text-slate-900">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {activity.description}
                  </p>
                </div>
              </div>

              <span className="text-sm text-slate-400">
                {activity.timestamp}
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}