from marshmallow import fields, Schema

class TeacherResponseSchema(Schema):

    public_uuid = fields.UUID()
    employee_code = fields.String()
    first_name = fields.String()
    middle_name = fields.String()
    last_name = fields.String()
    display_name = fields.String()
    official_email = fields.Email()
    mobile_number = fields.String()
    department = fields.String()
    designation = fields.String()
    employment_status = fields.String()
    joining_date = fields.Date()
    face_registered = fields.Boolean()
    remarks = fields.String()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    is_active = fields.Boolean()

class TeacherListResponseSchema(Schema):

    public_uuid = fields.UUID()
    employee_code = fields.String()
    display_name = fields.String()
    department = fields.String()
    designation = fields.String()
    employment_status = fields.String()
    face_registered = fields.Boolean()

class TeacherStatisticsResponseSchema(Schema):

    total_teachers = fields.Integer()
    active_teachers = fields.Integer()
    inactive_teachers = fields.Integer()
    face_registered = fields.Integer()
    face_not_registered = fields.Integer()