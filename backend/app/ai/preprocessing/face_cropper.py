from __future__ import annotations

import numpy as np
from insightface.app.common import Face


class FaceCropper:
    """
    Crop face for MiniFASNet anti-spoofing.

    MiniFASNet expects an expanded crop around the face,
    not a tightly cropped bounding box.
    """

    SCALE = 2.7

    @classmethod
    def crop(
        cls,
        image: np.ndarray,
        face: Face,
    ) -> np.ndarray:

        h, w = image.shape[:2]

        x1, y1, x2, y2 = face.bbox.astype(int)

        face_width = x2 - x1
        face_height = y2 - y1

        cx = x1 + face_width / 2
        cy = y1 + face_height / 2

        crop_width = face_width * cls.SCALE
        crop_height = face_height * cls.SCALE

        nx1 = max(0, int(cx - crop_width / 2))
        ny1 = max(0, int(cy - crop_height / 2))

        nx2 = min(w, int(cx + crop_width / 2))
        ny2 = min(h, int(cy + crop_height / 2))

        return image[
            ny1:ny2,
            nx1:nx2,
        ]