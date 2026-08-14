export interface AttendanceFiltersProps {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;

  onSearchChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onStartDateChange?: (value: string) => void;
  onEndDateChange?: (value: string) => void;
  onClearFilters?: () => void;
}