from flask_jwt_extended import get_jwt, get_jwt_identity


class RequestContext:

    @staticmethod
    def get_identity() -> str:
        return get_jwt_identity()

    @staticmethod
    def get_claims() -> dict:
        return get_jwt()