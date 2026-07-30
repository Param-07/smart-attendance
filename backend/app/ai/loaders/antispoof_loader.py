from threading import Lock
from pathlib import Path

import onnxruntime as ort


class AntiSpoofLoader:

    _session = None
    _lock = Lock()

    @classmethod
    def get_session(cls):

        if cls._session is None:
            with cls._lock:

                if cls._session is None:

                    model_path = (
                        Path(__file__).parent.parent
                        / "models"
                        / "anti_spoof.onnx"
                    )
                    
                    if not model_path.exists():
                        raise FileNotFoundError(
                            f"Anti-spoof model not found: {model_path}"
                        )
                    
                    cls._session = ort.InferenceSession(
                        str(model_path),
                        providers=["CPUExecutionProvider"],
                    )

        return cls._session