import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  checkOut,
} from "../api/attendance.api";

import type {
  AttendanceCheckOutPayload,
} from "../api/attendance.api.types";

import {
  TODAY_ATTENDANCE_QUERY_KEY,
} from "./useTodayAttendance";

interface CheckOutVariables {
  payload: AttendanceCheckOutPayload;
  selfie?: File | null;
}

export function useCheckOut() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      selfie,
    }: CheckOutVariables) =>
      checkOut(
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