from marshmallow import Schema, fields, validate

class LoginRequestSchema(Schema):
    
    username = fields.Str(
        required=True,
        validate=validate.Length(
            min=3,
            max=50
        )
    )

    password = fields.Str(
        required=True,
        validate=validate.Length(
            min=8,
            max=128
        ),
        load_only=True              # Because passwords should never be serialized back to the client.
    )