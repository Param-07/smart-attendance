import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  variant?: "default" | "danger";
}

export interface SidebarProps {
  navigation: NavigationItem[];
  bottomNavigation: NavigationItem[];
  onLogout: () => void;

  isOpen: boolean;
  onClose: () => void;
}

export interface TopbarProps {
  schoolName: string;
  userName: string;
  userRole: string;
  onMenuClick: () => void;
}