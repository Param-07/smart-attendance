from .repository import TeacherRepository

from app.extensions import bcrypt
from app.models import Account, Teacher
from app.core.enums import UserRole
from app.modules.common.database.base_repository import BaseRepository
from app.modules.school.repository.school import SchoolRepository

from .exceptions import (
    UsernameAlreadyExistsException,
    OfficialEmailAlreadyExistsException,
    EmployeeCodeAlreadyExistsException,
    TeacherNotFoundException,
)

from app.modules.school.exceptions import (
    SchoolNotFoundException,
)


class TeacherService:

    def __init__(self):

        self.teacher_repository = TeacherRepository()
        self.base_repository = BaseRepository(Account)
        self.school_repository = SchoolRepository()

    # Create Teacher

    def create_teacher(
        self,
        data: dict,
        account: Account,
    ) -> Teacher:

        try:
            if self.base_repository.exists(
                username=data["username"]
            ):
                raise UsernameAlreadyExistsException()

            if self.teacher_repository.exists(
                employee_code=data["employee_code"]
            ):
                raise EmployeeCodeAlreadyExistsException()

            if self.teacher_repository.exists(
                official_email=data["official_email"]
            ):
                raise OfficialEmailAlreadyExistsException()

            # Determine School

            if account.role == UserRole.SCHOOL_ADMIN:

                if account.school_id is None:
                    raise SchoolNotFoundException()

                school = self.school_repository.get_by_id(
                    account.school_id
                )

            elif account.role == UserRole.SUPER_ADMIN:

                school_public_uuid = data.get(
                    "school_public_uuid"
                )

                if not school_public_uuid:
                    raise SchoolNotFoundException()

                school = self.school_repository.get_by_public_uuid(
                    school_public_uuid
                )

            else:
                raise TeacherNotFoundException()

            if school is None:
                raise SchoolNotFoundException()

            # Create Account

            password_hash = (
                bcrypt
                .generate_password_hash(
                    data["password"]
                )
                .decode("utf-8")
            )

            teacher_account = Account(
                username=data["username"],
                password_hash=password_hash,
                role=UserRole.TEACHER,
                school_id=school.id,
            )

            self.base_repository.add(
                teacher_account
            )

            self.base_repository.flush()

            # Create Teacher

            teacher = Teacher(
                school_id=school.id,
                account_id=teacher_account.id,
                employee_code=data["employee_code"],
                first_name=data["first_name"],
                middle_name=data.get("middle_name"),
                last_name=data["last_name"],
                display_name=data["display_name"],
                official_email=data["official_email"],
                mobile_number=data.get("mobile_number"),
                department=data["department"],
                designation=data["designation"],
                joining_date=data["joining_date"],
                remarks=data.get("remarks"),
            )

            self.teacher_repository.add(
                teacher
            )

            self.teacher_repository.commit()

            return teacher

        except Exception:
            self.teacher_repository.rollback()
            raise

    # Get Teacher

    def get_teacher_by_uuid(
        self,
        public_uuid: str,
        account: Account,
    ) -> Teacher:

        school_id = self._get_school_scope(
            account
        )

        teacher = self.teacher_repository.get_by_public_uuid(
            public_uuid=public_uuid,
            school_id=school_id,
        )

        if teacher is None:
            raise TeacherNotFoundException()

        return teacher

    # Get Teachers

    def get_teachers(
        self,
        filters: dict,
        account: Account,
    ):

        school_id = self._get_school_scope(
            account
        )

        return self.teacher_repository.get_teachers(
            school_id=school_id,
            search=filters.get("search"),
            department=filters.get("department"),
            designation=filters.get("designation"),
            gender=filters.get("gender"),
            is_active=filters.get("is_active"),
            page=filters.get("page"),
            page_size=filters.get("page_size"),
            sort_by=filters.get("sort_by"),
            order=filters.get("order"),
        )

    # Delete / Deactivate Teacher

    def delete_teacher(
        self,
        public_uuid: str,
        account: Account,
    ) -> None:

        teacher = self.get_teacher_by_uuid(
            public_uuid,
            account,
        )

        teacher.is_active = False

        self.teacher_repository.commit()

    # Update Teacher

    def update_teacher(
        self,
        public_uuid: str,
        data: dict,
        account: Account,
    ) -> Teacher:

        teacher = self.get_teacher_by_uuid(
            public_uuid,
            account,
        )

        if (
            teacher.employee_code != data["employee_code"]
            and self.teacher_repository.exists(
                employee_code=data["employee_code"]
            )
        ):
            raise EmployeeCodeAlreadyExistsException()

        if (
            teacher.official_email != data["official_email"]
            and self.teacher_repository.exists(
                official_email=data["official_email"]
            )
        ):
            raise OfficialEmailAlreadyExistsException()

        teacher.employee_code = data["employee_code"]
        teacher.first_name = data["first_name"]
        teacher.middle_name = data.get("middle_name")
        teacher.last_name = data["last_name"]
        teacher.display_name = data["display_name"]
        teacher.official_email = data["official_email"]
        teacher.mobile_number = data.get("mobile_number")
        teacher.department = data["department"]
        teacher.designation = data["designation"]
        teacher.employment_status = data["employment_status"]
        teacher.joining_date = data["joining_date"]
        teacher.remarks = data.get("remarks")

        self.teacher_repository.commit()

        return teacher

    # Statistics

    def get_stats(
        self,
        account: Account,
    ):

        school_id = self._get_school_scope(
            account
        )

        return self.teacher_repository.get_statistics(
            school_id=school_id
        )

    # Activation

    def update_activation(
        self,
        public_uuid: str,
        is_active: bool,
        account: Account,
    ):

        teacher = self.get_teacher_by_uuid(
            public_uuid,
            account,
        )

        teacher.is_active = is_active

        self.teacher_repository.commit()

        return teacher

    # School Scope

    @staticmethod
    def _get_school_scope(
        account: Account,
    ) -> int | None:

        if account.role == UserRole.SUPER_ADMIN:
            return None

        if account.role == UserRole.SCHOOL_ADMIN:

            if account.school_id is None:
                raise SchoolNotFoundException()

            return account.school_id

        if account.role == UserRole.TEACHER:

            if account.school_id is None:
                raise SchoolNotFoundException()

            return account.school_id

        raise TeacherNotFoundException()