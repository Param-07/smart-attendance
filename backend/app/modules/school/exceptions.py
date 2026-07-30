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

class InvalidEmailException(ConflictException):

    def __init__(self):
        super().__init__("Please check your email Id.")