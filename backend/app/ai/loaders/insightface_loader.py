from threading import Lock

from insightface.app import FaceAnalysis

class InsightFaceLoader:
    """
    Thread-safe singleton for InsightFace FaceAnalysis.
    """

    _model = None
    _lock = Lock()

    @classmethod
    def get_model(cls) -> FaceAnalysis:

        if cls._model is None:
            with cls._lock:
                model = FaceAnalysis(
                    name= "buffalo_l",
                    providers= ["CPUExecutionProvider"],
                    allowed_modules= ["detection", "recognition"]
                )

                model.prepare(
                    ctx_id=0,
                    det_size=(640, 640)
                )

                cls._model = model

        return cls._model