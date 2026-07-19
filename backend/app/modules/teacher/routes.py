from flask import Blueprint

from .controller import TeacherController

teacher_bp = Blueprint(
    "teachers",
    __name__,
)

teacher_controller = TeacherController()

teacher_bp.route(
    "/",
    methods = ["POST"]
)(teacher_controller.add_teacher)

teacher_bp.route(
    "/",
    methods = ["GET"]
)(teacher_controller.get_all_teachers)

teacher_bp.route(
    "/<string:public_uuid>",
    methods = ["GET"]
)(teacher_controller.get_teacher)

teacher_bp.route(
    "/<string:public_uuid>",
    methods = ["PUT"]
)(teacher_controller.update_teacher)

teacher_bp.route(
    "/<string:public_uuid>",
    methods = ["DELETE"]
)(teacher_controller.delete_teacher)
