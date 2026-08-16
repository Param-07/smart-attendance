export type ActivityType =
  | "attendance"
  | "leave"
  | "correction"
  | "teacher";

export interface ActivityItem {
  id: string;

  title: string;

  description: string;

  timestamp: string;

  type: ActivityType;
}

export interface RecentActivityProps {
  activities: ActivityItem[];
}