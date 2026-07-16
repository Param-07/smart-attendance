"""
Standard API Responses

Provides a consistent response format across the
Smart Attendance backend.

"""

from __future__ import annotations

from flask import jsonify


class ApiResponse:
    """Standard API response builder."""

    @staticmethod
    def success(
        message: str = "Success",
        data=None,
        status_code: int = 200,
    ):
        response = {
            "success": True,
            "message": message,
            "data": data,
            "errors": None,
        }

        return jsonify(response), status_code

    @staticmethod
    def error(
        message: str = "Request failed.",
        errors=None,
        status_code: int = 400,
    ):
        response = {
            "success": False,
            "message": message,
            "data": None,
            "errors": errors,
        }

        return jsonify(response), status_code

    # --------------------------------------------------
    # Convenience Methods
    # --------------------------------------------------

    @classmethod
    def created(cls, message="Created successfully.", data=None):
        return cls.success(message, data, 201)

    @classmethod
    def bad_request(cls, message="Bad request.", errors=None):
        return cls.error(message, errors, 400)

    @classmethod
    def unauthorized(cls, message="Unauthorized."):
        return cls.error(message, status_code=401)

    @classmethod
    def forbidden(cls, message="Forbidden."):
        return cls.error(message, status_code=403)

    @classmethod
    def not_found(cls, message="Resource not found."):
        return cls.error(message, status_code=404)

    @classmethod
    def conflict(cls, message="Conflict detected."):
        return cls.error(message, status_code=409)

    @classmethod
    def validation_error(cls, message="Validation failed.", errors=None):
        return cls.error(message, errors, 422)

    @classmethod
    def internal_server_error(
        cls,
        message="Internal server error.",
    ):
        return cls.error(message, status_code=500)