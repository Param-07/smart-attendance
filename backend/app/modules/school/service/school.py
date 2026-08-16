from app.models import School, SchoolConfiguration
from app.models.account import Account

from app.core.enums import (
    AccountStatus,
    UserRole,
)

from app.modules.authentication.repository import AuthRepository
from app.modules.authentication.utils import AuthUtils
from app.modules.authentication.exceptions import (
    AccountUsernameAlreadyExistsException,
)

from ..repository.school import SchoolRepository
from ..repository.configuration import (
    SchoolConfigurationRepository,
)

from ..exceptions import (
    SchoolCodeAlreadyExistsException,
    SchoolEmailAlreadyExistsException,
    SchoolNotFoundException,
)


class SchoolService:

    def __init__(self):

        self.school_repository = SchoolRepository()

        self.configuration_repository = (
            SchoolConfigurationRepository()
        )

        self.auth_repository = AuthRepository()

    # Create School

    def create_school(
        self,
        data: dict,
    ) -> dict:

        school_data = data["school"]
        admin_data = data["admin"]

        # Validate School

        if self.school_repository.exists(
            code=school_data["code"]
        ):
            raise SchoolCodeAlreadyExistsException()

        if self.school_repository.exists(
            email=school_data["email"]
        ):
            raise SchoolEmailAlreadyExistsException()

        # Validate School Admin Username

        if self.auth_repository.get_by_username(
            admin_data["username"]
        ) is not None:

            raise AccountUsernameAlreadyExistsException()

        # Generate Temporary Password

        temporary_password = (
            AuthUtils.generate_temporary_password()
        )

        password_hash = AuthUtils.hash_password(
            temporary_password
        )

        try:

            # Create School

            school = School(
                name=school_data["name"],
                code=school_data["code"],
                email=school_data["email"],
                phone=school_data.get("phone"),
                website=school_data.get("website"),
                address=school_data["address"],
                city=school_data["city"],
                state=school_data["state"],
                country=school_data["country"],
                postal_code=school_data.get("postal_code"),
                logo_path=school_data.get("logo_path"),
                timezone=school_data["timezone"],
            )

            self.school_repository.add(school)

            # Generate school.id before creating
            # related records.
            self.school_repository.flush()

            # Create School Configuration

            configuration = SchoolConfiguration(
                school_id=school.id,
            )

            self.configuration_repository.add(
                configuration
            )

            # Create School Admin Account

            admin_account = Account(
                username=admin_data["username"],
                password_hash=password_hash,
                role=UserRole.SCHOOL_ADMIN,
                account_status=AccountStatus.ACTIVE,
                password_reset_required=True,
                school_id=school.id,
            )

            self.auth_repository.create_account(
                admin_account
            )

            # Commit Transaction

            self.school_repository.commit()

            return {
                "school": school,
                "admin": admin_account,
                "temporary_password": temporary_password,
            }

        except Exception:
            self.school_repository.rollback()
            raise

    # Get own school
    
    def get_my_school(
        self,
        account: Account,
    ) -> School:

        if account.school_id is None:
            raise SchoolNotFoundException()

        school = self.school_repository.get_by_id(
            account.school_id
        )

        if school is None:
            raise SchoolNotFoundException()

        return school
    
    # Get School

    def get_school_by_uuid(
        self,
        public_uuid: str,
    ) -> School:

        school = (
            self.school_repository.get_by_public_uuid(
                public_uuid
            )
        )

        if school is None:
            raise SchoolNotFoundException()

        return school

    # Get Schools

    def get_schools(
        self,
        filters: dict,
    ):

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

    # Update School

    def update_school(
        self,
        public_uuid: str,
        data: dict,
    ) -> School:

        school = (
            self.school_repository.get_by_public_uuid(
                public_uuid
            )
        )

        if school is None:
            raise SchoolNotFoundException()

        if (
            school.code != data["code"]
            and self.school_repository.exists(
                code=data["code"]
            )
        ):
            raise SchoolCodeAlreadyExistsException()

        if (
            school.email != data["email"]
            and self.school_repository.exists(
                email=data["email"]
            )
        ):
            raise SchoolEmailAlreadyExistsException()

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

    # Update Activation

    def update_activation(
        self,
        public_uuid: str,
        is_active: bool,
    ) -> School:

        school = (
            self.school_repository.get_by_public_uuid(
                public_uuid
            )
        )

        if school is None:
            raise SchoolNotFoundException()

        school.is_active = is_active

        self.school_repository.commit()

        return school

    # Statistics

    def get_statistics(self):

        return self.school_repository.get_statistics()