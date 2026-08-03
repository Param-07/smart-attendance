from flask import request

from app.core.enums import UserRole
from app.core.responses import ApiResponse
from app.modules.authentication.decorators import (
    auth_required,
    roles_required,
)

from ..schemas.request import (
    CreateSchoolRequestSchema,
    SchoolListRequestSchema,
    UpdateSchoolRequestSchema,
    SchoolActivationRequestSchema
)

from ..schemas.response import (
    SchoolResponseSchema,
    SchoolStatisticsResponseSchema,
    SchoolListResponseSchema
)

from ..service.school import SchoolService


class SchoolController:

    def __init__(self):

        self.service = SchoolService()

        self.school_list_request_schema = SchoolListRequestSchema()
        self.school_create_request_schema = CreateSchoolRequestSchema()
        self.school_update_request_schema = UpdateSchoolRequestSchema()
        self.school_activation_request_schema = SchoolActivationRequestSchema()

        self.school_response_schema = SchoolResponseSchema()
        self.school_statistics_response_schema = SchoolStatisticsResponseSchema()
        self.school_list_response_schema = SchoolListResponseSchema()

    @auth_required
    @roles_required(UserRole.ADMIN)
    def add_school(self):

        payload = self.school_create_request_schema.load(
            request.get_json() or {}
        )

        result = self.service.create_school(
            data=payload
        )

        response = self.school_response_schema.dump(result)

        return ApiResponse.success(
            message="School created successfully.",
            data=response,
        )

    @auth_required
    @roles_required(UserRole.ADMIN)
    def get_all_schools(self):

        filters = self.school_list_request_schema.load(
            request.args
        )

        result = self.service.get_schools(filters)

        response = {
            "items": self.school_list_request_schema.dump(
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
            message="Schools fetched successfully.",
            data=response,
        )

    @auth_required
    @roles_required(UserRole.ADMIN)
    def get_school(
        self,
        public_uuid,
    ):

        result = self.service.get_school_by_uuid(
            public_uuid
        )

        response = self.school_response_schema.dump(
            result
        )

        return ApiResponse.success(
            message="Success",
            data=response,
        )

    @auth_required
    @roles_required(UserRole.ADMIN)
    def update_school(
        self,
        public_uuid,
    ):

        payload = self.school_update_request_schema.load(
            request.get_json() or {}
        )

        result = self.service.update_school(
            public_uuid,
            payload,
        )

        response = self.school_response_schema.dump(
            result
        )

        return ApiResponse.success(
            message="School updated successfully.",
            data=response,
        )

    @auth_required
    @roles_required(UserRole.ADMIN)
    def get_statistics(self):

        result = self.service.get_statistics()

        response = self.school_statistics_response_schema.dump(
            result
        )

        return ApiResponse.success(
            message="School statistics fetched successfully.",
            data=response,
        )

    @auth_required
    @roles_required(UserRole.ADMIN)
    def update_activation(
        self,
        public_uuid,
    ):

        payload = self.school_activation_request_schema.load(
            request.get_json() or {}
        )

        school = self.service.update_activation(
            public_uuid,
            payload["is_active"],
        )

        return ApiResponse.success(
            message=(
                "School activated successfully."
                if school.is_active
                else "School deactivated successfully."
            ),
            data=self.school_response_schema.dump(
                school
            ),
        )