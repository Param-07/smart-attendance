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