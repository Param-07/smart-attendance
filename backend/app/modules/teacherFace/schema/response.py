from marshmallow import Schema, validate, fields

class TeacherFaceResponseSchema(Schema):
    teacher_uuid = fields.UUID()
    image_url = fields.String()
    model_name = fields.String()
    model_version = fields.String()
    face_quality_score = fields.Float()
    registered_at = fields.DateTime()