from __future__ import annotations

from app.models import SchoolConfiguration, School
from app.modules.common.database.base_repository import BaseRepository
from app.extensions import db


class SchoolConfigurationRepository(
    BaseRepository[SchoolConfiguration]
):

    def __init__(self):
        super().__init__(SchoolConfiguration)

    def get_by_school_id(
        self,
        school_id: int,
    ) -> SchoolConfiguration | None:

        return (
            db.session.query(SchoolConfiguration)
            .filter(
                SchoolConfiguration.school_id == school_id
            )
            .first()
        )

    def get_by_school_public_uuid(
        self,
        public_uuid: str,
    ) -> SchoolConfiguration | None:

        return (
            db.session.query(SchoolConfiguration)
            .join(School)
            .filter(
                School.public_uuid == public_uuid
            )
            .first()
        )