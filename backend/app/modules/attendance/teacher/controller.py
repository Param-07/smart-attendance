from flask import request
from flask_jwt_extended import get_jwt_identity

from app.core.responses import ApiResponse
from .service import TeacherAttendanceService
from ..schemas import *
from app.modules.authentication.decorators import auth_required
from app.core.pagination_schema import PaginationSchema

class TeacherAttendanceController:

    def __init__(self):

        self.service = TeacherAttendanceService()

        self.check_in_request_schema = AttendanceCheckInRequestSchema()
        self.check_out_request_schema = AttendanceCheckOutRequestSchema()
        self.list_request_schema = AttendanceListRequestSchema()

        self.response_schema = AttendanceResponseSchema()
        self.response_list_schema = AttendanceResponseSchema(many=True)
        self.pagination_schema = PaginationSchema()

    @auth_required
    def check_in(self):

        public_uuid = get_jwt_identity()

        payload = self.check_in_request_schema.load(
            request.form
        )

        selfie = request.files.get("selfie")

        attendance = self.service.check_in(
            public_uuid= public_uuid,
            selfie= selfie,
            **payload,
        )

        response = self.response_schema.dump(attendance)

        return ApiResponse.success(
            message= "Attendance marked successfully.",
            data= response
        )
    
    @auth_required
    def check_out(self):

        public_uuid = get_jwt_identity()

        payload = self.check_out_request_schema.load(
            request.get_json()
        )

        attendance = self.service.check_out(
            public_uuid= public_uuid,
            **payload
        )

        response = self.response_schema.dump(attendance)

        return ApiResponse.success(
            message= "Check out successfull. You can leave the campus.",
            data= response
        )

    @auth_required
    def get_my_today_attendance(self):

        public_uuid = get_jwt_identity()
        attendance = self.service.get_my_attendance_today(public_uuid)
        resposne = self.response_schema.dump(attendance)

        return ApiResponse.success(
            message= "Today's Attendance",
            data= resposne
        )


    
    @auth_required
    def get_attendance(self, public_uuid):

        attendance = self.service.get_attendance(public_uuid)
        response = self.response_schema.dump(attendance)

        return ApiResponse.success(
            message= "Attendance retrived",
            data= response
        )
    
    @auth_required
    def get_my_attendance_list(self):

        payload = self.list_request_schema.load(
            request.args
        )

        pagination = self.service.get_my_attendance_list(**payload)

        response = self.pagination_schema.dump(pagination)

        response["items"] = self.response_list_schema.dump(
            pagination.items
        )

        return ApiResponse.success(
            message="List of attendance",
            data=response
        )

        