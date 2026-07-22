from datetime import date

from app.models import Attendance
from app.core.pagination import PaginationResult
from app.modules.teacher.exceptions import TeacherNotFoundException
from app.core.exceptions import ValidationException
from .repository import AdminAttendanceRepository
from ..enums import AttendanceStatus

class AdminAttendanceService:

    def __init__(self):
        self.attendance_repository = AdminAttendanceRepository()

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

        teacher_id = None

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