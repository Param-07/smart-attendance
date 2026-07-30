from __future__ import annotations

import numpy as np

from app.ai.loaders.antispoof_loader import AntiSpoofLoader
from app.models.result_model import LivenessResult
from app.ai.liveness.preprocess import LivenessPreprocessor


class AntiSpoofModel:

    def __init__(self):

        self.session = AntiSpoofLoader.get_session()

        self.preprocessor = LivenessPreprocessor()

        self.input_name = self.session.get_inputs()[0].name

        self.output_name = self.session.get_outputs()[0].name

    def predict(
        self,
        image: np.ndarray
    ) -> LivenessResult:

        tensor = self.preprocessor.preprocess(image)

        output = self.session.run(
            [self.output_name],
            {
                self.input_name: tensor
            }
        )[0]

        return self._postprocess(output)

    def _postprocess(
        self,
        output: np.ndarray,
    ) -> LivenessResult:

        probabilities = self._softmax(output[0])

        live_probability = float(probabilities[0])

        print_probability = float(probabilities[1])

        replay_probability = float(probabilities[2])

        spoof_probability = max(
            print_probability,
            replay_probability,
        )

        return LivenessResult(
            is_live=live_probability >= spoof_probability,
            confidence=live_probability,
            live_probability=live_probability,
            print_attack_probability=print_probability,
            replay_attack_probability= replay_probability
        )
    
    @staticmethod
    def _softmax(
        logits: np.ndarray,
    ) -> np.ndarray:

        logits = logits - np.max(logits)

        exp = np.exp(logits)

        return exp / exp.sum()