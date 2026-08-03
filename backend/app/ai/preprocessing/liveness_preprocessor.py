from __future__ import annotations

import cv2
import numpy as np


class LivenessPreprocessor:

    MODEL_SIZE = 128

    @classmethod
    def preprocess(
        cls,
        face_crop: np.ndarray,
    ) -> np.ndarray:

        image = cv2.cvtColor(
            face_crop,
            cv2.COLOR_BGR2RGB,
        )

        image = cls._letterbox(
            image,
            cls.MODEL_SIZE,
        )

        image = (
            image.astype(np.float32)
            / 255.0
        )

        image = np.transpose(
            image,
            (2, 0, 1),
        )

        return image

    @classmethod
    def preprocess_batch(
        cls,
        face_crops: list[np.ndarray],
    ) -> np.ndarray:

        if not face_crops:
            raise ValueError(
                "Face crop list cannot be empty."
            )

        batch = np.stack(
            [
                cls.preprocess(crop)
                for crop in face_crops
            ],
            axis=0,
        )

        return batch

    @staticmethod
    def _letterbox(
        image: np.ndarray,
        target_size: int,
    ) -> np.ndarray:

        height, width = image.shape[:2]

        ratio = target_size / max(
            height,
            width,
        )

        new_width = int(width * ratio)
        new_height = int(height * ratio)

        interpolation = (
            cv2.INTER_LANCZOS4
            if ratio > 1
            else cv2.INTER_AREA
        )

        resized = cv2.resize(
            image,
            (new_width, new_height),
            interpolation=interpolation,
        )

        delta_width = target_size - new_width
        delta_height = target_size - new_height

        top = delta_height // 2
        bottom = delta_height - top

        left = delta_width // 2
        right = delta_width - left

        return cv2.copyMakeBorder(
            resized,
            top,
            bottom,
            left,
            right,
            cv2.BORDER_REFLECT_101,
        )