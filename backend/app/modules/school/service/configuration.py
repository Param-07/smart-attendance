from ..repository.school import SchoolRepository
from ..repository.configuration import SchoolConfigurationRepository
from ..exceptions import ConfigurationNotFoundException, SchoolNotFoundException

from app.models import SchoolConfiguration
class SchoolConfigurationService:

    def __init__(self):

        self.school_repository = SchoolRepository()
        self.configuration_repository = SchoolConfigurationRepository()

    def get_configuration(
        self,
        school_public_uuid: str,
    ):

        return self._get_configuration(
            school_public_uuid
        )

    def update_configuration(
        self,
        school_public_uuid: str,
        data: dict,
    ):

        configuration = self._get_configuration(
            school_public_uuid
        )

        for field, value in data.items():
            setattr(
                configuration,
                field,
                value,
            )

        self.configuration_repository.commit()

        return configuration

    
    # Private Helper

    def _get_configuration(
        self,
        school_public_uuid: str,
    ):

        school = self.school_repository.get_by_public_uuid(
            school_public_uuid
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