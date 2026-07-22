from flask import Blueprint

from .controller import AuthController

auth_bp = Blueprint(
    "auth",
    __name__
)

controller = AuthController()

auth_bp.route(
    "/login",
    methods=["POST"],
)(controller.login)

auth_bp.route(
    "/me",
    methods = ["GET"]
)(controller.current_user)

auth_bp.route(
    "/refresh",
    methods = ["POST"]
)(controller.refresh)