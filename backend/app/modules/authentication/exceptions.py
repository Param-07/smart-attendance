from app.core.exceptions import (
    UnauthorizedException,
    ForbiddenException,
)


class InvalidCredentialsException(UnauthorizedException):

    error_code = "INVALID_CREDENTIALS"

    def __init__(self):
        super().__init__("Invalid username or password.")

class AccountLockedException(ForbiddenException):

    error_code = "ACCOUNT_LOCKED"

    def __init__(self):
        super().__init__(
            "Your account has been locked. Please contact the administrator."
        )

class AccountDisabledException(ForbiddenException):

    error_code = "ACCOUNT_DISABLED"

    def __init__(self):
        super().__init__(
            "Your account has been disabled. Please contact the administrator."
        )

class PasswordExpiredException(ForbiddenException):

    error_code = "PASSWORD_EXPIRED"

    def __init__(self):
        super().__init__(
            "Your password has expired."
        )

class PasswordResetRequiredException(ForbiddenException):

    error_code = "PASSWORD_RESET_REQUIRED"

    def __init__(self):
        super().__init__(
            "Password reset is required."
        )