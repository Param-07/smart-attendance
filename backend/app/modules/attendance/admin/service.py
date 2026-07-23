from __future__ import annotations
from datetime import date, datetime, UTC

from app.models import Attendance
from app.core.pagination import PaginationResult
from app.modules.teacher.exceptions import TeacherNotFoundException
from ..exceptions import AttendanceNotFoundException
from app.core.exceptions import ValidationException
from .repository import AdminAttendanceRepository
from app.modules.teacher.repository import TeacherRepository
from app.modules.authentication.repository import AuthRepository
from ..enums import AttendanceStatus

class AdminAttendanceService:

    def __init__(self):

        self.attendance_repository = AdminAttendanceRepository()
        self.teacher_repository = TeacherRepository()
        self.account_repository = AuthRepository()

    def get_attendance_list(
        self,
        *,
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
        
        if teacher_public_uuid is not None:
            teacher = self.teacher_repository.get_by_public_uuid(
                public_uuid=teacher_public_uuid
            )

            if teacher is None:
                raise TeacherNotFoundException()

            teacher_id = teacher.id

        if start_date is not None and end_date is not None:
            if start_date > end_date:
                raise ValidationException(
                    "Start date cannot be after end date."
                )

        return self.attendance_repository.get_attendance_list(
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

    def get_attendance(self, public_uuid: str) -> Attendance:

        attendance = self.attendance_repository.get_by_public_uuid(public_uuid)

        if attendance is None:
            raise AttendanceNotFoundException()
        
        return attendance

    def correct_attendance(
        self,
        *,
        attendance_public_uuid: str,
        admin_account_public_uuid: str,
        check_in_time: datetime | None = None,
        check_out_time: datetime | None = None,
        remarks: str,
    ) -> Attendance:

        attendance = self.attendance_repository.get_by_public_uuid(
            attendance_public_uuid
        )

        if attendance is None:
            raise AttendanceNotFoundException()

        admin = self.account_repository.get_by_public_uuid(
            admin_account_public_uuid
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

        attendance.corrected_by = admin.username

        attendance.corrected_at = datetime.now(UTC)

        return self.attendance_repository.update_attendance(
            attendance
        )

    def get_attendance_statistics(self):

        return self.attendance_repository.get_attendance_statistics()