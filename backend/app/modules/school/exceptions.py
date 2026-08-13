from app.core.exceptions import ConflictException

class SchoolNotFoundException(ConflictException):

    def __init__(self):
        super().__init__("School not found.")

class SchoolCodeAlreadyExistsException(ConflictException):

    def __init__(self):
        super().__init__("School code is already assigned. Please enter the unique valid school code.")

class ConfigurationNotFoundException(ConflictException):

    def __init__(self):
        super().__init__("Configuration not found.")

class SchoolEmailAlreadyExistsException(ConflictException):

    error_code = "SCHOOL_EMAIL_ALREADY_EXISTS"

    def __init__(self):
        super().__init__(
            "School email is already assigned. "
            "Please use a unique school email."
        )