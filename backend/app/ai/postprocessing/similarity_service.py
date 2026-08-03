import numpy as np

class SimilarityService:

    DEFAULT_THRESHOLD = 0.65

    @classmethod
    def is_match(cls, embedding1: np.ndarray, embedding2: np.ndarray, threshold: float | None = None) -> tuple[float, bool]:
    
        if threshold is None:
            threshold = cls.DEFAULT_THRESHOLD

        similarity = cls.cosine_similarity(
            embedding1,
            embedding2
        )

        return similarity, similarity >= threshold

    @staticmethod
    def cosine_similarity(embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """
        Calculates cosine similarity between two embeddings.
        """

        numerator = np.dot(
            embedding1,
            embedding2
        )

        denominator = (
            np.linalg.norm(embedding1) *
            np.linalg.norm(embedding2)
        )

        if denominator == 0:
            raise ValueError("Embedding norm cannot be zero.")

        similarity = numerator / denominator

        return float(similarity)