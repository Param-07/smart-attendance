"""
Custom Exceptions

Defines application-specific exceptions used throughout
the Smart Attendance backend.

"""


class AppException(Exception):
    """
    Base application exception.
    """

    status_code = 400

    error_code = "APPLICATION_ERROR"

    def __init__(
        self,
        message: str,
    ):
        super().__init__(message)

        self.message = message


class BadRequestException(AppException):

    status_code = 400

    error_code = "BAD_REQUEST"


class UnauthorizedException(AppException):

    status_code = 401

    error_code = "UNAUTHORIZED"


class ForbiddenException(AppException):

    status_code = 403

    error_code = "FORBIDDEN"


class NotFoundException(AppException):

    status_code = 404

    error_code = "NOT_FOUND"


class ConflictException(AppException):

    status_code = 409

    error_code = "CONFLICT"


class ValidationException(AppException):

    status_code = 422

    error_code = "VALIDATION_ERROR"