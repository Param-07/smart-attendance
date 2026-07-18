from __future__ import annotations
from marshmallow import ValidationError

from flask import Flask

from app.core.exceptions import AppException
from app.core.responses import ApiResponse

def register_exception_handlers(app: Flask) -> None:

    @app.errorhandler(AppException)
    def handle_app_exception(error: AppException):

        return ApiResponse.error(
            message= error.message,
            errors= {
                "code": error.error_code
            },
            status_code= error.status_code
        )
    
    @app.errorhandler(ValidationError)
    def handle_validation_error(error: ValidationError):
        return ApiResponse.error(
            message=error.messages,
            errors={
                "code": error.messages_dict
            },
            status_code= 400
        )
    
    @app.errorhandler(Exception)
    def handle_unexpected_exception(error: Exception):

        return ApiResponse.internal_server_error(
            message= str(error)
        )