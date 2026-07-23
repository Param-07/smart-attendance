from marshmallow import Schema, fields, validate
from ..enums import AttendanceStatus

class AttendanceCheckInRequestSchema(Schema):

    latitude = fields.Decimal(
        required=True,
        as_string=True
    )

    longitude = fields.Decimal(
        required=True,
        as_string=True
    )

    accuracy = fields.Decimal(
        required=True,
        as_string=True
    )

class AttendanceCheckOutRequestSchema(Schema):

    latitude = fields.Decimal(
        required=True,
        as_string=True
    )

    longitude = fields.Decimal(
        required=True,
        as_string=True
    )

    accuracy = fields.Decimal(
        required=True,
        as_string=True
    )

class AttendanceListRequestSchema(Schema):

    teacher_public_uuid = fields.UUID(load_default=None)

    search = fields.String(load_default=None)

    status = fields.Enum(
        AttendanceStatus,
        by_value=True,
        load_default=None,
    )

    start_date = fields.Date(load_default=None)

    end_date = fields.Date(load_default=None)

    page = fields.Integer(
        load_default=1,
        validate=validate.Range(min=1),
    )

    page_size = fields.Integer(
        load_default=20,
        validate=validate.Range(min=1, max=100),
    )

    sort_by = fields.String(
        load_default="attendance_date",
        validate=validate.OneOf([
            "attendance_date",
            "check_in_time",
            "check_out_time",
            "status",
            "created_at",
        ]),
    )

    order = fields.String(
        load_default="desc",
        validate=validate.OneOf(["asc", "desc"]),
    )

class AttendanceCorrectionRequestSchema(Schema):

    check_in_time = fields.DateTime(
        load_default=None,
        allow_none=True,
    )

    check_out_time = fields.DateTime(
        load_default=None,
        allow_none=True,
    )

    remarks = fields.String(
        required=True,
        validate=validate.Length(max=500),
    )

class AttendanceStatisticsRequestSchema(Schema):

    start_date = fields.Date(
        load_default=None
    )

    end_date = fields.Date(
        load_default=None
    )