import type { Attendance } from "../../Attendance.types";

export interface AttendanceActionsMenuProps {
  attendance: Attendance;

  onView: (
    attendance: Attendance,
  ) => void;

  onCorrect?: (
    attendance: Attendance,
  ) => void;
}