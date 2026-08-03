from ..common.database.base_repository import BaseRepository
from app.models import TeacherFace
from ...extensions import db

class TeacherFaceRepository(BaseRepository[TeacherFace]):

    def __init__(self):
        super().__init__(TeacherFace)

    def get_active_face(self, teacher_id: int) -> TeacherFace | None:

        return (
            db.session.query(TeacherFace)
                .filter(
                    TeacherFace.teacher_id == teacher_id,
                    TeacherFace.is_active.is_(True)
                )
                .first()
        )

    def get_all_faces(self, teacher_id: int) -> list[TeacherFace]:

        return (
            db.session.query(TeacherFace)
                .filter(TeacherFace.teacher_id == teacher_id)
                .order_by(TeacherFace.created_at.desc())
                .all()
        )

    def has_active_face(self, teacher_id: int) -> bool:

        return (
            self.get_active_face(teacher_id)
            is not None
        )

    def deactivate_active_face(self, teacher_id: int) -> int:
        updated = (
            db.session.query(TeacherFace)
                .filter(
                    TeacherFace.teacher_id == teacher_id,
                    TeacherFace.is_active.is_(True)
                )
                .update(
                    {
                        TeacherFace.is_active: False
                    },
                    synchronize_session= False
                )
        )

        db.session.flush()
        
        return updated