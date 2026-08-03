from app.models import School, SchoolConfiguration

from ..repository.school import SchoolRepository
from ..repository.configuration import SchoolConfigurationRepository
from ..exceptions import (
    SchoolCodeAlreadyExistsException,
    SchoolNotFoundException,
    InvalidEmailException
)

class SchoolService:

    def __init__(self):

        self.school_repository = SchoolRepository()
        self.configuration_repository = SchoolConfigurationRepository()

    def create_school(
            self,
            data: dict
    ) -> School:

        school = self.school_repository.get_by_code(code= data["code"])

        if school:
            raise SchoolCodeAlreadyExistsException()

        if self.school_repository.exists(data["email"]):
            raise InvalidEmailException()

        school = School(
            name=data["name"],
            code=data["code"],
            email=data["email"],
            phone=data.get("phone"),
            website=data.get("website"),
            address=data["address"],
            city=data["city"],
            state=data["state"],
            country=data["country"],
            postal_code=data.get("postal_code"),
            logo_path=data.get("logo_path"),
            timezone=data["timezone"],
        )

        try:
            school = self.school_repository.add(school)
            self.school_repository.flush()

            configuration = SchoolConfiguration(
                school_id = school.id
            )

            self.configuration_repository.add(configuration)
            
            self.school_repository.commit()

            return school
        except Exception:
            self.school_repository.rollback()
            raise

    def get_school_by_uuid(
            self,
            public_uuid: str
    ) -> School:

        school = self.school_repository.get_by_public_uuid(public_uuid)

        if school is None:
            raise SchoolNotFoundException()

        return school

    def get_schools(self, filters: dict):

        return self.school_repository.get_schools(
            search=filters.get("search"),
            country=filters.get("country"),
            state=filters.get("state"),
            city=filters.get("city"),
            is_active=filters.get("is_active"),
            page=filters.get("page"),
            page_size=filters.get("page_size"),
            sort_by=filters.get("sort_by"),
            order=filters.get("order"),
        )

    def update_school(
            self,
            public_uuid: str,
            data: dict
    ) -> School:

        school = self.school_repository.get_by_public_uuid(public_uuid)

        if school is None:
            raise SchoolNotFoundException()

        if ( school.code != data["code"] and 
            self.school_repository.exists(data["code"])
        ):
            raise SchoolCodeAlreadyExistsException()

        school.name = data["name"]
        school.code = data["code"]
        school.email = data["email"]
        school.phone = data.get("phone")
        school.website = data.get("website")
        school.address = data["address"]
        school.city = data["city"]
        school.state = data["state"]
        school.country = data["country"]
        school.postal_code = data.get("postal_code")
        school.logo_path = data.get("logo_path")
        school.timezone = data["timezone"]

        self.school_repository.commit()

        return school

    def update_activation(
        self,
        public_uuid: str,
        is_active: bool,
    ) -> School:

        school = self.school_repository.get_by_public_uuid(
            public_uuid
        )

        if school is None:
            raise SchoolNotFoundException()

        school.is_active = is_active

        self.school_repository.commit()

        return school

    def get_statistics(self):

        return self.school_repository.get_statistics()