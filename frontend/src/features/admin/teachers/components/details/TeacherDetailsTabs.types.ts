export type TeacherDetailsTab =
  | "overview"
  | "attendance";

export interface TeacherDetailsTabsProps {
  activeTab: TeacherDetailsTab;
  onTabChange: (
    tab: TeacherDetailsTab,
  ) => void;
}