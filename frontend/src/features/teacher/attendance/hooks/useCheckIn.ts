import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  checkIn,
} from "../api/attendance.api";

import type {
  AttendanceCheckInPayload,
} from "../api/attendance.api.types";

import {
  TODAY_ATTENDANCE_QUERY_KEY,
} from "./useTodayAttendance";

interface CheckInVariables {
  payload: AttendanceCheckInPayload;
  selfie?: File | null;
}

export function useCheckIn() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      selfie,
    }: CheckInVariables) =>
      checkIn(
        payload,
        selfie,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          TODAY_ATTENDANCE_QUERY_KEY,
      });
    },
  });
}