import os
from datetime import UTC, datetime

from werkzeug.datastructures import FileStorage

from app.extensions import db
from app.models import Teacher, TeacherFace

from app.core.exceptions import (
    ConflictException,
    NotFoundException,
)

from app.modules.teacher.repository import TeacherRepository
from app.modules.teacherFace.repository import TeacherFaceRepository

from app.services.face.face_verification_service import (
    FaceVerificationService,
)
from app.services.storage.selfie_storage_service import (
    StorageService,
)


class TeacherFaceService:

    BUCKET_NAME = "teacher-faces"

    def __init__(self):

        self.teacher_repository = TeacherRepository()

        self.teacher_face_repository = TeacherFaceRepository()

        self.face_verification = FaceVerificationService()

        self.storage = StorageService()

    # ============================================================
    # Public Methods
    # ============================================================

    def register_face(
        self,
        teacher_public_uuid: str,
        uploaded_file: FileStorage,
    ) -> TeacherFace:

        teacher = self._get_teacher(
            teacher_public_uuid
        )

        self._validate_registration(
            teacher
        )

        face, embedding = (
            self.face_verification.extract_embedding(
                uploaded_file
            )
        )

        image_path = None

        try:

            image_path = self._upload_face(
                teacher,
                uploaded_file,
            )

            teacher_face = self._create_teacher_face(
                teacher=teacher,
                embedding=embedding,
                image_path=image_path,
                face=face,
            )

            self._save_teacher_face(
                teacher_face
            )

            db.session.commit()

            return teacher_face

        except Exception:

            db.session.rollback()

            if image_path:
                try:
                    self.storage.delete_file(
                        self.BUCKET_NAME,
                        image_path,
                    )
                except Exception:
                    pass

            raise

    # Private Helpers

    def _get_teacher(
        self,
        teacher_public_uuid: str,
    ) -> Teacher:

        teacher = (
            self.teacher_repository.get_by_public_uuid(
                teacher_public_uuid
            )
        )

        if teacher is None:
            raise NotFoundException(
                "Teacher not found."
            )

        return teacher

    def _validate_registration(
        self,
        teacher: Teacher,
    ) -> None:

        if self.teacher_face_repository.has_active_face(
            teacher.id
        ):
            raise ConflictException(
                "Teacher already has an active face registration."
            )

    def _upload_face(
        self,
        teacher: Teacher,
        uploaded_file: FileStorage,
    ) -> str:

        extension = os.path.splitext(
            uploaded_file.filename
        )[1]

        filename = (
            datetime.now(UTC)
            .strftime("%Y%m%d_%H%M%S_%f")
            + extension
        )

        file_path = (
            f"{teacher.public_uuid}/{filename}"
        )

        return self.storage.upload_file(
            bucket_name=self.BUCKET_NAME,
            file_path=file_path,
            file=uploaded_file,
        )

    def _create_teacher_face(
        self,
        teacher: Teacher,
        embedding,
        image_path: str,
        face,
    ) -> TeacherFace:

        return TeacherFace(

            teacher_id=teacher.id,

            image_path=image_path,

            embedding=embedding.tolist(),

            model_name="InsightFace",

            model_version="buffalo_l",

            face_quality_score=float(
                face.det_score
            ),
        )

    def _save_teacher_face(
        self,
        teacher_face: TeacherFace,
    ) -> None:

        self.teacher_face_repository.add(
            teacher_face
        )

        db.session.flush()

    def get_registered_face(
        self,
        teacher_public_uuid: str,
    ) -> dict:

        teacher = self._get_teacher(
            teacher_public_uuid
        )

        teacher_face = self._get_active_face(
            teacher.id
        )

        image_url = self.storage.get_public_url(
            bucket_name=self.BUCKET_NAME,
            file_path=teacher_face.image_path,
        )

        return {
            "teacher_uuid": str(teacher.public_uuid),
            "image_url": image_url,
            "model_name": teacher_face.model_name,
            "model_version": teacher_face.model_version,
            "face_quality_score": teacher_face.face_quality_score,
            "registered_at": teacher_face.created_at,
        }

    def delete_face(
        self,
        teacher_public_uuid: str,
    ) -> None:

        teacher = self._get_teacher(
            teacher_public_uuid
        )

        teacher_face = self._get_active_face(
            teacher.id
        )

        try:

            self.storage.delete_file(
                bucket_name=self.BUCKET_NAME,
                file_path=teacher_face.image_path,
            )

            self.teacher_face_repository.deactivate_active_face(
                teacher.id
            )

            db.session.commit()

        except Exception:

            db.session.rollback()
            raise

    def replace_face(
        self,
        teacher_public_uuid: str,
        uploaded_file: FileStorage,
    ) -> TeacherFace:

        teacher = self._get_teacher(
            teacher_public_uuid
        )

        old_face = self._get_active_face(
            teacher.id
        )

        face, embedding = (
            self.face_verification.extract_embedding(
                uploaded_file
            )
        )

        image_path = None

        try:

            image_path = self._upload_face(
                teacher,
                uploaded_file,
            )

            self.teacher_face_repository.deactivate_active_face(
                teacher.id
            )

            teacher_face = self._create_teacher_face(
                teacher=teacher,
                embedding=embedding,
                image_path=image_path,
                face=face,
            )

            self._save_teacher_face(
                teacher_face
            )

            db.session.commit()

        except Exception:

            db.session.rollback()

            if image_path:
                try:
                    self.storage.delete_file(
                        self.BUCKET_NAME,
                        image_path,
                    )
                except Exception:
                    pass

            raise

        try:
            self.storage.delete_file(
                self.BUCKET_NAME,
                old_face.image_path,
            )
        except Exception:
            pass

        return teacher_face

    # ============================================================
    # Private Helpers
    # ============================================================

    def _get_active_face(
        self,
        teacher_id: int,
    ) -> TeacherFace:

        teacher_face = (
            self.teacher_face_repository.get_active_face(
                teacher_id
            )
        )

        if teacher_face is None:
            raise NotFoundException(
                "Teacher does not have an active face registration."
            )

        return teacher_face