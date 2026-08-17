from flask import Blueprint

from ..controller.school import SchoolController
from ..controller.configuration import SchoolConfigurationController


school_bp = Blueprint(
    "schools",
    __name__
)

school_controller = SchoolController()
configuration_controller = SchoolConfigurationController()


school_bp.route(
    "/",
    methods=["POST"],
)(school_controller.add_school)

school_bp.route(
    "/",
    methods=["GET"],
)(school_controller.get_all_schools)

school_bp.route(
    "/me",
    methods=["GET"],
)(school_controller.get_my_school)

school_bp.route(
    "/statistics",
    methods=["GET"],
)(school_controller.get_statistics)

school_bp.route(
    "/<uuid:public_uuid>",
    methods=["GET"],
)(school_controller.get_school)

school_bp.route(
    "/<uuid:public_uuid>",
    methods=["PUT"],
)(school_controller.update_school)

school_bp.route(
    "/<uuid:public_uuid>/activation",
    methods=["PUT"],
)(school_controller.update_activation)

school_bp.route(
    "/configuration",
    methods=["GET"],
)(configuration_controller.get_configuration)

school_bp.route(
    "/configuration",
    methods=["PUT"],
)(configuration_controller.update_configuration)