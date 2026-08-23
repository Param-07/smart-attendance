import { useQuery } from "@tanstack/react-query";

import {
  getAttendanceConfiguration,
} from "../api/configuration.api";

export const ATTENDANCE_CONFIGURATION_QUERY_KEY = [
  "teacher",
  "attendance",
  "configuration",
] as const;

export function useAttendanceConfiguration() {
  return useQuery({
    queryKey:
      ATTENDANCE_CONFIGURATION_QUERY_KEY,

    queryFn:
      getAttendanceConfiguration,

    staleTime:
      5 * 60 * 1000,
  });
}