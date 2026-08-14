import apiClient from "@/shared/api/apiClient";
import type { ApiResponse } from "@/shared/api/apiTypes";

import type {
  Department,
  Designation,
  EmploymentStatus,
  Teacher,
} from "../Teachers.types";

import type {
  TeacherListResponseDto,
  TeacherResponseDto,
} from "./teacher.api.types";

import type { TeacherFormData } from "../components/form/TeacherForm.types";

// Create teacher

export async function createTeacher(
  formData: TeacherFormData,
): Promise<Teacher> {
  const payload = {
    username: formData.username,
    password: formData.password,
    employee_code: formData.employeeCode,
    first_name: formData.firstName,
    middle_name: formData.middleName || null,
    last_name: formData.lastName,
    display_name: `${formData.firstName} ${formData.lastName}`,
    official_email: formData.officialEmail,
    mobile_number: formData.phone || null,
    department: formData.department,
    designation: formData.designation,
    joining_date: formData.joiningDate,
    remarks: formData.remarks || null,
  };

  console.log(payload)
  const response =
    await apiClient.post<
      ApiResponse<TeacherResponseDto>
    >("/teachers/", payload);

  return mapTeacher(
    response.data.data,
  );
}

// Enum mappings

const departmentMap: Record<
  string,
  Department
> = {
  ADMINISTRATION: "Administration",
  MATHEMATICS: "Mathematics",
  SCIENCE: "Science",
  ENGLISH: "English",
  SOCIAL_SCIENCE: "Social Science",
  COMPUTER: "Computer",
  SPORTS: "Sports",
  ART: "Art",
  MUSIC: "Music",
  LIBRARY: "Library",
};

const designationMap: Record<
  string,
  Designation
> = {
  PRINCIPAL: "Principal",
  VICE_PRINCIPAL: "Vice Principal",
  HOD: "Head of Department",
  TEACHER: "Teacher",
  ASSISTANT_TEACHER: "Assistant Teacher",
  SPORTS_COACH: "Sports Coach",
  LIBRARIAN: "Librarian",
  ADMINISTRATOR: "Administrator",
};

const employmentStatusMap: Record<
  string,
  EmploymentStatus
> = {
  ACTIVE: "ACTIVE",
  ON_LEAVE: "ON_LEAVE",
  SUSPENDED: "SUSPENDED",
  RESIGNED: "RESIGNED",
  RETIRED: "RETIRED",
};

// Helpers

function normalizeEnumKey(
  value: string,
): string {
  if (value.includes(".")) {
    return value.split(".").pop() ?? value;
  }

  return value;
}


function mapDepartment(
  value: string,
): Department {
  const key = normalizeEnumKey(value);

  return (
    departmentMap[key] ??
    (value as Department)
  );
}


function mapDesignation(
  value: string,
): Designation {
  const key = normalizeEnumKey(value);

  return (
    designationMap[key] ??
    (value as Designation)
  );
}


function mapEmploymentStatus(
  value: string,
): EmploymentStatus {
  const key = normalizeEnumKey(value);

  return (
    employmentStatusMap[key] ??
    (value as EmploymentStatus)
  );
}

// Teacher mapping

function mapTeacher(
  payload: TeacherResponseDto,
): Teacher {
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

    email:
      payload.official_email,

    phone:
      payload.mobile_number ?? "",

    department:
      mapDepartment(
        payload.department,
      ),

    designation:
      mapDesignation(
        payload.designation,
      ),

    employmentStatus:
      mapEmploymentStatus(
        payload.employment_status,
      ),

    joiningDate:
      payload.joining_date,

    faceRegistered:
      payload.face_registered,

    remarks:
      payload.remarks,

    status:
      payload.is_active
        ? "ACTIVE"
        : "INACTIVE",
  };
}


// Get single teacher

export async function getTeacher(
  publicUuid: string,
): Promise<Teacher> {
  const response =
    await apiClient.get<
      ApiResponse<TeacherResponseDto>
    >(
      `/teachers/${publicUuid}`,
    );

  return mapTeacher(
    response.data.data,
  );
}


// Update teacher activation

export async function updateTeacherActivation(
  publicUuid: string,
  isActive: boolean,
): Promise<Teacher> {
  const response =
    await apiClient.patch<
      ApiResponse<TeacherResponseDto>
    >(
      `/teachers/${publicUuid}/activation`,
      {
        is_active: isActive,
      },
    );

  return mapTeacher(
    response.data.data,
  );
}


// Update teacher

export async function updateTeacher(
  publicUuid: string,
  data: Partial<{
    employee_code: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    display_name: string;
    official_email: string;
    mobile_number: string | null;
    department: Department;
    designation: Designation;
    employment_status: EmploymentStatus;
    joining_date: string;
    remarks: string | null;
  }>,
): Promise<Teacher> {
  console.log(data)
  const response =
    await apiClient.put<
      ApiResponse<TeacherResponseDto>
    >(
      `/teachers/${publicUuid}`,
      data,
    );

  return mapTeacher(
    response.data.data,
  );
}


// Get teachers

export interface GetTeachersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  status?: "" | "ACTIVE" | "INACTIVE";
}

export async function getTeachers({
  page = 1,
  pageSize = 20,
  search = "",
  department = "",
  status = "",
}: GetTeachersParams = {}): Promise<{
  teachers: Teacher[];
  pagination: TeacherListResponseDto["pagination"];
}> {
  const params: Record<
    string,
    string | number
  > = {
    page,
    page_size: pageSize,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  if (department) {
    params.department = department;
  }

  if (status) {
    params.is_active =
      status === "ACTIVE"
        ? "true"
        : "false";
  }

  const response =
    await apiClient.get<
      ApiResponse<TeacherListResponseDto>
    >("/teachers/", {
      params,
    });

  return {
    teachers:
      response.data.data.items.map(
        mapTeacher,
      ),
    pagination:
      response.data.data.pagination,
  };
}