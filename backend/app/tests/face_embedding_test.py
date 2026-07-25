from app.ai.preprocessing.image_utils import ImageUtils
from app.services.face.face_detection_service import FaceDetectionService
from app.services.face.face_embedding_service import FaceEmbeddingService

image = ImageUtils.read_image("your_image_path")

detector = FaceDetectionService()

face = detector.detect_single_face(image)

embedding = FaceEmbeddingService.get_embedding(face)

FaceEmbeddingService.validate_embedding(embedding)

print(type(embedding))
print(embedding.shape)

embedding_list = FaceEmbeddingService.to_list(embedding)

print(type(embedding_list))
print(len(embedding_list))