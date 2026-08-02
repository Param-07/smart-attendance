from __future__ import annotations

import numpy as np
from insightface.app.common import Face

from app.ai.loaders.liveness_loader import LivenessLoader
from app.ai.preprocessing.face_cropper import FaceCropper
from app.ai.preprocessing.liveness_preprocessor import (
    LivenessPreprocessor,
)
from app.models.result_model import (
    LivenessResult,
)


class LivenessModel:

    DEFAULT_THRESHOLD = 0.0

    def __init__(self):

        self.session = LivenessLoader.get_session()

        self.cropper = FaceCropper()

        self.preprocessor = LivenessPreprocessor()

        self.input_name = (
            self.session.get_inputs()[0].name
        )

        self.output_name = (
            self.session.get_outputs()[0].name
        )

    def predict(
        self,
        image: np.ndarray,
        face: Face,
        threshold: float | None = None,
    ) -> LivenessResult:

        if threshold is None:
            threshold = self.DEFAULT_THRESHOLD

        crop = self.cropper.crop(
            image=image,
            face=face,
        )
        print(f"Face crop shape-2")

        batch = self.preprocessor.preprocess_batch(
            [crop]
        )

        logits = self.session.run(
            [self.output_name],
            {
                self.input_name: batch
            },
        )[0]

        if logits.shape != (1, 2):
            raise ValueError(
                f"Unexpected model output shape: {logits.shape}"
            )

        return self._process_logits(
            logits[0],
            threshold,
        )

    @staticmethod
    def _process_logits(
        logits: np.ndarray,
        threshold: float,
    ) -> LivenessResult:

        real_logit = float(logits[0])

        spoof_logit = float(logits[1])

        logit_difference = (
            real_logit - spoof_logit
        )

        is_live = (
            logit_difference >= threshold
        )

        confidence = abs(
            logit_difference
        )

        return LivenessResult(
            is_live=is_live,
            confidence=confidence,
            real_logit=real_logit,
            spoof_logit=spoof_logit,
            logit_difference=logit_difference,
        )