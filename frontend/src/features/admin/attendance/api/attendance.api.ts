import apiClient from "@/shared/api/apiClient";

import type { ApiResponse } from "@/shared/api/apiTypes";

import type { Attendance } from "../Attendance.types";

import type {
  AttendanceCorrectionRequest,
  AttendanceListResponseDto,
  AttendanceResponseDto,
} from "./attendance.api.types";


// Enum Helpers

function cleanEnumValue(
  value: string,
): string {
  return value.includes(".")
    ? value.split(".").pop() ?? value
    : value;
}


// Teacher Mapper

function mapAttendanceTeacher(
  payload: AttendanceResponseDto["teacher"],
): Attendance["teacher"] {
  return {
    id: payload.public_uuid,

    employeeCode:
      payload.employee_code,

    firstName:
      payload.first_name,

    middleName:
      payload.middle_name ?? "",

    lastName:
      payload.last_name,

    displayName:
      payload.display_name,

    designation:
      cleanEnumValue(
        payload.designation,
      ),

    department:
      cleanEnumValue(
        payload.department,
      ),

    employmentStatus:
      cleanEnumValue(
        payload.employment_status,
      ),

    email:
      payload.official_email,

    phone:
      payload.mobile_number ?? "",

    joiningDate:
      payload.joining_date,

    faceRegistered:
      payload.face_registered,

    isActive:
      payload.is_active,

    remarks:
      payload.remarks ?? null,
  };
}


// Attendance Mapper

function mapAttendance(
  payload: AttendanceResponseDto,
): Attendance {
  return {
    id: payload.public_uuid,

    attendanceDate:
      payload.attendance_date,

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

    status:
      cleanEnumValue(
        payload.status,
      ) as Attendance["status"],

    remarks:
      payload.remarks,

    teacher:
      mapAttendanceTeacher(
        payload.teacher,
      ),

    createdAt:
      payload.created_at,

    updatedAt:
      payload.updated_at,
  };
}


// Attendance Filters

export interface AttendanceFilters {
  search?: string;

  status?: string;

  startDate?: string;

  endDate?: string;
}


// Get Attendance List

export async function getAttendance(
  page = 1,
  pageSize = 20,
  filters: AttendanceFilters = {},
): Promise<{
  attendance: Attendance[];
  pagination: AttendanceListResponseDto;
}> {
  const params: Record<
    string,
    string | number
  > = {
    page,
    page_size: pageSize,
  };


  if (filters.search?.trim()) {
    params.search =
      filters.search.trim();
  }


  if (filters.status) {
    params.status =
      filters.status;
  }


  if (filters.startDate) {
    params.start_date =
      filters.startDate;
  }


  if (filters.endDate) {
    params.end_date =
      filters.endDate;
  }


  const response =
    await apiClient.get<
      ApiResponse<AttendanceListResponseDto>
    >(
      "/admin/attendance/",
      {
        params,
      },
    );


  const data =
    response.data.data;


  return {
    attendance:
      data.items.map(
        mapAttendance,
      ),

    pagination:
      data,
  };
}


// Get Attendance Details

export async function getAttendanceById(
  publicUuid: string,
): Promise<Attendance> {
  const response =
    await apiClient.get<
      ApiResponse<AttendanceResponseDto>
    >(
      `/admin/attendance/${publicUuid}`,
    );


  return mapAttendance(
    response.data.data,
  );
}


// Correct Attendance

export async function correctAttendance(
  publicUuid: string,
  data: AttendanceCorrectionRequest,
): Promise<Attendance> {
  const response =
    await apiClient.put<
      ApiResponse<AttendanceResponseDto>
    >(
      `/admin/attendance/${publicUuid}/correct`,
      data,
    );


  return mapAttendance(
    response.data.data,
  );
}