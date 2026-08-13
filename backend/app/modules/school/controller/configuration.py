from flask import request

from app.core.enums import UserRole
from app.core.responses import ApiResponse
from app.modules.authentication.decorators import (
    auth_required,
    roles_required,
)

from ..service.configuration import SchoolConfigurationService

from ..schemas.request import (
    SchoolConfigurationUpdateRequestSchema,
)

from ..schemas.response import (
    SchoolConfigurationResponseSchema,
)


class SchoolConfigurationController:

    def __init__(self):

        self.service = SchoolConfigurationService()

        self.school_configuration_update_request_schema = SchoolConfigurationUpdateRequestSchema()

        self.school_configuration_response_schema = SchoolConfigurationResponseSchema()

    @auth_required
    @roles_required(UserRole.SUPER_ADMIN)
    def get_configuration(
        self,
        school_public_uuid,
    ):

        result = self.service.get_configuration(
            school_public_uuid,
        )

        response = (
            self.school_configuration_response_schema.dump(
                result
            )
        )

        return ApiResponse.success(
            message="School configuration fetched successfully.",
            data=response,
        )

    @auth_required
    @roles_required(UserRole.SUPER_ADMIN)
    def update_configuration(
        self,
        school_public_uuid,
    ):

        payload = (
            self.school_configuration_update_request_schema.load(
                request.get_json() or {}
            )
        )

        result = self.service.update_configuration(
            school_public_uuid,
            payload,
        )

        response = (
            self.school_configuration_response_schema.dump(
                result
            )
        )

        return ApiResponse.success(
            message="School configuration updated successfully.",
            data=response,
        )