import apiClient from "@/shared/api/apiClient";
import type { ApiResponse } from "@/shared/api/apiTypes";

import type {
  SchoolConfigurationResponseDto,
} from "./configuration.api.types";

export async function getAttendanceConfiguration() {
  const response =
    await apiClient.get<
      ApiResponse<SchoolConfigurationResponseDto>
    >(
      "/schools/configuration",
    );

  return response.data.data;
}