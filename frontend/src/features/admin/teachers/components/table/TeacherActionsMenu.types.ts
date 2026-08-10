import type { Teacher } from "../../Teachers.types";

export interface TeacherActionsMenuProps {
  teacher: Teacher;

  onView?: (teacher: Teacher) => void;

  onEdit?: (teacher: Teacher) => void;

  onToggleStatus?: (teacher: Teacher) => void;
}