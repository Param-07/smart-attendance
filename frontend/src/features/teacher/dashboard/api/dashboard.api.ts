import apiClient from "@/shared/api/apiClient";

import type { ApiResponse } from "@/shared/api/apiTypes";

import type {
  AttendanceListResponseDto,
  AttendanceResponseDto,
} from "./dashboard.api.types";

import type {
  DashboardAttendance,
  DashboardTeacher,
} from "../Dashboard.types";


// Enum Helpers

function cleanEnumValue(
  value: string,
): string {
  return value.includes(".")
    ? value.split(".").pop() ?? value
    : value;
}


// Attendance Mapper

function mapAttendance(
  payload: AttendanceResponseDto,
): DashboardAttendance {
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

    checkOutLatitude:
      payload.check_out_latitude,

    checkOutLongitude:
      payload.check_out_longitude,

    remarks:
      payload.remarks,
  };
}


// Teacher Mapper

function mapTeacher(
  payload: AttendanceResponseDto["teacher"],
): DashboardTeacher {
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


// Get Today's Attendance

export async function getTodayAttendance(): Promise<{
  attendance: DashboardAttendance | null;

  teacher: DashboardTeacher | null;
}> {

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
     * The backend currently raises
     * AttendanceNotFoundException when
     * the teacher has no attendance today.
     *
     * Treat that as a valid dashboard state.
     *
     * Do not swallow other errors.
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


// Get Recent Attendance

export async function getRecentAttendance(
  page = 1,
  pageSize = 5,
): Promise<DashboardAttendance[]> {

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

  const data =
    response.data.data;

  return data.items.map(
    mapAttendance,
  );
}