from __future__ import annotations

import cv2
import numpy as np


class LivenessPreprocessor:

    INPUT_SIZE = (80, 80)

    def preprocess(
        self,
        image: np.ndarray,
    ) -> np.ndarray:
        """
        Convert BGR image to MiniFASNet input tensor.

        Returns:
            Shape: (1, 3, 80, 80)
        """

        image = cv2.resize(
            image,
            self.INPUT_SIZE,
        )

        image = image.astype(np.float32)
        image /= 255.0

        image = np.transpose(
            image,
            (2, 0, 1),
        )

        image = np.expand_dims(
            image,
            axis=0,
        )

        return image