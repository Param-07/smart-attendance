export interface TeacherPaginationProps {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;

  onPageChange: (page: number) => void;
}