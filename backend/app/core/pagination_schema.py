from marshmallow import Schema, fields


class PaginationSchema(Schema):

    page = fields.Integer(dump_only=True)
    page_size = fields.Integer(dump_only=True)
    total_records = fields.Integer(dump_only=True)
    total_pages = fields.Integer(dump_only=True)
    has_next = fields.Boolean(dump_only=True)
    has_previous = fields.Boolean(dump_only=True)