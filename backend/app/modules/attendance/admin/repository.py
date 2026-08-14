from __future__ import annotations

from datetime import date

from sqlalchemy import func, or_

from app.extensions import db
from app.modules.common.database.base_repository import BaseRepository
from app.models import Attendance, Teacher
from app.core.pagination import PaginationResult
from ..enums import AttendanceStatus


class AdminAttendanceRepository(BaseRepository[Attendance]):

    SORTABLE_COLUMNS = {
        "attendance_date": Attendance.attendance_date,
        "check_in_time": Attendance.check_in_time,
        "check_out_time": Attendance.check_out_time,
        "status": Attendance.status,
        "created_at": Attendance.created_at,
    }

    def __init__(self):
        super().__init__(Attendance)

    def get_attendance_list(
        self,
        *,
        school_id: int | None = None,
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

        if school_id is not None:
            query = query.filter(
                Teacher.school_id == school_id
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
            pattern = f"%{search.strip()}%"

            query = query.filter(
                or_(
                    Teacher.first_name.ilike(pattern),
                    Teacher.middle_name.ilike(pattern),
                    Teacher.last_name.ilike(pattern),
                    Teacher.display_name.ilike(pattern),
                    Teacher.employee_code.ilike(pattern),
                )
            )

        query = self._apply_sorting(
            query,
            sort_by,
            order,
        )

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

    def get_by_public_uuid(
        self,
        public_uuid: str,
        school_id: int | None = None,
    ) -> Attendance | None:

        query = (
            db.session.query(Attendance)
            .join(Teacher)
            .filter(
                Attendance.public_uuid == public_uuid
            )
        )

        if school_id is not None:
            query = query.filter(
                Teacher.school_id == school_id
            )

        return query.first()

    def update_attendance(
        self,
        attendance: Attendance,
    ) -> Attendance:

        db.session.commit()

        return attendance

    def get_attendance_statistics(
        self,
        *,
        school_id: int | None = None,
    ) -> dict:

        today = date.today()

        teacher_query = db.session.query(Teacher.id).filter(
            Teacher.is_active.is_(True)
        )

        if school_id is not None:
            teacher_query = teacher_query.filter(
                Teacher.school_id == school_id
            )

        total_teachers = teacher_query.count()

        base_query = (
            db.session.query(Attendance)
            .join(Teacher)
            .filter(
                Attendance.attendance_date == today
            )
        )

        if school_id is not None:
            base_query = base_query.filter(
                Teacher.school_id == school_id
            )

        present = (
            base_query
            .with_entities(Attendance.teacher_id)
            .distinct()
            .count()
        )

        completed = (
            base_query
            .filter(
                Attendance.status.in_(
                    [
                        AttendanceStatus.COMPLETED,
                        AttendanceStatus.CORRECTED,
                    ]
                )
            )
            .with_entities(Attendance.teacher_id)
            .distinct()
            .count()
        )

        pending_checkout = (
            base_query
            .filter(
                Attendance.status == AttendanceStatus.OPEN
            )
            .with_entities(Attendance.teacher_id)
            .distinct()
            .count()
        )

        absent = max(
            total_teachers - present,
            0,
        )

        attendance_percentage = 0.0

        if total_teachers > 0:
            attendance_percentage = round(
                (present / total_teachers) * 100,
                2,
            )

        return {
            "total_teachers": total_teachers,
            "present": present,
            "absent": absent,
            "completed": completed,
            "pending_checkout": pending_checkout,
            "attendance_percentage": attendance_percentage,
        }

    def get_attendance_report(
        self,
        *,
        school_id: int | None = None,
        teacher_id: int | None = None,
        search: str | None = None,
        status: AttendanceStatus | None = None,
        start_date: date,
        end_date: date,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "attendance_date",
        order: str = "desc",
    ) -> PaginationResult[Attendance]:

        query = self._build_attendance_report_query(
            school_id=school_id,
            teacher_id=teacher_id,
            search=search,
            status=status,
            start_date=start_date,
            end_date=end_date,
        )

        total_records = query.count()

        query = self._apply_sorting(
            query,
            sort_by,
            order,
        )

        items = (
            query
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        return PaginationResult(
            items=items,
            page=page,
            page_size=page_size,
            total_records=total_records,
        )

    def get_attendance_report_export(
        self,
        *,
        school_id: int | None = None,
        teacher_id: int | None = None,
        search: str | None = None,
        status: AttendanceStatus | None = None,
        start_date: date,
        end_date: date,
        sort_by: str = "attendance_date",
        order: str = "desc",
    ) -> list[Attendance]:

        query = self._build_attendance_report_query(
            school_id=school_id,
            teacher_id=teacher_id,
            search=search,
            status=status,
            start_date=start_date,
            end_date=end_date,
        )

        query = self._apply_sorting(
            query,
            sort_by,
            order,
        )

        return query.all()

    def _build_attendance_report_query(
        self,
        *,
        school_id: int | None = None,
        teacher_id: int | None = None,
        search: str | None = None,
        status: AttendanceStatus | None = None,
        start_date: date,
        end_date: date,
    ):

        query = (
            db.session.query(Attendance)
            .join(Teacher)
        )

        query = query.filter(
            Attendance.attendance_date >= start_date,
            Attendance.attendance_date <= end_date,
        )

        if school_id is not None:
            query = query.filter(
                Teacher.school_id == school_id
            )

        if teacher_id is not None:
            query = query.filter(
                Attendance.teacher_id == teacher_id
            )

        if status is not None:
            query = query.filter(
                Attendance.status == status
            )

        if search:
            pattern = f"%{search.strip()}%"

            query = query.filter(
                or_(
                    Teacher.employee_code.ilike(pattern),
                    Teacher.first_name.ilike(pattern),
                    Teacher.middle_name.ilike(pattern),
                    Teacher.last_name.ilike(pattern),
                    Teacher.display_name.ilike(pattern),
                )
            )

        return query

    def _apply_sorting(
        self,
        query,
        sort_by: str,
        order: str,
    ):

        sort_column = self.SORTABLE_COLUMNS.get(
            sort_by,
            Attendance.attendance_date,
        )

        if order.lower() == "asc":
            return query.order_by(
                sort_column.asc()
            )

        return query.order_by(
            sort_column.desc()
        )