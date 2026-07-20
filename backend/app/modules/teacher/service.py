from sqlalchemy import or_

from .repository import TeacherRepository
from app.extensions import bcrypt
from app.models import Account
from app.models import Teacher
from app.core.enums import UserRole
from app.core.pagination import PaginationResult
from app.modules.common.database.base_repository import BaseRepository
from .exceptions import UsernameAlreadyExistsException, OfficialEmailAlreadyExistsException, EmployeeCodeAlreadyExistsException, TeacherNotFoundException

class TeacherService:

    def __init__(self):

        self.teacher_repository = TeacherRepository()
        self.base_repository = BaseRepository(Account)

    def create_teacher(self ,data: dict) -> Teacher:
        try:
            if self.base_repository.exists(username = data["username"]):
                raise UsernameAlreadyExistsException()
            if self.teacher_repository.exists(employee_code = data["employee_code"]):
                raise EmployeeCodeAlreadyExistsException()
            if self.teacher_repository.exists(official_email = data["official_email"]):
                raise OfficialEmailAlreadyExistsException()
            
            password_hash = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

            #create Account
            account = Account(
                username=data["username"],
                password_hash=password_hash,
                role=UserRole.TEACHER
            )

            self.base_repository.add(account)
            self.base_repository.flush()

            print("account created")
            teacher = Teacher(
                account_id=account.id,
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

            teacher = self.teacher_repository.add(teacher)
            self.teacher_repository.commit()
            
            return teacher
        except Exception as exc:
            self.teacher_repository.rollback()
            raise Exception(str(exc))
        
    def get_teacher_by_uuid(self, public_uuid: str) -> Teacher:
        
        teacher = self.teacher_repository.get_by_public_uuid(
                    public_uuid
                )
        if teacher is None:
            raise TeacherNotFoundException()
        
        return teacher
    
    def get_teachers(self, filters: dict):

        return self.teacher_repository.get_teachers(
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
    
    def delete_teacher(self, public_uuid: str) -> None:

        teacher = self.teacher_repository.get_by_public_uuid(public_uuid)
        teacher.is_active = False
        self.teacher_repository.commit()

    def update_teacher(self, public_uuid: str, data: dict) -> Teacher:

        teacher = self.teacher_repository.get_by_public_uuid(public_uuid)

        if (
            teacher.employee_code != data["employee_code"]
            and self.teacher_repository.exists(employee_code=data["employee_code"])
        ):
            raise EmployeeCodeAlreadyExistsException()

        if (
            teacher.official_email != data["official_email"]
            and self.teacher_repository.exists(official_email=data["official_email"])
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
    
    def get_stats(self):

        return self.teacher_repository.get_statistics()
    
    def update_activation(
        self,
        public_uuid: str,
        is_active: bool,
    ):

        teacher = self.teacher_repository.get_by_public_uuid(public_uuid)

        if teacher is None:
            raise TeacherNotFoundException()

        teacher.is_active = is_active

        self.teacher_repository.commit()

        return teacher

    
