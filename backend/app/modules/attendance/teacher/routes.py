from flask import Blueprint

from .controller import TeacherAttendanceController

teacher_attendance_bp = Blueprint(
    "attendance",
    __name__
)

attendance_controller = TeacherAttendanceController()

teacher_attendance_bp.route(
    "/check-in",
    methods=["POST"],
)(attendance_controller.check_in)

teacher_attendance_bp.route(
    "/check-out",
    methods=["POST"],
)(attendance_controller.check_out)

teacher_attendance_bp.route(
    "",
    methods=["GET"],
)(attendance_controller.get_attendance_list)

teacher_attendance_bp.route(
    "/<uuid:public_uuid>",
    methods=["GET"],
)(attendance_controller.get_attendance)

teacher_attendance_bp.route(
    "/me/today",
    methods=["GET"],
)(attendance_controller.get_my_today_attendance)