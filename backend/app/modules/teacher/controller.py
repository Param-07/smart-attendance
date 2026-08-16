from flask import request

from app.core.responses import ApiResponse
from app.core.enums import UserRole

from .schemas.request import (
    TeacherCreateRequestSchema,
    TeacherUpdateRequestSchema,
    TeacherListRequestSchema,
    TeacherActivationRequestSchema,
)

from .schemas.response import (
    TeacherListResponseSchema,
    TeacherResponseSchema,
    TeacherStatisticsResponseSchema,
)

from .service import TeacherService

from app.modules.authentication.decorators import (
    auth_required,
    roles_required,
)

from app.modules.authentication.service import AuthService


class TeacherController:

    def __init__(self):

        self.service = TeacherService()
        self.auth_service = AuthService()

        self.teacher_activation_request_schema = (
            TeacherActivationRequestSchema()
        )

        self.teacher_list_request_schema = (
            TeacherListRequestSchema()
        )

        self.teacher_create_request_schema = (
            TeacherCreateRequestSchema()
        )

        self.teacher_update_request_schema = (
            TeacherUpdateRequestSchema()
        )

        self.teacher_response_schema = (
            TeacherResponseSchema()
        )

        self.teacher_list_response_schema = (
            TeacherListResponseSchema()
        )

        self.teacher_statistics_response_schema = (
            TeacherStatisticsResponseSchema()
        )

    # Create Teacher

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def add_teacher(self):

        account = self.auth_service.get_current_user()

        payload = self.teacher_create_request_schema.load(
            request.get_json() or {}
        )

        result = self.service.create_teacher(
            data=payload,
            account=account,
        )

        response = self.teacher_response_schema.dump(
            result
        )

        return ApiResponse.success(
            message="Teacher created successfully.",
            data=response,
        )

    # Get All Teachers

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def get_all_teachers(self):

        account = self.auth_service.get_current_user()

        filters = self.teacher_list_request_schema.load(
            request.args
        )

        result = self.service.get_teachers(
            filters=filters,
            account=account,
        )

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

    # Get Teacher

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def get_teacher(
        self,
        public_uuid,
    ):

        account = self.auth_service.get_current_user()

        result = self.service.get_teacher_by_uuid(
            public_uuid=public_uuid,
            account=account,
        )

        response = self.teacher_response_schema.dump(
            result
        )

        return ApiResponse.success(
            message="Teacher retrieved successfully.",
            data=response,
        )

    # Update Teacher

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def update_teacher(
        self,
        public_uuid,
    ):

        account = self.auth_service.get_current_user()

        data = self.teacher_update_request_schema.load(
            request.get_json() or {}
        )

        result = self.service.update_teacher(
            public_uuid=public_uuid,
            data=data,
            account=account,
        )

        response = self.teacher_response_schema.dump(
            result
        )

        return ApiResponse.success(
            message="Teacher updated successfully.",
            data=response,
        )

    # Delete / Deactivate Teacher

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def delete_teacher(
        self,
        public_uuid,
    ):

        account = self.auth_service.get_current_user()

        self.service.delete_teacher(
            public_uuid=public_uuid,
            account=account,
        )

        return ApiResponse.success(
            message="Teacher deleted successfully.",
        )

    # Teacher Statistics

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def get_statsistics(self):

        account = self.auth_service.get_current_user()

        result = self.service.get_stats(
            account=account,
        )

        response = (
            self.teacher_statistics_response_schema.dump(
                result
            )
        )

        return ApiResponse.success(
            message="Teacher statistics fetched successfully.",
            data=response,
        )

    # Teacher Activation

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def update_activation(
        self,
        public_uuid,
    ):

        account = self.auth_service.get_current_user()

        payload = self.teacher_activation_request_schema.load(
            request.get_json() or {}
        )

        teacher = self.service.update_activation(
            public_uuid=public_uuid,
            is_active=payload["is_active"],
            account=account,
        )

        return ApiResponse.success(
            message=(
                "Teacher activated successfully."
                if teacher.is_active
                else "Teacher deactivated successfully."
            ),
            data=self.teacher_response_schema.dump(
                teacher
            ),
        )