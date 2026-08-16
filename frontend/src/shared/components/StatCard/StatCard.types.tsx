import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;

  trend?: ReactNode;

  className?: string;
}