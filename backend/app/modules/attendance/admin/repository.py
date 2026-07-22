from datetime import date

from sqlalchemy import or_

from app.extensions import db
from app.modules.common.database.base_repository import BaseRepository
from app.models import Attendance, Teacher
from app.core.pagination import PaginationResult
from ..enums import AttendanceStatus

class AdminAttendanceRepository(BaseRepository[Attendance]):

    def __init__(self, model):
        super().__init__(model)

    SORTABLE_COLUMNS = {
        "attendance_date": Attendance.attendance_date,
        "check_in_time": Attendance.check_in_time,
        "check_out_time": Attendance.check_out_time,
        "status": Attendance.status,
        "created_at": Attendance.created_at,
    }

    def get_attendance_list(
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

        query = (
            db.session.query(Attendance)
            .join(Teacher)
        )

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
                    Teacher.middle_name.ilike(pattern),
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