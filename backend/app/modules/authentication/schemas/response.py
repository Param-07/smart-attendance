from marshmallow import fields, Schema

class LoginResponseSchema(Schema):

    access_token = fields.Str(required=True,dump_only=True)
    refresh_token= fields.Str(required=True, dump_only=True)

    token_type = fields.Str(
        dump_default="Bearer",
        dump_only=True
    )

    expires_in = fields.Int(required=True, dump_only=True)

class CurrentUserResponseSchema(Schema):

    public_uuid = fields.Str(dump_only=True)
    username = fields.Str(dump_only=True)

    role = fields.Function(
        lambda obj: obj.role.value
    )

    account_status = fields.Function(
        lambda obj: obj.account_status.value
    )

    last_login = fields.DateTime(dump_only=True)

class RefreshTokenResponseSchema(Schema):

    access_token = fields.Str(dump_only=True)
    token_type = fields.Str(dump_only=True, dump_default="Bearer")
    expires_in = fields.Int(dump_only=True)