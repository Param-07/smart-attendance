from datetime import date, datetime, timezone
from decimal import Decimal

from app.core.exceptions import ValidationException
from app.core.pagination import PaginationResult
from ..enums import AttendanceStatus
from app.modules.teacher.repository import TeacherRepository
from .repository import TeacherAttendanceRepository
from ..exceptions import (
    AttendanceAlreadyCheckedInException, 
    AttendanceCheckInFailedException, 
    AttendanceNotFoundException, 
    AttendanceCheckOutFailedException
)
from app.modules.teacher.exceptions import TeacherNotFoundException
from app.models import Attendance,Teacher

class TeacherAttendanceService:

    def __init__(self):
        self.attendance_repository = TeacherAttendanceRepository()
        self.teacher_repository = TeacherRepository()

    def get_attendance(self, public_uuid: str) -> Attendance:

        return self.attendance_repository.get_by_public_uuid(public_uuid)

    def get_my_attendance_today(self, public_uuid: str) -> Attendance:

        teacher = self._get_teacher_by_public_uuid(public_uuid)

        attendance = self.attendance_repository.get_today_attendance(
            teacher_id= teacher.id,
        )

        if attendance is None:
            raise AttendanceNotFoundException()
        
        return attendance
    
    def get_my_attendance_list(
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
        
        teacher = self.teacher_repository.get_by_public_uuid(public_uuid = teacher_public_uuid)

        if teacher is None:
            raise TeacherNotFoundException()
        
        today = date.today()

        if start_date is None:
            start_date = today.replace(day=1)

        if end_date is None:
            end_date = today

        if start_date > end_date:
            raise ValidationException("Start date cannot be after end date.")
        
        if page < 1:
            raise ValidationException("Page must be greater than 0.")

        if page_size < 1:
            raise ValidationException("Page size must be greater than 0.")

        if page_size > 100:
            raise ValidationException("Page size cannot exceed 100.")

        return self.attendance_repository.get_my_attendance_list(
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
    
    def check_in(
        self,
        *,
        public_uuid: str,
        latitude: Decimal,
        longitude: Decimal,
        accuracy: float,
    ) -> Attendance:
        
        teacher = self._get_teacher_by_public_uuid(public_uuid)

        existing_attendance = self.attendance_repository.get_today_attendance(
            teacher_id= teacher.id
        )

        if existing_attendance:
            raise AttendanceAlreadyCheckedInException()
        
        try:
            attendance = Attendance(
                teacher_id=teacher.id,
                attendance_date=date.today(),
                check_in_time=datetime.now(timezone.utc),
                check_in_latitude=latitude,
                check_in_longitude=longitude,
                check_in_accuracy=accuracy,
                status=AttendanceStatus.OPEN,
            )

            self.attendance_repository.add(attendance)
            self.attendance_repository.commit()

            return attendance
        
        except Exception as exc:
            self.attendance_repository.rollback()
            raise AttendanceCheckInFailedException()

    def check_out(
        self,
        *,
        public_uuid: str,
        latitude: Decimal,
        longitude: Decimal,
        accuracy: float,
    ) -> Attendance:
        
        teacher = self._get_teacher_by_public_uuid(public_uuid)

        attendance = self.attendance_repository.get_today_attendance(
            teacher_id= teacher.id
        )

        if attendance is None:
            raise AttendanceNotFoundException()
        
        attendance.check_out_time = datetime.now(timezone.utc)
        attendance.check_out_latitude = latitude
        attendance.check_out_longitude = longitude
        attendance.check_out_accuracy = accuracy
        attendance.status = AttendanceStatus.COMPLETED

        try:
            self.attendance_repository.commit()
            return attendance
        except Exception as exc:
            self.attendance_repository.rollback()
            raise AttendanceCheckOutFailedException()
        
    # Helper functions

    def _get_teacher_by_public_uuid(
        self,
        public_uuid: str,
    ) -> Teacher:
        teacher = self.teacher_repository.get_by_public_uuid(public_uuid)

        if teacher is None:
            raise TeacherNotFoundException()

        return teacher

