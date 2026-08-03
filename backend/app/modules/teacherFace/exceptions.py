from app.core.exceptions import NotFoundException

class TeacherFaceNotFoundException(NotFoundException):

    def __init__(self):
            super().__init__("Teacher Face not found.")