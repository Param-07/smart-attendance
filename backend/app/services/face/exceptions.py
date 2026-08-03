from app.core.exceptions import ConflictException, NotFoundException

class FaceMismatchException(ConflictException):

    def __init__(self):
        super().__init__("Face mismatch detected. Please ensure your face is clearly visible in the selfie and try again.")