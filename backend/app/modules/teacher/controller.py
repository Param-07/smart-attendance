from flask import request

from app.core.responses import ApiResponse
from app.core.enums import UserRole
from .schemas.request import TeacherCreateRequestSchema, TeacherUpdateRequestSchema, TeacherListRequestSchema
from .schemas.response import TeacherListResponseSchema, TeacherResponseSchema
from .service import TeacherService
from app.modules.authentication.decorators import auth_required, roles_required

class TeacherController:

    def __init__(self):
        self.service = TeacherService()
        self.teacher_list_request_schema = TeacherListRequestSchema()
        self.teacher_create_request_schema = TeacherCreateRequestSchema()
        self.teacher_update_request_schema = TeacherUpdateRequestSchema()
        self.teacher_response_schema = TeacherResponseSchema()
        self.teacher_list_response_schema = TeacherListResponseSchema()

    @auth_required
    @roles_required(UserRole.ADMIN)
    def add_teacher(self):

        payload = self.teacher_create_request_schema.load(
            request.get_json() or {}
        )

        result = self.service.create_teacher(data=payload)
        response = self.teacher_response_schema.dump(result)

        return ApiResponse.success(
            message= "Teacher created successfully",
            data= response
        )
    
    @auth_required
    @roles_required(UserRole.ADMIN)
    def get_all_teachers(self):

        filters = self.teacher_list_request_schema.load(
            request.args
        )

        result = self.service.get_teachers(filters)

        response = {
            "items": self.teacher_list_response_schema.dump(
                result.items,
                many=True,
            ),
            "pagination": {
                "page": result.page,
                "page_size": result.page_size,
                "total_records": result.total_records,
                "total_pages": result.total_pages,
                "has_next": result.has_next,
                "has_previous": result.has_previous,
            },
        }

        return ApiResponse.success(
            message="Teachers fetched successfully.",
            data=response,
        )

    @auth_required
    def get_teacher(self, uuid):

        result = self.service.get_teacher_by_uuid(uuid)
        response = self.teacher_response_schema.dump(result)

        return ApiResponse.success(
            message= "Success",
            data= response
        )
    
    @auth_required
    @roles_required(UserRole.ADMIN)
    def update_teacher(self, public_uuid):

        data = self.teacher_update_request_schema.load(
            request.get_json()
        )

        result = self.service.update_teacher(
            public_uuid,
            data
        )

        response = self.teacher_response_schema.dump(result)

        return ApiResponse.success(
            message= "Teacher updated successfully.",
            data= response
        )
    
    @auth_required
    @roles_required(UserRole.ADMIN)
    def delete_teacher(self, public_uuid):

        self.service.delete_teacher(public_uuid)

        return ApiResponse.success(
            message= "Teacher deleted successfully."
        )

