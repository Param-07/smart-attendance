from app.ai.preprocessing.image_utils import ImageUtils
from app.services.face.face_detection_service import FaceDetectionService
from app.services.face.face_embedding_service import FaceEmbeddingService
from app.services.face.face_matching_service import FaceMatchingService

image = ImageUtils.read_image("your_image_path")

detector = FaceDetectionService()
face = detector.detect_single_face(image)

embedding = FaceEmbeddingService.get_embedding(face)

matcher = FaceMatchingService()

result = matcher.match(
    embedding,
    embedding,
)

print(result)