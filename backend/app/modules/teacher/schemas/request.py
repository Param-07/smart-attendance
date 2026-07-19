from marshmallow  import Schema, fields, validate
from app.core.enums import Department, Designation, EmploymentStatus

class TeacherCreateRequestSchema(Schema):

    # Account
    username = fields.String(
        required=True,
        validate=validate.Length(min=4, max=50),
    )

    password = fields.String(
        required=True,
        load_only=True,
        validate=validate.Length(min=8),
    )

    # Teacher
    employee_code = fields.String(
        required=True,
        validate=validate.Length(max=20),
    )

    first_name = fields.String(
        required=True,
        validate=validate.Length(max=50),
    )

    middle_name = fields.String(
        allow_none=True,
        validate=validate.Length(max=50),
    )

    last_name = fields.String(
        required=True,
        validate=validate.Length(max=50),
    )

    display_name = fields.String(
        required=True,
        validate=validate.Length(max=150),
    )

    official_email = fields.Email(required=True)

    mobile_number = fields.String(
        allow_none=True,
        validate=validate.Length(max=20),
    )

    department = fields.Enum(
        Department,
        by_value=True,
        required=True,
    )

    designation = fields.Enum(
        Designation,
        by_value=True,
        required=True,
    )

    joining_date = fields.Date(required=True)

    remarks = fields.String(
        allow_none=True,
    )

class TeacherUpdateRequestSchema(Schema):

    first_name = fields.String()

    middle_name = fields.String(
        allow_none=True,
    )

    last_name = fields.String()
    display_name = fields.String()
    official_email = fields.Email()
    
    mobile_number = fields.String(
        allow_none=True,
    )

    department = fields.Enum(
        Department,
        by_value=True,
    )

    designation = fields.Enum(
        Designation,
        by_value=True,
    )

    employment_status = fields.Enum(
        EmploymentStatus,
        by_value=True,
    )

    joining_date = fields.Date()

    remarks = fields.String(
        allow_none=True,
    )

class TeacherListRequestSchema(Schema):

    search = fields.String(load_default=None)
    department = fields.String(load_default=None)
    designation = fields.String(load_default=None)
    gender = fields.String(load_default=None)
    is_active = fields.Boolean(load_default=True)
    
    page = fields.Integer(
        load_default=1,
        validate=validate.Range(min=1),
    )

    page_size = fields.Integer(
        load_default=20,
        validate=validate.Range(min=1, max=100),
    )

    sort_by = fields.String(load_default="created_at")

    order = fields.String(
        load_default="desc",
        validate=validate.OneOf(["asc", "desc"]),
    )