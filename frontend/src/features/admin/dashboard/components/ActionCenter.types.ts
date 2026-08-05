import type { LucideIcon } from "lucide-react";

export interface ActionItem {
  id: string;

  title: string;

  description: string;

  pendingCount: number;

  href: string;

  icon: LucideIcon;
}

export interface ActionCenterProps {
  items: ActionItem[];
}