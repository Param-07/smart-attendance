import apiClient from "@/shared/api/apiClient";

import type { Teacher } from "../Teachers.types";
import type { ApiResponse } from "@/shared/api/apiTypes";

import type { TeacherListResponseDto, TeacherResponseDto } from "./teacher.api.types"

function mapTeacher(payload: TeacherResponseDto): Teacher {
    console.log(payload)
  return {
    id: payload.public_uuid,
    employeeCode: payload.employee_code,
    firstName: payload.first_name,
    middleName: payload.middle_name ?? "",
    lastName: payload.last_name,
    designation: payload.designation.replace("Designation.", ""),
    department: payload.department.replace("Department.", ""),
    email: payload.official_email,
    phone: payload.mobile_number,
    status: payload.is_active ? "ACTIVE" : "INACTIVE",
  };
}

export async function getTeacher(
  publicUuid: string,
): Promise<Teacher> {
  const response = await apiClient.get<
    ApiResponse<TeacherResponseDto>
  >(`/teachers/${publicUuid}`);

  return mapTeacher(response.data.data);
}

export async function updateTeacherActivation(
  publicUuid: string,
  isActive: boolean,
): Promise<Teacher> {
  const response = await apiClient.patch<
    ApiResponse<TeacherResponseDto>
  >(`/teachers/${publicUuid}/activation`, {
    is_active: isActive,
  });

  return mapTeacher(response.data.data);
}

export async function getTeachers(
  page = 1,
  pageSize = 20,
): Promise<{
  teachers: Teacher[];
  pagination: TeacherListResponseDto["pagination"];
}> {
  const response = await apiClient.get<
    ApiResponse<TeacherListResponseDto>
  >("/teachers/", {
    params: {
      page,
      page_size: pageSize,
    },
  });

  return {
    teachers: response.data.data.items.map(mapTeacher),
    pagination: response.data.data.pagination,
  };
}
