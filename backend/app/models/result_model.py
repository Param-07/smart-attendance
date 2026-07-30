from dataclasses import dataclass


@dataclass
class FaceMatchResult:
    matched: bool
    similarity_score: float
    threshold: float

@dataclass
class LivenessResult:
    is_live: bool
    confidence: float
    live_probability: float
    print_attack_probability: float
    replay_attack_probability: float