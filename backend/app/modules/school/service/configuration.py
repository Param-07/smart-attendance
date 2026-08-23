from app.models import Account

from app.core.enums import UserRole
from app.core.exceptions import ForbiddenException

from ..repository.school import SchoolRepository
from ..repository.configuration import SchoolConfigurationRepository
from ..exceptions import (
    ConfigurationNotFoundException,
    SchoolNotFoundException,
)


class SchoolConfigurationService:

    def __init__(self):

        self.school_repository = SchoolRepository()
        self.configuration_repository = (
            SchoolConfigurationRepository()
        )

    def get_configuration(
        self,
        school_id: int,
        current_user: Account,
    ):
        school = self.school_repository.get_by_id(school_id)

        if school is None:
            raise SchoolNotFoundException()
        
        configuration = self._get_configuration(
            school_public_uuid= school.public_uuid
        )

        if configuration is None:
            raise ConfigurationNotFoundException()

        return configuration

    def update_configuration(
        self,
        school_id: str,
        data: dict,
        current_user: Account,
    ):

        school = self.school_repository.get_by_id(school_id)
        
        if school is None:
            raise SchoolNotFoundException()
        
        configuration = self._get_configuration(
            school_public_uuid= school.public_uuid
        )

        self._authorize_school_access(
            configuration.school_id,
            current_user,
        )

        for field, value in data.items():

            setattr(
                configuration,
                field,
                value,
            )

        self.configuration_repository.commit()

        return configuration

    def _get_configuration(
        self,
        school_public_uuid: str,
    ):

        school = (
            self.school_repository.get_by_public_uuid(
                school_public_uuid
            )
        )

        if school is None:
            raise SchoolNotFoundException()

        configuration = (
            self.configuration_repository.get_by_school_id(
                school.id
            )
        )

        if configuration is None:
            raise ConfigurationNotFoundException()

        return configuration