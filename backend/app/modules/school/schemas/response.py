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

    public_uuid = fields.UUID()

    version = fields.Integer()

    require_check_in_face = fields.Boolean()

    require_check_out_face = fields.Boolean()

    require_liveness = fields.Boolean()

    allow_face_reregistration = fields.Boolean()

    face_match_threshold = fields.Decimal(
        as_string=True,
    )

    allow_check_in = fields.Boolean()

    allow_check_out = fields.Boolean()

    auto_checkout_enabled = fields.Boolean()

    auto_checkout_time = fields.Time(
        allow_none=True,
    )

    require_check_in_gps = fields.Boolean()

    require_check_out_gps = fields.Boolean()

    allowed_radius = fields.Integer()

    gps_accuracy_threshold = fields.Integer()

    max_failed_login_attempts = fields.Integer()

    lockout_duration_minutes = fields.Integer()

    created_at = fields.DateTime()

    updated_at = fields.DateTime()