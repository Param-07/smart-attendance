from __future__ import annotations
from typing import Optional

from sqlalchemy import or_

from app.models import School
from app.modules.common.database.base_repository import BaseRepository
from app.extensions import db
from app.core.pagination import PaginationResult

class SchoolRepository(BaseRepository[School]):

    SORTABLE_COLUMNS = {
        "name": School.name,
        "code": School.code,
        "email": School.email,
        "city": School.city,
        "state": School.state,
        "country": School.country,
        "created_at": School.created_at,
    }

    def __init__(self):
        super().__init__(School)

    def get_by_code(
            self,
            code: str
    ) -> School:

        return (
            db.session.query(School)
                .filter(
                    School.code == code
                )
                .first()
        )

    def get_active_schools(
            self
    ) -> Optional[School]:

        return (
            db.session.query(School)
                .filter(
                    School.is_active.is_(True)
                )
                .all()
        )

    def get_schools(
        self,
        *,
        search: str | None = None,
        city: str | None = None,
        state: str | None = None,
        country: str | None = None,
        is_active: bool | None = True,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "created_at",
        order: str = "desc",
    ) -> PaginationResult[School]:

        query = db.session.query(School)

        if city:
            query = query.filter(
                School.city == city
            )

        if state:
            query = query.filter(
                School.state == state
            )

        if country:
            query = query.filter(
                School.country == country
            )

        if is_active is not None:
            query = query.filter(
                School.is_active == is_active
            )

        if search:
            pattern = f"%{search}%"

            query = query.filter(
                or_(
                    School.name.ilike(pattern),
                    School.code.ilike(pattern),
                    School.email.ilike(pattern),
                )
            )

        sort_column = self.SORTABLE_COLUMNS.get(
            sort_by,
            School.created_at,
        )

        if order == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        total_records = query.count()

        schools = (
            query
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        return PaginationResult(
            items=schools,
            page=page,
            page_size=page_size,
            total_records=total_records,
        )


    def get_statistics(self) -> dict:

        total_schools = db.session.query(School).count()

        active_schools = (
            db.session.query(School)
            .filter(School.is_active.is_(True))
            .count()
        )

        inactive_schools = (
            db.session.query(School)
            .filter(School.is_active.is_(False))
            .count()
        )

        return {
            "total_schools": total_schools,
            "active_schools": active_schools,
            "inactive_schools": inactive_schools,
        }