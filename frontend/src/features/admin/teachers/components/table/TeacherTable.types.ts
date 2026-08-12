import type { Teacher } from "../../Teachers.types";

export interface TeacherTableProps {
  teachers: Teacher[];

  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;

  onPageChange: (page: number) => void;

  onToggleStatus: (teacher : Teacher) => void;
}