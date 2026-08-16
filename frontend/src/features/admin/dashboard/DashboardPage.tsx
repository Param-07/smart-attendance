import PageHeader from "@/shared/components/PageHeader";
import StatCard from "@/shared/components/StatCard";
import ActionCenter from "./components/ActionCenter";
import SystemAlerts from "./components/SystemAlerts";
import RecentActivity from "./components/RecentActivity";

import { 
dashboardStats,
actionItems, 
systemAlerts,
recentActivities} from "./Dashboard.constants";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of today's attendance and teacher activity."
      />
      <div className="space-y-8">
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardStats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={
                  <span className="text-green-600">
                    {stat.trend}
                  </span>
                }
              />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-2">

            <ActionCenter
                items={actionItems}
            />

            <SystemAlerts
                alerts={systemAlerts}
            />

        </section>

        <RecentActivity
          activities={recentActivities}
        />
      </div>
    </>
  );
}