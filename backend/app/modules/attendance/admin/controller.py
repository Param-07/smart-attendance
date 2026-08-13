from flask import request, send_file
from flask_jwt_extended import get_jwt_identity

from .service import AdminAttendanceService
from ..schemas import *
from app.core.pagination_schema import PaginationSchema
from app.modules.authentication.decorators import auth_required, roles_required
from app.core.enums import UserRole
from app.core.responses import ApiResponse

class AdminAttendanceController:

    def __init__(self):

        self.service = AdminAttendanceService()

        self.report_request_schema = AttendanceReportRequestSchema()
        self.correction_request_schema = AttendanceCorrectionRequestSchema()
        self.list_request_schema = AttendanceListRequestSchema()

        self.response_list_schema = AttendanceResponseSchema(many=True)
        self.response_schema = AttendanceResponseSchema()
        self.response_stats_schema = AttendanceStatisticsResponseSchema()

        self.pagination_schema = PaginationSchema()

    @auth_required
    @roles_required(UserRole.SUPER_ADMIN)
    def get_attendance_list(self):

        payload = self.list_request_schema.load(
            request.args
        )

        pagination = self.service.get_attendance_list(
            **payload
        )

        response = self.pagination_schema.dump(pagination)
        response["items"] = self.response_list_schema.dump(pagination.items)

        return ApiResponse.success(
            message= "Attendance list fetched successfully.",
            data= response
        )

    @auth_required
    @roles_required(UserRole.SUPER_ADMIN)
    def get_attendance(self, public_uuid: str):

        attendance = self.service.get_attendance(
            public_uuid
        )

        response = self.response_schema.dump(attendance)
        
        return ApiResponse.success(
            message= "Attendance fetched successfully.",
            data= response
        )

    @auth_required
    @roles_required(UserRole.SUPER_ADMIN)
    def correct_attendance(
        self,
        public_uuid: str,
    ):

        payload = self.correction_request_schema.load(
            request.get_json()
        )

        attendance = self.service.correct_attendance(
            attendance_public_uuid=public_uuid,
            admin_account_public_uuid=get_jwt_identity(),
            **payload
        )

        response = self.response_schema.dump(attendance)

        return ApiResponse.success(
            message="Attendance corrected successfully.",
            data= response
        )

    @auth_required
    @roles_required(UserRole.SUPER_ADMIN)
    def get_attendance_stats(self):

        stats = self.service.get_attendance_statistics()
        response = self.response_stats_schema.dump(stats)

        return ApiResponse.success(
            message= "Status fetched successfully.",
            data= response
        )

    @auth_required
    @roles_required(UserRole.SUPER_ADMIN)
    def get_attendance_report(self):

        payload = self.report_request_schema.load(
            request.args
        )

        pagination = self.service.get_attendance_report(
            **payload
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
    @roles_required(UserRole.SUPER_ADMIN)
    def get_attendance_report_export(self):
    
        payload = self.report_request_schema.load(
            request.args
        )
    
        attendance = self.service.get_attendance_report_export(
            **payload
        )
    
        excel_file = self.excel_export_service.generate(
            attendance
        )

        return send_file(
            excel_file,
            as_attachment=True,
            download_name="attendance_report.xlsx"
        )

