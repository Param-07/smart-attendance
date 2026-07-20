from __future__ import annotations

from sqlalchemy import or_, case, func

from app.extensions import db
from app.models import Teacher
from app.core.pagination import PaginationResult
from app.modules.common.database.base_repository import BaseRepository

class TeacherRepository(BaseRepository[Teacher]):
    """
    Repository responsible for Teacher related
    database operations.
    """
    
    SORTABLE_COLUMNS = {
        "first_name": Teacher.first_name,
        "last_name": Teacher.last_name,
        "employee_code": Teacher.employee_code,
        "official_email": Teacher.official_email,
        "department": Teacher.department,
        "designation": Teacher.designation,
        "created_at": Teacher.created_at,
    }

    def __init__(self):
        super().__init__(Teacher)

    def get_by_employee_code(self, employee_code: str) -> Teacher | None:
        return (
            db.session.query(Teacher)
                .filter(Teacher.employee_code == employee_code)
                .first()
        )
    
    def get_by_official_email(self, email: str) -> Teacher | None:
        return (
            db.session.query(Teacher)
                .filter(Teacher.official_email ==  email)
                .first()
        )
    
    def get_by_account_id(self, account_id) -> Teacher | None:
        return (
            db.session.query(Teacher)
                .filter(Teacher.account_id == account_id)
                .first()
        )
    
    def get_active_teachers(self) -> list[Teacher]:
        return (
            db.session.query(Teacher)
                .filter(
                    Teacher.is_active.is_(True)
                )
                .all()
        )
    
    def get_face_registered_teachers(self) -> list[Teacher]:
        return (
            db.session.query(Teacher)
                .filter(
                    Teacher.face_registered.is_(True)
                )
                .all()
        )
    
    def get_teachers(
        self,
        *,
        search: str | None = None,
        department: str | None = None,
        designation: str | None = None,
        gender: str | None = None,
        is_active: bool | None = True,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "created_at",
        order: str = "desc",
    ) -> PaginationResult[Teacher]:

        query = db.session.query(Teacher)

        if department:
            query = query.filter(
                Teacher.department == department
            )

        if designation:
            query = query.filter(
                Teacher.designation == designation
            )

        if gender:
            query = query.filter(
                Teacher.gender == gender
            )

        if is_active is not None:
            query = query.filter(
                Teacher.is_active == is_active
            )

        if search:
            pattern = f"%{search}%"

            query = query.filter(
                or_(
                    Teacher.first_name.ilike(pattern),
                    Teacher.last_name.ilike(pattern),
                    Teacher.employee_code.ilike(pattern),
                    Teacher.official_email.ilike(pattern),
                )
            )

        sort_column = self.SORTABLE_COLUMNS.get(
            sort_by,
            Teacher.created_at,
        )

        if order == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        total_records = query.count()

        teachers = (
            query
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        return PaginationResult(
            items=teachers,
            page=page,
            page_size=page_size,
            total_records=total_records,
        )
    
    def get_statistics(self):

        stats = (
            db.session.query(
                func.count(Teacher.id).label("total_teachers"),

                func.sum(
                    case(
                        (Teacher.is_active.is_(True), 1),
                        else_=0
                    )
                ).label("active_teachers"),

                func.sum(
                    case(
                        (Teacher.is_active.is_(False), 1),
                        else_= 0
                    )
                ).label("inactive_teachers"),

                func.sum(
                    case(
                        (Teacher.face_registered.is_(True), 1),
                        else_=0,
                    )
                ).label("face_registered"),

                func.sum(
                    case(
                        (Teacher.face_registered.is_(False), 1),
                        else_=0,
                    )
                ).label("face_not_registered")
            ).one()
        )

        return {
            "total_teachers": stats.total_teachers,
            "active_teachers": stats.active_teachers or 0,
            "inactive_teachers": stats.inactive_teachers or 0,
            "face_registered": stats.face_registered or 0,
            "face_not_registered": stats.face_not_registered or 0,
        }
    
    def update_activation(
        self,
        teacher: Teacher,
        is_active: bool,
    ):

        teacher.is_active = is_active

        self.commit()