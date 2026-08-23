import { useQuery } from "@tanstack/react-query";

import { getTodayAttendance } from "../api/attendance.api";

export const TODAY_ATTENDANCE_QUERY_KEY = [
  "teacher",
  "attendance",
  "today",
] as const;

export function useTodayAttendance() {
  return useQuery({
    queryKey: TODAY_ATTENDANCE_QUERY_KEY,
    queryFn: getTodayAttendance,
    staleTime: 30_000,
  });
}