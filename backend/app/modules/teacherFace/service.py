from ...extensions import db
from ..teacher.repository import TeacherRepository
from .repository import TeacherFaceReopsitory

class TeacherFaceService:

    def __init__(self):

        self.teacher_face_repository = TeacherFaceReopsitory()
        self.teacher_repository = TeacherRepository()
