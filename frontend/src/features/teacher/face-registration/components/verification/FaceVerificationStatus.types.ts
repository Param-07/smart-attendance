export type FaceVerificationStep =
  | "capture"
  | "face_detection"
  | "liveness"
  | "processing";

export interface FaceVerificationStatusProps {
  currentStep: FaceVerificationStep;
}