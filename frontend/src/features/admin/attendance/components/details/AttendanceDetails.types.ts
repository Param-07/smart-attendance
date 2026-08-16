import type { Attendance } from "../../Attendance.types";

export interface AttendanceDetailsProps {
  attendance: Attendance;
  isLoading?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onClose?: () => void;
}
