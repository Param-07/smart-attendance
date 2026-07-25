from app.ai.preprocessing.image_utils import ImageUtils
from app.services.face.face_detection_service import FaceDetectionService

image = ImageUtils.read_image("your_image_path")

service = FaceDetectionService()

face = service.detect_single_face(image)

print(face)
print(face.bbox)
print(face.det_score)