from threading import Lock
from pathlib import Path

import onnxruntime as ort


class LivenessLoader:

    _session = None
    _lock = Lock()

    @classmethod
    def get_session(cls) -> ort.InferenceSession:

        if cls._session is None:

            with cls._lock:

                if cls._session is None:

                    model_path = (
                        Path(__file__).parent.parent
                        / "models"
                        / "best_model.onnx"
                    )

                    if not model_path.exists():
                        raise FileNotFoundError(
                            f"Liveness model not found: {model_path}"
                        )

                    cls._session = ort.InferenceSession(
                        str(model_path),
                        providers=["CPUExecutionProvider"],
                    )

        return cls._session