export interface TeacherFiltersProps {
  search?: string;

  department?: string;

  status?: string;

  onSearchChange?: (
    value: string,
  ) => void;

  onDepartmentChange?: (
    value: string,
  ) => void;

  onStatusChange?: (
    value: string,
  ) => void;

  onClearFilters?: () => void;
}