from __future__ import annotations

import os
from datetime import UTC, datetime

from werkzeug.datastructures import FileStorage

from app.extensions import db
from app.models import (
    Account,
    Teacher,
    TeacherFace,
)

from app.core.enums import UserRole
from app.core.exceptions import (
    ConflictException,
    ForbiddenException,
    NotFoundException,
)

from app.ai.preprocessing.image_utils import ImageUtils

from app.modules.teacher.repository import TeacherRepository
from app.modules.teacherFace.repository import TeacherFaceRepository
from app.modules.school.repository.configuration import (
    SchoolConfigurationRepository,
)

from app.services.face.face_verification_service import (
    FaceVerificationService,
)
from app.services.storage.selfie_storage_service import StorageService
from app.services.face.liveness_service import LivenessService
from app.services.face.face_detection_service import FaceDetectionService


class TeacherFaceService:

    BUCKET_NAME = "teacher-faces"

    def __init__(self):

        self.teacher_repository = TeacherRepository()

        self.teacher_face_repository = (
            TeacherFaceRepository()
        )

        self.face_verification = FaceVerificationService()

        self.storage = StorageService()

        self.liveness_service = LivenessService()

        self.configuration_repository = (
            SchoolConfigurationRepository()
        )

        self.face_detector = FaceDetectionService()

    def register_face(
        self,
        teacher_public_uuid: str,
        uploaded_file: FileStorage,
        current_user: Account,
    ) -> TeacherFace:

        if uploaded_file is None:
            raise ValueError(
                "Selfie image is required."
            )

        teacher = self._get_teacher(
            teacher_public_uuid
        )

        self._authorize_teacher_access(
            teacher,
            current_user,
        )

        self._validate_registration(
            teacher
        )

        configuration = self._get_configuration(
            teacher
        )

        image = self._read_image(
            uploaded_file
        )

        face = self.face_detector.detect_single_face(
            image
        )

        self._validate_liveness(
            image=image,
            face=face,
            configuration=configuration,
        )

        embedding = (
            self.face_verification.extract_embedding(
                face
            )
        )

        uploaded_file.stream.seek(0)

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

            self.teacher_face_repository.add(
                teacher_face
            )

            db.session.flush()
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

    def replace_face(
        self,
        teacher_public_uuid: str,
        uploaded_file: FileStorage,
        current_user: Account,
    ) -> TeacherFace:

        if uploaded_file is None:
            raise ValueError(
                "Selfie image is required."
            )

        teacher = self._get_teacher(
            teacher_public_uuid
        )

        self._authorize_teacher_access(
            teacher,
            current_user,
        )

        old_face = self._get_active_face(
            teacher.id
        )

        configuration = self._get_configuration(
            teacher
        )

        image = self._read_image(
            uploaded_file
        )

        face = self.face_detector.detect_single_face(
            image
        )

        self._validate_liveness(
            image=image,
            face=face,
            configuration=configuration,
        )

        embedding = (
            self.face_verification.extract_embedding(
                face
            )
        )

        uploaded_file.stream.seek(0)

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

            self.teacher_face_repository.add(
                teacher_face
            )

            db.session.flush()
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

    def get_registered_face(
        self,
        teacher_public_uuid: str,
        current_user: Account,
    ) -> dict:

        teacher = self._get_teacher(
            teacher_public_uuid
        )

        self._authorize_teacher_access(
            teacher,
            current_user,
        )

        teacher_face = self._get_active_face(
            teacher.id
        )

        image_url = self.storage.get_public_url(
            bucket_name=self.BUCKET_NAME,
            file_path=teacher_face.image_path,
        )

        return {
            "teacher_uuid": str(
                teacher.public_uuid
            ),
            "image_url": image_url,
            "model_name": teacher_face.model_name,
            "model_version": teacher_face.model_version,
            "face_quality_score": (
                teacher_face.face_quality_score
            ),
            "registered_at": teacher_face.created_at,
        }

    def delete_face(
        self,
        teacher_public_uuid: str,
        current_user: Account,
    ) -> None:

        teacher = self._get_teacher(
            teacher_public_uuid
        )

        self._authorize_teacher_access(
            teacher,
            current_user,
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

    def _authorize_teacher_access(
        self,
        teacher: Teacher,
        current_user: Account,
    ) -> None:

        if current_user.role == UserRole.SUPER_ADMIN:
            return

        if current_user.role == UserRole.SCHOOL_ADMIN:

            if current_user.school_id != teacher.school_id:
                raise ForbiddenException(
                    "You do not have access to this teacher."
                )

            return

        raise ForbiddenException(
            "You do not have permission to access this teacher."
        )

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

    def _upload_face(
        self,
        teacher: Teacher,
        uploaded_file: FileStorage,
    ) -> str:

        extension = os.path.splitext(
            uploaded_file.filename or ""
        )[1].lower()

        if extension not in {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
        }:
            extension = ".jpg"

        filename = (
            datetime.now(UTC).strftime(
                "%Y%m%d_%H%M%S_%f"
            )
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

    def _read_image(
        self,
        uploaded_file: FileStorage,
    ):

        return ImageUtils.read_uploaded_image(
            uploaded_file
        )

    def _validate_liveness(
        self,
        image,
        face,
        configuration,
    ) -> None:

        self.liveness_service.validate(
            image=image,
            face=face,
            configuration=configuration,
        )

    def _get_configuration(
        self,
        teacher: Teacher,
    ):

        school_public_uuid = (
            teacher.school.public_uuid
        )

        configuration = (
            self.configuration_repository
            .get_by_school_public_uuid(
                school_public_uuid
            )
        )

        if configuration is None:
            raise NotFoundException(
                "School configuration not found."
            )

        return configuration