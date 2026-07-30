from __future__ import annotations

import cv2
import numpy as np

class LivenessPreprocessor:

    def preprocess(
        self,
        image: np.ndarray,
        input_size: tuple[int, int]
    ) -> np.ndarray:
        """
        Preprocess image for the anti-spoofing model.
        """

        image = cv2.resize(image, input_size)

        image = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )

        image = image.astype(np.float32)
        image /= 255.0

        image = np.transpose(
            image,
            (2,0,1)
        )

        image = np.expand_dims(
            image,
            axis=0
        )

        return image