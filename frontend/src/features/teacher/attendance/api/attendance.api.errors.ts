export type AttendanceErrorCode =
  | "LIVENESS_FAILED"
  | "FACE_MATCH_FAILED"
  | "FACE_NOT_REGISTERED"
  | "GPS_OUTSIDE_RADIUS"
  | "GPS_ACCURACY_LOW"
  | "CHECK_IN_NOT_ALLOWED"
  | "ALREADY_CHECKED_IN"
  | "CHECK_OUT_NOT_ALLOWED"
  | "ALREADY_CHECKED_OUT"
  | "VALIDATION_ERROR"
  | "UNKNOWN_ERROR";

export class AttendanceApiError extends Error {
  readonly code: AttendanceErrorCode;
  readonly status?: number;

  constructor(
    code: AttendanceErrorCode,
    message: string,
    status?: number,
  ) {
    super(message);

    this.name = "AttendanceApiError";
    this.code = code;
    this.status = status;
  }
}