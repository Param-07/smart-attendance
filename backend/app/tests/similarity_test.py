from app.ai.preprocessing.image_utils import ImageUtils
from app.services.face.face_detection_service import FaceDetectionService
from app.services.face.face_embedding_service import FaceEmbeddingService
from app.ai.postprocessing.similarity_service import SimilarityService

image = ImageUtils.read_image("your_image_path")

detector = FaceDetectionService()

face = detector.detect_single_face(image)

embedding = FaceEmbeddingService.get_embedding(face)

score, matched = SimilarityService.is_match(
    embedding,
    embedding,
)

print(score)
print(matched)