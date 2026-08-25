import axios from "axios";

import apiClient from "@/shared/api/apiClient";
import type { ApiResponse } from "@/shared/api/apiTypes";

import type {
  AttendanceCheckInPayload,
  AttendanceCheckOutPayload,
  AttendanceListResponseDto,
  AttendanceResponseDto,
} from "./attendance.api.types";

import {
  AttendanceApiError,
  type AttendanceErrorCode,
} from "./attendance.api.errors";

import type { Attendance } from "../Attendance.types";


// ============================================================
// Enum Helpers
// ============================================================

function cleanEnumValue(
  value: string,
): string {
  return value.includes(".")
    ? value.split(".").pop() ?? value
    : value;
}


// ============================================================
// Attendance Mapper
// ============================================================

function mapAttendance(
  payload: AttendanceResponseDto,
): Attendance {
  const status =
    cleanEnumValue(payload.status);

  return {
    id: payload.public_uuid,

    date: payload.attendance_date,

    state:
      status === "OPEN"
        ? "CHECKED_IN"
        : "ATTENDANCE_COMPLETE",

    status,

    checkInTime:
      payload.check_in_time,

    checkOutTime:
      payload.check_out_time,

    checkInLatitude:
      payload.check_in_latitude,

    checkInLongitude:
      payload.check_in_longitude,

    checkInAccuracy:
      payload.check_in_accuracy,

    checkOutLatitude:
      payload.check_out_latitude,

    checkOutLongitude:
      payload.check_out_longitude,

    checkOutAccuracy:
      payload.check_out_accuracy,

    checkInFaceMatchScore:
      payload.check_in_face_match_score,

    checkInSelfiePath:
      payload.check_in_selfie_path,

    checkOutSelfiePath:
      payload.check_out_selfie_path,

    remarks:
      payload.remarks,
  };
}


// ============================================================
// Teacher Mapper
// ============================================================

function mapTeacher(
  payload: AttendanceResponseDto["teacher"],
) {
  return {
    id: payload.public_uuid,

    displayName:
      payload.display_name,

    employeeCode:
      payload.employee_code,

    designation:
      cleanEnumValue(
        payload.designation,
      ),

    department:
      cleanEnumValue(
        payload.department,
      ),

    faceRegistered:
      payload.face_registered,
  };
}


// ============================================================
// Attendance Error Helpers
// ============================================================

function isAttendanceErrorCode(
  code?: string,
): code is AttendanceErrorCode {
  return [
    "LIVENESS_FAILED",
    "FACE_MATCH_FAILED",
    "FACE_NOT_REGISTERED",
    "GPS_OUTSIDE_RADIUS",
    "GPS_ACCURACY_LOW",
    "CHECK_IN_NOT_ALLOWED",
    "ALREADY_CHECKED_IN",
    "CHECK_OUT_NOT_ALLOWED",
    "ALREADY_CHECKED_OUT",
    "NOT_FOUND",
    "VALIDATION_ERROR",
  ].includes(
    code as AttendanceErrorCode,
  );
}


function normalizeAttendanceError(
  error: unknown,
): AttendanceApiError {

  if (!axios.isAxiosError(error)) {
    return new AttendanceApiError(
      "UNKNOWN_ERROR",
      "Unable to process attendance.",
    );
  }

  const status =
    error.response?.status;

  const responseData =
    error.response?.data as
      | {
          message?: string;

          errors?: {
            code?: string;
          } | null;
        }
      | undefined;

  const code =
    responseData?.errors?.code;

  const message =
    responseData?.message ??
    "Unable to process attendance.";

  if (
    isAttendanceErrorCode(code)
  ) {
    return new AttendanceApiError(
      code,
      message,
      status,
    );
  }

  return new AttendanceApiError(
    "UNKNOWN_ERROR",
    message,
    status,
  );
}


// ============================================================
// Get Today's Attendance
// ============================================================

export async function getTodayAttendance() {
  try {
    const response =
      await apiClient.get<
        ApiResponse<AttendanceResponseDto>
      >(
        "/attendance/me/today",
      );

    const data =
      response.data.data;

    return {
      attendance:
        mapAttendance(data),

      teacher:
        mapTeacher(data.teacher),
    };

  } catch (error: any) {

    /*
     * No attendance for today is a valid
     * dashboard state.
     */

    if (
      error?.response?.status === 404
    ) {
      return {
        attendance: null,
        teacher: null,
      };
    }

    throw error;
  }
}


// ============================================================
// Get Attendance List
// ============================================================

export async function getAttendanceList(
  page = 1,
  pageSize = 5,
) {
  const response =
    await apiClient.get<
      ApiResponse<AttendanceListResponseDto>
    >(
      "/attendance/",
      {
        params: {
          page,
          page_size: pageSize,
        },
      },
    );

  return response.data.data.items.map(
    mapAttendance,
  );
}


// ============================================================
// Check In
// ============================================================

export async function checkIn(
  payload: AttendanceCheckInPayload,
  selfie?: File | null,
) {
  const formData =
    new FormData();

  if (payload.latitude != null) {
    formData.append(
      "latitude",
      payload.latitude,
    );
  }

  if (payload.longitude != null) {
    formData.append(
      "longitude",
      payload.longitude,
    );
  }

  if (payload.accuracy != null) {
    formData.append(
      "accuracy",
      payload.accuracy,
    );
  }

  if (selfie) {
    formData.append(
      "selfie",
      selfie,
    );
  }

  try {
    const response =
      await apiClient.post<
        ApiResponse<AttendanceResponseDto>
      >(
        "/attendance/check-in",
        formData,
      );

    return mapAttendance(
      response.data.data,
    );

  } catch (error) {
    throw normalizeAttendanceError(
      error,
    );
  }
}


// ============================================================
// Check Out
// ============================================================

export async function checkOut(
  payload: AttendanceCheckOutPayload,
  selfie?: File | null,
) {
  const formData =
    new FormData();

  if (payload.latitude != null) {
    formData.append(
      "latitude",
      payload.latitude,
    );
  }

  if (payload.longitude != null) {
    formData.append(
      "longitude",
      payload.longitude,
    );
  }

  if (payload.accuracy != null) {
    formData.append(
      "accuracy",
      payload.accuracy,
    );
  }

  if (selfie) {
    formData.append(
      "selfie",
      selfie,
    );
  }

  try {
    const response =
      await apiClient.post<
        ApiResponse<AttendanceResponseDto>
      >(
        "/attendance/check-out",
        formData,
      );

    return mapAttendance(
      response.data.data,
    );

  } catch (error) {
    throw normalizeAttendanceError(
      error,
    );
  }
}