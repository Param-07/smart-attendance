from app.ai.liveness.anti_spoof_model import AntiSpoofModel
from app.core.exceptions import ConflictException

class LivenessService:

    def __init__(self):
        self.model = AntiSpoofModel()

    def validate(
        self,
        image,
        configuration,
    ):

        if not configuration.require_liveness:
            return None

        result = self.model.predict(image)

        if not result.is_live:
            raise ConflictException(
                "Liveness verification failed."
            )

        if result.confidence < configuration.liveness_threshold:
            raise ConflictException(
                "Liveness confidence below threshold."
            )

        return result