from flask import request, send_file
from flask_jwt_extended import get_jwt_identity

from .service import AdminAttendanceService
from ..schemas import *
from app.core.pagination_schema import PaginationSchema
from app.modules.authentication.decorators import (
    auth_required,
    roles_required,
)
from app.core.enums import UserRole
from app.core.responses import ApiResponse
from app.modules.authentication.service import AuthService


class AdminAttendanceController:

    def __init__(self):

        self.service = AdminAttendanceService()
        self.auth_service = AuthService()

        self.report_request_schema = AttendanceReportRequestSchema()
        self.correction_request_schema = AttendanceCorrectionRequestSchema()
        self.list_request_schema = AttendanceListRequestSchema()

        self.response_list_schema = AttendanceResponseSchema(many=True)
        self.response_schema = AttendanceResponseSchema()
        self.response_stats_schema = AttendanceStatisticsResponseSchema()

        self.pagination_schema = PaginationSchema()

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def get_attendance_list(self):

        current_user = self.auth_service.get_current_user()

        payload = self.list_request_schema.load(
            request.args
        )

        pagination = self.service.get_attendance_list(
            school_id=current_user.school_id,
            **payload,
        )

        response = self.pagination_schema.dump(
            pagination
        )

        response["items"] = self.response_list_schema.dump(
            pagination.items
        )

        return ApiResponse.success(
            message="Attendance list fetched successfully.",
            data=response,
        )

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def get_attendance(
        self,
        public_uuid: str,
    ):

        current_user = self.auth_service.get_current_user()

        attendance = self.service.get_attendance(
            public_uuid=public_uuid,
            school_id=current_user.school_id,
        )

        response = self.response_schema.dump(
            attendance
        )

        return ApiResponse.success(
            message="Attendance fetched successfully.",
            data=response,
        )

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def correct_attendance(
        self,
        public_uuid: str,
    ):

        current_user = self.auth_service.get_current_user()

        payload = self.correction_request_schema.load(
            request.get_json() or {}
        )

        attendance = self.service.correct_attendance(
            attendance_public_uuid=public_uuid,
            admin_account_public_uuid=current_user.public_uuid,
            school_id=current_user.school_id,
            **payload,
        )

        response = self.response_schema.dump(
            attendance
        )

        return ApiResponse.success(
            message="Attendance corrected successfully.",
            data=response,
        )

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def get_attendance_stats(self):

        current_user = self.auth_service.get_current_user()

        stats = self.service.get_attendance_statistics(
            school_id=current_user.school_id,
        )

        response = self.response_stats_schema.dump(
            stats
        )

        return ApiResponse.success(
            message="Status fetched successfully.",
            data=response,
        )

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def get_attendance_report(self):

        current_user = self.auth_service.get_current_user()

        payload = self.report_request_schema.load(
            request.args
        )

        pagination = self.service.get_attendance_report(
            school_id=current_user.school_id,
            **payload,
        )

        response = self.pagination_schema.dump(
            pagination
        )

        response["items"] = self.response_list_schema.dump(
            pagination.items
        )

        return ApiResponse.success(
            message="Attendance report fetched successfully.",
            data=response,
        )

    @auth_required
    @roles_required(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
    )
    def get_attendance_report_export(self):

        current_user = self.auth_service.get_current_user()

        payload = self.report_request_schema.load(
            request.args
        )

        attendance = self.service.get_attendance_report_export(
            school_id=current_user.school_id,
            **payload,
        )

        excel_file = self.excel_export_service.generate(
            attendance
        )

        return send_file(
            excel_file,
            as_attachment=True,
            download_name="attendance_report.xlsx",
        )