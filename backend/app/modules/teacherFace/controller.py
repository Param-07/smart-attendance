from flask import request
from flask_jwt_extended import get_jwt_identity

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
from app.services.storage.selfie_storage_service import StorageService


class TeacherFaceController:

    def __init__(self):

        self.service = TeacherFaceService()
        self.auth_service = AuthService()
        self.storage_service = StorageService()

        self.response_schema = TeacherFaceResponseSchema()

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
        UserRole.TEACHER,
    )
    def register_face(self):

        account_uuid = get_jwt_identity()
        uploaded_file = request.files.get("selfie")

        if uploaded_file is None:
            raise BadRequestException(
                "Selfie image is required."
            )

        current_user = self.auth_service.get_current_user()

        teacher_face = self.service.register_face(
            account_uuid,
            uploaded_file,
            current_user,
        )

        response = self._serialize_face(teacher_face)

        return ApiResponse.success(
            message="Face registered successfully.",
            data=response,
        )

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
        UserRole.TEACHER,
    )
    def update_face(self):

        account_uuid = get_jwt_identity()
        uploaded_file = request.files.get("selfie")

        if uploaded_file is None:
            raise BadRequestException(
                "Selfie image is required."
            )

        current_user = self.auth_service.get_current_user()

        teacher_face = self.service.replace_face(
            account_uuid,
            uploaded_file,
            current_user,
        )

        response = self._serialize_face(teacher_face)

        return ApiResponse.success(
            message="Face updated successfully.",
            data=response,
        )

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
        UserRole.TEACHER,
    )
    def get_face(self):

        account_uuid = get_jwt_identity()
        current_user = self.auth_service.get_current_user()

        teacher_face = self.service.get_registered_face(
            account_uuid,
            current_user,
        )

        response = self._serialize_face(teacher_face)

        return ApiResponse.success(
            message="Face retrieved successfully.",
            data=response,
        )

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
        UserRole.TEACHER,
    )
    def delete_face(self):

        account_uuid = get_jwt_identity()
        current_user = self.auth_service.get_current_user()

        self.service.delete_face(
            account_uuid,
            current_user,
        )

        return ApiResponse.success(
            message="Face deleted successfully."
        )

    def _serialize_face(self, teacher_face):

        response = self.response_schema.dump(teacher_face)
        image_path = teacher_face.get("image_path")
    
        response["image_url"] = (
            self.storage_service.get_signed_url(
                "teacher-faces",
                image_path,
            )
            if image_path
            else None
        )
    
        return response