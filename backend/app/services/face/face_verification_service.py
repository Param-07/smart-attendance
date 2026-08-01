from app.services.face.face_detection_service import FaceDetectionService
from app.services.face.face_embedding_service import FaceEmbeddingService
from app.ai.postprocessing.similarity_service import SimilarityService


class FaceVerificationService:

    def __init__(self):

        self.face_detector = FaceDetectionService()

        self.face_embedding = FaceEmbeddingService()

        self.similarity = SimilarityService()

    def extract_embedding(
        self,
        image,
    ):

        face = self.face_detector.detect_single_face(
            image
        )

        embedding = self.face_embedding.get_embedding(
            face
        )

        self.face_embedding.validate_embedding(
            embedding
        )

        return face, embedding

    def compare(
        self,
        registered_embedding,
        current_embedding,
    ):

        return self.similarity.is_match(
            registered_embedding,
            current_embedding,
        )

    def verify(
        self,
        registered_embedding,
        image,
    ):

        face, current_embedding = self.extract_embedding(
            image
        )

        similarity, result = self.compare(
            registered_embedding,
            current_embedding,
        )

        return (
            face,
            similarity,
            result
        )