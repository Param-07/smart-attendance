from marshmallow import Schema, fields


class SchoolResponseSchema(Schema):

    public_uuid = fields.UUID(dump_only=True)

    name = fields.String(dump_only=True)

    code = fields.String(dump_only=True)

    email = fields.Email(dump_only=True)

    phone = fields.String(
        allow_none=True,
        dump_only=True,
    )

    website = fields.String(
        allow_none=True,
        dump_only=True,
    )

    address = fields.String(dump_only=True)

    city = fields.String(dump_only=True)

    state = fields.String(dump_only=True)

    country = fields.String(dump_only=True)

    postal_code = fields.String(
        allow_none=True,
        dump_only=True,
    )

    logo_path = fields.String(
        allow_none=True,
        dump_only=True,
    )

    timezone = fields.String(dump_only=True)

    is_active = fields.Boolean(dump_only=True)

    created_at = fields.DateTime(dump_only=True)

    updated_at = fields.DateTime(dump_only=True)

class SchoolStatisticsResponseSchema(Schema):

    total_schools = fields.Integer(dump_only=True)

    active_schools = fields.Integer(dump_only=True)

    inactive_schools = fields.Integer(dump_only=True)

class SchoolListResponseSchema(Schema):

    public_uuid = fields.UUID()
    name = fields.String()
    code = fields.String()
    city = fields.String()
    state = fields.String()
    country = fields.String()
    email = fields.Email()
    is_active = fields.Boolean()
    
class SchoolConfigurationResponseSchema(Schema):

    public_uuid = fields.UUID(
        dump_only=True,
    )

    version = fields.Integer(
        dump_only=True,
    )

    # Face Recognition

    require_check_in_face = fields.Boolean(
        dump_only=True,
    )

    require_check_out_face = fields.Boolean(
        dump_only=True,
    )

    require_liveness = fields.Boolean(
        dump_only=True,
    )

    liveness_threshold = fields.Decimal(
        as_string=True,
        dump_only=True,
    )

    allow_face_reregistration = fields.Boolean(
        dump_only=True,
    )

    face_match_threshold = fields.Decimal(
        as_string=True,
        dump_only=True,
    )

    # Attendance

    allow_check_in = fields.Boolean(
        dump_only=True,
    )

    allow_check_out = fields.Boolean(
        dump_only=True,
    )

    auto_checkout_enabled = fields.Boolean(
        dump_only=True,
    )

    auto_checkout_time = fields.Time(
        allow_none=True,
        dump_only=True,
    )

    # GPS

    require_check_in_gps = fields.Boolean(
        dump_only=True,
    )

    require_check_out_gps = fields.Boolean(
        dump_only=True,
    )

    allowed_radius = fields.Integer(
        dump_only=True,
    )

    gps_accuracy_threshold = fields.Integer(
        dump_only=True,
    )

    school_latitude = fields.Decimal(
        as_string=True,
        allow_none=True,
        dump_only=True,
    )

    school_longitude = fields.Decimal(
        as_string=True,
        allow_none=True,
        dump_only=True,
    )

    location_name = fields.String(
        allow_none=True,
        dump_only=True,
    )

    # Security

    max_failed_login_attempts = fields.Integer(
        dump_only=True,
    )

    lockout_duration_minutes = fields.Integer(
        dump_only=True,
    )

    created_at = fields.DateTime(
        dump_only=True,
    )

    updated_at = fields.DateTime(
        dump_only=True,
    )

class SchoolAdminResponseSchema(Schema):

    public_uuid = fields.UUID(
        dump_only=True,
    )

    username = fields.String(
        dump_only=True,
    )

    role = fields.String(
        dump_only=True,
    )


class CreateSchoolResponseSchema(Schema):

    school = fields.Nested(
        SchoolResponseSchema,
        dump_only=True,
    )

    admin = fields.Nested(
        SchoolAdminResponseSchema,
        dump_only=True,
    )

    temporary_password = fields.String(
        dump_only=True,
    )