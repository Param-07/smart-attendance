import type { Teacher } from "../../Teachers.types";

export interface TeacherProfileHeaderProps {
  teacher: Teacher;
  onEdit?: (teacher: Teacher) => void;
  onToggleStatus?: (teacher: Teacher) => void;
}