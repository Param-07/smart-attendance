import numpy as np
from insightface.app.common import Face


class FaceEmbeddingService:
    """
    Handles extraction and validation of face embeddings.
    """

    @staticmethod
    def get_embedding(face: Face) -> np.ndarray:
        if face.embedding is None:
            raise ValueError("Face embedding could not be generated.")

        return face.embedding

    @staticmethod
    def validate_embedding(embedding: np.ndarray) -> None:

        if embedding.ndim != 1:
            raise ValueError("Embedding must be one-dimensional.")

        if embedding.shape[0] != 512:
            raise ValueError(
                f"Expected embedding dimension 512 but got {embedding.shape[0]}"
            )

    @staticmethod
    def to_list(embedding: np.ndarray) -> list[float]:
        return embedding.tolist()

    @staticmethod
    def from_list(values: list[float]) -> np.ndarray:
        return np.array(values, dtype=np.float32)