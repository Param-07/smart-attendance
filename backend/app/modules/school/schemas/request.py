from marshmallow import Schema, fields, validate


class CreateSchoolRequestSchema(Schema):

    name = fields.String(
        required=True,
        validate=validate.Length(max=255),
    )

    code = fields.String(
        required=True,
        validate=validate.Length(max=50),
    )

    email = fields.Email(
        required=True,
        validate=validate.Length(max=255),
    )

    phone = fields.String(
        load_default=None,
        validate=validate.Length(max=20),
    )

    website = fields.Url(
        load_default=None,
        validate=validate.Length(max=500),
    )

    address = fields.String(
        required=True,
        validate=validate.Length(max=500),
    )

    city = fields.String(
        required=True,
        validate=validate.Length(max=100),
    )

    state = fields.String(
        required=True,
        validate=validate.Length(max=100),
    )

    country = fields.String(
        required=True,
        validate=validate.Length(max=100),
    )

    postal_code = fields.String(
        load_default=None,
        validate=validate.Length(max=20),
    )

    logo_path = fields.String(
        load_default=None,
        validate=validate.Length(max=500),
    )

    timezone = fields.String(
        required=True,
        validate=validate.Length(max=100),
    )

class UpdateSchoolRequestSchema(CreateSchoolRequestSchema):
    pass

class SchoolListRequestSchema(Schema):

    search = fields.String(load_default=None)

    city = fields.String(load_default=None)

    state = fields.String(load_default=None)

    country = fields.String(load_default=None)

    is_active = fields.Boolean(load_default=True)

    page = fields.Integer(load_default=1)

    page_size = fields.Integer(load_default=20)

    sort_by = fields.String(load_default="created_at")

    order = fields.String(load_default="desc")

class SchoolActivationRequestSchema(Schema):

    is_active = fields.Boolean(required=True)


class SchoolConfigurationUpdateRequestSchema(Schema):

    # Face Recognition

    require_check_in_face = fields.Boolean()

    require_check_out_face = fields.Boolean()

    require_liveness = fields.Boolean()

    allow_face_reregistration = fields.Boolean()

    face_match_threshold = fields.Decimal(
        as_string=True,
        validate=validate.Range(
            min=0,
            max=1,
        ),
    )

    # Attendance

    allow_check_in = fields.Boolean()

    allow_check_out = fields.Boolean()

    auto_checkout_enabled = fields.Boolean()

    auto_checkout_time = fields.Time(
        allow_none=True,
    )

    # GPS

    require_check_in_gps = fields.Boolean()

    require_check_out_gps = fields.Boolean()

    allowed_radius = fields.Integer(
        validate=validate.Range(min=1),
    )

    gps_accuracy_threshold = fields.Integer(
        validate=validate.Range(min=1),
    )

    # Security

    max_failed_login_attempts = fields.Integer(
        validate=validate.Range(min=1),
    )

    lockout_duration_minutes = fields.Integer(
        validate=validate.Range(min=1),
    )
