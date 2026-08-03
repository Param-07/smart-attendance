from app.ai.liveness.anti_spoof_model import LivenessModel
from app.core.exceptions import ConflictException

from app.models import SchoolConfiguration

class LivenessService:

    def __init__(self):
        self.model = LivenessModel()

    def validate(
        self,
        image,
        face,
        configuration: SchoolConfiguration,
    ):

        if not configuration.require_liveness:
            return None

        result = self.model.predict(image, face, configuration.liveness_threshold)

        if not result.is_live:
            raise ConflictException(
                "Liveness verification failed."
            )

        if result.confidence < configuration.liveness_threshold:
            raise ConflictException(
                "Liveness confidence below threshold."
            )

        return result