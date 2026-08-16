import type { ReactNode } from "react";

export interface DashboardSectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}