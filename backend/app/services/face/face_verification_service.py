from insightface.app.common import Face
import numpy as np

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
        face,
    ):

        embedding = self.face_embedding.get_embedding(
            face
        )

        self.face_embedding.validate_embedding(
            embedding
        )

        return embedding

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
        *,
        registered_embedding: np.ndarray,
        face: Face,
    ):

        current_embedding = self.extract_embedding(
            face
        )

        similarity, result = self.compare(
            registered_embedding,
            current_embedding,
        )

        return (
            similarity,
            result,
        )