from marshmallow import Schema, fields

from app.modules.teacher.schemas.response import TeacherResponseSchema

class AttendanceResponseSchema(Schema):

    public_uuid = fields.UUID(dump_only=True)
    attendance_date = fields.Date(dump_only=True)

    check_in_time = fields.DateTime(dump_only=True)
    check_out_time = fields.DateTime(dump_only=True)

    check_in_latitude = fields.Decimal(
        as_string=True,
        dump_only=True,
    )

    check_in_longitude = fields.Decimal(
        as_string=True,
        dump_only=True,
    )

    check_in_accuracy = fields.Float(dump_only=True)

    check_out_latitude = fields.Decimal(
        as_string=True,
        dump_only=True,
    )

    check_out_longitude = fields.Decimal(
        as_string=True,
        dump_only=True,
    )

    check_out_accuracy = fields.Float(dump_only=True)

    face_match_score = fields.Float(
        allow_none=True,
        dump_only=True,
    )

    status = fields.String(dump_only=True)

    remarks = fields.String(
        allow_none=True,
        dump_only=True,
    )

    teacher = fields.Nested(
        TeacherResponseSchema,
        dump_only=True,
    )

    created_at = fields.DateTime(dump_only=True)

    updated_at = fields.DateTime(dump_only=True)