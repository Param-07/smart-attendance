from datetime import date, datetime, timezone
from decimal import Decimal
from email.mime import image

from scipy.datasets import face
from werkzeug.datastructures import FileStorage

from app.extensions import db
from app.core.exceptions import ValidationException
from app.core.pagination import PaginationResult

from app.models import Attendance, Teacher, TeacherFace, SchoolConfiguration

from app.modules.teacher.repository import TeacherRepository
from app.modules.teacher.exceptions import (
    TeacherNotFoundException,
    TeacherInactiveException,
)

from app.modules.school.repository.configuration import SchoolConfigurationRepository

from app.modules.teacherFace.repository import TeacherFaceRepository
from app.modules.teacherFace.exceptions import (
    TeacherFaceNotFoundException,
)

from app.modules.attendance.teacher.repository import (
    TeacherAttendanceRepository,
)

from app.modules.attendance.enums import AttendanceStatus
from app.core.enums import EmploymentStatus

from app.modules.attendance.exceptions import (
    AttendanceAlreadyCheckedInException,
    AttendanceAlreadyCheckedOutException,
    AttendanceCheckInFailedException,
    AttendanceCheckOutFailedException,
    AttendanceNotFoundException,
)

from app.modules.school.exceptions import (
    ConfigurationNotFoundException
)

from app.services.face.exceptions import FaceMismatchException

from app.services.face.face_verification_service import FaceVerificationService
from app.services.face.face_detection_service import FaceDetectionService
from app.services.gps.gps_validation_service import GPSValidationServce
from app.services.face.liveness_service import LivenessService
from app.services.storage.selfie_storage_service import StorageService

from app.ai.preprocessing.image_utils import ImageUtils


