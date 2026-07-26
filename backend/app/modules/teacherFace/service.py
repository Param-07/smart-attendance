import os
from datetime import datetime, UTC
from werkzeug.datastructures import FileStorage

from app.models import Teacher, TeacherFace

from ...extensions import db
from ..teacher.repository import TeacherRepository
from .repository import TeacherFaceRepository

from app.services.face.face_detection_service import FaceDetectionService
from app.services.face.face_embedding_service import FaceEmbeddingService
from app.services.storage.selfie_storage_service import StorageService
from app.ai.preprocessing.image_utils import ImageUtils

from ..teacher.exceptions import TeacherNotFoundException
from ...core.exceptions import ConflictException

class TeacherFaceService:

    def __init__(self):

        self.teacher_face_repository = TeacherFaceRepository()
        self.teacher_repository = TeacherRepository()

        self.face_detector = FaceDetectionService()
        self.face_embedder = FaceEmbeddingService()
        self.storage = StorageService()
        self.image_utils = ImageUtils()

    def register_face(self, teacher_public_uuid: str, image: FileStorage):

        teacher = self.teacher_repository.get_by_public_uuid(public_uuid= teacher_public_uuid)

        if teacher is None:
            raise TeacherNotFoundException()

        if self.teacher_face_repository.has_active_face(teacher_id= teacher.id):
            raise ConflictException("Teacher already has a registered face.")

        
        self.image_utils.read_uploaded_image(image)
        face = self.face_detector.detect_single_face(image)

        embedding = self.face_embedder.get_embedding(face)
        self.face_embedder.validate_embedding(embedding)

        try:
            image_path = self._upload_face(teacher, image)

            teacher_face = self._create_teacher_face(teacher, embedding, image_path, face)
            self._save_teacher_face(teacher_face)

            return teacher_face
        except Exception as exc:
            db.session.rollback()

            if image_path:
                self.storage.delete_file("teacher-faces", image_path)

            raise

    def _upload_face(self, teacher: Teacher, uploaded_file: FileStorage):

        extension = os.path.splitext(
            uploaded_file.filename
        )[1]

        file_name = (
            datetime.now(UTC)
            .strftime("%Y%m%d_%H%M%S")
            + extension
        )

        path = (f"{teacher.public_uuid}/{file_name}")

        return self.storage.upload_file(
            bucket_name= "teacher-faces",
            file_path= path,
            file= uploaded_file
        )

    def _create_teacher_face(
        self,
        teacher,
        embedding,
        image_path,
        face,
    ):

        return TeacherFace(
            teacher_id=teacher.id,
            face_embedding=embedding.tolist(),
            face_image_path=image_path,
            face_quality_score=float(face.det_score),
            embedding_version="buffalo_l",
        )

    def _save_teacher_face(self, teacher_face):

        self.teacher_face_repository.add(
            teacher_face
        )

        db.session.commit()

        return teacher_face