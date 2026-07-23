from flask import Blueprint

from .controller import AdminAttendanceController

attendance_admin_bp = Blueprint(
    "attendance_admin",
    __name__,
)

controller = AdminAttendanceController()

attendance_admin_bp.route(
    "/",
    methods=["GET"],
)(controller.get_attendance_list)

attendance_admin_bp.route(
    "/<uuid:public_uuid>",
    methods=["GET"],
)(controller.get_attendance)

attendance_admin_bp.route(
    "/<string:public_uuid>/correct",
    methods=["PUT"],
)(controller.correct_attendance)

attendance_admin_bp.route(
    "/statistics",
    methods=["GET"],
)(controller.get_attendance_stats)