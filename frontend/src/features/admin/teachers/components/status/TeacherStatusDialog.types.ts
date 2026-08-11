import type { Teacher } from "../../Teachers.types";

export interface TeacherStatusDialogProps {
  teacher: Teacher;

  isOpen: boolean;

  onClose: () => void;

  onConfirm: (
    teacher: Teacher,
  ) => void;

  isSubmitting?: boolean;
}