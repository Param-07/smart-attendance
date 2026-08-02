from dataclasses import dataclass


@dataclass
class FaceMatchResult:
    matched: bool
    similarity_score: float
    threshold: float

@dataclass(slots=True)
class LivenessResult:
    is_live: bool
    confidence: float
    real_logit: float
    spoof_logit: float
    logit_difference: float