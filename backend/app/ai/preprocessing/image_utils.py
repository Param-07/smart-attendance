import cv2
import numpy as np

from werkzeug.datastructures import FileStorage

class ImageUtils:

    @staticmethod
    def read_uploaded_image(file_storage: FileStorage) -> np.ndarray:

        file_bytes = file_storage.stream.read()
        file_storage.stream.seek(0)   # Reset stream position

        image = cv2.imdecode(
            np.frombuffer(file_bytes, np.uint8),
            cv2.IMREAD_COLOR,
        )

        ImageUtils.validate_image(image)

        return image

    @staticmethod
    def read_image(image_path: str) -> np.ndarray:
        """
        Reads an image from disk.

        Raises:
            FileNotFoundError
            ValueError
        """

        image = cv2.imread(image_path)

        if image is None:
            raise FileNotFoundError(
                 f"Unable to read image: {image_path}"
            )

        return image

    @staticmethod
    def validate_image(image: np.ndarray) -> None:
        """
        Validates an OpenCV image.
        """

        if image is None:
            raise ValueError("Image cannot be none")

        if image.size == 0:
            raise ValueError("Image is empty")

        if len(image.shape) != 3:
            raise ValueError("Image must have all 3 channels")

    @staticmethod
    def get_image_size(image: np.ndarray) -> tuple[int, int]:
        """
        Returns:
            (height, width)
        """

        height, width = image.shape[:2]

        return height, width

    @staticmethod
    def bgr_to_rgb(image: np.ndarray) -> np.ndarray:
        return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    @staticmethod
    def rgb_to_bgr(image: np.ndarray) -> np.ndarray:
        return cv2.cvtColor(image, cv2.COLOR_RGB2BGR)