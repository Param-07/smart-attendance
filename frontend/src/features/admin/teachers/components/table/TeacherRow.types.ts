import type { Teacher } from "../../Teachers.types";

export interface TeacherRowProps {
  teacher: Teacher;

  onToggleStatus: (
    teacher: Teacher,
  ) => void;
}