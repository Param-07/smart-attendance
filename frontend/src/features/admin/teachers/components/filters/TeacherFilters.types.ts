export type TeacherSystemStatus =
  | ""
  | "ACTIVE"
  | "INACTIVE";

export interface TeacherFiltersProps {
  search?: string;

  department?: string;

  status?: TeacherSystemStatus;

  onSearchChange?: (
    value: string,
  ) => void;

  onDepartmentChange?: (
    value: string,
  ) => void;

  onStatusChange?: (
    value: TeacherSystemStatus,
  ) => void;

  onClearFilters?: () => void;
}