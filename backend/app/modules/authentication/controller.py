from flask import request

from app.core.responses import ApiResponse
from .schemas.request import LoginRequestSchema
from .schemas.response import LoginResponseSchema, CurrentUserResponseSchema, RefreshTokenResponseSchema
from .service import AuthService
from .decorators import auth_required, roles_required, refresh_required

class AuthController:

    def __init__(self):
        self.service = AuthService()
        self.login_request_schema = LoginRequestSchema()
        self.login_response_schema = LoginResponseSchema()
        self.current_user_response_schema = CurrentUserResponseSchema()
        self.refresh_token_response_schema = RefreshTokenResponseSchema()

    def login(self):
        payload = self.login_request_schema.load(
            request.get_json() or {}
        )

        result = self.service.login(
            username= payload["username"],
            password= payload["password"],
            ip_address= request.remote_addr
        )

        response = self.login_response_schema.dump(result)

        return ApiResponse.success(
            message= "Login successfull",
            data= response
        )
    
    @auth_required
    def current_user(self):
        account = self.service.get_current_user()
        response = self.current_user_response_schema.dump(account)

        return ApiResponse.success(
            message= "Current user retrieved successfully.",
            data= response
        )
    
    @refresh_required
    def refresh(self):
        account = self.service.refresh_token()
        response = self.refresh_token_response_schema.dump(account)

        return ApiResponse.success(
            message= "Access token refreshed successfully.",
            data= response
        )