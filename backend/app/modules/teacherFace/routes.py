from .controller import TeacherFaceController
from flask import Blueprint

teacher_face_bp = Blueprint(
    "teacher_face",
    __name__
)

teacher_face_controller = TeacherFaceController()

teacher_face_bp.route(
    "teacher/<uuid:teacher_public_uuid>/face",
    methods=["POST"],
)(teacher_face_controller.register_face)

teacher_face_bp.route(
    "teacher/<uuid:teacher_public_uuid>/face",
    methods=["PUT"],
)(teacher_face_controller.update_face)

teacher_face_bp.route(
    "teacher/<uuid:teacher_public_uuid>/face",
    methods=["GET"],
)(teacher_face_controller.get_face)

teacher_face_bp.route(
    "teacher/<uuid:teacher_public_uuid>/face",
    methods=["DELETE"],
)(teacher_face_controller.delete_face)