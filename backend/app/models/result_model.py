from dataclasses import dataclass


@dataclass
class FaceMatchResult:
    matched: bool
    similarity_score: float
    threshold: float