class TeacherAttendanceService:

    BUCKET_NAME = "attendance-selfies"

    def __init__(self):

        self.teacher_repository = TeacherRepository()
        self.teacher_face_repository = TeacherFaceRepository()
        self.attendance_repository = TeacherAttendanceRepository()
        self.configuration_repository = SchoolConfigurationRepository()

        self.face_verification = FaceVerificationService()
        self.face_detector = FaceDetectionService()
        self.liveness_service = LivenessService()
        self.gps_service = GPSValidationServce()
        self.storage = StorageService()

    def get_my_attendance_today(
        self,
        teacher_public_uuid: str,
    ) -> Attendance:

        teacher = self._get_teacher(
            teacher_public_uuid
        )

        attendance = (
            self.attendance_repository.get_today_attendance(
                teacher_id=teacher.id,
            )
        )

        if attendance is None:
            raise AttendanceNotFoundException()

        return attendance

    def get_my_attendance_list(
        self,
        *,
        teacher_public_uuid: str,
        search: str | None = None,
        status: AttendanceStatus | None = None,
        start_date: date | None = None,
        end_date: date | None = None,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "attendance_date",
        order: str = "desc",
    ) -> PaginationResult[Attendance]:

        teacher = self._get_teacher(
            teacher_public_uuid
        )

        today = date.today()

        if start_date is None:
            start_date = today.replace(day=1)

        if end_date is None:
            end_date = today

        if start_date > end_date:
            raise ValidationException(
                "Start date cannot be after end date."
            )

        if page < 1:
            raise ValidationException(
                "Page must be greater than 0."
            )

        if page_size < 1:
            raise ValidationException(
                "Page size must be greater than 0."
            )

        if page_size > 100:
            raise ValidationException(
                "Page size cannot exceed 100."
            )

        return (
            self.attendance_repository.get_teacher_attendance_list(
                teacher_id=teacher.id,
                search=search,
                status=status,
                start_date=start_date,
                end_date=end_date,
                page=page,
                page_size=page_size,
                sort_by=sort_by,
                order=order,
            )
        )

    def check_in(
        self,
        *,
        teacher_public_uuid: str,
        selfie: FileStorage | None,
        latitude: Decimal | None,
        longitude: Decimal | None,
        accuracy: float | None,
    ) -> Attendance:

        selfie_path = None

        try:

            teacher = self._get_teacher(
                teacher_public_uuid
            )

            configuration = self._get_configuration(
                teacher.school.public_uuid
            )
            self._validate_teacher_status(
                teacher
            )

            self._validate_duplicate_check_in(
                teacher.id
            )

            self._validate_gps(
                configuration,
                latitude,
                longitude,
                accuracy,
            )

            similarity = None

            if configuration.require_check_in_face:

                image = self._read_image(
                    selfie
                )

                face = self.face_detector.detect_single_face(image)

                self._validate_liveness(
                    configuration,
                    image=image,
                    face=face,
                )

                registered_face = self._get_registered_face(
                    teacher.id
                )

                similarity, is_match = (
                    self.face_verification.verify(
                        registered_embedding=registered_face.embedding,
                        face=face,
                    )
                )

                if not is_match:
                    raise FaceMismatchException()

            selfie.stream.seek(0)

            selfie_path = self._upload_selfie(
                teacher=teacher,
                uploaded_file=selfie,
                attendance_type="check_in",
            )

            attendance = self._create_attendance(
                teacher=teacher,
                latitude=latitude,
                longitude=longitude,
                accuracy=accuracy,
                selfie_path=selfie_path,
                similarity_score=similarity,
            )

            self._save_attendance(
                attendance
            )

            db.session.commit()

            return attendance

        except Exception:

            db.session.rollback()

            if selfie_path:
                try:
                    self.storage.delete_file(
                        self.BUCKET_NAME,
                        selfie_path,
                    )
                except Exception:
                    pass

            raise

    def check_out(
        self,
        *,
        teacher_public_uuid: str,
        selfie: FileStorage | None,
        latitude: Decimal | None,
        longitude: Decimal | None,
        accuracy: float | None,
    ) -> Attendance:

        selfie_path = None

        try:

            teacher = self._get_teacher(
                teacher_public_uuid
            )

            configuration = self._get_configuration(
                teacher.school.public_uuid
            )

            attendance = self._get_open_attendance(
                teacher.id
            )

            self._validate_check_out(
                attendance
            )

            self._validate_gps(
                configuration,
                latitude,
                longitude,
                accuracy,
                gps_required=configuration.require_check_out_gps,
            )

            similarity = None

            if configuration.require_check_out_face:
                image = self._read_image(
                    selfie
                )

                self._validate_liveness(
                    configuration,
                    image=image,
                    face=face,
                )

                registered_face = self._get_registered_face(
                    teacher.id
                )

                face = self.face_detector.detect_single_face(image)

                similarity, is_match = (
                    self.face_verification.verify(
                        registered_embedding=registered_face.embedding,
                        face=face,
                    )
                )

                if not is_match:
                    raise FaceMismatchException()

            selfie.stream.seek(0)

            selfie_path = self._upload_selfie(
                teacher=teacher,
                uploaded_file=selfie,
                attendance_type="check_out",
            )

            self._update_attendance(
                attendance=attendance,
                latitude=latitude,
                longitude=longitude,
                accuracy=accuracy,
                selfie_path=selfie_path,
                similarity_score=similarity,
            )

            db.session.commit()

            return attendance

        except Exception:

            db.session.rollback()

            if selfie_path:
                try:
                    self.storage.delete_file(
                        self.BUCKET_NAME,
                        selfie_path,
                    )
                except Exception:
                    pass

            raise

    # Private Helpers

    def _get_teacher(
        self,
        teacher_public_uuid: str,
    ) -> Teacher:

        teacher = self.teacher_repository.get_by_public_uuid(
            teacher_public_uuid
        )

        if teacher is None:
            raise TeacherNotFoundException()

        return teacher

    def _get_registered_face(
        self,
        teacher_id: int,
    ) -> TeacherFace:

        teacher_face = (
            self.teacher_face_repository.get_active_face(
                teacher_id
            )
        )

        if teacher_face is None:
            raise TeacherFaceNotFoundException()

        return teacher_face

    def _get_open_attendance(
        self,
        teacher_id: int,
    ) -> Attendance:

        attendance = (
            self.attendance_repository.get_open_attendance(
                teacher_id=teacher_id,
            )
        )

        if attendance is None:
            raise AttendanceNotFoundException()

        return attendance

    def _validate_duplicate_check_in(
        self,
        teacher_id: int,
    ) -> None:

        if self.attendance_repository.has_checked_in_today(
            teacher_id=teacher_id,
        ):
            raise AttendanceAlreadyCheckedInException()

    def _validate_check_out(
        self,
        attendance: Attendance,
    ) -> None:

        if attendance.check_out_time is not None:
            raise AttendanceAlreadyCheckedOutException()

    def _upload_selfie(
        self,
        *,
        teacher: Teacher,
        uploaded_file: FileStorage,
        attendance_type: str,
    ) -> str:

        extension = uploaded_file.filename.rsplit(".", 1)[-1]

        filename = (
            f"{attendance_type}_"
            f"{datetime.now(timezone.utc).strftime('%H%M%S_%f')}"
            f".{extension}"
        )

        file_path = (
            f"{teacher.public_uuid}/"
            f"{date.today()}/"
            f"{filename}"
        )

        return self.storage.upload_file(
            bucket_name=self.BUCKET_NAME,
            file_path=file_path,
            file=uploaded_file,
        )

    def _create_attendance(
        self,
        *,
        teacher: Teacher,
        latitude: Decimal,
        longitude: Decimal,
        accuracy: float,
        selfie_path: str,
        similarity_score: float,
    ) -> Attendance:

        return Attendance(
            teacher_id=teacher.id,
            attendance_date=date.today(),
            check_in_time=datetime.now(timezone.utc),
            check_in_latitude=latitude,
            check_in_longitude=longitude,
            check_in_accuracy=accuracy,
            check_in_selfie_path=selfie_path,
            face_match_score=similarity_score,
            status=AttendanceStatus.OPEN,
        )

    def _update_attendance(
        self,
        *,
        attendance: Attendance,
        latitude: Decimal,
        longitude: Decimal,
        accuracy: float,
        selfie_path: str,
        similarity_score: float,
    ) -> None:

        attendance.check_out_time = datetime.now(
            timezone.utc
        )

        attendance.check_out_latitude = latitude

        attendance.check_out_longitude = longitude

        attendance.check_out_accuracy = accuracy

        attendance.check_out_selfie_path = selfie_path

        attendance.face_match_score = similarity_score

        attendance.status = AttendanceStatus.COMPLETED

    def _save_attendance(
        self,
        attendance: Attendance,
    ) -> None:

        self.attendance_repository.add(
            attendance
        )

        db.session.flush()

    def _get_configuration(
        self,
        school_public_uuid: str
    ) -> SchoolConfiguration:

        config = self.configuration_repository.get_by_school_public_uuid(school_public_uuid)

        if config is None:
            raise ConfigurationNotFoundException()

        return config

    def _validate_teacher_status(
            self, 
            teacher: Teacher
        ):

        if not teacher.is_active:
            raise TeacherNotFoundException()

        if teacher.employment_status == EmploymentStatus.INACTIVE:
            raise TeacherInactiveException()

    def _read_image(self, uploaded_file: FileStorage):

        return ImageUtils.read_uploaded_image(uploaded_file)


    def _validate_gps(self, configuration: SchoolConfiguration, latitude, longitude, accuracy):

        self.gps_service.validate(
            configurations= configuration,
            latitude= latitude,
            longitude= longitude,
            accuracy= accuracy,
            gps_required= configuration.require_check_in_gps
        )

    def _validate_liveness(self, configuration, image):

        return self.liveness_service.validate(
            configuration= configuration,
            image= image
        )
