from flask import request

from app.core.responses import ApiResponse
from app.core.exceptions import BadRequestException
from app.core.enums import UserRole

from .schema.response import TeacherFaceResponseSchema
from .service import TeacherFaceService

from app.modules.authentication.decorators import (
    auth_required,
    roles_required,
)
from app.modules.authentication.service import AuthService


class TeacherFaceController:

    def __init__(self):

        self.service = TeacherFaceService()
        self.auth_service = AuthService()

        self.response_schema = TeacherFaceResponseSchema()

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def register_face(self, teacher_public_uuid):

        uploaded_file = request.files.get("selfie")

        if uploaded_file is None:
            raise BadRequestException(
                "Selfie image is required."
            )

        current_user = self.auth_service.get_current_user()

        teacher_face = self.service.register_face(
            teacher_public_uuid,
            uploaded_file,
            current_user,
        )

        response = self.response_schema.dump(
            teacher_face
        )

        return ApiResponse.success(
            message="Face registered successfully.",
            data=response,
        )

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def update_face(self, teacher_public_uuid):

        uploaded_file = request.files.get("selfie")

        if uploaded_file is None:
            raise BadRequestException(
                "Selfie image is required."
            )

        current_user = self.auth_service.get_current_user()

        teacher_face = self.service.replace_face(
            teacher_public_uuid,
            uploaded_file,
            current_user,
        )

        response = self.response_schema.dump(
            teacher_face
        )

        return ApiResponse.success(
            message="Face updated successfully.",
            data=response,
        )

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def get_face(self, teacher_public_uuid):

        current_user = self.auth_service.get_current_user()

        teacher_face = self.service.get_registered_face(
            teacher_public_uuid,
            current_user,
        )

        response = self.response_schema.dump(
            teacher_face
        )

        return ApiResponse.success(
            message="Face retrieved successfully.",
            data=response,
        )

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def delete_face(self, teacher_public_uuid):

        current_user = self.auth_service.get_current_user()

        self.service.delete_face(
            teacher_public_uuid,
            current_user,
        )

        return ApiResponse.success(
            message="Face deleted successfully."
        )