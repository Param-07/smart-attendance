from ..repository.configuration import SchoolConfigurationRepository
from app.modules.school.repository import SchoolRepository
from ..exceptions import (
    SchoolConfigurationAlreadyExistsException,
    SchoolConfigurationNotFoundException,
)
from app.modules.school.exceptions import SchoolNotFoundException
from app.models import SchoolConfiguration


class SchoolConfigurationService:

    def __init__(self):

        self.school_repository = SchoolRepository()
        self.configuration_repository = SchoolConfigurationRepository()