export interface FaceRegistrationResponseDto {
  teacher_uuid: string;
  image_url: string;
  model_name: string;
  model_version: string;
  face_quality_score: number | null;
  registered_at: string;
}