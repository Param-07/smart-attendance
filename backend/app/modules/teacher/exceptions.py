from app.core.exceptions import ConflictException, NotFoundException

class TeacherNotFoundException(NotFoundException):
    
    def __init__(self):
        super().__init__("Teacher not found.")

class EmployeeCodeAlreadyExistsException(ConflictException):

    def __init__(self):
        super().__init__("Employee code already exists.")

class OfficialEmailAlreadyExistsException(ConflictException):

    def __init__(self):
        super().__init__("Official email already exists.")

class UsernameAlreadyExistsException(ConflictException):

    def __init__(self):
        super().__init__("Username already exists.")