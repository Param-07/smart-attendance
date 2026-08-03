from app.models import FaceMatchResult
from app.ai.postprocessing.similarity_service import SimilarityService
from .face_embedding_service import FaceEmbeddingService

class FaceMatchingService:

    def __init__(self):

        self.similarity_service = SimilarityService()
        self.embedding_service = FaceEmbeddingService()

    def match(self, registered_embedding, current_embedding, threshold: float | None = None) -> FaceMatchResult:

        if threshold is None:
            threshold = self.similarity_service.DEFAULT_THRESHOLD

        self.embedding_service.validate_embedding(
            embedding= registered_embedding
        )
        self.embedding_service.validate_embedding(
            embedding= current_embedding
        )
        
        similarity, is_match = self.similarity_service.is_match(
            embedding1= registered_embedding,
            embedding2= current_embedding,
            threshold= threshold
        )

        return FaceMatchResult(
            matched= is_match,
            similarity_score= similarity,
            threshold= threshold
        )