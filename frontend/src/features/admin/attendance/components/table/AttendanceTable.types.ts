import type { Attendance } from "../../Attendance.types";

export interface AttendanceTableProps {
  attendance: Attendance[];

  loading: boolean;

  page: number;

  pageSize: number;

  totalRecords: number;

  totalPages: number;

  hasNext: boolean;

  hasPrevious: boolean;

  onPageChange: (page: number) => void;
}