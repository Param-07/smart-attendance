from __future__ import annotations

import cv2
import numpy as np

from insightface.app.common import Face


class FaceCropper:

    DEFAULT_EXPANSION_FACTOR = 1.5

    @classmethod
    def crop(
        cls,
        image: np.ndarray,
        face: Face,
        expansion_factor: float | None = None,
    ) -> np.ndarray:

        if expansion_factor is None:
            expansion_factor = cls.DEFAULT_EXPANSION_FACTOR

        height, width = image.shape[:2]

        x1, y1, x2, y2 = face.bbox.astype(int)

        face_width = x2 - x1
        face_height = y2 - y1

        if face_width <= 0 or face_height <= 0:
            raise ValueError("Invalid face bounding box.")

        max_dimension = max(
            face_width,
            face_height,
        )

        crop_size = int(
            max_dimension * expansion_factor
        )

        center_x = x1 + face_width / 2
        center_y = y1 + face_height / 2

        crop_x = int(center_x - crop_size / 2)
        crop_y = int(center_y - crop_size / 2)

        crop_x1 = max(0, crop_x)
        crop_y1 = max(0, crop_y)

        crop_x2 = min(
            width,
            crop_x + crop_size,
        )

        crop_y2 = min(
            height,
            crop_y + crop_size,
        )

        top_pad = max(0, -crop_y)
        left_pad = max(0, -crop_x)

        bottom_pad = max(
            0,
            crop_y + crop_size - height,
        )

        right_pad = max(
            0,
            crop_x + crop_size - width,
        )

        cropped = image[
            crop_y1:crop_y2,
            crop_x1:crop_x2,
        ]

        cropped = cv2.copyMakeBorder(
            cropped,
            top_pad,
            bottom_pad,
            left_pad,
            right_pad,
            cv2.BORDER_REFLECT_101,
        )

        if (
            cropped.shape[0] != crop_size
            or
            cropped.shape[1] != crop_size
        ):
            raise ValueError(
                "Face crop size mismatch."
            )

        return cropped