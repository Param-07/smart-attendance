from datetime import date

from sqlalchemy import or_

from app.extensions import db
from ..enums import AttendanceStatus
from app.core.pagination import PaginationResult
from app.modules.common.database.base_repository import BaseRepository
from app.models import Attendance, Teacher


class TeacherAttendanceRepository(BaseRepository[Attendance]):
    SORTABLE_COLUMNS = {
        "attendance_date": Attendance.attendance_date,
        "check_in_time": Attendance.check_in_time,
        "check_out_time": Attendance.check_out_time,
        "created_at": Attendance.created_at,
    }

    def __init__(self):
        super().__init__(Attendance)

    def get_today_attendance(
        self,
        teacher_id: int
    ) -> Attendance | None:
        return (
            db.session.query(Attendance)
            .filter(
                Attendance.teacher_id == teacher_id,
                Attendance.attendance_date == date.today(),
            )
            .first()
        )

    def get_open_attendance(
        self,
        teacher_id: int,
        attendance_date: date,
    ) -> Attendance | None:
        return (
            db.session.query(Attendance)
            .filter(
                Attendance.teacher_id == teacher_id,
                Attendance.attendance_date == attendance_date,
                Attendance.status == AttendanceStatus.OPEN,
            )
            .first()
        )

    def get_my_attendance_list(
        self,
        *,
        teacher_id: int | None = None,
        search: str | None = None,
        status: AttendanceStatus | None = None,
        start_date: date | None = None,
        end_date: date | None = None,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "attendance_date",
        order: str = "desc",
    ) -> PaginationResult[Attendance]:

        query = db.session.query(Attendance)

        if search:
            query = query.join(Teacher)

        if teacher_id is not None:
            query = query.filter(
                Attendance.teacher_id == teacher_id
            )

        if status is not None:
            query = query.filter(
                Attendance.status == status
            )

        if start_date is not None:
            query = query.filter(
                Attendance.attendance_date >= start_date
            )

        if end_date is not None:
            query = query.filter(
                Attendance.attendance_date <= end_date
            )

        if search:
            pattern = f"%{search}%"

            query = query.filter(
                or_(
                    Teacher.first_name.ilike(pattern),
                    Teacher.last_name.ilike(pattern),
                    Teacher.employee_code.ilike(pattern),
                )
            )

        sort_column = self.SORTABLE_COLUMNS.get(
            sort_by,
            Attendance.attendance_date,
        )

        if order == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        total_records = query.count()

        attendance_records = (
            query
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        return PaginationResult(
            items=attendance_records,
            page=page,
            page_size=page_size,
            total_records=total_records,
        )