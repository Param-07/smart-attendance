export type FaceRegistrationCameraError =
  | "CAMERA_PERMISSION_DENIED"
  | "CAMERA_UNAVAILABLE"
  | "CAPTURE_FAILED";

export interface FaceRegistrationCameraProps {
  onCapture: (image: Blob) => void;
  onError: (error: FaceRegistrationCameraError) => void;
  disabled?: boolean;
}