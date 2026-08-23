// Location Data

import type { SchoolConfigurationResponseDto } from "../api/configuration.api.types";
import type { Attendance } from "../Attendance.types";

export interface LocationData {
    latitude: number;
    longitude: number;
    accuracy: number;
}

export interface LocationCaptureProps {
  onLocation: (location: LocationData) => void;
}

// Check In Flow

export type CheckInState =
  | "IDLE"
  | "VERIFYING"
  | "SUCCESS"
  | "ERROR";

export interface CheckInFlowProps {
    configuration: SchoolConfigurationResponseDto;

    attendance: Attendance | null;

    onSuccess?: () => void;
    onError?: () => void;
    onCancel?: () => void;
}

// Selfie Capture

export type CameraState =
  | "idle"
  | "requesting"
  | "ready"
  | "captured"
  | "error";

export interface SelfieCaptureProps {
  onCapture: (file: File) => void;
  onCancel?: () => void;
}