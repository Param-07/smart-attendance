import secrets
import string

from flask_bcrypt import (
    generate_password_hash,
    check_password_hash,
)
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
)

from app.models.account import Account


class AuthUtils:

    @staticmethod
    def hash_password(password: str) -> str:
        return generate_password_hash(password).decode("utf-8")

    @staticmethod
    def verify_password(
        password: str,
        password_hash: str,
    ) -> bool:
        return check_password_hash(
            password_hash,
            password,
        )

    @staticmethod
    def generate_temporary_password(
        length: int = 12,
    ) -> str:
        """
        Generate a cryptographically secure temporary password.

        The generated password is intended for first-time
        account setup and must be changed by the user.
        """

        if length < 8:
            raise ValueError(
                "Temporary password length must be at least 8 characters."
            )

        characters = (
            string.ascii_letters
            + string.digits
        )

        return "".join(
            secrets.choice(characters)
            for _ in range(length)
        )

    @staticmethod
    def generate_access_token(
        account: Account,
    ) -> str:

        additional_claims = {
            "role": account.role.value,
            "username": account.username,
        }

        return create_access_token(
            identity=str(account.public_uuid),
            additional_claims = additional_claims,
        )

    @staticmethod
    def generate_refresh_token(
        account: Account,
    ) -> str:

        return create_refresh_token(
            identity=str(account.public_uuid),
        )