export type FaceRegistrationStatus =
  | "capture"
  | "review"
  | "processing"
  | "success"
  | "error";

export type FaceRegistrationError =
  | "CAMERA_PERMISSION_DENIED"
  | "CAMERA_UNAVAILABLE"
  | "CAPTURE_FAILED"
  | "NO_FACE_DETECTED"
  | "MULTIPLE_FACES_DETECTED"
  | "POOR_FACE_QUALITY"
  | "LIVENESS_FAILED"
  | "REGISTRATION_FAILED";

export type FaceRegistrationMode =
  | "register"
  | "update";