from app.core.exceptions import ConflictException, NotFoundException

class AttendanceNotFoundException(NotFoundException):
    
    def __init__(self):
        super().__init__("Attendance not found.")

class AttendanceAlreadyCheckedInException(ConflictException):

    def __init__(self):
        super().__init__("Attendance is already marked.")

class AttendanceCheckInFailedException(ConflictException):

    def __init__(self):
        super().__init__("Something went wrong while saving attendance. Try Again !")

class AttendanceCheckOutFailedException(ConflictException):

    def __init__(self):
        super().__init__("Something went wrong while checking you out. Try Again !")
