from __future__ import annotations

from datetime import UTC, date, datetime

from app.models import Attendance
from app.core.pagination import PaginationResult
from app.core.exceptions import ValidationException
from app.modules.teacher.exceptions import TeacherNotFoundException
from app.modules.teacher.repository import TeacherRepository
from app.modules.authentication.repository import AuthRepository
from ..enums import AttendanceStatus
from ..exceptions import AttendanceNotFoundException
from .repository import AdminAttendanceRepository


class AdminAttendanceService:

    def __init__(self):

        self.attendance_repository = AdminAttendanceRepository()
        self.teacher_repository = TeacherRepository()
        self.account_repository = AuthRepository()

    def get_attendance_list(
        self,
        *,
        school_id: int,
        teacher_public_uuid: str | None = None,
        search: str | None = None,
        status: AttendanceStatus | None = None,
        start_date: date | None = None,
        end_date: date | None = None,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "attendance_date",
        order: str = "desc",
    ) -> PaginationResult[Attendance]:

        if (
            start_date is not None
            and end_date is not None
            and start_date > end_date
        ):
            raise ValidationException(
                "Start date cannot be after end date."
            )

        teacher_id = None

        if teacher_public_uuid is not None:

            teacher = self._get_teacher(
                teacher_public_uuid,
                school_id,
            )

            teacher_id = teacher.id

        return self.attendance_repository.get_attendance_list(
            school_id=school_id,
            teacher_id=teacher_id,
            search=search,
            status=status,
            start_date=start_date,
            end_date=end_date,
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            order=order,
        )

    def get_attendance(
        self,
        *,
        public_uuid: str,
        school_id: int,
    ) -> Attendance:

        attendance = (
            self.attendance_repository.get_by_public_uuid(
                public_uuid,
                school_id,
            )
        )

        if attendance is None:
            raise AttendanceNotFoundException()

        return attendance

    def correct_attendance(
        self,
        *,
        attendance_public_uuid: str,
        admin_account_public_uuid: str,
        school_id: int,
        check_in_time: datetime | None = None,
        check_out_time: datetime | None = None,
        remarks: str,
    ) -> Attendance:

        attendance = (
            self.attendance_repository.get_by_public_uuid(
                attendance_public_uuid,
                school_id,
            )
        )

        if attendance is None:
            raise AttendanceNotFoundException()

        admin = self.account_repository.get_by_public_uuid(
            admin_account_public_uuid
        )

        if admin is None:
            raise ValidationException(
                "Admin account not found."
            )

        if (
            check_in_time is not None
            and check_out_time is not None
            and check_in_time > check_out_time
        ):
            raise ValidationException(
                "Check-in time cannot be after check-out time."
            )

        if check_in_time is not None:
            attendance.check_in_time = check_in_time

        if check_out_time is not None:
            attendance.check_out_time = check_out_time

        attendance.remarks = remarks
        attendance.status = AttendanceStatus.CORRECTED
        attendance.corrected_by = admin.id
        attendance.corrected_at = datetime.now(UTC)

        return self.attendance_repository.update_attendance(
            attendance
        )

    def get_attendance_statistics(
        self,
        *,
        school_id: int,
    ):

        return self.attendance_repository.get_attendance_statistics(
            school_id=school_id
        )

    def get_attendance_report(
        self,
        *,
        school_id: int,
        teacher_public_uuid: str | None = None,
        search: str | None = None,
        status: AttendanceStatus | None = None,
        start_date: date,
        end_date: date,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "attendance_date",
        order: str = "desc",
    ) -> PaginationResult[Attendance]:

        if start_date > end_date:
            raise ValidationException(
                "Start date cannot be later than end date."
            )

        teacher_id = None

        if teacher_public_uuid is not None:

            teacher = self._get_teacher(
                teacher_public_uuid,
                school_id,
            )

            teacher_id = teacher.id

        return self.attendance_repository.get_attendance_report(
            school_id=school_id,
            teacher_id=teacher_id,
            search=search,
            status=status,
            start_date=start_date,
            end_date=end_date,
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            order=order,
        )

    def get_attendance_report_export(
        self,
        *,
        school_id: int,
        teacher_public_uuid: str | None = None,
        search: str | None = None,
        status: AttendanceStatus | None = None,
        start_date: date,
        end_date: date,
        sort_by: str = "attendance_date",
        order: str = "desc",
    ) -> list[Attendance]:

        if start_date > end_date:
            raise ValidationException(
                "Start date cannot be later than end date."
            )

        teacher_id = None

        if teacher_public_uuid is not None:

            teacher = self._get_teacher(
                teacher_public_uuid,
                school_id,
            )

            teacher_id = teacher.id

        return self.attendance_repository.get_attendance_report_export(
            school_id=school_id,
            teacher_id=teacher_id,
            search=search,
            status=status,
            start_date=start_date,
            end_date=end_date,
            sort_by=sort_by,
            order=order,
        )

    def _get_teacher(
        self,
        public_uuid: str,
        school_id: int,
    ):

        teacher = self.teacher_repository.get_by_public_uuid(
            public_uuid
        )

        if (
            teacher is None
            or teacher.school_id != school_id
        ):
            raise TeacherNotFoundException()

        return teacher