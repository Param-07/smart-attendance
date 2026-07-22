from flask import Blueprint
from .controller import HealthController

health_bp = Blueprint(
    "health",
    __name__
)

health_bp.route(
    "/health",
    methods = ["GET"]
)(HealthController.get_health)