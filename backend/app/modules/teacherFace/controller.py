from flask import request 

from app.core.responses import ApiResponse
from .schema.response import TeacherFaceResponseSchema
from .service import TeacherFaceService

from app.modules.authentication.decorators import auth_required, roles_required
from app.core.enums import UserRole

class TeacherFaceController:
    
    def __init__(self):

        self.service = TeacherFaceService()

        self.response_schema = TeacherFaceResponseSchema()

    @auth_required
    @roles_required(UserRole.ADMIN)
    def register_face(self, teacher_public_uuid):

        uploaded_file = request.files.get("selfie")

        teacher_face = self.service.register_face(
            teacher_public_uuid,
            uploaded_file,
        )

        response = self.response_schema.dump(teacher_face)

        return ApiResponse.success(
            message="Face registered successfully.",
            data=response
        )

    @auth_required
    @roles_required(UserRole.ADMIN)
    def update_face(self, teacher_public_uuid):

        uploaded_file = request.files.get("selfie")

        teacher_face = self.service.replace_face(
            teacher_public_uuid,
            uploaded_file,
        )

        response = self.response_schema.dump(teacher_face)

        return ApiResponse.success(
            message="Face updated successfully.",
            data=response
        )

    @auth_required
    @roles_required(UserRole.ADMIN)
    def get_face(self, teacher_public_uuid):

        teacher_face = self.service.get_registered_face(
            teacher_public_uuid
        )

        response = self.response_schema.dump(teacher_face)

        return ApiResponse.success(
            message="Face retrieved successfully.",
            data=response
        )

    @auth_required
    @roles_required(UserRole.ADMIN)
    def delete_face(self, teacher_public_uuid):

        self.service.delete_face(
            teacher_public_uuid
        )

        return ApiResponse.success(
            message="Face deleted successfully."
        )