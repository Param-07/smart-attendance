import type { Teacher } from "../../Teachers.types";

export interface TeacherDetailsProps {
  teacher: Teacher;
  onEdit?: (teacher: Teacher) => void;
}